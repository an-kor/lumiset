const Utils = (App) => ({
    scale: (scale) => {
        let themeScale = App.utils.getThemeVariable('scale', 1);
        return parseFloat(themeScale) * parseFloat(scale);
    },
    getThemeVariable: (variableKey, defaultValue) => {
        const currentTheme = App.getStore().getState().currentTheme;
        return App.themes[currentTheme].variables[variableKey] ?? defaultValue;
    },
    getBreakpoints: () => {
        return {
            xs: {
                min: '0',
                max: App.utils.getThemeVariable('xs', '650px'),
            },
            sm: {
                min: App.utils.getThemeVariable('xs', '650px'),
                max: App.utils.getThemeVariable('sm', '900px'),
            },
            md: {
                min: App.utils.getThemeVariable('sm', '900px'),
                max: App.utils.getThemeVariable('md', '1280px'),
            },
            lg: {
                min: App.utils.getThemeVariable('md', '1280px'),
                max: App.utils.getThemeVariable('lg', '1920px'),
            },
            xl: {
                min: App.utils.getThemeVariable('lg', '1920px'),
                max: Infinity,
            },
        }
    },
    getCurrentBreakpoint: () => {
        const breakpoints = App.utils.getBreakpoints();
        const viewportWidth = window.innerWidth;

        const isBreakpointActive = (min, max) => {
            const minWidth = parseInt(min, 10);
            const maxWidth = parseInt(max, 10);
            return viewportWidth >= minWidth && viewportWidth < maxWidth;
        };

        for (const [breakpoint, { min, max }] of Object.entries(breakpoints)) {
            if (isBreakpointActive(min, max)) {
                return breakpoint;
            }
        }
        return null;
    },
});

export default Utils;
