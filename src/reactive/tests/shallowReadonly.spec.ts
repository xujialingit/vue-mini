import { isReadonly, shallowReadonly } from "../reactive"

//只有表层是readonly
/**
    使用场景，
        在嵌套对象中，只需要把表层的属性变成响应式对象，不需要把深层次的变成
        响应式对象的时候使用；
        一般来说都是用于项目中的优化的时候
 */
describe("shallowReadonly", ()=> {
    test("should not make non-reactive properties reactive", () => {
        const props = shallowReadonly({n: {foo: 1}});
        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.n)).toBe(false);
    })
    test("warn then call set", () => {
        // console.warn()
        //mock
        console.warn = jest.fn();
        const user = shallowReadonly({ age:10})
        user.age = 11;
        expect(isReadonly(user)).toBe(true);
        expect(console.warn).toBeCalled();
    })
})