import '../styles/animation.css';

import { Router } from '@vaadin/router';

const router = new Router(document.querySelector('#router-outlet'));
router.setRoutes([
  {
    path: '/',
    animate: true,
    component: 'mb-homepage',
  },
  {
    path: '/favorite',
    animate: true,
    children: [
      { path: '/', component: 'mb-favoritepage' },
      { path: '/:id', component: 'mb-detailpage' },
    ],
  },
  {
    path: '/detail/:id',
    animate: true,
    component: 'mb-detailpage',
  },
  {
    path: '/error',
    animate: true,
    component: 'mb-notfound-page',
  },
  {
    path: '(.*)',
    animate: true,
    redirect: '/error',
  },
]);

export { router, Router };
