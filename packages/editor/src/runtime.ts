import {
  ConfiguratorValueType,
  ElementType,
  createConfigurator,
  Resource,
} from '@gamma/runtime';

const runtime = {
  ConfiguratorValueType,
  ElementType,
  Resource,
  createConfigurator,
};

//@ts-ignore
window['@gamma/runtime'] = runtime;
