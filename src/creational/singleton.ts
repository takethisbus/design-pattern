// ❌
class Logger {
  public logs: string[] = [];

  log(message: string): void {
    this.logs.push(message);
    console.log(message);
  }
}

// 같은 파일내에 두 개의 인스턴스
const logger1 = new Logger();
const logger2 = new Logger();

logger1.log("Bad logger message 1");
logger2.log("Bad logger message 2");

// ✅ Good: Singleton 패턴 사용
class SingleLogger {
  private static instance: SingleLogger | null = null;
  private logs: string[] = [];

  private constructor() {}

  public static getInstance(): SingleLogger {
    if (!SingleLogger.instance) {
      SingleLogger.instance = new SingleLogger();
    }
    return SingleLogger.instance;
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    this.logs.push(logMessage);
    console.log(logMessage);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// 싱글톤 인스턴스 사용
const singleLogger1 = SingleLogger.getInstance();
const singleLogger2 = SingleLogger.getInstance();

// 두 인스턴스는 같은 객체
console.log("Good Example - Same instance?", singleLogger1 === singleLogger2); // true

// 두 로거는 같은 로그를 공유
singleLogger1.log("Good logger message 1");
singleLogger2.log("Good logger message 2");
console.log("Good logger 1 logs:", singleLogger1.getLogs()); // Good logger message 2
console.log("Good logger 2 logs:", singleLogger2.getLogs()); // Good logger message 2
