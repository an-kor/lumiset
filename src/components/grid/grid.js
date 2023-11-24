export default (App) => {
    return class extends App.BaseElement {
        static elementName = 'lumi-grid';
        static styles = App.Lit.css`
      .grid-container {
        display: flex;
        --grid-gap-unit: calc(0.5 * var(--gap, 0));
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
        direction: row;
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

        constructor() {
            super();
        }

        static get properties() {
            return {
                gap: {type: Number},
                wrap: {type: String},
                justify: {type: String},
                alignItems: {type: String},
                alignContent: {type: String},
                direction: {type: String},
            };
        }

        updated(changedProperties) {
            changedProperties.forEach((_, propName) => {
                switch (propName) {
                    case 'gap':
                        this.style.setProperty('--grid-gap', `${this.gap}px`);
                        break;
                    case 'wrap':
                        this.style.setProperty('--grid-wrap', this.wrap);
                        break;
                    case 'justify':
                        this.style.setProperty('--grid-justify', this.justify);
                        break;
                    case 'alignItems':
                        this.style.setProperty('--grid-align-items', this.alignItems);
                        break;
                    case 'alignContent':
                        this.style.setProperty('--grid-align-content', this.alignContent);
                        break;
                    case 'direction':
                        this.style.setProperty('--grid-direction', this.direction);
                        break;
                }
            });
        }
        renderElement() {
            return App.Lit.html`
              <div class="grid-container">
                <slot></slot>
              </div>
            `;
        }
    }
};