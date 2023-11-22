import Lumiset from "../lib/lumiset/index.js";
import { MyElement, TextElement } from "./components/index.js";
import { LayoutBlank } from "./layouts/index.js";
import { initializeRoutes } from "./routes.js";

let App = Lumiset({
    initialState:{
        isAuthorized: false,
        authorizedRoutes: ["dashboard", "users/:id"],
        version: "1.0.0",
        todos: [
            { id: 0, text: "Do laundry" },
            { id: 1, text: "Buy groceries" }
        ],
    },
    initialSchema: {
        authorizedRoutes: ["string"],
        version: "string",
        todos: [{ id: "number", text: "string" }],
        item: {
            id: "number",
            text: "string"
        }
    },
    middlewares: {
        'auth': {
            path: "currentRoute",
            handler: async (value, state) => {
                if (!state.isAuthorized && state.authorizedRoutes.includes(value)) {
                    return false;
                }
                return true;
            },
            onReject: () => {
                App.getRouter().navigate('login')
            }
        }
    }
});

window.state = App.getStore().getState();

export default App;