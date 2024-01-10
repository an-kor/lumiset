export default (App) => {
    return class extends App.BaseElement {
        static elementName = 'lumi-icon';

        static get properties() {
            return {
                icon: { type: String },
                size: { type: String },
                color: { type: String },
                _svgElement: { type: Object, state: true }
            };
        }

        static get styles() {
            return App.BaseElement.extendStyles`
:host {
    display: block;
    width: var(--lumi-icon-size);
    height: var(--lumi-icon-size);
}
svg{
    color: var(--lumi-icon-color);
    width: 100%;
    height: 100%;
}
`;
        }

        constructor() {
            super();
            this._svgElement = null;
        }


        onIconChanged(newIcon) {
            this.fetchIcon(newIcon);
        }

        onSizeChanged(newSize) {
            if (newSize.indexOf('%') === -1 && newSize === parseFloat(newSize).toString()) {
                newSize += 'px';
            }
            this.style.setProperty('--lumi-icon-size', newSize);
        }

        onColorChanged(newColor) {
            if (newColor.indexOf('lumi-') === 0) {
                newColor = `var(--${newColor})`;
            }
            this.style.setProperty('--lumi-icon-color', newColor);
        }

        renderElement() {
            return App.Lit.html``;
        }

        async fetchIcon(iconName) {
            const iconSrc = this.getIconSrc(iconName);
            try {
                let svgText = App.getStore().getItem(`iconsCache.${iconName}`);
                if (!svgText) {
                    const response = await fetch(iconSrc);
                    svgText = await response.text();
                    App.getStore().setItem(`iconsCache.${iconName}`, svgText);
                }
                const parser = new DOMParser();
                this._svgElement = parser.parseFromString(svgText, "image/svg+xml").documentElement;
                this.updateSVGElement();
            } catch (error) {
                console.error('Error fetching icon:', error);
            }
        }


        updateSVGElement() {
            const container = this.shadowRoot;
            if (container && this._svgElement) {
                container.innerHTML = '';
                container.appendChild(this._svgElement.cloneNode(true));
            }
        }

        getIconSrc(iconName) {
            return `${App.themes[App.getStore().getItem('currentTheme')].variables.iconsFolderPath??'/lumiset/icons'}/${iconName}.svg`;
        }
    }
};