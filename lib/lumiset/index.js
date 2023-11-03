import { createStore } from './store/index.js';
import { createRouter } from './router.js';
import { createRenderer } from './renderer.js';
const Lumiset = ({initialState= {}, initialSchema= {}}) => {
    const store = createStore(initialState, initialSchema);
    const router = createRouter('hash', store);
    const renderer = createRenderer(store);
    return {
        getStore: () => store,
        getRouter: () => router,
        render: (...params) => renderer.render(...params),
    }
}
export default Lumiset;

