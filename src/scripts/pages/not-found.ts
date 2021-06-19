import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mb-notfound-page')
export class NotFoundPage extends LitElement {
  render(): unknown {
    return html`
      <h1 class="display-1">Something went wrong. Please try again</h1>
      <p>The pathname was ${window.location.pathname}</p>
    `;
  }
}
