import { createBEM } from './bem';
import { GAMMA_PREFIX } from './constant';

export function createNamespace(name: string) {
  const prefixedName = `${GAMMA_PREFIX}-${name}`;
  return [prefixedName, createBEM(prefixedName)] as const;
}
