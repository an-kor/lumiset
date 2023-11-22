import {LitElement, css } from '../lit.js';
export default ({store}) => {
    class LumiApp extends HTMLTemplateElement {
        connectedCallback() {

            const style = document.createElement("style");
            if (!this.parentElement.dataset['lumi']) {
                this.parentElement.dataset['lumi'] = true;
            }

            const loader = document.createElement('lumi-loader')
            this.parentElement.appendChild(loader);
            let unsubscribe = store.subscribe(
                (state, changes) => {
                    this.parentElement.removeChild(loader);
                    this.content.appendChild(style);
                    this.parentElement.appendChild(this.content);
                    unsubscribe();
                },
                'currentRoute'
            );
            store.subscribe(
                (state, changes) => {
                    style.textContent = `
                      [data-lumi] {
                        ${state.themeCss}
                      }
                    `;
                },
                'themeCss'
            );
        }
    }
    customElements.define('lumi-app', LumiApp, { extends: "template" });
    return LumiApp;
}