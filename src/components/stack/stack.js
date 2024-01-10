export default (App) => {
    return class LumiStack extends App.BaseElement {
        static elementName = 'lumi-stack';

        static get properties() {
            return {
                row: { type: String },
                column: { type: String },
                gap: { type: Number },
                padding: { type: Number },
                align: { type: String },
                justify: { type: String },
                center: { type: String },
                wrap: { type: Boolean },
                debug: { type: Boolean }
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
    :host {
      display: flex;
      flex-direction: var(--lumi-stack-direction, column);
      gap: var(--lumi-stack-gap, var(--lumi-gap));
      padding: var(--lumi-stack-padding, 0);
      align-items: var(--lumi-stack-align-items, stretch);
      justify-content: var(--lumi-stack-justify-content, flex-start);
      flex-wrap: var(--lumi-stack-wrap, nowrap);
      width: 100%;
      box-sizing: border-box;
      background-color: var(--lumi-stack-debug-color, transparent);
    }
`;
        }

        constructor() {
            super();
            this.direction = 'column';
            this.align = 'stretch';
            this.justify = 'flex-start';
            this.wrap = false;
            this.debug = false;
        }


        onRowChanged(newRow) {
            this.style.setProperty('--lumi-stack-direction', 'row');
        }

        onColumnChanged(newColumn) {
            this.style.setProperty('--lumi-stack-direction', 'column');
        }

        onGapChanged(newGap) {
            this.style.setProperty('--lumi-stack-gap', `${newGap * 4}px`);
        }

        onPaddingChanged(newPadding) {
            this.style.setProperty('--lumi-stack-padding', `calc(${newPadding} * var(--lumi-unit-half))`);
        }

        onAlignChanged(newAlign) {
            this.style.setProperty('--lumi-stack-align-items', newAlign);
        }

        onJustifyChanged(newJustify) {
            this.style.setProperty('--lumi-stack-justify-content', newJustify);
        }

        onCenterChanged(newCenter) {
            if (newCenter) {
                this.style.setProperty('--lumi-stack-align-items', 'center');
                this.style.setProperty('--lumi-stack-justify-content', 'center');
            }
        }

        onWrapChanged(newWrap) {
            this.style.setProperty('--lumi-stack-wrap', newWrap ? 'wrap' : 'nowrap');
        }

        onDebugChanged(newDebug) {
            this.style.setProperty('--lumi-stack-debug-color', newDebug ? '#00FF00' : 'transparent');
        }

        renderElement() {
            return App.Lit.html`<slot></slot>`;
        }
    };
};
