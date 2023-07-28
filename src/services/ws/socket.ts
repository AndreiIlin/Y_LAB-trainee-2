import { IDefaultWSConfig, TSocketsNames } from '@src/services/ws/types';
import { TServices } from '@src/services/types';
import mc from 'merge-change';

abstract class Socket<Config extends { url: string } = IDefaultWSConfig> {
  services: TServices;
  config: Config;
  name: TSocketsNames;
  socket: WebSocket | undefined;

  constructor(config: Config | unknown, services: TServices, name: TSocketsNames) {
    this.services = services;
    this.config = mc.patch(this.defaultConfig(), config);
    this.name = name;
    this.socket = undefined;
  }

  /**
   * Инициализация после создания экземпляра.
   * Вызывается автоматически.
   * Используется, чтобы не переопределять конструктор
   */
  init() {
    this.socket = new WebSocket(this.defaultConfig().url);
  }

  /**
   * Конфигурация по умолчанию.
   * Переопределяется общими параметрами сервиса ws и параметрами из конфига экземпляра
   */
  defaultConfig(): Config | IDefaultWSConfig {
    return {
      url: `ws://example.front.ylab.io/${this.name}`,
    };
  }


}

export default Socket;
