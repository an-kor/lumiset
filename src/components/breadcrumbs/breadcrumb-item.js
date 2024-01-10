export default (App) => {
    return class LumiBreadcrumbItem extends App.BaseElement {
        static elementName = 'lumi-breadcrumb-item';

        static get properties() {
            return {
                href: { type: String },
                active: { type: Boolean },
                disabled: { type: Boolean }
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
                :host {
                    margin-right: var(--lumi-unit-half);
                    cursor: pointer;
                    font-size: var(--lumi-unit);
                }
                :host([active]) {
                    font-weight: 500;
                }
                :host([disabled]) {
                    color: var(--lumi-accents-3);
                    user-select: none; 
                }
                a {
                    text-decoration: none;
                    color: inherit;
                }
                a:hover {
                    text-decoration: underline;
                }
                span {
                    cursor: default;
                }
            `;
        }

        renderElement() {
            return this.href && !this.disabled ? App.Lit.html`
                <a href="${this.href}" class="${this.active ? 'active' : ''}">
                    <slot></slot>
                </a>
            ` : App.Lit.html`
                <span class="${this.active ? 'active' : ''} ${this.disabled ? 'disabled' : ''}">
                    <slot></slot>
                </span>
            `;
        }
    }
};