import { h } from "../../lib/guide-mini-vue.esm.js"
export const App = {
    //.vue
    //template
    //render
    render() {
        return h("div",
            {
                id: "root",
            },
            //children --> string
            // "hello,mini-vue"

            //children --> Array
            [
                h("p", { class: "red" }, "hi"),
                h("p", { class: "blue" }, "mini-vue")
            ]
        )
    },
    setup() {

        return { msg: "mini-vue" }
    }
}