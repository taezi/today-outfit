package com.todayoutfit.backend.recommendation.service;

import com.todayoutfit.backend.recommendation.dto.RecommendationResult;
import com.todayoutfit.backend.user.entity.User;
import com.todayoutfit.backend.weather.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import tools.jackson.databind.ObjectMapper;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
@ConditionalOnProperty(name = "recommendation.mode", havingValue = "codex-cli")
public class CodexCliRecommendationGenerator implements RecommendationGenerator {

    private final RecommendationPromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;
    private final String codexCommand;
    private final String workingDirectory;
    private final String model;
    private final Duration timeout;

    public CodexCliRecommendationGenerator(
            RecommendationPromptBuilder promptBuilder,
            @Value("${recommendation.codex-cli.command:codex}") String codexCommand,
            @Value("${recommendation.codex-cli.working-directory:..}") String workingDirectory,
            @Value("${recommendation.codex-cli.model:}") String model,
            @Value("${recommendation.codex-cli.timeout-seconds:60}") long timeoutSeconds
    ) {
        this.promptBuilder = promptBuilder;
        this.objectMapper = new ObjectMapper();
        this.codexCommand = codexCommand;
        this.workingDirectory = workingDirectory;
        this.model = model;
        this.timeout = Duration.ofSeconds(timeoutSeconds);
    }

    @Override
    public RecommendationResult generate(User user, WeatherResponse weather) {
        String prompt = promptBuilder.build(user, weather);
        String codexPrompt = prompt + """

                중요:
                - JSON 외의 설명 문장은 절대 쓰지 마.
                - 코드블록 마크다운도 쓰지 마.
                - top, bottom, outer, shoes, reason 필드를 모두 채워줘.
                - top, bottom, outer, shoes는 각각 아이템 하나만 작성해.
                - "또는", "혹은", "/", 쉼표로 여러 후보를 나열하지 마.
                """;

        Path outputFile = null;

        try {
            outputFile = Files.createTempFile("today-outfit-codex-", ".json");
            Process process = startCodexProcess(outputFile);
            writePrompt(process, codexPrompt);

            CompletableFuture<String> processOutputFuture = CompletableFuture.supplyAsync(() -> readProcessOutput(process));

            boolean finished = process.waitFor(timeout.toSeconds(), TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                throw new IllegalStateException("Codex 추천 생성 시간이 초과되었습니다. CODEX_CLI_TIMEOUT_SECONDS 값을 늘리거나 잠시 후 다시 시도해주세요.");
            }

            String processOutput = processOutputFuture.join();
            if (process.exitValue() != 0) {
                throw new IllegalStateException("Codex CLI 실행에 실패했습니다. Codex 로그인 상태와 CODEX_CLI_COMMAND 경로를 확인해주세요. " + summarizeProcessOutput(processOutput));
            }

            String lastMessage = Files.readString(outputFile, StandardCharsets.UTF_8);
            String json = extractJson(lastMessage);
            RecommendationResult result = objectMapper.readValue(json, RecommendationResult.class);
            validateResult(result);

            return result;
        } catch (IOException exception) {
            throw new IllegalStateException(toIOExceptionMessage(exception), exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Codex 추천 생성이 중단되었습니다. 다시 시도해주세요.", exception);
        } finally {
            if (outputFile != null) {
                try {
                    Files.deleteIfExists(outputFile);
                } catch (IOException ignored) {
                }
            }
        }
    }

    private Process startCodexProcess(Path outputFile) throws IOException {
        validateWorkingDirectory();
        List<String> command = createBaseCommand();
        command.add("exec");
        command.add("-C");
        command.add(workingDirectory);
        command.add("--sandbox");
        command.add("read-only");
        if (StringUtils.hasText(model)) {
            command.add("--model");
            command.add(model);
        }
        command.add("-o");
        command.add(outputFile.toString());
        command.add("-");

        return new ProcessBuilder(command)
                .redirectErrorStream(true)
                .start();
    }

    private void validateWorkingDirectory() {
        Path path = Path.of(workingDirectory);
        if (!Files.isDirectory(path)) {
            throw new IllegalStateException("Codex 작업 폴더를 찾을 수 없습니다. CODEX_CLI_WORKING_DIRECTORY 값을 확인해주세요: " + workingDirectory);
        }
    }

    private List<String> createBaseCommand() {
        String normalizedCommand = codexCommand.toLowerCase();
        List<String> command = new ArrayList<>();

        if (normalizedCommand.endsWith(".cmd") || normalizedCommand.endsWith(".bat")) {
            command.add("cmd.exe");
            command.add("/c");
            command.add(codexCommand);
            return command;
        }

        if (normalizedCommand.endsWith(".ps1")) {
            command.add("powershell.exe");
            command.add("-NoProfile");
            command.add("-ExecutionPolicy");
            command.add("Bypass");
            command.add("-File");
            command.add(codexCommand);
            return command;
        }

        command.add(codexCommand);
        return command;
    }

    private void writePrompt(Process process, String prompt) throws IOException {
        try (BufferedWriter writer = process.outputWriter(StandardCharsets.UTF_8)) {
            writer.write(prompt);
        }
    }

    private String readProcessOutput(Process process) {
        try {
            return process.inputReader(StandardCharsets.UTF_8)
                    .lines()
                    .collect(Collectors.joining(System.lineSeparator()));
        } catch (Exception exception) {
            return "";
        }
    }

    private String extractJson(String value) {
        int start = value.indexOf('{');
        int end = value.lastIndexOf('}');

        if (start < 0 || end < start) {
            throw new IllegalStateException("Codex 응답에서 JSON을 찾지 못했습니다. 다시 시도해주세요.");
        }

        return value.substring(start, end + 1);
    }

    private void validateResult(RecommendationResult result) {
        if (!StringUtils.hasText(result.top())
                || !StringUtils.hasText(result.bottom())
                || !StringUtils.hasText(result.outer())
                || !StringUtils.hasText(result.shoes())
                || !StringUtils.hasText(result.reason())) {
            throw new IllegalStateException("Codex 추천 결과에 빈 값이 있습니다. 다시 시도해주세요.");
        }
    }

    private String toIOExceptionMessage(IOException exception) {
        String message = exception.getMessage();

        if (message != null && message.contains("CreateProcess error=2")) {
            return "Codex 실행 파일을 찾을 수 없습니다. CODEX_CLI_COMMAND 값을 codex.cmd 전체 경로로 설정해주세요.";
        }

        return "Codex 추천 결과를 처리하지 못했습니다. Codex CLI 설정을 확인해주세요.";
    }

    private String summarizeProcessOutput(String processOutput) {
        if (!StringUtils.hasText(processOutput)) {
            return "";
        }

        String compactOutput = processOutput.replaceAll("\\s+", " ").trim();
        if (compactOutput.length() <= 300) {
            return compactOutput;
        }

        return compactOutput.substring(0, 300) + "...";
    }
}
