import Service from '@src/services/service';
import { TWSConfig, TSockets, TSocketsNames } from '@src/services/ws/types';
import { TServices } from '@src/services/types';
import * as sockets from './imports';

/**
 * Сервис WebSocket API к внешнему серверу
 * Позволяет разнести слой АПИ на модули (ws)
 */
class WSService extends Service<TWSConfig, undefined> {
  private _sockets: TSockets;

  constructor(config: TWSConfig, services: TServices, env: ImportMetaEnv) {
    super(config, services, env);
    this._sockets = {} as TSockets;
  }

  override init() {
    // Создание экземпляров socket
    const names = Object.keys(sockets) as TSocketsNames[];
    for (const name of names) this.initSocket(name);
  }

  /**
   * Инициализация модуля socket
   * @param name Имя модуля socket, по которому будет обращение к методам
   * @param moduleName Название JS модуля. По умолчанию равен name
   */
  initSocket<T extends keyof TSockets>(name: T, moduleName?: T) {
    const config = this.config.sockets[name];
    // Если нет класса сопоставленного с name, то используется класс по умолчанию
    if (!moduleName) moduleName = name;
    if (!sockets[moduleName]) throw new Error(`Not found endpoint module "${moduleName}"`);
    const Constructor = sockets[moduleName];
    this._sockets[name] = new Constructor(config, this.services, name) as TSockets[T];
  }

  get sockets() {
    return this._sockets;
  }

  /**
   * Socket по названию
   * @param name Название модуля socket
   */
  get<T extends TSocketsNames>(name: T): TSockets[T] {
    if (!this._sockets[name]) {
      throw new Error(`Not found endpoint "${name}"`);
    }
    return this._sockets[name];
  }
}

export default WSService;
