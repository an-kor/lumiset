export default (App) => {
    return class LumiCapacity extends App.BaseElement {
        static elementName = 'lumi-capacity';

        static get properties() {
            return {
                value: { type: Number },
                limit: { type: Number },
                color: { type: String } // Optional
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
                :host {
                    display: block;
                    width: 100%;
                    margin: var(--lumi-unit);
                    border-radius: var(--lumi-border-radius);
                    overflow:hidden;
                }
                .capacity-bar {
                    height: var(--lumi-unit);
                    background-color: var(--lumi-accents-2);
                    position: relative;
                }
                .capacity-fill {
                    height: 100%;
                    background-color: var(--lumi-success);
                    width: 0;
                }
            `;
        }

        renderElement() {
            const html = App.Lit.html;
            const fillWidth = (this.value / this.limit) * 100;
            const fillColor = this.color || 'var(--lumi-success)';

            return html`
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${fillWidth}%; background-color: ${fillColor};"></div>
                </div>
            `;
        }
    }
}
