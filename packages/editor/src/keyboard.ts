import { logger } from '@/core/Logger';
import hotkeys from 'hotkeys-js';
import { commandHistory } from '@/core/CommandHistory';
import { safeEventBus, SafeEventType } from '@/events';
import { isMac } from '@/utils';

const COMMAND_KEY = isMac ? 'command' : 'ctrl';

hotkeys(`${COMMAND_KEY}+z`, function (event) {
  // 回退
  event.preventDefault();
  commandHistory.undo();
});

hotkeys(`${COMMAND_KEY}+shift+z`, function (event) {
  // 重做
  event.preventDefault();
  commandHistory.redo();
});

hotkeys(`${COMMAND_KEY}+x`, function (event) {
  //  TODO 剪切
  event.preventDefault();
  safeEventBus.emit(SafeEventType.CUT_VIEWDATA);
  logger.debug('you pressed command+x!');
});

hotkeys(`${COMMAND_KEY}+c`, function (event) {
  // TODO 复制
  event.preventDefault();
  safeEventBus.emit(SafeEventType.COPY_VIEWDATA);
  logger.debug('you pressed command+c!');
});

hotkeys(`${COMMAND_KEY}+v`, function (event) {
  // TODO 粘贴
  event.preventDefault();
  safeEventBus.emit(SafeEventType.PASTE_VIEWDATA);
  logger.debug('you pressed command+v!');
});
