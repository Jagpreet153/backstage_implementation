import { createDevApp } from '@backstage/dev-utils';
import { randomPlugin, RandomPage } from '../src/plugin';

createDevApp()
  .registerPlugin(randomPlugin)
  .addPage({
    element: <RandomPage />,
    title: 'Root Page',
    path: '/random',
  })
  .render();
