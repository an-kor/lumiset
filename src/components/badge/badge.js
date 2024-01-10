// File: src/components/badge/badge.js
export default (App) => {
    return class LumiBadge extends App.BaseElement {
        static elementName = 'lumi-badge';

        static get properties() {
            return {
                text: { type: String },
                icon: { type: String },
                size: { type: String }, // 'small', 'medium', 'large'
                color: { type: String } // 'default', 'primary', 'success', etc.
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
                :host {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--lumi-badge-border-radius, 50px);
                    padding: var(--lumi-badge-padding, 0.5em 1em);
                    font-size: var(--lumi-badge-font-size, var(--lumi-font-size));
                    background-color: var(--lumi-badge-background);
                    color: var(--lumi-badge-color);
                    box-sizing: border-box;
                    user-select: none; 
                }

                :host([size="small"]) {
                    padding: var(--lumi-badge-padding, 0.25em 0.75em);
                    font-size: var(--lumi-badge-font-size-small, 0.75em);
                }

                :host([size="large"]) {
                    font-size: var(--lumi-badge-font-size-large, 1.25em);
                }

                lumi-icon {
                    margin-right: var(--lumi-badge-icon-spacing, 0.25em);
                }
            `;
        }

        onColorChanged(value) {
            let bgColor = 'var(--lumi-foreground)';
            console.log('onColorChanged');

            switch (value) {
                default:
                    bgColor = 'var(--lumi-'+value+'-dark)';
                    break;
            }

            this.style.setProperty('--lumi-badge-background', bgColor);
            this.style.setProperty('--lumi-badge-color', `var(--lumi-${App.utils.getBackgroundBrightness(this, 2)?'foreground':'background'})`);
        }



        renderElement() {
            const html = App.Lit.html;
            return html`
                ${this.icon ? html`<lumi-icon icon="${this.icon}" size="1em"></lumi-icon>` : ''}
                <span>${this.text}</span>
            `;
        }
    }
}
