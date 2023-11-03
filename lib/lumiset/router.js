const createRouter = (mode = 'history', store) => {
    if (mode !== 'hash' && mode !== 'history') {
        throw new Error('Invalid routing mode specified.');
    }

    let flatRoutes = [];

    const flattenRoute = (route, parentPath = '') => {
        if (route.children) {
            for (const child of route.children) {
                flattenRoute(child, parentPath + route.path);
            }
        } else {
            flatRoutes.push({
                path: parentPath + route.path,
                handler: route.handler,
                middlewares: route.middlewares || []
            });
        }
    };

    const findMatchingRoute = (path) => {
        for (const route of flatRoutes) {
            const routeSegments = route.path.split('/').filter(Boolean);
            const pathSegments = path.split('/').filter(Boolean);

            if (routeSegments.length !== pathSegments.length) {
                continue;
            }

            let isMatch = true;
            const params = {};

            for (let i = 0; i < routeSegments.length; i++) {
                if (routeSegments[i].startsWith(':')) {
                    params[routeSegments[i].slice(1)] = pathSegments[i];
                } else if (routeSegments[i] !== pathSegments[i]) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return { ...route, params };
            }
        }
        return null;
    };


    const updateRouteInStore = async (path) => {
        const matchingRoute = findMatchingRoute(path);
        if (matchingRoute) {
            for (const middleware of matchingRoute.middlewares) {
                const result = await middleware(store, matchingRoute.params);
                if (result === false) {
                    return; // Halt the navigation
                }
            }
            // Set route in store directly
            store.setStateProperty('route', {
                path,
                params: matchingRoute.params
            });
            if (matchingRoute.handler) {
                matchingRoute.handler(matchingRoute.params);
            }
        }
    };

    if (mode === 'hash') {
        window.addEventListener('hashchange', () => {
            updateRouteInStore(window.location.hash.slice(1));
        });
        updateRouteInStore(window.location.hash.slice(1));
    } else if (mode === 'history') {
        window.addEventListener('popstate', () => {
            updateRouteInStore(window.location.pathname);
        });
        updateRouteInStore(window.location.pathname);
    }

    const navigate = (path) => {
        if (mode === 'hash') {
            window.location.hash = path;
        } else if (mode === 'history') {
            history.pushState({}, '', path);
            updateRouteInStore(path);
        }
    };

    const addRoute = (route) => {
        flattenRoute(route);
    };

    const addRoutes = (routes) => {
        for (const route of routes) {
            addRoute(route);
        }
    };

    return {
        navigate,
        addRoute,
        addRoutes
    };
};

export { createRouter };