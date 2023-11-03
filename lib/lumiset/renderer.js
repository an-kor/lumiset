function createRenderer(store) {
    // A tree representing components and their attributes
    const componentTree = {};
    let idCounter = 0;

    // Generates a unique ID
    function generateUniqueId() {
        idCounter += 1;
        return `id_${idCounter}`;
    }

    // Map of filters
    const filters = {
        i18n: (value) => {
            const translations = {
                'Add Todo': 'Добавить todo',
                'Delete': 'Удалить'
            };
            return translations[value] || value + '-i18n';
        }
    };

    // Parses a value and returns its path and any filters applied to it
    function parseAttributeValue(value) {
        const [path, ...filterList] = value.split('|').map(s => s.trim());
        return {
            path,
            filters: filterList
        };
    }

    // Mapping of state paths to element IDs that use them
    const elementPathLinks = {};

    // Returns a value from the state, with any filters applied
    function getValueWithFilters(path, filters) {
        const valueFromState = path.split('.').reduce((acc, curr) => acc[curr], store.getState());
        return applyFilters(valueFromState, filters);
    }

    // Applies a list of filters to a value
    function applyFilters(value, filterList) {
        for (const filter of filterList) {
            if (filters[filter]) {
                value = filters[filter](value);
            } else {
                console.warn(`Unknown filter: ${filter}`);
            }
        }
        return value;
    }

    // Updates a DOM element with a dynamic attribute value
    function applyDynamicAttribute(element, attr, value) {
        switch (attr.name) {
            case 'payload':
                // element.dataset.payload = JSON.stringify(value);
                break;
            case 'input':
                element.value = value;
                element.addEventListener('input', (e) => {
                    store.setPath(attr.value, e.target.value);
                });
                break;
            case 'content':
                element.innerHTML = value;
                break;
            default:
                console.warn(`Unknown dynamic attribute: ${attr.name}`);
        }
    }

    // Extracts dynamic attributes from a node and its descendants
    function extractDynamicAttributes(node, component) {
        if (node.attributes) {
            for (let i = 0; i < node.attributes.length; i++) {
                const attribute = node.attributes[i];
                if (attribute.name.startsWith(':')) {
                    const uniqueId = generateUniqueId();
                    node.setAttribute('data-uid', uniqueId);
                    const parsedAttribute = parseAttributeValue(attribute.value);

                    component.dynamicAttributes.push({
                        elementId: uniqueId,
                        name: attribute.name.slice(1),
                        value: parsedAttribute.path,
                        filters: parsedAttribute.filters
                    });

                    if (!elementPathLinks[parsedAttribute.path]) {
                        elementPathLinks[parsedAttribute.path] = [];
                    }
                    elementPathLinks[parsedAttribute.path].push(uniqueId);

                    node.removeAttribute(attribute.name);
                }
            }
        }

        node.childNodes.forEach(child => extractDynamicAttributes(child, component));
    }

    // Parses template tags and stores their content and dynamic attributes
    function parseTemplates() {
        const templateElements = document.querySelectorAll('template');
        templateElements.forEach((template) => {
            componentTree[template.id] = {
                template: template.content.cloneNode(true),
                dynamicAttributes: []
            };
            extractDynamicAttributes(componentTree[template.id].template, componentTree[template.id]);
        });
    }

    // Renders a component, applying any dynamic attributes
    function renderComponent(id, externalProps = {}) {
        const component = componentTree[id];
        if (!component) return null;

        const fragment = component.template.cloneNode(true);

        // Handle nested components
        const nestedComponents = fragment.querySelectorAll('template[data-component]');
        nestedComponents.forEach(nestedComp => {
            const nestedId = nestedComp.getAttribute('data-component');
            let nestedProps = nestedComp.getAttribute('data-payload');

            // Convert the nestedProps from string to object
            try {
                nestedProps = JSON.parse(nestedProps.replace(/'/g, '"')); // Replacing single quotes with double quotes
            } catch (error) {
                console.warn('Error parsing data-payload attribute:', error);
                nestedProps = {};
            }

            nestedComp.replaceWith(renderComponent(nestedId, nestedProps));
        });

        component.dynamicAttributes.forEach(attr => {
            const targetElement = fragment.querySelector(`[data-uid="${attr.elementId}"]`);
            let value;

            // Check if the value is a prop (starts with @)
            if (attr.value.startsWith('@')) {
                value = externalProps[attr.value.slice(1)];  // Remove the @ and get the prop value
            } else {
                value = getValueWithFilters(attr.value, attr.filters);
            }

            applyDynamicAttribute(targetElement, attr, value);
        });

        return fragment;
    }

    // Handles updates to the state, updating any affected elements
    function handleStateChange(state, changes) {
        for (const change of changes) {
            const affectedElementIds = elementPathLinks[change.path];
            if (affectedElementIds) {
                affectedElementIds.forEach(elementId => {
                    const element = document.querySelector(`[data-uid="${elementId}"]`);
                    const dynamicAttr = Object.values(componentTree)
                        .flatMap(comp => comp.dynamicAttributes)
                        .find(attr => attr.elementId === elementId);

                    if (dynamicAttr) {
                        const value = getValueWithFilters(dynamicAttr.value, dynamicAttr.filters);
                        applyDynamicAttribute(element, dynamicAttr, value);
                    }
                });
            }
        }
    }

    store.subscribe(handleStateChange);
    parseTemplates();

    return {
        render: renderComponent,
        getComponentTree: () => componentTree
    };
}

export { createRenderer };
