import { createStore } from './store/index.js';
import { createRouter } from './router.js';
import componentsList from './components/index.js';
import * as Lit from './lit.js';
const Lumiset = ({
         initialState= {},
         initialSchema= {},
         middlewares = {},
         customComponents = {},
         currentTheme = 'default',
         themes = {}
}) => {
    const store = createStore(initialState, initialSchema, middlewares);
    const router = createRouter('hash', store);

    const components = {};

    for (let [componentName, componentFactory] of Object.entries(componentsList)) {
        components[componentName] = componentFactory({store, router, components});
    }

    const App = {
        getStore: () => store,
        getRouter: () => router,
        Lit,
        themes,
        ...components
    }

    if (customComponents){
        Object.keys(customComponents).forEach(key => {
            const ElementClass = customComponents[key](App);
            let elementName = 'lumi-' + key.replace('create', '').toLowerCase();
            if (ElementClass.elementName) {
                elementName = ElementClass.elementName;
            }
            customElements.define(elementName, ElementClass);
        });
    }


    if (themes){
        store.subscribe(
            (state, changes) => {
                if (App.themes[state.currentTheme]) {
                    state.themeCss = Object.entries(App.themes[state.currentTheme]).map(([key, value]) => `--${key}: ${value};`).join(' ');
                }
            },
            'currentTheme'
        );
        store.getState().currentTheme = currentTheme
    }

    return App;
}
export default Lumiset;

