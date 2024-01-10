import {LitElement, css, unsafeCSS } from '../lit.js';
const generateRandomId = () => {
    const randomString = Date.now() + "-" + Math.random().toString(36).substring(2, 5);
    return `lumi-${randomString}`;
}
export default ({store}) => {
    return class BaseElement extends LitElement {

        static get properties() {
            return {
                margin: { type: Number },
                mb: { type: Number, reflect:true },
                mt: { type: Number },
                mr: { type: Number },
                ml: { type: Number },
                padding: { type: Number },
                pb: { type: Number },
                pt: { type: Number },
                pr: { type: Number },
                pl: { type: Number }
            };
        }
        static styles = css`
    :host {display:block;}
    :host([margin]) { margin: calc(var(--lumi-unit) * var(--margin, 1)); }
    :host([mb]) { margin-bottom: calc(var(--lumi-unit) * var(--mb, 1)); }
    :host([mt]) { margin-top: calc(var(--lumi-unit) * var(--mt, 1)); }
    :host([mr]) { margin-right: calc(var(--lumi-unit) * var(--mr, 1)); }
    :host([ml]) { margin-left: calc(var(--lumi-unit) * var(--ml, 1)); }
    :host([padding]) { padding: calc(var(--lumi-unit) * var(--padding, 1)); }
    :host([pb]) { padding-bottom: calc(var(--lumi-unit) * var(--pb, 1)); }
    :host([pt]) { padding-top: calc(var(--lumi-unit) * var(--pt, 1)); }
    :host([pr]) { padding-right: calc(var(--lumi-unit) * var(--pr, 1)); }
    :host([pl]) { padding-left: calc(var(--lumi-unit) * var(--pl, 1)); }
`

        constructor() {
            super();
            this.store = store;
            this.state = store.getState();
            this.unsubscribe = null;
            if (!this.id) {
                this.id = generateRandomId()
            }
            this.setupStoreSubscriptions();
        }

        connectedCallback() {
            super.connectedCallback();
            this.updateFromStore();
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.unsubscribe) {
                this.unsubscribe();
            }
        }

        setupStoreSubscriptions() {
            const watchedPaths = [];
            for (const attr of this.attributes) {
                if (attr.name.startsWith(':')) {
                    let path = attr.value;
                    if (path.startsWith('!')) {
                        path = path.slice(1);
                    }
                    if (!watchedPaths.includes(path)) {
                        watchedPaths.push(path);
                    }
                }
            }
            this.unsubscribe = store.subscribe(
                (state, changes) => this.updateFromStore(state, changes),
                watchedPaths
            );
        }

        updateFromStore() {
            let updateRequired = false;

            for (const attr of this.attributes) {
                if (attr.name.startsWith(':')) {
                    const propName = attr.name.slice(1);
                    const path = attr.value;

                    const isNegated = path.startsWith('!');
                    const storeValue = store.getItem(isNegated ? path.slice(1) : path);

                    this[propName] = isNegated ? !storeValue : storeValue;
                    updateRequired = true;
                }
            }
            if (updateRequired) {
                this.requestUpdate();
            }
        }
        getDataItem(key){
            return this.store.getItem(`componentsData.${this.id}.${key}`);
        }
        setDataItem(key, value){
            return this.store.setItem(`componentsData.${this.id}.${key}`, value);
        }


        updated(changedProperties) {
            changedProperties.forEach((oldValue, propName) => {
                //if (this[propName] !== oldValue) {
                    const handlerName = `on${propName.charAt(0).toUpperCase()}${propName.slice(1)}Changed`;
                    if (typeof this[handlerName] === 'function') {
                        this[handlerName](this[propName], oldValue);
                    }

                    if (['margin', 'mb', 'mt', 'mr', 'ml', 'padding', 'pb', 'pt', 'pr', 'pl'].includes(propName)) {
                        this.style.setProperty(`--${propName}`, this[propName]);
                    }
                //}
            });
            if (typeof this.onChanged === 'function') {
                this.onChanged(changedProperties) ;
            }
        }
        _handleSlotChange(nodeHandler) {
            const slot = this.shadowRoot.querySelector('slot');
            const nodes = slot.assignedNodes({flatten: true});
            nodes.forEach(node => {
                if (typeof nodeHandler === 'function') {
                    nodeHandler(node);
                }
            });
        }

        static extendStyles(extendedStyles) {
            const extendedStylesCSS = css`${unsafeCSS(extendedStyles)}`;
            return css`${this.styles} ${extendedStylesCSS}`;
        }

        render() {
            if (this.hidden) {
                return null;
            }
            try {
                if (typeof this.renderElement === 'function') {
                    return this.renderElement();
                }
                return null;
            } catch (err) {
                console.error(`Error rendering ${this.constructor.elementName}:`, err);
            }
        }
    }
}