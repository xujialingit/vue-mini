import { h } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
    setup(props) {
        console.log(props?.count)
        props.count++;
    },
    render() {
        return h("div", {}, "hello" + this.count);
    }
}