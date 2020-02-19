'use strict';

import Sequelize, { Model } from 'sequelize';
import { getConfiguration } from '../initializer';

const MysqlDb = getConfiguration().mysql_connection;

interface LockingModel extends Model {
  readonly id: number;
}

type LockingStaticModel = typeof Model & {
  new (): LockingModel;
};

const schema = {
  id: { type: Sequelize.STRING, primaryKey: true }
};

export const LockingDb = MysqlDb.define('locking', schema) as LockingStaticModel;
