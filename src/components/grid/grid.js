export default (App) => {
    return class extends App.BaseElement {
        static elementName = 'lumi-grid';

        static get styles() {
            return App.BaseElement.extendStyles`
    :host {
        display: flex;
        --grid-gap-unit: calc(0.5 * var(--lumi-gap, 0));
        --grid-container-margin: calc(-1 * var(--grid-gap-unit));
        --grid-container-width: 100%;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: stretch;
        align-content: flex-start;
        flex-direction: row;
        box-sizing: border-box;
        width: var(--grid-container-width);
        margin: 0;
    }
    
    ::slotted(*) {
        display: flex;
        padding: var(--grid-gap-unit);
        flex-grow: 1;
        box-sizing: border-box;
    }
`;
        }

        constructor() {
            super();
        }

        static get properties() {
            return {
                gap: { type: Number },
                wrap: { type: String },
                justify: { type: String },
                alignItems: { type: String },
                alignContent: { type: String },
                direction: { type: String },
            };
        }

        onGapChanged(newGap) {
            this.style.setProperty('--grid-gap', `${newGap}px`);
        }

        onWrapChanged(newWrap) {
            this.style.setProperty('--grid-wrap', newWrap);
        }

        onJustifyChanged(newJustify) {
            this.style.setProperty('--grid-justify', newJustify);
        }

        onAlignItemsChanged(newAlignItems) {
            this.style.setProperty('--grid-align-items', newAlignItems);
        }

        onAlignContentChanged(newAlignContent) {
            this.style.setProperty('--grid-align-content', newAlignContent);
        }

        onDirectionChanged(newDirection) {
            this.style.setProperty('--grid-direction', newDirection);
        }

        renderElement() {
            return App.Lit.html`
                    <slot></slot>
            `;
        }
    }
};
