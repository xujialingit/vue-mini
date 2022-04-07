import { h, reactive } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"
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
                onClick() {
                    console.log("click");
                },
                onMouseover() {
                    console.log("mouseover")
                }
            },
            //children --> string
            // "hello," + this.msg

            //children --> Array
            [
                h("p", { class: "red" }, "hi" + this.msg),
                h("p", { class: "blue" }, "hi" + this.user.name),
                h(Foo, { count: 10 })
            ]
        )
    },
    setup() {
        const user = reactive({ name: 10 });
        return { msg: "mini-vue--hahah", user }
    }
}