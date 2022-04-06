import { computed } from "../computed";
import { reactive } from "../reactive"

describe("computed", () => {
    //ref
    //通过.value获取
    //可以缓存
    it("happy path", () => {
        const user = reactive({
            age: 1
        })
        const age = computed(() => {
            return user.age;
        })
        expect(age.value).toBe(1);
    })
    //缓存以及依赖收集
    it("computed依赖收集及缓存", () => {
        const value = reactive({
            foo: 1
        })
        const getter = jest.fn(() => {
            return value.foo;
        })
        const cValue = computed(getter);
        //初始化comupted的时候不会调用getter
        expect(getter).not.toHaveBeenCalled();

        //当获取comupted value时调用一次getter
        expect(cValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1);

        //当computed依赖的响应式对象没发生变化时，重复获取value不调用getter
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(1);

        //当computed依赖的响应式对象发生变化时，重复获取value调用getter
        value.foo = 2;
        expect(getter).toHaveBeenCalledTimes(1);

        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2);
    })
})