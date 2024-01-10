import { LitElement, html, css } from 'lit';

export default (App) => {
    return class LumiModal extends App.BaseElement {
        static get properties() {
            return {
                open: { type: Boolean, reflect: true }
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
        :host([open]) {
          display: block;
        }
        :host {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          overflow: auto;
        }
        .modal-content {
          background: var(--lumi-background, white);
          margin: 10% auto; /* Adjust to position the modal */
          padding: var(--lumi-unit);
          border: var(--lumi-border);
          border-radius: var(--lumi-border-radius);
          width: 80%; /* Adjust to control the modal width */
          box-shadow: var(--lumi-shadow-medium);
        }
        .modal-header,
        .modal-footer {
          padding: var(--lumi-unit);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-body {
          padding: var(--lumi-unit);
        }
        button {
          border: none;
          background: var(--lumi-background-hover-active);
          color: var(--lumi-foreground);
          padding: var(--lumi-unit-quarter);
          border-radius: var(--lumi-border-radius);
          cursor: pointer;
        }
      `;
        }

        renderElement() {
            return App.Lit.html`
        <div class="modal-content">
          <div class="modal-header">
            <slot name="header">Default Header</slot>
            <button @click=${this.closeModal}>&times;</button>
          </div>
          <div class="modal-body">
            <slot>Default Content</slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button @click=${this.closeModal}>Close</button>
            </slot>
          </div>
        </div>
      `;
        }

        closeModal() {
            this.open = false;
            // Dispatch an event notifying that the modal has been closed
            this.dispatchEvent(new CustomEvent('lumi-modal-closed'));
        }
    }
};
