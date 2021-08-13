import { getRandomStr } from '@/utils';

export enum LogLevel {
  Debug = 'debug',
  Log = 'log',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Danger = 'danger',
}

const LogLevelMap = new Map([
  [LogLevel.Debug, '#54E346'],
  [LogLevel.Log, '#185ADB'],
  [LogLevel.Info, '#00ADB5'],
  [LogLevel.Warn, '#F7B633'],
  [LogLevel.Error, '#FF502F'],
  [LogLevel.Danger, '#df85ff'],
]);

export class Log {
  id: string;
  value: any[];
  level: LogLevel;
  name?: string;
  constructor({
    value,
    level,
    name,
  }: {
    value: any;
    level: LogLevel;
    name?: string;
  }) {
    this.id = getRandomStr(6);
    this.value = value;
    this.level = level;
    this.name = name;
  }
}

export class Logger {
  private list: Log[] = [];
  report(log: Log) {
    this.list.push(log);
    const { level, value, name } = log;
    let color = LogLevelMap.get(level);
    console.log(
      `%c${name || level}%c ${value}`,
      `background: ${color} ; padding: 0 4px; border-radius: 3px 0 0 3px;  color: #fff`,
      `color: ${color};`,
    );
  }
  debug(...data: any[]) {
    this.report(
      new Log({
        level: LogLevel.Debug,
        value: data,
      }),
    );
  }
  log(...data: any[]) {
    this.report(
      new Log({
        level: LogLevel.Log,
        value: data,
      }),
    );
  }
  info(...data: any[]) {
    this.report(
      new Log({
        level: LogLevel.Info,
        value: data,
      }),
    );
  }
  warn(...data: any[]) {
    this.report(
      new Log({
        level: LogLevel.Warn,
        value: data,
      }),
    );
  }
  error(...data: any[]) {
    this.report(
      new Log({
        level: LogLevel.Error,
        value: data,
      }),
    );
  }
}

export const logger = new Logger();
