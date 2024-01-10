import {proxyFactory, proxyToRaw} from './proxy.js';
import {schemaFactory} from './schema.js';
const createStore = (initialState = {}, initialSchema = {}, middlewares) => {
    let state = typeof initialState === 'function' ? initialState() : initialState;

    const listeners = [];
    const changes = new Set();
    if (!middlewares) {
        middlewares = {};
    }

    const schema = schemaFactory(typeof initialSchema === 'function' ? initialSchema() : initialSchema);

    let pendingNotification = false;
    const notifyAll = (fullPath, changeType) => {
        if (pendingNotification) return;

        pendingNotification = true;
        (requestIdleCallback ?? requestAnimationFrame)(async () => {
            pendingNotification = false;
            if (changes.size) {
                let processedChanges = [];
                for (const listener of listeners) {
                    if (typeof (listener.paths) === "string") {
                        listener.paths = [listener.paths]
                    }
                    const relevantChanges = [...changes].filter(change => {
                        if (!listener.changeTypes.includes(change.type)) return false;
                        if (listener.paths.includes(change.path)) return true;
                        if (listener.paths.includes('*')) return true;

                        for (const path of listener.paths) {
                            if (change.path.startsWith(`${path}.`)) return true;
                            if (path.startsWith(`${change.path}.`)) return true;
                        }
                        return false;
                    });
                    if (relevantChanges.length) {
                        await listener.callback(state, relevantChanges);
                        processedChanges.push(...relevantChanges);
                    }
                }
                processedChanges.forEach((change)=>{
                    changes.delete(change);
                })
            }
        });
    };

    const getItem = (path) => {
        const keys = path.split('.');
        return keys.reduce((acc, key) => (typeof acc !== 'object' || acc === null) ? undefined : acc[key], state);
    };

    const setItem = (path, value) => {
        const keys = path.split('.');
        let current = state;
        for (let i = 0; i < keys.length - 1; i++) {
            if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
                current[keys[i]] = {};
            }
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

    const createProxy = proxyFactory(notifyAll, changes, schema, middlewares, getState);

    state = createProxy(state, '');


    const addMiddleware = (name, middleware) => {
        if (!middleware || typeof middleware.handler !== 'function') {
            throw new Error('Middleware handler must be a function');
        }
        if (middlewares[name]) {
            throw new Error('Middleware with this name already exists');
        }
        middlewares[name] = middleware;
    };

    const removeMiddleware = (name) => {
        if (!middlewares[name]) {
            throw new Error('Middleware with this name does not exist');
        }
        delete middlewares[name];
    };
    state.componentsData = {};

    return {
        getState,
        extendState: (extension) => Object.assign(state, extension),
        setStateProperty: (key, value) => { state[key] = value; },
        subscribe,
        addMiddleware,
        removeMiddleware,
        getItem,
        setItem
    };
};

export { createStore };
