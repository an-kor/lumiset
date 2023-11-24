export default (App) => {
    return class extends App.BaseElement {
        static styles = App.Lit.css`
            span {
              color: var(--mainColor);
            }
        `;

        static elementName = 'lumi-text';
        renderElement() {
            return App.Lit.html`<span>Test: ${this.value}</span>`;
        }
    }
};