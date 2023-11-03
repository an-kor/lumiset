export const proxyFactory = (notifyAll, changes, schema, middlewareMap) => {
    const getRelevantMiddlewares = (fullPath) => {
        const relevantPaths = Array.from(middlewareMap.keys()).filter(registeredPath =>
            fullPath === registeredPath || fullPath.startsWith(`${registeredPath}.`)
        );
        return relevantPaths.flatMap(registeredPath => middlewareMap.get(registeredPath));
    };
    return function createProxy(target, path = '') {
        const handler = {
            get(obj, prop) {
                if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
                    return obj[prop];
                }

                const value = obj[prop];
                const fullPath = path ? `${path}.${prop}` : prop;

                if (typeof value === 'object' && value !== null) {
                    return createProxy(value, fullPath);
                }

                return value;
            },
            set(obj, prop, value) {
                const fullPath = path ? `${path}.${prop}` : prop;

                if (prop !== 'length' || !Array.isArray(obj)) {
                    if (!schema.validateType(value, fullPath)) {
                        console.warn(`Validation failed for path "${fullPath}". Expected type: ${JSON.stringify(schema.getSchemaForPath(fullPath))} but got ${JSON.stringify(value)}`);
                        return true;
                    }
                } else {
                    return Object.keys(obj).length
                }

                let changeType;
                if (value === undefined) {
                    changeType = 'DELETE';
                } else if (obj[prop] === undefined) {
                    changeType = 'ADD';
                } else {
                    changeType = 'MODIFY';
                }
                const relevantMiddlewares = getRelevantMiddlewares(fullPath);
                for (const { changeType: middlewareChangeType, middleware } of relevantMiddlewares) {
                    if (middlewareChangeType === changeType) {
                        const result = middleware({ type: changeType, path: fullPath, value });
                        if (result === false) {
                            return true;
                        }
                    }
                }

                changes.add({ type: changeType, path: fullPath });
                obj[prop] = value;
                notifyAll();
                return true;
            },
            deleteProperty(obj, prop) {
                const fullPath = path ? `${path}.${prop}` : prop;
                if (prop in obj) {
                    changes.add({ type: 'DELETE', path: fullPath });
                    delete obj[prop];
                    notifyAll();
                }
                return true;
            }
        };

        return new Proxy(target, handler);
    }
};

export function proxyToRaw(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const rawObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            rawObj[key] = proxyToRaw(obj[key]);
        }
    }
    return rawObj;
}