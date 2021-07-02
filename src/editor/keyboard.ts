
import { logger } from '@/class/Logger';
import hotkeys from 'hotkeys-js';

hotkeys('command+a,ctrl+b,r,f', function (event, handler) {
  switch (handler.key) {
    case 'command+a': logger.debug('you pressed command+a!');
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
