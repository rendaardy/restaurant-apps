import '../../styles/detailpage.css';

import './components/like-button';

import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { Params, queryParentRouterSlot } from 'router-slot';

import { Restaurant, CustomerReview } from '../model/restaurant';
import { IRestaurantService, IFavoriteService, TYPES } from '../shared/restaurant-interface';
import { container } from '../shared/container';
import { RestaurantService } from '../shared/restaurants-service';
import { FavoriteService } from '../shared/favorite-service';
import { LikeButton } from './components/like-button';

@customElement('mb-detailpage')
export default class DetailPage extends LitElement {
  @property({ attribute: false })
  restaurant?: Restaurant;

  @property({ attribute: false })
  customerReviews?: CustomerReview[];

  @query('form.customer-reviews__form')
  reviewForm?: HTMLFormElement;

  @query('mb-like-button')
  likeButton?: LikeButton;

  restaurantId = '';

  location = '';

  constructor(
    private restaurantService: IRestaurantService,
    private favoriteService: IFavoriteService
  ) {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.restaurantService && !this.favoriteService) {
      this.restaurantService = container.get<IRestaurantService>(TYPES.RESTAURANT_SERVICE);
      this.favoriteService = container.get<IFavoriteService>(TYPES.FAVORITE_SERVICE);
    }

    if (!this.restaurantId || this.restaurantId === '') {
      this.restaurantId = this.params?.id ?? '';
    }

    // Set skip content button
    const skipContent = document.querySelector<HTMLAnchorElement>('.skip-content');
    if (skipContent) {
      skipContent.href = `${window.location.pathname}#main`;
    }
  }

  async firstUpdated(): Promise<void> {
    await import(/* webpackChunkName: "flexible-rating" */ 'flexible-rating');

    if (!this.location || this.location === '') {
      this.location = window.location.pathname;
    }

    try {
      if (this.location.startsWith('/detail')) {
        this.restaurant = await this.restaurantService.getRestaurant(this.restaurantId);
      } else if (this.location.startsWith('/favorite')) {
        this.restaurant = await this.favoriteService.getRestaurant(this.restaurantId);
      }
    } catch (err) {
      console.log(err);
      history.replaceState(null, '', '/error');
    }

    this.customerReviews = this.restaurant?.customerReviews;

    const isOn = await (this.favoriteService as FavoriteService).hasRestaurant(this.restaurantId);
    if (this.likeButton && isOn) {
      this.likeButton.on = isOn;
    }
  }

  get params(): Params | undefined {
    return queryParentRouterSlot(this)?.match?.params;
  }

  async onFavoriteToggle(): Promise<void> {
    const isOn = this.likeButton?.on;
    if (isOn) {
      try {
        if (this.restaurant) {
          await (this.favoriteService as FavoriteService).putRestaurant(this.restaurant);
        }
      } catch {
        if (this.likeButton) {
          this.likeButton.on = false;
        }
      }
    } else {
      try {
        await (this.favoriteService as FavoriteService).deleteRestaurant(this.restaurantId);
      } catch {
        if (this.likeButton) {
          this.likeButton.on = true;
        }
      }
    }
  }

  async onSubmitCustomerReview(event: Event): Promise<void> {
    event.preventDefault();

    const formData = new FormData(this.reviewForm);
    const custReview: CustomerReview = {
      id: this.restaurantId,
      name: formData.get('name')?.toString() ?? '',
      review: formData.get('review')?.toString() ?? '',
    };

    this.customerReviews = await (this.restaurantService as RestaurantService).postReview(
      custReview
    );
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  render(): unknown {
    return html`
      <section class="restaurant__header">
        <div class="restaurant__info">
          <h1 class="display-1">
            ${this.restaurant?.name}
            <mb-like-button
              aria-label-on="Dislike this restaurant"
              aria-label-off="Like this restaurant"
              @mb-like-button:change="${this.onFavoriteToggle}"
            >
            </mb-like-button>
          </h1>
          <flexible-rating
            max="5"
            value="${this.restaurant?.rating}"
            aria-label="Restaurant Rating"
          >
          </flexible-rating>
          <p>${this.restaurant?.city}</p>
          <p>${this.restaurant?.address}</p>
          <div class="restaurant__categories">
            ${this.restaurant?.categories.map(
              (category) => html`<span class="category">${category.name}</span>`
            )}
          </div>
        </div>
        <picture>
          <source
            media="(max-width: 1024px)"
            srcset="${this.restaurant?.largePicture}"
            type="image/jpeg"
          />
          <source
            media="(max-width: 860px)"
            srcset="${this.restaurant?.mediumPicture}"
            type="image/jpeg"
          />
          <source
            media="(max-width: 460px)"
            srcset="${this.restaurant?.smallPicture}"
            type="image/jpeg"
          />
          <img
            src="${this.restaurant?.mediumPicture}"
            alt="${this.restaurant?.name}"
            width="930"
            height="540"
            class="restaurant__image"
          />
        </picture>
      </section>
      <main id="main" class="main">
        <article class="restaurant__article">
          <section class="restaurant__description">
            <h2 class="display-2">Description</h2>
            <p class="restaurant__description">${this.restaurant?.description}</p>
          </section>
          <section class="restaurant__menu">
            <div>
              <h2 class="display-2">Foods</h2>
              <ul class="foods">
                ${this.restaurant?.menus.foods.map((food) => html`<li>${food.name}</li>`)}
              </ul>
            </div>
            <div>
              <h2 class="display-2">Drinks</h2>
              <ul class="drinks">
                ${this.restaurant?.menus.drinks.map((drink) => html`<li>${drink.name}</li>`)}
              </ul>
            </div>
          </section>
          <section class="customer-reviews">${this.customerReviewForm()}</section>
        </article>
      </main>
    `;
  }

  private customerReviewForm(): unknown {
    return html`
      <h3 class="display-3">Write your review</h3>
      <form class="customer-reviews__form" @submit="${this.onSubmitCustomerReview}">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your name" required />
        <label for="review">Review</label>
        <textarea
          cols="50"
          rows="5"
          id="review"
          name="review"
          placeholder="Awesome!"
          required
        ></textarea>
        <button type="submit" class="btn is-black">Send</button>
      </form>
      <ul class="customer-reviews__list">
        ${this.customerReviews?.map(
          ({ name, date, review }) => html`
            <li>
              <p>${name} - ${date}</p>
              <p>${review}</p>
            </li>
          `
        )}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-detailpage': DetailPage;
  }
}
