import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mb-card')
export class Card extends LitElement {
  @property({ attribute: 'resto-id' })
  restoId?: string;

  @property()
  name?: string;

  @property()
  image?: string;

  @property()
  city?: string;

  @property({ type: Number })
  rating?: number;

  @property()
  description?: string;

  @property()
  for?: string;

  static styles = css`
    * {
      font-family: inherit;
      font-size: inherit;
      box-sizing: inherit;
      margin: 0;
      padding: 0;
    }

    :host {
      border: 1px solid #eee;
      border-radius: 5px;
      background-color: #eeebdd;
      box-shadow: 2px -2px 5px #333, -2px 2px 5px #333;
    }

    .card {
      padding: 0.5em;
    }

    .card__thumbnail {
      display: block;
      width: 100%;
      height: 270px;
      object-fit: cover;
      object-position: center;
      border-radius: 5px;
      margin-bottom: 1em;
    }

    flexible-rating {
      display: block;
      --iron-icon-width: 1rem;
    }

    .card__content {
      padding: 0.5em;
    }

    .card__text {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .card__action {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      margin-top: 1rem;
    }

    .card__action a {
      flex: 1;
      text-align: center;
    }

    .truncate {
      -webkit-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
    }

    .display-3 {
      font-size: 1.2rem;
    }

    .btn {
      display: inline-block;
      background-color: #fff;
      color: #000;
      text-decoration-line: none;
      font-size: 1rem;
      padding: 0.8rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      transition-duration: 0.2s;
    }

    .btn.is-black:hover {
      background-color: transparent;
      color: #1b1717;
      border: 1px solid #1b1717;
    }

    .is-black {
      color: #eee;
      background-color: #1b1717;
    }

    .location {
      font-size: 0.8rem;
      font-style: italic;
    }
  `;

  async firstUpdated(): Promise<void> {
    await import(/* webpackChunkName: "flexible-rating" */ 'flexible-rating');
  }

  render(): unknown {
    return html`
      <article class="card">
        <img
          class="card__thumbnail"
          width="400"
          height="270"
          loading="lazy"
          src="${this.image}"
          alt="${this.name}"
        />
        <div class="card__content">
          <h3 class="card__title display-3">${this.name}</h3>
          <p class="location">${this.city}</p>
          <flexible-rating max="5" value="${this.rating}" aria-label="rating"></flexible-rating>
          <p class="card__text truncate">${this.description}</p>
          <div class="card__action">
            <a href="/${this.for}/${this.restoId}" class="btn is-black">Detail</a>
          </div>
        </div>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-card': Card;
  }
}
