import * as sockets from '@src/services/ws/imports';

/**
 * Конструкторы модулей сокетов
 */
export type TSocketsConstructors = typeof sockets;

/**
 * Названия модулей сокетов
 */
export type TSocketsNames = keyof TSocketsConstructors;

/**
 * Модули сокетов
 */
export type TSockets = {
  [P in TSocketsNames]: InstanceType<TSocketsConstructors[P]>
}

export interface IDefaultWSConfig {
  url: string;
}

/**
 * Дефолтный конфиг сокета
 */
export type TWSConfig = {
  default: IDefaultWSConfig;
  sockets: {
    [P in TSocketsNames]: ReturnType<TSockets[P]['defaultConfig']>;
  }
}
