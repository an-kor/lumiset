export default (App) => {
    return class extends App.BaseElement {
        static elementName = 'lumi-footer';
        static get properties() {
            return {
                type: { type: String }
            };
        }

        static get styles() {
            return App.Lit.css`
footer {
    border-top: var(--lumi-border);
    padding: var(--lumi-card-padding);
}
`;
        }

        constructor() {
            super();
            this.type = 'default';
        }
        renderElement() {
            return App.Lit.html`
              <footer>
                <slot></slot>
              </footer>
            `;
        }

    }
};