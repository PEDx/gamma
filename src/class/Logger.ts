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
  value: string;
  level: LogLevel;
  constructor({
    value, level
  }: {
    value: string;
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
  debug(str: string) {
    this.report(new Log({
      level: LogLevel.Debug,
      value: str
    }))
  }
  log(str: string) {
    this.report(new Log({
      level: LogLevel.Log,
      value: str
    }))
  }
  info(str: string) {
    this.report(new Log({
      level: LogLevel.Info,
      value: str
    }))
  }
  warn(str: string) {
    this.report(new Log({
      level: LogLevel.Warn,
      value: str
    }))
  }
  error(str: string) {
    this.report(new Log({
      level: LogLevel.Error,
      value: str
    }))
  }
}


export const logger = new Logger();

