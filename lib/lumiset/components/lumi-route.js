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
            this.routeMatchCache = new Map(); // Cache to store route matching results
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
            const cacheKey = `${this.route}:${this.path}`;
            // Check if the result is already cached
            let matchResult = this.routeMatchCache.get(cacheKey);

            if (matchResult === undefined) {
                // If not cached, perform the match and cache the result
                matchResult = router.matchRoute(this.route, this.path);
                this.routeMatchCache.set(cacheKey, matchResult);
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