const createRouter = (mode = 'history', store) => {
    if (mode !== 'hash' && mode !== 'history') {
        throw new Error('Invalid routing mode specified.');
    }

    const updateRouteInStore = (path) => {
        store.setStateProperty('currentRoute', path);
    };
    const matchRoute = (route, path) => {
        // Split both route and path into segments
        const routeSegments = route.split('/');
        const pathSegments = path.split('/');

        // Immediately return false if route has more segments than path
        // except for when path ends with a wildcard.
        if (routeSegments.length > pathSegments.length && pathSegments[pathSegments.length - 1] !== '*') {
            return false;
        }

        // Initialize an object to hold any named parameters found
        const params = {};

        // Iterate over the path segments
        for (let i = 0; i < pathSegments.length; i++) {
            const pathSegment = pathSegments[i];
            const routeSegment = routeSegments[i];

            // If the path segment is a wildcard '*', it matches any route segment
            // except if it's the last segment in the path, then it must match the rest of the route.
            if (pathSegment === '*') {
                if (i === pathSegments.length - 1) {
                    return true;
                }
                continue;
            }

            // If the path segment starts with ':', it is a named parameter
            // Capture the parameter value from the route
            if (pathSegment.startsWith(':')) {
                const paramName = pathSegment.slice(1);
                params[paramName] = routeSegment;
                continue;
            }

            if (routeSegment !== pathSegment) {
                return false;
            }
        }
        store.setStateProperty('pathParams', params);
        return true;
    }

    const updateRoute = () => {
        const route = mode === 'hash' ? window.location.hash.slice(1) : window.location.pathname;
        updateRouteInStore(route);
    }

    const eventType = mode === 'hash' ? 'hashchange' : 'popstate';
    window.addEventListener(eventType, updateRoute);
    document.addEventListener('DOMContentLoaded', updateRoute);


    const navigate = (path) => {
        if (mode === 'hash') {
            window.location.hash = path;
        } else if (mode === 'history') {
            history.pushState({}, '', path);
            updateRouteInStore(path);
        }
    };


    return {
        navigate,
        matchRoute,
    };
};

export { createRouter };