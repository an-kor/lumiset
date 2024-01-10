export default (App) => {
    return class LumiButton extends App.BaseElement {
        static elementName = 'lumi-button';

        static get properties() {
            return {
                size: { type: String }, // 'small', 'medium', 'large'
                type: { type: String }, // 'primary', 'secondary', 'success', 'warning', 'error'
                shape: { type: String }, // 'normal', 'rounded'
                icon: { type: String },
                suffix: { type: String }, // suffix icon
                prefix: { type: String }, // prefix icon
                loading: { type: Boolean },
                disabled: { type: Boolean },
                background: { type: String },
                fixedWidth: { type: Number },
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
:host {
    --button-bg-color: var(--lumi-foreground);
    --button-text-color: var(--lumi-text-color-contrast);
    --button-font-size: 1em;
    --button-padding: var(--lumi-unit-half);
    --button-border-radius: var(--lumi-border-radius);
    --button-icon-size: 1em;
    --button-fixed-width: auto;
}

button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--lumi-unit-half);
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
    outline: none;
    border: none;
    box-shadow: var(--lumi-shadow-small);
    border-radius: var(--button-border-radius);
    padding: var(--button-padding);
    font-size: var(--button-font-size);
    --lumi-icon-size: var(--button-font-size);
    width: var(--button-fixed-width);
}

button:hover {
    opacity: 0.8;
}
button:focus-visible  {
    outline: var(--lumi-outline);
    outline-offset: 2px;
}
button:active {
    outline: none;
    opacity: 0.9;
}

:host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
}

button:disabled {
    user-select: none;
    pointer-events: none;
}

:host([size="small"]) button {
    --button-font-size: 0.8em;
    --button-icon-size: 1em;
    --button-padding: 0.4em 0.75em;
}

:host([size="medium"]) button {
    --button-font-size: 1em;
    --button-icon-size: 1em;
}

:host([size="large"]) button {
    --button-font-size: 1.2em;
    --button-icon-size: 1.2em;
    --button-padding: 0.6em 1.25em;
}

:host([type="primary"]) button {
    --button-bg-color: var(--lumi-success);
}

:host([type="secondary"]) button {
  --button-bg-color: var(--lumi-background);
  --button-text-color: var(--lumi-text-color);
  box-shadow: var(--lumi-shadow-border);
}

:host([type="secondary"]) button:active {
    box-shadow: var(--lumi-shadow-border-active);
}

:host([type="tertiary"]) button {
  background-color: var(--lumi-background);
  color: var(--lumi-text-color);
}

:host([type="warning"]) button {
  background-color: var(--lumi-warning);
}

:host([type="error"]) button {
  background-color: var(--lumi-error);
}

:host([shape="rounded"]) button {
    --button-border-radius: 25px;
}

:host([size="small"][icon]) button,
:host([size="medium"][icon]) button,
:host([size="large"][icon]) button {
    --button-padding: calc(var(--button-font-size) / 2);
}

:host([size="small"][icon]) button {
    --lumi-icon-size: calc(var(--button-font-size) * 1.2);
}

button .button-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:host([icon]) .button-content {
  display:none;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 0.8em;
  height: 0.8em;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
        }

        constructor() {
            super();
            this.size = 'medium';
            this.type = 'primary';
            this.shape = 'normal';
            this.loading = false;
            this.disabled = false;
        }

        renderIcon(icon, position = '') {
            return icon ? App.Lit.html`<span class="icon ${position}"><lumi-icon icon=${icon}></lumi-icon></span>` : '';
        }

        renderLoadingSpinner() {
            return this.loading ? App.Lit.html`<span class="spinner"></span>` : '';
        }

        onBackgroundChanged(value) {
            this.style.setProperty('--button-bg-color', value);
            this.style.setProperty('--button-text-color', `var(--lumi-text-color${App.utils.getBackgroundBrightness(this.shadowRoot.querySelector('button'))?'':'-contrast'})`);
        }

        onFixedWidthChanged(value) {
            this.style.setProperty('--button-fixed-width', `${value}px`);
        }

        renderElement() {
            return App.Lit.html`
                <button class="lumi-button" ?disabled="${this.disabled}">
                    ${this.prefix ? this.renderIcon(this.prefix, 'prefix') : ''}
                    ${this.icon ? this.renderIcon(this.icon) : ''}
                    <span class="button-content"><slot></slot></span>
                    ${this.renderLoadingSpinner()}
                    ${this.suffix ? this.renderIcon(this.suffix, 'suffix') : ''}
                </button>
            `;
        }
    }
};
