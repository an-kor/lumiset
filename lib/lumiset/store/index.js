import {proxyFactory, proxyToRaw} from './proxy.js';
import {schemaFactory} from './schema.js';
const createStore = (initialState = {}, initialSchema = {}) => {
    let state = typeof initialState === 'function' ? initialState() : initialState;

    const listeners = [];
    const changes = new Set();
    const middlewareMap = new Map();

    const schema = schemaFactory(typeof initialSchema === 'function' ? initialSchema() : initialSchema);

    let pendingNotification = false;
    const notifyAll = () => {
        if (pendingNotification) return;

        pendingNotification = true;
        (requestIdleCallback??requestAnimationFrame)(() => {
            if (changes.size) {
                pendingNotification = false;

                for (const listener of listeners) {
                    const relevantChanges = [...changes].filter(change =>
                            listener.changeTypes.includes(change.type) && listener.paths.some(path =>
                                path === '*' || change.path === path || change.path.startsWith(`${path}.`)
                            )
                    );

                    if (relevantChanges.length) {
                        listener.callback(state, relevantChanges);
                    }
                }
                changes.clear();
            }
        });
    };
    const getPathValue = (path) => {
        const keys = path.split('.');
        return keys.reduce((acc, key) => (typeof acc !== 'object' || acc === null) ? undefined : acc[key], state);
    };

    const setPathValue = (path, value) => {
        const keys = path.split('.');
        let current = state;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    };

    // Store API
    const getState = () => state;
    const subscribe = (callback, paths = ['*'], changeTypes = ['ADD', 'DELETE', 'MODIFY']) => {
        listeners.push({ callback, paths, changeTypes });
        return () => {
            const index = listeners.findIndex(l => l.callback === callback);
            listeners.splice(index, 1);
        };
    };

    const createProxy = proxyFactory(notifyAll, changes, schema, middlewareMap);

    state = createProxy(state, '');


    const addMiddleware = (path, changeType, middleware) => {
        if (typeof middleware !== 'function') {
            throw new Error('Middleware must be a function');
        }
        if (!middlewareMap.has(path)) {
            middlewareMap.set(path, []);
        }
        middlewareMap.get(path).push({ changeType, middleware });
    };

    const removeMiddleware = (path, changeType, middleware) => {
        const relevantMiddlewares = middlewareMap.get(path);
        if (relevantMiddlewares) {
            const index = relevantMiddlewares.findIndex(m => m.changeType === changeType && m.middleware === middleware);
            if (index !== -1) {
                relevantMiddlewares.splice(index, 1);
            }
            if (relevantMiddlewares.length === 0) {
                middlewareMap.delete(path);
            }
        }
    };

    return {
        getState,
        extendState: (extension) => Object.assign(state, extension),
        setStateProperty: (key, value) => { state[key] = value; },
        subscribe,
        addMiddleware,
        removeMiddleware,
        getPathValue,
        setPathValue,
        proxyToRaw
    };
};

export { createStore };
