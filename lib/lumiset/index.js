import { createStore } from './store/index.js';
import { createRouter } from './router.js';
import componentsList from './components/index.js';
import * as Lit from './lit.js';
const Lumiset = ({initialState= {}, initialSchema= {}, middlewares = {}}) => {
    const store = createStore(initialState, initialSchema, middlewares);
    const router = createRouter('hash', store);


    const components = {};

    for (let [componentName, componentFactory] of Object.entries(componentsList)) {
        components[componentName] = componentFactory({store, router, components});
    }

    return {
        getStore: () => store,
        getRouter: () => router,
        Lit,
        ...components
    }
}
export default Lumiset;

