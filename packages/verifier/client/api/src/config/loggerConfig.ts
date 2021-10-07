export class LoggerConfig {
  consoleLogLevel = process.env.CONSOLE_LOG_LEVEL ?? "info";
  fileLogLevel = process.env.FILE_LOG_LEVEL ?? "debug";
  logFileName = process.env.LOG_FILE_NAME ?? "verifier_client.log.json";
}
