import { getRandomStr } from "@/utils";


enum LogLevel {
  Debug = 'debug',
  Log = 'log',
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

const LogLevelMap = new Map([
  [LogLevel.Debug, '#54E346'],
  [LogLevel.Log, '#185ADB'],
  [LogLevel.Info, '#00ADB5'],
  [LogLevel.Warn, '#F7B633'],
  [LogLevel.Error, '#FF502F'],
])



class Log {
  id: string;
  value: any[];
  level: LogLevel;
  constructor({
    value, level
  }: {
    value: any[];
    level: LogLevel;
  }) {
    this.id = getRandomStr(6)
    this.value = value
    this.level = level
  }
}


export class Logger {
  private list: Log[] = []
  private report(log: Log) {
    this.list.push(log)
    const { level, value } = log
    console.log(
      `%c${level}%c ${value}`,
      `background: ${LogLevelMap.get(level)} ; padding: 0 4px; border-radius: 3px 0 0 3px;  color: #fff`,
      `color: ${LogLevelMap.get(level)};`
    );
  }
  debug(...data: any[]) {
    this.report(new Log({
      level: LogLevel.Debug,
      value: data
    }))
  }
  log(...data: any[]) {
    this.report(new Log({
      level: LogLevel.Log,
      value: data
    }))
  }
  info(...data: any[]) {
    this.report(new Log({
      level: LogLevel.Info,
      value: data
    }))
  }
  warn(...data: any[]) {
    this.report(new Log({
      level: LogLevel.Warn,
      value: data
    }))
  }
  error(...data: any[]) {
    this.report(new Log({
      level: LogLevel.Error,
      value: data
    }))
  }
}


export const logger = new Logger();

