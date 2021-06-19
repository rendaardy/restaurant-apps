import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mb-like-button')
export class LikeButton extends LitElement {
  @property({ type: Boolean })
  on = false;

  @property({ attribute: 'aria-label-on' })
  ariaLabelOn = '';

  @property({ attribute: 'aria-label-off' })
  ariaLabelOff = '';

  constructor() {
    super();
    this.addEventListener('click', () => {
      this.on = !this.on;
      this.dispatchEvent(new CustomEvent('mb-like-button:change', { detail: { isOn: this.on } }));
    });
  }

  updated(): void {
    const label = this.on ? this.ariaLabelOn : this.ariaLabelOff;
    this.setAttribute('aria-label', label);
  }

  static styles = css`
    .btn-like {
      background-color: transparent;
      padding: 1.3rem;
      border: none;
      border-radius: 100px;
      cursor: pointer;
    }

    .btn-like i.fa {
      font-size: 2.5rem;
      color: #810000;
      transition-duration: 0.3s;
    }

    .btn-like i.fa:hover {
      transform: translateY(-2px);
    }
  `;

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  render(): unknown {
    return html`
      <button class="btn-like">
        ${this.on
          ? html`<i class="fa fa-heart" aria-hidden="true"></i>`
          : html`<i class="fa fa-heart-o" aria-hidden="true"></i>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-like-button': LikeButton;
  }
}
