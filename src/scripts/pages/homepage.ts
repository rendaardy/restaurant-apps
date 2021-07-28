import './components/card';
import './components/dual-ring';

import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { Restaurant } from '../model/restaurant';
import { IRestaurantService, TYPES } from '../shared/restaurant-interface';
import { container } from '../shared/container';
import { RestaurantService } from '../shared/restaurants-service';

@customElement('mb-homepage')
export default class HomePage extends LitElement {
  @property({ attribute: false })
  restaurants: Restaurant[] = [];

  @query('.search-form > input[name="q"]')
  searchForm?: HTMLInputElement;

  @state()
  private showLoading = true;

  constructor(private restaurantService: IRestaurantService) {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.restaurantService) {
      this.restaurantService = container.get<IRestaurantService>(TYPES.RESTAURANT_SERVICE);
    }

    // Set skip content button
    const skipContent = document.querySelector<HTMLAnchorElement>('.skip-content');
    if (skipContent) {
      skipContent.href = `${window.location.pathname}#main`;
    }
  }

  async firstUpdated(): Promise<void> {
    try {
      this.restaurants = await this.restaurantService.getRestaurants();
    } catch (err) {
      console.log(err);
      history.replaceState(null, '', '/error');
    } finally {
      this.showLoading = false;
    }
  }

  async handleSearch(event: Event): Promise<void> {
    event.preventDefault();
    const query = this.searchForm?.value ?? '';
    this.restaurants = await (this.restaurantService as RestaurantService).findRestaurants(query);
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  render(): unknown {
    return html`
      ${this.hero()}
      <main id="main" class="main">
        <section class="article-list">
          <h2 class="article-list__header display-2">Explore Restaurant</h2>
          ${this.searchInput()}
          <div class="article-list__content">
            ${this.showLoading ? html`<dual-ring></dual-ring>` : this.cardItems()}
          </div>
        </section>
      </main>
    `;
  }

  private cardItems(): unknown {
    return this.restaurants.map(
      (resto) => html` <mb-card
        resto-id="${resto.id}"
        name="${resto.name}"
        image="${resto.smallPicture}"
        city="${resto.city}"
        rating="${resto.rating}"
        description="${resto.description}"
        for="detail"
      >
      </mb-card>`
    );
  }

  private hero(): unknown {
    return html`
      <header class="hero">
        <div class="hero__content">
          <h1 class="display-1">Megabucket</h1>
          <p>Find the best restaurant near you</p>
        </div>
        <picture>
          <source
            media="(max-width: 860px)"
            srcset="/images/heroes/hero-image_4-medium.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 860px)"
            srcset="/images/heroes/hero-image_4-medium.jpg"
            type="image/jpeg"
          />
          <source
            media="(max-width: 450px)"
            srcset="/images/heroes/hero-image_4-small.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 450px)"
            srcset="/images/heroes/hero-image_4-small.jpg"
            type="image/jpeg"
          />
          <source srcset="/images/heroes/hero-image_4.webp" type="image/webp" />
          <img
            class="hero__bg-image"
            width="1350"
            height="900"
            src="/images/heroes/hero-image_4.jpg"
            alt=""
          />
        </picture>
      </header>
    `;
  }

  private searchInput(): unknown {
    return html`
      <form class="search-form" @submit="${this.handleSearch}">
        <input
          type="search"
          name="q"
          placeholder="Search restaurant"
        />
        <button type="submit" class="btn is-black">Search</button>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-homepage': HomePage;
  }
}
