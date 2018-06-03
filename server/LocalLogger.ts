/* tslint:disable:no-any */

export enum LogLevel {
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  OFF = Infinity,
}

enum LogColor {
  RED = '[31m',
  GREEN = '[32m',
  YELLOW = '[33m',
  CYAN = '[36m',
}

// prettier-ignore
const colorize = (s: string, color: LogColor): string => `\x1b${color}${s}\x1b[0m`;

const TIME_PHRASES = [
  'milliseconds',
  'seconds',
  'minutes',
  'hours',
  'date',
  'month',
  'fullYear',
];

const padZeroes = (n: number, offset: number = 0): string => {
  const s = `${n}`;
  const result = [s];
  for (let i = 0; i < offset - s.length; i++) {
    result.unshift('0');
  }
  return result.join('');
};

class LocalLogger {
  private _level: LogLevel;
  private _timed: boolean;

  constructor({ level, timed }: { level?: LogLevel; timed?: boolean } = {}) {
    this._level = level || LogLevel.INFO;
    this._timed = timed || false;
  }

  get level() {
    return this._level;
  }

  set level(level: LogLevel) {
    this._level = level;
  }

  get timed() {
    return this._timed;
  }

  set timed(timed: boolean) {
    this._timed = timed;
  }

  get timestamp() {
    const date = new Date();
    const r = {} as any;
    TIME_PHRASES.forEach(phrase => {
      r[phrase] = date[`getUTC${phrase[0].toUpperCase()}${phrase.substr(1)}`]();
      if (phrase === 'fullYear') {
        r[phrase] = r[phrase] % 100;
      } else if (phrase === 'month') {
        r[phrase]++;
      }
      r[phrase] = padZeroes(r[phrase], phrase === 'milliseconds' ? 3 : 2);
    });
    const d = `${r.month}/${r.date}/${r.fullYear}`;
    const t = `${r.hours}:${r.minutes}:${r.seconds}:${r.milliseconds}`;
    return `${d}+${t}`;
  }

  public middleware = (req, res, next) => {
    setImmediate(() => {
      const content = `${req.method} ${res.statusCode} ${req.originalUrl}`;
      if (res.statusCode < 400) {
        this.info(colorize('✓', LogColor.GREEN), content);
      } else {
        this.error(colorize('✗', LogColor.RED), content);
      }
    });
    next();
  }; // tslint:disable-line:semicolon

  public info(...params: Array<any>): void {
    this.stdout('info', LogColor.CYAN, ...params);
  }

  public warn(...params: Array<any>): void {
    this.stdout('warn', LogColor.YELLOW, ...params);
  }

  public error(...params: Array<any>): void {
    this.stdout('error', LogColor.RED, ...params);
  }

  private stdout(type: string, color: LogColor, ...params: Array<any>): void {
    if (this.level > LogLevel[type.toUpperCase()]) {
      return;
    }
    const prefixes = [colorize(`[${type.toUpperCase()}]`, color)];
    if (this.timed) {
      prefixes.push(this.timestamp);
    }
    console[type](...prefixes, ...params);
    prefixes.length = 0;
  }
}

export default LocalLogger;
