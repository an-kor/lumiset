export default (App) => {
    return class extends App.BaseElement {
        static styles = App.Lit.css``;

        static elementName = 'lumi-base';
        renderElement() {
            return App.Lit.html``;
        }
    }
};