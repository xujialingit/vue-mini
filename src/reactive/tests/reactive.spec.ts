import { reactive, isReactive } from "../reactive";
describe("reactive", () => {
    //reactive 单元测试1
    it("happy path", () => {
        const orignal = { foo: 1 };
        const observed = reactive(orignal);
        //ractive 对象不等于原始对象
        expect(observed).not.toBe(orignal);
        //reactive 对象属性和元素对象的属性相同
        expect(observed.foo).toBe(1);

        //isReactive 测试是否为Reactive
        expect(isReactive(observed)).toBe(true);
        // expect(isReactive(orignal)).toBe(true); // --> 报错
    })

    //reactive嵌套对象
    test("nested reactive", () => {
        const original = {
            nested: {
                foo: 1,
            },
            array: [{ bar: 2 }]
        }
        const observed = reactive(original);
        expect(isReactive(observed.nested)).toBe(true);
        expect(isReactive(observed.array)).toBe(true);
        expect(isReactive(observed.array[0])).toBe(true);
    })
})