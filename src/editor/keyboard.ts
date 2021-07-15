
import { logger } from '@/common/Logger';
import hotkeys from 'hotkeys-js';
import { commandHistory } from '@/editor/core/CommandHistory';
import { isMac } from '@/utils';

const COMMAND_KEY = isMac ? 'command' : 'ctrl'

hotkeys(`${COMMAND_KEY}+z`, function (event) {
  event.preventDefault()
  commandHistory.undo()
});

hotkeys(`${COMMAND_KEY}+shift+z`, function (event) {
  event.preventDefault()
  commandHistory.redo()
});

hotkeys(`${COMMAND_KEY}+x`, function (event) {
  event.preventDefault()
  logger.debug('you pressed command+x!');
});

hotkeys(`${COMMAND_KEY}+c`, function (event) {
  event.preventDefault()
  logger.debug('you pressed command+c!');
});

hotkeys(`${COMMAND_KEY}+v`, function (event) {
  event.preventDefault()
  logger.debug('you pressed command+v!');
});
