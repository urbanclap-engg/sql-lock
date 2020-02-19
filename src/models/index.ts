
import { LockingDb } from './locking.schema';
import { Transaction } from 'sequelize';
import _ from 'lodash';

export const create = async (key: string, options: { transaction: Transaction }): Promise<void> => {
  await LockingDb.bulkCreate([{ id : key }], _.merge({ updateOnDuplicate: ['id'] }, options));
};

export const destroy = async (key: string): Promise<void> => {
  await LockingDb.destroy({ where: { id: key } });
};
