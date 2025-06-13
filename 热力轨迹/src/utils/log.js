/**
 * for Qt WebEngineView environment
 */
class Log {

  constructor() {

    this.level = 'debug'
    this._levels = [
      'off',
      'debug',
      'info',
      'warn',
      'error',
    ]

  }

  setLevel(level) {

    this.level = level || this.level

  }

  debug(...arg) {

    if (this._levels.indexOf(this.level) === 1) {

      console.warn('DEBUG -', ...arg)

    }

  }

  info(...arg) {

    if (this._levels.indexOf(this.level) >= 1 && this._levels.indexOf(this.level) <= 2) {

      console.warn('INFO -', ...arg)

    }

  }

  warn(...arg) {

    if (this._levels.indexOf(this.level) >= 1 && this._levels.indexOf(this.level) <= 3) {

      console.warn('WARN -', ...arg)

    }

  }

  error(...arg) {

    if (this._levels.indexOf(this.level) >= 1) {

      console.error('ERROR -', ...arg)

    }

  }

}

export default new Log()
