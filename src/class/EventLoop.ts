// LINK https://www.zeolearn.com/magazine/javascript-how-is-callback-execution-strategy-for-promises-different-than-dom-events-callback
// LINK https://github.com/sl1673495/blogs/issues/47
interface microtask {
  execute: () => void;
}
interface task {
  execute: () => void;
}

interface ITaskQueues {
  events: task[];
  parser: task[];
  callbacks: task[];
  resources: task[];
  domManipulation: task[];
}

type ITaskQueuesName = keyof ITaskQueues;

const handle = () => Math.random() > 0.5;

const vSyncTime = handle;
const needsDomRerender = handle;
const hasEventLoopEventsToDispatch = handle;
const dispatchPendingUIEvents = handle;
const resizeSteps = handle;
const scrollSteps = handle;
const mediaQuerySteps = handle;
const cssAnimationSteps = handle;
const fullscreenRenderingSteps = handle;
const animationFrameCallbackSteps = handle;
const intersectionObserverSteps = handle;
const resizeObserverSteps = handle;
const updateStyle = handle;
const updateLayout = handle;
const paint = handle;

export class EventLoop {
  taskQueues: ITaskQueues;
  microtaskQueue: microtask[] = [];
  scriptExecuting: boolean = false;
  constructor() {
    this.taskQueues = {
      events: [], // UI events from native GUI framework
      parser: [], // HTML parser
      callbacks: [], // setTimeout, requestIdleTask
      resources: [], // image loading
      domManipulation: [],
    };
  }
  nextTask() {
    // Spec says:
    // "Select the oldest task on one of the event loop's task queues"
    // Which gives browser implementers lots of freedom
    // Queues can have different priorities, etc.
    for (let key in this.taskQueues) {
      const q = this.taskQueues[key as ITaskQueuesName];
      if (q.length > 0) return q.shift();
    }
    return null;
  }
  executeMicrotasks() {
    if (this.scriptExecuting) return;
    let microtasks = this.microtaskQueue;
    this.microtaskQueue = [];
    microtasks.forEach((t) => t.execute());
  }
  needsRendering() {
    return (
      vSyncTime() && (needsDomRerender() || hasEventLoopEventsToDispatch())
    );
  }
  render() {
    dispatchPendingUIEvents();
    resizeSteps();
    scrollSteps();
    mediaQuerySteps();
    cssAnimationSteps();
    fullscreenRenderingSteps();
    animationFrameCallbackSteps();
    intersectionObserverSteps();
    while (resizeObserverSteps()) {
      updateStyle();
      updateLayout();
    }
    paint();
  }
}

const eventLoop = new EventLoop();

while (true) {
  const task = eventLoop.nextTask();
  if (task) task.execute();
  eventLoop.executeMicrotasks();
  if (eventLoop.needsRendering()) eventLoop.render();
}
