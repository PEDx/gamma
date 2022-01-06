const tryCall = <T extends Function>(fn: T) => {
  try {
    return fn();
  } catch (error) {
    throw error;
  }
};

export class Renderer {
  constructor() {}
  build() {}
}
