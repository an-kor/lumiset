import { createStore as createAppStore } from './store/index.js';
import { createRouter as createAppRouter } from './router.js';
import components from './components/index.js';
import * as Lit from './lit.js';
import Utils from './utils.js';

const prepareThemeCss = (utils, theme) => {
    return theme.globals + " " +
        Object.entries(theme.variables).map(
            ([key, value]) => {
                let variableValue = value;
                if (typeof(value) === "object") {
                    const breakpointValue = utils.getBreakpointByValue(value, theme);
                    if (breakpointValue) {
                        variableValue = breakpointValue;
                    }
                }
                return `--${key}: ${variableValue};`
            }
        ).join(' ');
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
         controllers = {},
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
        appStore.getState().themeCss = prepareThemeCss(App.utils, mergeThemes(App.themes.default,themes[currentTheme]));
        appStore.getState().currentTheme = currentTheme;
    }

    if (themes) {
        appStore.subscribe(
            (state, changes) => {
                if (App.themes[state.currentTheme]) {
                    state.themeCss = prepareThemeCss(App.utils, mergeThemes(App.themes.default, App.themes[state.currentTheme]));
                } else {
                    console.error('Theme ID not found');
                }
            },
            'currentTheme'
        );

        const resizeListener = () => {
            appStore.getState().themeCss = prepareThemeCss(App.utils, mergeThemes(App.themes.default, App.themes[state.currentTheme]));
        };
        window.addEventListener('resize', resizeListener);

    }

    const appComponents = {};

    for (const [componentName, componentFactory] of Object.entries(components)) {
        appComponents[componentName] = componentFactory({ store: appStore, router: appRouter, components: appComponents });
    }
    Object.assign(App, appComponents);

    let appControllers = {};

    for (const [controllerName, controllerFactory] of Object.entries(controllers)) {
        let controller = controllerFactory(App);
        let renamedController = {};

        for (const [actionName, actionFunction] of Object.entries(controller)) {
            if (!actionName.startsWith(controllerName + '.')) {
                renamedController[controllerName + '.' + actionName] = actionFunction;
            } else {
                renamedController[actionName] = actionFunction;
            }
        }
        appControllers = {...appControllers, ...renamedController};
    }
    App.actions = appControllers;

    App.callAction = (caller, actionName, ...params) => {
        if (App.actions[actionName]) {
            App.actions[actionName].call(caller, ...params)
        } else {
            console.error('Action name not found');
        }
    }



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
