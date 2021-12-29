import { AsyncUpdateQueue } from '../src/AsyncUpdateQueue';

const timeout = (n: number = 0) => new Promise((r) => setTimeout(r, n));

describe('class: AsyncUpdateQueue', () => {
  test('simple usage', async () => {
    const auq = new AsyncUpdateQueue();
    let count = 0;
    const len = 10;
    const sameWork = () => {
      count += 1;
    };
    const geWork = () => () => {
      count += 1;
    };
    Array.from({ length: len }).forEach(() => {
      auq.push(geWork());
    });
    expect(count).toBe(0);
    await timeout(100);
    expect(count).toBe(len);

    count = 0;
    Array.from({ length: len }).forEach(() => {
      auq.push(sameWork);
    });
    expect(count).toBe(0);
    await timeout(100);
    expect(count).toBe(1);
  });
});
