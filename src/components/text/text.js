
export default (App) => {
    return class extends App.BaseElement {

        static get styles() {
            return App.BaseElement.extendStyles(`
                span {
                  color: var(--lumi-foreground);
                }
                :host([type="success"]) { color: var(--lumi-success); }
                :host([type="warning"]) { color: var(--lumi-warning); }
                :host([type="secondary"]) { color: var(--lumi-accents-5); }
                :host([type="error"]) { color: var(--lumi-error); }
            `);
        }

        static get properties() {
            return {
                h1: { type: Boolean },
                h2: { type: Boolean },
                h3: { type: Boolean },
                h4: { type: Boolean },
                h5: { type: Boolean },
                h6: { type: Boolean },
                b: { type: Boolean },
                small: { type: Boolean },
                i: { type: Boolean },
                span: { type: Boolean },
                del: { type: Boolean },
                em: { type: Boolean },
                blockquote: { type: Boolean },
                className: { type: String },
                type: { type: String },
                value: { type: String }
            };
        }


        static elementName = 'lumi-text';

        renderElement() {
            let content = App.Lit.html`<slot></slot>`;
            if (this.value) {
                content = App.Lit.html`${this.value}`;
            }

            if (this.blockquote) content = App.Lit.html`<blockquote>${content}</blockquote>`;
            if (this.em) content = App.Lit.html`<em>${content}</em>`;
            if (this.del) content = App.Lit.html`<del>${content}</del>`;
            if (this.span) content = App.Lit.html`<span>${content}</span>`;
            if (this.small) content = App.Lit.html`<small>${content}</small>`
            if (this.b) content = App.Lit.html`<b>${content}</b>`;
            if (this.i) content = App.Lit.html`<i>${content}</i>`;
            if (this.p) content = App.Lit.html`<p>${content}</p>`;
            if (this.h6) content = App.Lit.html`<h6>${content}</h6>`;
            if (this.h5) content = App.Lit.html`<h5>${content}</h5>`;
            if (this.h4) content = App.Lit.html`<h4>${content}</h4>`;
            if (this.h3) content = App.Lit.html`<h3>${content}</h3>`;
            if (this.h2) content = App.Lit.html`<h2>${content}</h2>`;
            if (this.h1) content = App.Lit.html`<h1>${content}</h1>`;


            return content;
        }
    }
};