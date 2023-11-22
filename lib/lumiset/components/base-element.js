import {LitElement } from '../lit.js';
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

        // Update properties from the store based on attributes starting with ':'
        updateFromStore() {
            let updateRequired = false;

            for (const attr of this.attributes) {
                // Check if the attribute name starts with ':'
                if (attr.name.startsWith(':')) {
                    const propName = attr.name.slice(1);
                    const path = attr.value;

                    // Check if the value is meant to be negated
                    const isNegated = path.startsWith('!');
                    const storeValue = store.getItem(isNegated ? path.slice(1) : path);

                    // Apply negation if needed
                    this[propName] = isNegated ? !storeValue : storeValue;
                    updateRequired = true;
                }
            }
            if (updateRequired) {
                this.requestUpdate();
            }
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