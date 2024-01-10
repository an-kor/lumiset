export default (App) => {
    return class LumiBreadcrumbs extends App.BaseElement {
        static elementName = 'lumi-breadcrumbs';

        static get properties() {
            return {
                type: { type: String } // 'text' or 'menu'
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
                :host {
                    display: flex;
                    align-items: center;
                    font-family: var(--sans);
                    color: var(--lumi-foreground);
                }
                
                ::slotted(.menu-item) {
                    border: 1px solid var(--lumi-accents-2);
                    padding: 0 var(--lumi-unit-half);
                    border-radius: var(--lumi-border-radius);
                    margin-right: var(--lumi-unit-quarter);
                    display: inline-block; /* or flex, based on your design */
                }
                ::slotted(.menu-item[active]) {
                    border-color: var(--lumi-accents-3);
                }
                .separator {
                    color: var(--lumi-accents-3);
                    margin: 0 var(--lumi-unit-quarter);
                    display: flex;
                    align-items: center;
                }
            `;
        }

        constructor() {
            super();
            this.type = 'text'; // Default type
        }

        renderElement() {

            Array.from(this.children).forEach(child => {
                if (this.type === 'menu') {
                    child.classList.add('menu-item');
                } else {
                    child.classList.remove('menu-item');
                }
            });

            return this.type === 'menu' ? App.Lit.html`
                <div>
                    <slot></slot>
                </div>
            ` : App.Lit.html`
                ${Array.from(this.children).map((child, index) => App.Lit.html`
                    ${child}
                    ${index < this.children.length - 1 ? App.Lit.html`<span class="separator"><lumi-icon size="1em" icon="chevron-right"></lumi-icon></span>` : ''}
                `)}
            `;
        }
    }
};
