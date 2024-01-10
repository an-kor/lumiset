export default (App) => {
    return class extends App.BaseElement {
        static styles = App.Lit.css`
:host{
    display:block;
    width: '100%';
    border-top: var(--lumi-border);
    margin: var(--lumi-card-padding) 0;
}
`;

        static elementName = 'lumi-divider';
        renderElement() {
            return App.Lit.html``;
        }
    }
};