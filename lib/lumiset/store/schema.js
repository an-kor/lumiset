export const schemaFactory = (schema) => {
    const validateType = (value, path, expectedSchema) => {
        if (!expectedSchema) {
            expectedSchema = getSchemaForPath(path, schema);
        }

        if (!expectedSchema) {
            return true;
        }
        switch(expectedSchema) {
            case 'string':
            case 'number':
                return typeof value === expectedSchema;
            case 'integer':
                return typeof value === 'number' && Number.isInteger(value);
            case 'float':
                return typeof value === 'number' && !Number.isInteger(value);
            case 'date':
                return value instanceof Date && !isNaN(value.getTime());
            default:
                break;
        }

        // Array validation
        if (Array.isArray(expectedSchema)) {
            const itemSchema = expectedSchema[0];
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (!validateType(item, '', itemSchema)) {
                        return false;
                    }
                }
                return true;
            } else {

                return validateType(value, '', itemSchema);
            }
        }

        // Object validation
        if (typeof expectedSchema === 'object') {
            for (const key in expectedSchema) {
                if (!validateType(value[key], '', expectedSchema[key])) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }
    const getSchemaForPath = (path) => {
        const keys = path.split('.');
        let currentSchema = schema;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (Array.isArray(currentSchema) && !isNaN(key)) {
                currentSchema = currentSchema[0];
            } else {
                currentSchema = currentSchema[key];
            }

            if (currentSchema === undefined) {
                return null;
            }
        }

        return currentSchema;
    }
    const updateSchemaAtPath = (path, newSchemaFragment) => {
        const keys = path.split('.');
        let currentSchema = schema;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!currentSchema[keys[i]]) {
                currentSchema[keys[i]] = {};
            }
            currentSchema = currentSchema[keys[i]];
        }
        currentSchema[keys[keys.length - 1]] = newSchemaFragment;
    }

    return {
        validateType,
        getSchemaForPath,
        updateSchemaAtPath,
        getSchema() {
            return schema;
        },
        setSchema: (newSchema) => {
            schema = newSchema;
        },
    }
}