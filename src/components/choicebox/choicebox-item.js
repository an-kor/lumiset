export default (App) => {
    return class LumiChoiceboxItem extends App.BaseElement {
        static elementName = 'lumi-choicebox-item';

        static get properties() {
            return {
                title: { type: String },
                name: { type: String },
                description: { type: String },
                checked: { type: Boolean, reflect: true},
                value: { type: String },
                disabled: { type: Boolean},
                type: { type: String }
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`

        label{
            cursor: pointer;
            display: block;
            padding: var(--lumi-card-padding);
            background: var(--lumi-background);
            color: var(--lumi-foreground);
            border: var(--lumi-border);
            border-radius: var(--lumi-border-radius);
            transition: var(--lumi-background-transition);
        }

        label:hover {
            background-color: var(--lumi-background-hover);
        }
        
        label:focus-visible  {
            outline: var(--lumi-outline);
            outline-offset: 2px;
        }

        label:active {
            outline: none;
            border-color: var(--lumi-border-active-color);
        }

        input:focus{
            outline: none;
        }


        :host([checked]) label{
            background-color: var(--lumi-background-hover-active);
            border-color: var(--lumi-focus-color);
        }

        :host([disabled]) {
            opacity: 0.5;
            cursor: not-allowed;
        }

        :host([disabled]) label {
            user-select: none;
            pointer-events: none;
        }

        :host([checked]) {
          background: var(--lumi-accents-1);
        }

        input {
            cursor: pointer;
            pointer-events: none;
        }
      `;
        }

        constructor() {
            super();
            this.title = '';
            this.type = 'radio';
            this.description = '';
            this.checked = false;
            this.value = '';
            this.disabled = false;
        }

        _onChange(e) {
            let valueArray;
            if (this.type === 'checkbox') {
                valueArray = this.store.getItem(`componentsData.${this.name}.value`) || [];
                if (e.target.checked && !valueArray.includes(e.target.value)) {
                    valueArray.push(e.target.value);
                } else if (!e.target.checked) {
                    valueArray = valueArray.filter((item) => item !== this.value);
                }
            } else {
                valueArray = e.target.checked?[e.target.value]:[];
            }
            this.checked = e.target.checked;
            this.store.setItem(`componentsData.${this.name}.value`, valueArray);
        }

        _onKeyPress(e) {
            if ((e.key === 'Enter' || e.key === ' ') && !this.disabled) {
                e.preventDefault();
                if (this.type==='radio'){
                    if (!this.checked) this.checked = !this.checked;
                } else {
                    this.checked = !this.checked;
                }
                this._onChange({ target: { checked: this.checked, value: this.value } });
            }
        }

        renderElement() {
            return App.Lit.html`
          <label for="${this.id}" tabindex="${this.disabled?-1:0}" @keypress="${this._onKeyPress}">
              <lumi-stack row>
                  <div>
                    <div class="choicebox-title"><slot name="title">${this.title}</slot></div>
                    <lumi-text small type="secondary">${this.description}</lumi-text>
                  </div>
                  <input
                    id="${this.id}"
                    class="choicebox-input"
                    type="${this.type}"
                    .checked="${this.checked}"
                    .value="${this.value}"
                    ?disabled="${this.disabled}"
                    @change="${this._onChange}"
                    tabindex="-1"
                  />
              </lumi-stack>
          </label>
      `;
        }
    };
};
