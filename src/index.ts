import { InitializationOptions } from './interface';
import _ from 'lodash';
import { DLMError, MysqlUriMissingError } from './errors';

/**
 *
 * @param key: Lock Key
 * @param ttl: Optionally pass ttl
 * @returns function to release lock
 */
export const getLock = async (key: string, ttl?: number): Promise<() => Promise<void>> => {
  const operation = await import('./operation');
  return operation.getLock(key, ttl);
};


export const initialize = async (mysqlUri: string, options?: InitializationOptions): Promise<void> => {
  if (_.isEmpty(mysqlUri)) {
    throw new DLMError(MysqlUriMissingError);
  }
  const init = await import('./initializer');
  await init.initialize(mysqlUri, options || {});
};


export const transaction = async <T>(key: string, func: () => Promise<T> | T): Promise<T> => {
  const lockReleaser = await getLock(key);
  try {
    const data = await func();
    lockReleaser();
    return data;
  } catch (err) {
    lockReleaser();
    throw err;
  }
};
