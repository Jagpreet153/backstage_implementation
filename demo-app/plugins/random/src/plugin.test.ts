import { randomPlugin } from './plugin';

describe('random', () => {
  it('should export plugin', () => {
    expect(randomPlugin).toBeDefined();
  });
});
