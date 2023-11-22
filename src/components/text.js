export default (App) => {
    return class extends App.BaseElement {
        static elementName = 'lumi-element';
        renderElement() {
            return App.Lit.html`
                    <p>version: ${this.version}</p>
                    <p>text: ${this.text}</p>
                    <p>todos:
                        ${this.todos.map((todo) => {
                    return App.Lit.html`<li>${todo?.text}</li>`;
                }
            )}
                    </p>
                `;
        }
    }
};