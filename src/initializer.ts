import _ from 'lodash';
import { Sequelize } from 'sequelize';
import { InitializationOptions, Configuration } from './interface';
import { DLMError, NotInitializedError } from './errors';

const DEFAULT_LOCKING_TTL = 10000;


let configuration: Configuration | null = null;

const getConnection = (MysqlUri: string): Sequelize => {
  return new Sequelize(MysqlUri, { pool: { min: 2, max: 10, idle: 30000, acquire: 30000 }, logging: false });
};

const getOptionsWithDefaults = (options: InitializationOptions): InitializationOptions => {
  return {
    locking_ttl: _.isNumber(options.locking_ttl) ? options.locking_ttl : DEFAULT_LOCKING_TTL
  };
};

export const initialize = async (MysqlUri: string, options: InitializationOptions): Promise<void> => {
  const connection = getConnection(MysqlUri);
  await connection.authenticate();
  const optionsWithDefaults = getOptionsWithDefaults(options);
  configuration = {
    mysql_connection: connection,
    locking_ttl: optionsWithDefaults.locking_ttl as number
  };
  await import('./models');
  await connection.sync();
  return;
};

export const getConfiguration = (): Configuration => {
  if (!configuration) {
    throw new DLMError(NotInitializedError);
  }
  return configuration;
};
