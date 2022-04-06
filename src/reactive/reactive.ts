import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers, ReactiveFlag } from "./baseHanlders";



//reactive
export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers)
}

export function isReactive(value) {
    //双感叹号防止未绑定Proxy对象返回的值是undefined
    return !!value[ReactiveFlag.IS_REACTIVE]
}


export function isReadonly(value) {
    return !!value[ReactiveFlag.IS_READONLY]
}

//readonly 
export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}

//shallowReadonly
export function shallowReadonly(raw) {
    return new Proxy(raw, shallowReadonlyHandlers)
}

//isProxy
export function isProxy(value) {
    return !!value[ReactiveFlag.IS_PROXY]
}

//统一生成代理对象
function createActiveObject(raw, baseHanlders) {
    return new Proxy(raw, baseHanlders)
}

