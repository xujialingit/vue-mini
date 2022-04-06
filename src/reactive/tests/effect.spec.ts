import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe("effect", () => {
    it("happy path", () => {
        const user = reactive({ age: 10 });
        let nextAge;
        effect(() => { nextAge = user.age + 1 });
        expect(nextAge).toBe(11);
        user.age += 12;
        expect(nextAge).toBe(23);
    })

    it("should return runner when call effect", () => {
        //1. effect(fn) --> function（runner) --> fn --> return ;
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return "foo";
        })

        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12);
        expect(r).toBe("foo");
    })

    //scheduler 调度
    it("scheduler", () => {
        //1.通过effect 的第二参数给定一个 scheduler 的fn
        //2. effect 第一次执行的时候 才会执行fn
        //3. 当响应式对象 set update不会执行fn 二十执行scheduler
        //4. 如果说当执行runner的时候， 会再次执行fn
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        })
        const obj = reactive({ foo: 1 });
        const runner = effect(() => {
            dummy = obj.foo;
        },
            { scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        obj.foo++;

        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);
        run();
        expect(dummy).toBe(2);
    })
    //stop
    it("stop", () => {
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        })
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);
        //这个情况只涉及到一个set
        // obj.prop = 3;
        //get set操作 当在get操作的时候又会去收集依赖
        // obj.prop = obj.prop + 1; 
        obj.prop++;
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
    })

    it("onStop", () => {
        const obj = reactive({
            foo: 1
        })
        const onStop = jest.fn(() => {
            console.log("onStop 被调用")
        })
        let dummy;
        const runner = effect(() => {
            dummy = obj.foo;
        }, { onStop })
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    })
})