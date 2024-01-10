const Utils = (App) => ({
    scale: (scale) => {
        let themeScale = App.utils.getThemeVariable('scale', 1);
        return parseFloat(themeScale) * parseFloat(scale);
    },
    getThemeVariable: (variableKey, defaultValue, theme) => {
        let currentTheme;
        if (theme) {
            currentTheme = theme;
        } else {
            currentTheme = App.themes[App.getStore().getState().currentTheme];
        }
        if (!currentTheme.variables) return null;
        return currentTheme.variables[variableKey] ?? defaultValue;
    },
    getBreakpoints: (theme) => {
        return {
            xs: {
                min: '0',
                max: App.utils.getThemeVariable('xs', '650px', theme),
            },
            sm: {
                min: App.utils.getThemeVariable('xs', '650px', theme),
                max: App.utils.getThemeVariable('sm', '900px', theme),
            },
            md: {
                min: App.utils.getThemeVariable('sm', '900px', theme),
                max: App.utils.getThemeVariable('md', '1280px', theme),
            },
            lg: {
                min: App.utils.getThemeVariable('md', '1280px', theme),
                max: App.utils.getThemeVariable('lg', '1920px', theme),
            },
            xl: {
                min: App.utils.getThemeVariable('lg', '1920px', theme),
                max: Infinity,
            },
        }
    },
    getCurrentBreakpoint: (theme) => {
        const breakpoints = App.utils.getBreakpoints(theme);
        const viewportWidth = window.innerWidth;

        const isBreakpointActive = (min, max) => {
            const minWidth = parseInt(min, 10);
            const maxWidth = parseInt(max, 10);
            return viewportWidth >= minWidth && (viewportWidth < maxWidth || max === Infinity);
        };

        for (const [breakpoint, { min, max }] of Object.entries(breakpoints)) {
            if (isBreakpointActive(min, max)) {
                return breakpoint;
            }
        }
        return null;
    },
    getBreakpointByValue: (container, theme) => {
        const currentBreakpoint = App.utils.getCurrentBreakpoint(theme);
        const breakpointsOrder = ['xs', 'sm', 'md', 'lg', 'xl'];
        let activeBreakpointValue;

        for (let i = breakpointsOrder.indexOf(currentBreakpoint); i >= 0; i--) {
            const bp = breakpointsOrder[i];
            if (container[bp] !== undefined) {
                activeBreakpointValue = container[bp];
                return activeBreakpointValue;
            }
        }
        return null;
    },
    getBackgroundBrightness: (elementOrColor, multiplier) => {
        if (!multiplier) multiplier = 1;
        let bgColor;
        if (typeof elementOrColor === "string") {
            bgColor = elementOrColor;
        } else {
            bgColor = window.getComputedStyle(elementOrColor).backgroundColor;
        }
        let colorComponents = bgColor.substring(bgColor.indexOf('(') + 1, bgColor.lastIndexOf(')')).split(/,\s*/);
        let r = parseInt(colorComponents[0]);
        let g = parseInt(colorComponents[1]);
        let b = parseInt(colorComponents[2]);
        if (colorComponents.length>3){
            let t = colorComponents[3];
            if (t < 0.5) return true;
        }

        let brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness/multiplier > 128;
    },
    generateRandomId: () => {
        const randomString = Date.now() + "-" + Math.random().toString(36).substring(2, 5);
        return `lumi-${randomString}`;
    }
});

export default Utils;
