import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { RouterSlot, IRoute } from 'router-slot';

const appRoutes: IRoute[] = [
  {
    path: '',
    component: () => import('./homepage'),
    pathMatch: 'full',
  },
  {
    path: 'favorite',
    component: () => import('./favoritepage'),
  },
  {
    path: 'favorite/:id',
    component: () => import('./detailpage'),
  },
  {
    path: 'detail/:id',
    component: () => import('./detailpage'),
  },
  {
    path: 'error',
    component: () => import('./not-found'),
  },
  {
    path: '**',
    redirectTo: '/error',
  },
];

@customElement('mb-app')
export default class App extends LitElement {
  @query('router-slot')
  routerSlot!: RouterSlot;

  firstUpdated(): void {
    this.routerSlot.add(appRoutes);
  }

  updated(): void {
    this.routerSlot.render();
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  render(): unknown {
    return html`<router-slot></router-slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-app': App;
  }
}
