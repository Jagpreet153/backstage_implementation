import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const randomPlugin = createPlugin({
  id: 'random',
  routes: {
    root: rootRouteRef,
  },
});

export const RandomCard = randomPlugin.provide(
  createRoutableExtension({
    component: {
      lazy: () =>
        import('./components/RandomCard').then(m => m.RandomCard),
    }
  }),
);

export const RandomPage = randomPlugin.provide(
  createRoutableExtension({
    name: 'RandomPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
