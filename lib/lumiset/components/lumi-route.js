import {LitElement, html } from '../lit.js';
export default ({store, router, components}) => {
    class RouteComponent extends components.BaseElement {
        static get properties() {
            return {
                path: { type: String },
                route: { type: String },
                isVisible: { type: Boolean, state: true }
            };
        }

        constructor() {
            super();
            this.isVisible = false;
            this.routeMatchCache = new Map();
            let dynamicPath = this.attributes.getNamedItem(':path');
            if (dynamicPath) {
                this.path = store.getItem(dynamicPath.value);
            }
            this.unsubscribe = this.store.subscribe(
                (state, changes) => {
                    this.route = state.currentRoute;
                    this.requestUpdate();
                },
                'currentRoute'
            );
        }

        shouldUpdate(changedProperties) {
            // Generate a cache key
            let matchResult = false;

            // Prepare a list of paths to check
            const pathsToCheck = Array.isArray(this.path) ? this.path : [this.path];

            for (const path of pathsToCheck) {
                const cacheKey = `${this.route}:${path}`;
                let cachedResult = this.routeMatchCache.get(cacheKey);

                if (cachedResult === undefined) {
                    matchResult = router.matchRoute(this.route, path);
                    this.routeMatchCache.set(cacheKey, matchResult);
                } else {
                    matchResult = cachedResult;
                }

                // If a match is found, break out of the loop
                if (matchResult) break;
            }

            const visibilityChanged = this.isVisible !== matchResult;
            this.isVisible = matchResult;
            return visibilityChanged;
        }

        // Invalidate the cache when the path property changes
        updated(changedProperties) {
            if (changedProperties.has('path')) {
                this.routeMatchCache.clear();
            }
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.unsubscribe) {
                this.unsubscribe();
            }
        }

        renderElement() {
            return this.isVisible ? html`<slot></slot>` : html``;
        }
    }
    customElements.define('lumi-route', RouteComponent);
    return RouteComponent;
}