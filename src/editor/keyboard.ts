
import { logger } from '@/class/Logger';
import hotkeys from 'hotkeys-js';
import { commandHistory } from '@/class/CommandHistory';

hotkeys('command+z,command+shift+z,ctrl+b,r,f', function (event, handler) {
  event.preventDefault()
  switch (handler.key) {
    case 'command+z':
      logger.debug('you pressed command+z!');
      commandHistory.undo()
      break;
    case 'command+shift+z':
      logger.debug('you pressed command+shift+z!');
      commandHistory.redo()
      break;
    case 'ctrl+b': logger.debug('you pressed ctrl+b!');
      break;
    case 'r': logger.debug('you pressed r!');
      break;
    case 'f': logger.debug('you pressed f!');
      break;
    default: logger.debug('event');
  }
});
