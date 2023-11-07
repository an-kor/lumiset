import {LitElement, html } from '../lit.js';
export default ({store}) => {
    return class BaseElement extends LitElement {
        constructor() {
            super();
            this.store = store;
            this.state = store.getState();
            this.unsubscribe = null;
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

        // Subscribe to store paths based on the attributes starting with ':'
        setupStoreSubscriptions() {
            const watchedPaths = [];
            for (const attr of this.attributes) {
                if (attr.name.startsWith(':')) {
                    const path = attr.value;
                    watchedPaths.push(path);
                }
            }
            this.unsubscribe = store.subscribe(
                (state, changes) => this.updateFromStore(state, changes),
                watchedPaths
            );
        }

        // Update properties from the store based on attributes starting with ':'
        updateFromStore() {
            let updateRequired = false;
            for (const attr of this.attributes) {
                if (attr.name.startsWith(':')) {
                    const propName = attr.name.slice(1);
                    const path = attr.value;
                    this[propName] = store.getPathValue(path);
                    updateRequired = true;
                }
            }
            if (updateRequired) {
                this.requestUpdate();
            }
        }
        render(fn) {
            try {
                if (typeof this.renderElement === 'function') {
                    return this.renderElement();
                }
                return html('')
            } catch (err) {
                console.error(err);
            }
        }
    }
}