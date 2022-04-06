import { isProxy, reactive, readonly } from "../reactive";

describe("isProxy test", () => {
    test("happy Path", () => {
        const original = { foo: 0 };
        const observed = reactive(original);
        const observed1 = readonly(original);
        expect(isProxy(observed)).toBe(true);
        expect(isProxy(observed1)).toBe(true);
        expect(isProxy(original)).toBe(false)
    })
})