// Асинхронный импорт сервисов для деления сборки
export default {
  api: () => import('@src/services/api'),
  suspense: () => import('@src/services/suspense'),
  validator: () => import('@src/services/validator'),
  router: () => import('@src/services/router'),
  modals: () => import('@src/services/modals'),
  i18n: () => import('@src/services/i18n'),
  store: () => import('@src/services/store'),
  ws: () => import('@src/services/ws'),
  canvas: () => import('@src/services/canvas'),
};
