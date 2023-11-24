export default {
    globals: `
        font-family: var(--sans);
        -webkit-font-smoothing: antialiased;
        text-rendering: geometricPrecision;
        -webkit-tap-highlight-color: transparent;
        font-size: var(--unit);
        margin: 0;
        padding: 0;
    `,
    variables: {
        "sans": '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        "mono": 'Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace',
        "main-color": 'red',
        "scale": 0.5,
        "columns": 12,
        "gap": '16pt',
        "unit": '16px',

        "xs": "650px",
        "sm": "900px",
        "md": "1280px",
        "lg": "1920px"
    }
};