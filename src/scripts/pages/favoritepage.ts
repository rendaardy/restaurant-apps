import './components/card';
import './components/dual-ring';

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { Restaurant } from '../model/restaurant';
import { IFavoriteService, TYPES } from '../shared/restaurant-interface';
import { container } from '../shared/container';

@customElement('mb-favoritepage')
export default class FavoritePage extends LitElement {
  @property({ attribute: false })
  restaurants: Restaurant[] = [];

  @state()
  private showLoading = true;

  constructor(private favoriteService: IFavoriteService) {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.favoriteService) {
      this.favoriteService = container.get<IFavoriteService>(TYPES.FAVORITE_SERVICE);
    }

    // Set skip content button
    const skipContent = document.querySelector<HTMLAnchorElement>('.skip-content');
    if (skipContent) {
      skipContent.href = `${window.location.pathname}#main`;
    }
  }

  async firstUpdated(): Promise<void> {
    try {
      this.restaurants = await this.favoriteService.getRestaurants();
    } catch (err) {
      console.log(err);
      history.replaceState(null, '', '/error');
    } finally {
      this.showLoading = false;
    }
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  render(): unknown {
    return html`
      <main id="main" class="main">
        <section class="article-list">
          <h2 class="article-list__header display-2">Favorites</h2>
          <div class="article-list__content">
            ${this.showLoading ? html`<dual-ring></dual-ring>` : this.cardItems()}
          </div>
        </section>
      </main>
    `;
  }

  private cardItems(): unknown {
    return this.restaurants.map(
      (resto) => html`
        <mb-card
          resto-id="${resto.id}"
          name="${resto.name}"
          image="${resto.smallPicture}"
          city="${resto.city}"
          rating="${resto.rating}"
          description="${resto.description}"
          for="favorite"
        >
        </mb-card>
      `
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-favoritepage': FavoritePage;
  }
}
