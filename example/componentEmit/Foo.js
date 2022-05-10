import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
    name: "Foo",
    render() {
        const btn = h("button", {
            onClick: this.emitAdd
        }, "emitAdd")

        const foo = h("p", {},"foo")
        return h("div", {}, [foo, btn])
    },
    setup() {
        return {}
    }
}