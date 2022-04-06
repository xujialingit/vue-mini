import { effect } from "../effect";
import { reactive } from "../reactive";
import { ref, isRef, unRef, proxyRefs } from "../ref";

describe("ref", () => {
    it("happy path", () => {
        const a = ref(1);
        expect(a.value).toBe(1);
    })
    it("ref得是一个响应式对象", () => {
        const a = ref(1);
        let dummy;
        let calls = 0;
        effect(() => {
            calls++;
            dummy = a.value;
        })
        expect(calls).toBe(1);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);

        // // 相同得修改不能调用trigger
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
    })
    it("可以ref一个对象变成响应式对象", () => {
        const a = ref({
            count: 1
        })
        let dummy;
        effect(() => {
            dummy = a.value.count;
        })
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
    })

    //isRef unRef
    it("isRef", () => {
        const a = ref(1);
        const user = reactive({ age: 1 })
        expect(isRef(a)).toBe(true);
        expect(isRef(1)).toBe(false);
        expect(isRef(user)).toBe(false);
    })

    //不需要value拿到ref的值
    it("unRef", () => {
        const a = ref(1);
        const user = reactive({ age: 1 })
        expect(unRef(a)).toBe(1);
        expect(unRef(1)).toBe(1);
    })

    //proxyRefs
    it("proxyRefs", () => {
        const user = {
            age: ref(10),
            name: "xiaoqiang"
        }
        const proxyUser = proxyRefs(user);
        expect(user.age.value).toBe(10);
        expect(proxyUser.age).toBe(10);
        expect(proxyUser.name).toBe("xiaoqiang");

        //template
        //ref.value 在模板templage直接通过.属性获取值
        //setup() { return { ref } }

        //set --> ref .value
        proxyUser.age = 20;
        expect(proxyUser.age).toBe(20);
        expect(user.age.value).toBe(20);

        proxyUser.age = ref(10);
        expect(proxyUser.age).toBe(10);
        expect(user.age.value).toBe(10)
    })
})