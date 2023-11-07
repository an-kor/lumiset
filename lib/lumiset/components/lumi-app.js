export default ({store}) => {
    class LumiApp extends HTMLTemplateElement {
        connectedCallback() {
            //this.parentElement.appendChild(this.content);
            //add loader to parent element
            const loader = document.createElement('div')
            loader.classList.add('loader');
            this.parentElement.appendChild(loader);
            let unsubscribe = store.subscribe(
                (state, changes) => {
                    this.parentElement.removeChild(loader);
                    this.parentElement.appendChild(this.content);
                    unsubscribe();
                },
                'currentRoute'
            );
        }
    }
    customElements.define('lumi-app', LumiApp, { extends: "template" });
    return LumiApp;
}