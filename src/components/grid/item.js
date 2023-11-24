export default (App) => {
    const getItemLayout = (val) => {
        const display = val === 0 ? 'display: none;' : 'display: flex;';
        if (typeof val === 'number') {
            const width = (100 / App.utils.getThemeVariable('columns')) * val;
            const ratio = width > 100 ? '100%' : width < 0 ? '0' : `${width}%`;
            return {
                grow: 0,
                display,
                width: ratio,
                basis: ratio,
            };
        }
        return {
            grow: 1,
            display,
            width: '100%',
            basis: '0',
        };
    };
    return class extends App.BaseElement {
        static elementName = 'lumi-grid-item';
        static get properties() {
            return {
                xs: { type: Number },
                sm: { type: Number },
                md: { type: Number },
                lg: { type: Number },
                xl: { type: Number },
            };
        }
        getComputedStyles() {
            const currentBreakpoint = App.utils.getCurrentBreakpoint();
            const breakpointsOrder = ['xs', 'sm', 'md', 'lg', 'xl']; // Breakpoints in order of size
            let activeBreakpointValue;

            for (let i = breakpointsOrder.indexOf(currentBreakpoint); i >= 0; i--) {
                const bp = breakpointsOrder[i];
                if (this[bp] !== undefined) {
                    activeBreakpointValue = this[bp];
                    break;
                }
            }
            if (typeof (activeBreakpointValue) !== 'undefined') {
                return getItemLayout(activeBreakpointValue);
            }
            return { grow: 1, display: 'display: flex;', width: '100%', basis: '0' };
        }

        static styles = App.Lit.css`
        .grid-item {
            box-sizing: border-box;
            width: 100%;
            padding: 0;
            margin: 0;
        }
        `;

        updateStyle() {
            const styles = this.getComputedStyles();
            this.style = `
            flex-grow: ${styles.grow}; ${styles.display}; width: ${styles.width}; flex-basis: ${styles.basis};
            `
        }

        updated(changedProperties) {
            this.updateStyle()
        }

        firstUpdated(changedProperties) {
            super.firstUpdated(changedProperties);
            this.updateStyle();
            this.resizeListener = () => this.updateStyle();
            window.addEventListener('resize', this.resizeListener);
            this.unsubscribe = App.getStore().subscribe(
                (state, changes) => {
                    this.updateStyle();
                },
                'themeCss'
            );
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            this.unsubscribe();
            window.removeEventListener('resize', this.resizeListener);
        }

        renderElement() {
            return App.Lit.html`
              <div class="grid-item">
                <slot></slot>
              </div>
            `;
        }
    }
};