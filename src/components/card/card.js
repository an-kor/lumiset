export default (App) => {
    return class extends App.BaseElement {

        static elementName = 'lumi-card';
        static get properties() {
            return {
                hoverable: { type: Boolean, reflect: true },
                type: { type: String }
            };
        }
        static get styles() {
            return App.BaseElement.extendStyles`
:host{
    background: var(--lumi-background, white);
    border-radius: var(--lumi-border-radius, 5px);
    box-sizing: border-box;
    box-shadow: var(--lumi-shadow-border);
    color: var(--lumi-foreground);
    width: var(--lumi-card-width, auto);
    height: var(--lumi-card-height, auto);
    padding: 0;
    margin: var(--lumi-card-margin, 0);
    display: block;
}

:host([hoverable]):hover {
    box-shadow: var(--lumi-shadow-border-medium);
}

::slotted(:not(lumi-card-footer)){
    padding: 0 var(--lumi-card-padding);
}

::slotted(:not(lumi-card-footer):first-child) {
    padding-top: var(--lumi-card-padding);
}
::slotted(:not(lumi-card-footer):last-child) {
    padding-bottom: var(--lumi-card-padding);
}


::slotted(lumi-card-footer) {
    margin-top: var(--lumi-card-padding);
    padding: 0;
    display: block;
}
`;
        }

        constructor() {
            super();
            this.hoverable = false;
            this.type = 'default';
        }

        renderElement() {
            return App.Lit.html`
        <slot></slot>
    `;
        }

    }
};