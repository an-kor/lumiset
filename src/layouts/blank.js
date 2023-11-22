export default (App) => {
    return class extends App.BaseElement {
        static elementName = 'app-layout-blank';
        static styles = App.Lit.css`
        :host {
              display: flex;
              width: 100%;
              min-height: 100vh;
         }
            .wrapper {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
        `;
        renderElement() {
            return App.Lit.html`
        <div class="wrapper">
            <div class="content">
                <slot></slot>
            </div>
        </div>

`;
        }
    }
};