const createStore = (initialState = {}) => {
    let state = typeof initialState === 'function' ? initialState() : initialState;
    const listeners = [];

    const notifyAll = (prevState, newState) => {
        for (const { callback, keys } of listeners) {
            if (!keys || keys.some(key => prevState[key] !== newState[key])) {
                callback(newState);
            }
        }
    };

    const getState = () => ({ ...state });

    const subscribe = (listener, watchedKeys) => {
        listeners.push({ callback: listener, keys: watchedKeys });
        return () => {
            const index = listeners.findIndex(l => l.callback === listener);
            listeners.splice(index, 1);
        }
    };

    const dispatch = async (actionType, payload) => {
        let action = { type: actionType, payload };

        const specificMiddleware = actions[actionType]?.middlewares || [];
        for (const middleware of specificMiddleware) {
            action = await middleware(action, dispatch, getState);
            if (!action) return; // If middleware returns a falsy value, stop processing
        }

        const prevState = getState();
        const result = actions[action.type].fn(prevState, action.payload);

        const newState = result instanceof Promise ? await result : result;

        state = { ...state, ...newState };
        notifyAll(prevState, newState);
    };

    const actions = {};

    actions.add = (type, actionFunction, middlewares = []) => {
        if (typeof type !== 'string' || typeof actionFunction !== 'function') {
            throw new Error('Invalid arguments provided to actions.add');
        }
        actions[type] = { fn: actionFunction, middlewares };
    };

    return {
        getState,
        subscribe,
        dispatch,
        actions
    };
};

// Async Middleware example
async function loggerMiddleware(action, dispatch, getState) {
    console.log('Current state:', getState());
    console.log('Dispatching action:', action.type, 'with payload:', action.payload);
    // Can introduce asynchronous operations here if needed
    await new Promise(resolve => setTimeout(resolve, 500)); // for demonstration
    return action;
}

const store = createStore({ count: 0 });

store.actions.add('INCREMENT', async (prevState, payload) => {
    // Emulating a delay, e.g., fetching from an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { count: prevState.count + payload.amount };
}, [loggerMiddleware]);

store.subscribe(state => {
    console.log('State updated:', state);
});

store.dispatch('INCREMENT', { amount: 1 });

// Other features like bindDOMToStore can remain as previously provided.
