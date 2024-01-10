export default (App) => {
    return class LumiCheckbox extends App.BaseElement {
        static elementName = 'lumi-checkbox';

        static get properties() {
            return {
                checked: { type: Boolean, reflect: true },
                label: { type: String },
                indeterminate: { type: Boolean, reflect: true }
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
                :host {
                    display: block;
                    cursor: pointer;
                    line-height: var(--lumi-unit);
                }
                .checkbox-container {
                    display: flex;
                    align-items: center;
                }
                .checkbox {
                    position: relative;
                    width: var(--lumi-unit);
                    height: var(--lumi-unit);
                    border: var(--lumi-border);
                    border-radius: var(--lumi-border-radius);
                    background-color: var(--lumi-background);
                    margin-right: var(--lumi-unit-quarter);
                }
                .checkbox:checked {
                    background-color: var(--lumi-success);
                }
                .checkbox:indeterminate {
                    background-color: var(--lumi-warning);
                }
                .label {
                    display: inline-block;
                }
                .checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: var(--lumi-unit);
                    width: var(--lumi-unit);
                    background-size: contain;
                }
                /* ... more styles for the checkmark and indeterminate state ... */
            `;
        }

        constructor() {
            super();
            this.checked = false;
            this.indeterminate = false;
        }

        renderElement() {
            const html = App.Lit.html;
            return html`
                <label class="checkbox-container">
                    <input type="checkbox"
                           class="checkbox"
                           .checked=${this.checked}
                           .indeterminate=${this.indeterminate}
                           @change=${this.toggleCheckbox} />
                    ${this.label ? html`<span class="label">${this.label}</span>` : ''}
                    <span class="checkmark"></span>
                </label>
            `;
        }

        toggleCheckbox() {
            this.checked = !this.checked;
            this.indeterminate = false; // Clear indeterminate state when checkbox is toggled
            // Dispatch an event if needed
        }
    }
}
