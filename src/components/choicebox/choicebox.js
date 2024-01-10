export default (App) => {
    return class LumiChoicebox extends App.BaseElement {
        static elementName = 'lumi-choicebox';

        static get properties() {
            return {
                direction: { type: String },
                label: { type: String },
                value: { type: String },
                multiple: { type: Boolean }
            };
        }

        constructor() {
            super();
            this.direction = 'row';
            this.multiple = false;
            this.value = [];

            this.unsubscribe = App.getStore().subscribe(
                (state) => {
                    const newValue = this.getDataItem('value') || [];
                    if (JSON.stringify(this.value) !== JSON.stringify(newValue)) {
                        this.value = [...newValue];
                        this._updateCheckedItems();
                    }
                },
                [`componentsData.${this.id}.value`]
            );
        }

        _updateCheckedItems() {
            super._handleSlotChange(node => {
                if (node.nodeName === 'LUMI-CHOICEBOX-ITEM') {
                    node.checked = this.value.includes(node.value);
                }
            });
        }

        _onValueChanged(newValue, oldValue) {
            if (this.multiple && typeof newValue === 'string') {
                this.value = this.value.split(',').map(v => v.trim());
            } else {
                const valueArray = Array.isArray(newValue) ? newValue : [newValue];
                this.value = valueArray;
                this.setDataItem(`value`, valueArray);
            }
            this._updateCheckedItems();
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.store.removeItem(`componentsTree.${this.id}`);
        }

        _handleSlotChange() {
            super._handleSlotChange(node => {
                if (node.nodeName === 'LUMI-CHOICEBOX-ITEM') {
                    node.name = this.id;
                    node.type = this.multiple?'checkbox':'radio';
                }
            });
        }

        renderElement() {
            const html = App.Lit.html;
            return html`
            ${this.label ? html`<lumi-text small mb="0.5">${this.label}</lumi-text>`:null}
            <lumi-stack row>
                <slot @slotchange="${this._handleSlotChange}"></slot>
            </lumi-stack>
`;
        }
    };
};
