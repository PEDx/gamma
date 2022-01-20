import { logger } from '@/core/Logger';
import hotkeys from 'hotkeys-js';
import { isMac } from '@/utils';

const COMMAND_KEY = isMac ? 'command' : 'ctrl';

export class Keyboard {
  static flag: boolean = false;
  constructor() {
    if (Keyboard.flag) return;
    this.init();
  }
  init() {
    Keyboard.flag = true;
    hotkeys(`${COMMAND_KEY}+z`, function (event) {
      // 回退
      event.preventDefault();
    });

    hotkeys(`${COMMAND_KEY}+shift+z`, function (event) {
      // 重做
      event.preventDefault();
    });

    hotkeys(`${COMMAND_KEY}+x`, function (event) {
      //  剪切
      event.preventDefault();
      logger.debug('you pressed command+x!');
    });

    hotkeys(`${COMMAND_KEY}+c`, function (event) {
      // 复制
      event.preventDefault();
      logger.debug('you pressed command+c!');
    });

    hotkeys(`${COMMAND_KEY}+v`, function (event) {
      // 粘贴
      event.preventDefault();
      logger.debug('you pressed command+v!');
    });
  }
}
