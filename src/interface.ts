import { Sequelize } from 'sequelize';

export interface InitializationOptions {
  locking_ttl?: number;
}

export interface Configuration {
  mysql_connection: Sequelize;
  locking_ttl: number;
}
