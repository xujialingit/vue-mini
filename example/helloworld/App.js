import { h } from "../../lib/guide-mini-vue.esm.js"

window.self = null;
export const App = {
    //.vue
    //template
    //render
    render() {
        window.self = this;
        return h("div",
            {
                id: "root",
                class: "red",
                onClick() {
                    console.log("click");
                },
                onMouseover() {
                    console.log("mouseover")
                }
            },
            //children --> string
            "hello," + this.msg

            //children --> Array
            // [
            //     h("p", { class: "red" }, "hi"),
            //     h("p", { class: "blue" }, "mini-vue")
            // ]
        )
    },
    setup() {

        return { msg: "mini-vue--hahah" }
    }
}