// Асинхронный импорт сервисов для деления сборки
export default {
  api: () => import('@src/services/api'),
  store: () => import('@src/services/store'),
  suspense: () => import('@src/services/suspense'),
  validator: () => import('@src/services/validator'),
  ws: () => import('@src/services/ws'),

  router: () => import('@src/services/router/service'),
  modals: () => import('@src/services/modals/service'),
  i18n: () => import('@src/services/i18n/service'),
};
