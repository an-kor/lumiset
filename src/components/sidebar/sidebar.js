export default (App) => {
    return class SidebarComponent extends App.BaseElement {
        static elementName = 'lumi-sidebar';

        /** @lang CSS */
        static styles =  App.Lit.css`
          :host {
            --sidebar-width: 250px;
            --sidebar-collapsed-width: 50px;
          }

          .sidebar {
            width: var(--sidebar-width);
            background-color: #333;
            color: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
            transition: width 0.3s;
          }

          .sidebar.collapsed {
            width: var(--sidebar-collapsed-width);
          }

          .menu-item {
            padding: 15px 20px;
            border-bottom: 1px solid #444;
            cursor: pointer;
            display: flex;
            align-items: center;
            overflow: hidden;
          }

          .menu-item:hover {
            background-color: #555;
          }

          .toggle-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 10px 20px;
          }
        `;

        constructor() {
            super();
            this.collapsed = false;
        }

        static get properties() {
            return {
                collapsed: {type: Boolean}
            };
        }

        toggleSidebar() {
            this.collapsed = !this.collapsed;
        }

        render() {
            return html`
                <aside class="sidebar ${this.collapsed ? 'collapsed' : ''}">
                    <div class="profile">
                        <img src="/path/to/profile-image.jpg" alt="Profile Image" width="50" height="50"/>
                        <div class="profile-info">
                            <strong>Username</strong>
                            <span>Role</span>
                        </div>
                    </div>
                    <div class="menu-item">
                        <span class="icon">📈</span>
                        <span>Performance</span>
                    </div>
                    <!-- Add more menu items here -->
                    <button class="toggle-btn" @click="${this.toggleSidebar}">
                        ${this.collapsed ? '>>' : '<<'}
                    </button>
                </aside>
            `;
        }
    }
}