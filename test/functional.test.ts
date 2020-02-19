
import { getLock, initialize, transaction } from '../src';
import { getConfiguration } from '../src/initializer';
import Config from './config.json';
import Crypto from 'crypto';

jest.setTimeout(100000);

const getRandomKey = (): string => {
  return Crypto.randomBytes(5).toString('hex');
};

export const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('sql-locker', () => {
  beforeAll(async () => {
    await initialize(Config.mysql_uri, { locking_ttl: 5000 });
    await delay(500);
  });
  test('get lock and release', async () => {
    const lockKey = getRandomKey();
    const release = await getLock(lockKey, 2000);
    await release();
  });
  test('lock timeout', async () => {
    const lockKey = getRandomKey();
    await getLock(lockKey, 1000); //Lock should be released after 1 second
    const start = new Date();
    const lockRelease = await getLock(lockKey);
    const timeTaken = new Date().getTime() - start.getTime();
    await lockRelease();
    expect(timeTaken).toBeLessThan(4000);
    expect(timeTaken).toBeGreaterThan(1000);
  });
  test('try to get same lock twice - second lock will only be gotten after first releases lock', async () => {
    const lockKey = getRandomKey();
    const releaseLock = await getLock(lockKey, 5000);
    setTimeout(() => {
      releaseLock();
    }, 3000);
    const start = new Date();
    const releaseLock2 = await getLock(lockKey);
    expect(new Date().getTime() - start.getTime()).toBeGreaterThan(2900); //Waited until lock was released
    await releaseLock2();
  });
  test('get lock 1, get lock 2, get lock 3 - no blocking should happen here', async () => {
    const lockKey1 = getRandomKey();
    const lockKey2 = getRandomKey();
    const start  = new Date();
    const releaser1 = await getLock(lockKey1, 15000);
    const releaser2 = await getLock(lockKey2, 15000);
    expect(new Date().getTime() - start.getTime()).toBeLessThan(10000); //Got here before lock were released
    await releaser1();
    await releaser2();
  });
  test('transaction style lock', async () => {
    const lockKey = getRandomKey();
    const transactionPromise = transaction(lockKey, async () => {
      await delay(3000);
      return 'ok';
    });
    const start = new Date();
    const releaseLock2 = await getLock(lockKey);
    expect(new Date().getTime() - start.getTime()).toBeGreaterThan(2900); //Waited until lock was released
    expect(await transactionPromise).toEqual('ok');
    await releaseLock2();
  });
  afterAll(async () => {
    await delay(20000);
    const config = getConfiguration();
    await config.mysql_connection.close();
  })
});
