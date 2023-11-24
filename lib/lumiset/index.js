import { createStore as createAppStore } from './store/index.js';
import { createRouter as createAppRouter } from './router.js';
import components from './components/index.js';
import * as Lit from './lit.js';
import Utils from './utils.js';

const prepareThemeCss = (theme) => {
    return theme.globals + " " + Object.entries(theme.variables).map(([key, value]) => `--${key}: ${value};`).join(' ');
};

const mergeThemes = (defaultTheme, newTheme) => {
    return {
        globals: newTheme.globals ?? defaultTheme.globals,
        variables: {
            ...defaultTheme.variables,
            ...(newTheme.variables || {})
        }
    };
}
const Lumiset = ({
         initialState = {},
         initialSchema = {},
         middlewares = {},
         customComponents = {},
         currentTheme = 'default',
         themes = {}
     }) => {
    const appStore = createAppStore(initialState, initialSchema, middlewares);
    const appRouter = createAppRouter('hash', appStore);

    const App = {
        getStore: () => appStore,
        getRouter: () => appRouter,
        Lit,
        themes
    };
    App.utils = Utils(App);

    if (themes[currentTheme]) {
        appStore.getState().themeCss = prepareThemeCss(mergeThemes(App.themes.default,themes[currentTheme]));
        appStore.getState().currentTheme = currentTheme;
    }

    if (themes) {
        appStore.subscribe(
            (state, changes) => {
                if (App.themes[state.currentTheme]) {
                    state.themeCss = prepareThemeCss(mergeThemes(App.themes.default,App.themes[state.currentTheme]));
                } else {
                    console.error('Theme ID not found');
                }
            },
            'currentTheme'
        );
    }

    const appComponents = {};

    for (const [componentName, componentFactory] of Object.entries(components)) {
        appComponents[componentName] = componentFactory({ store: appStore, router: appRouter, components: appComponents });
    }
    Object.assign(App, appComponents);

    if (customComponents) {
        Object.keys(customComponents).forEach(key => {
            const ElementClass = customComponents[key](App);
            let elementName = 'lumi-' + key.replace('create', '').toLowerCase();
            if (ElementClass.elementName) {
                elementName = ElementClass.elementName;
            }
            customElements.define(elementName, ElementClass);
        });
    }

    return App;
};

export default Lumiset;
