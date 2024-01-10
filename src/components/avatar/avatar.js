export default (App) => {
    return class LumiAvatar extends App.BaseElement {
        static elementName = 'lumi-avatar';

        static get properties() {
            return {
                src: { type: String },
                size: { type: String, reflect: true },
                border: { type: String, reflect: true },
                background: { type: String, reflect: true },
                shape: { type: String, reflect: true }, // 'circle' or 'square'
                badge: { type: String },
                badgeColor: { type: String },
                badgePosition: { type: String, reflect: true },
                icon: { type: String },
                iconColor: { type: String },
                text: { type: String },
                textColor: { type: String }
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
:host {
    display: inline-flex;
    position: relative;
}
:host > div{
    aspect-ratio: 1 / 1;
    display: inline-flex;
    width: var(--avatar-size, var(--lumi-avatar-size));
    height: var(--avatar-size, auto);
    border-radius: var(--avatar-border-radius, 50%);
    background-color: var(--avatar-background, var(--lumi-foreground));
    border: var(--avatar-border, none);
    position: relative;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}
lumi-badge {
    position: absolute;
}
img {
    padding: 20%;
    width: var(--avatar-size, 100%);
    object-fit: cover;
    border-radius: inherit;
}
lumi-icon{
    top: -1px;
    position: relative;
}
.avatar-text {
    top: -1px;
    position: relative;
    text-transform: uppercase;
    color: var(--avatar-text-color, var(--lumi-foreground));
    font-size: var(--avatar-text-font-size, var(--lumi-unit));
}
`;
        }

        constructor() {
            super();
        }

        connectedCallback() {
            super.connectedCallback();
            this.updateFontSize();
            window.addEventListener('resize', this.updateFontSize.bind(this));
        }

        disconnectedCallback() {
            window.removeEventListener('resize', this.updateFontSize.bind(this));
            super.disconnectedCallback();
        }


        updateFontSize() {
            if (this.text) {
                const hostHeight = this.clientHeight;
                const fontSize = hostHeight * 0.5;
                this.style.setProperty('--avatar-text-font-size', `${fontSize}px`);
            }
        }


        onSizeChanged(value) {
            if (value == parseInt(value, 10)) {
                value += 'px';
            }
            this.style.setProperty('--avatar-size', value);
        }

        onBorderChanged(value) {
            if (value === '') {
                this.style.setProperty('--avatar-border', 'var(--lumi-border)');
            } else {
                this.style.setProperty('--avatar-border', value);
            }
        }
        onOutlineChanged(value) {
            this.style.setProperty('--avatar-outline', value);
        }

        onBackgroundChanged(value) {
            this.style.setProperty('--avatar-background', value);
        }

        onShapeChanged(value) {
            this.style.setProperty('--avatar-border-radius', value === 'circle' ? '50%' : '0');
        }

        onTextChanged(value) {
            if (!this.background) {
                this.style.setProperty('--avatar-background', 'var(--lumi-foreground)');
            }
            this.style.setProperty('--avatar-text-color', `var(--lumi-${App.utils.getBackgroundBrightness(this.shadowRoot.querySelector('div'))?'foreground':'background'})`);
        }
        onTextColorChanged(value) {
            this.style.setProperty('--avatar-text-color', value);
            this.style.setProperty('--avatar-text-filter', 'none');
        }
        onIconChanged(value) {
            if (!this.iconColor) {
                this.style.setProperty('--lumi-icon-color', `var(--lumi-${App.utils.getBackgroundBrightness(this.shadowRoot.querySelector('div')) ? 'foreground' : 'background'})`);
            } else {
                this.style.setProperty('--lumi-icon-color', this.iconColor);
            }
        }

        onChanged(changedProperties) {
            this.updateFontSize();
        }

        getBadgePositionStyles(position) {
            switch (position) {
                case 'top-left':
                    return 'top: 0; left: 0;';
                case 'top-right':
                    return 'top: 0; right: 0;';
                case 'bottom-left':
                    return 'bottom: 0; left: 0;';
                case 'bottom-right':
                    return 'bottom: 0; right: 0;';
                default:
                    return 'bottom: 0; right: 0;';
            }
        }

        renderElement() {
            const html = App.Lit.html;
            return html`
                <div>
                    ${this.icon ? html`<lumi-icon icon="${this.icon}" size="50%"></lumi-icon>`
                            : this.src ? html`<img src="${this.src}" alt="Avatar">`
                                    : this.text ? html`<div class="avatar-text">${this.formatText(this.text)}</div>`
                                            : html`<slot></slot>`}
                </div>
                ${this.badge ? html`<lumi-badge text="${this.badge}" size="small" color="${this.badgeColor??'success'}" style="${this.getBadgePositionStyles(this.badgePosition)}"></lumi-badge>` : ''}
            `;
        }

        formatText(text) {
            return text ? text.substring(0, 2).toUpperCase() : '';
        }
    }
}