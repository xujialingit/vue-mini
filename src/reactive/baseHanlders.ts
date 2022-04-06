import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive";
import { isObject, extend } from "../shared";
//枚举
export const enum ReactiveFlag {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
    IS_PROXY="__v_isProxy"
}

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        //通过创建getter函数传入的isReadonly实现isReactive 和 isReadonly
        if (key === ReactiveFlag.IS_REACTIVE) {
            return !isReadonly;
        }
        if (key === ReactiveFlag.IS_READONLY) {
            return isReadonly;
        }
        if(key === ReactiveFlag.IS_PROXY) {
            return true;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        //看看res是不是object
        if (isObject(res)) {
            //是否为readonly,如果是把对象属性变成readonly,不然变成reactive
            return isReadonly ? readonly(res) : reactive(res);
        }

        if (!isReadonly) {
            track(target, key);
        }
        return res;
    }
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        //TODO 出发依赖 
        trigger(target, key);
        return res;
    }
}

//先创建一个之后的handlers使用同一的geeter
const reactiveGetter = createGetter();
const reactiveSetter = createSetter();
const readonlyGetter = createGetter(true);
const shallowReadonlyGetter = createGetter(true, true)
export const mutableHandlers = {
    get: reactiveGetter,
    set: reactiveSetter
}

export const readonlyHandlers = {
    get: readonlyGetter,
    set(target, key, value) {
        console.warn(`key:${key} set失败， 因为target是readonly`)
        return true
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGetter
})
