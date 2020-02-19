import _ from 'lodash';
import { getConfiguration } from './initializer';
import { InvalidKeyError, DLMError } from './errors';
import * as LockDM from './models';
import { Transaction } from 'sequelize';

const Configuration = getConfiguration();

const getLockReleaser = (key: string, transaction: Transaction): () => Promise<void> => {
  let finished = false;
  return async (): Promise<void> => {
    if (!finished) {
      finished = true;
      await transaction.commit();
      await LockDM.destroy(key);
    }
  };
};

export const getLock = async (key: string, ttl?: number): Promise<() => Promise<void>> => {
  if (_.isEmpty(key)) {
    throw new DLMError(InvalidKeyError);
  }

  if (!_.isNumber(ttl)) {
    ttl = Configuration.locking_ttl;
  }
  const transaction = await Configuration.mysql_connection.transaction();
  await LockDM.create(key, { transaction : transaction });
  const lockReleaser = getLockReleaser(key, transaction);
  setTimeout(lockReleaser, ttl);
  return lockReleaser;
};
