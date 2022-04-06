import { trackEffects, triggerEffects, isTracking } from "./effect";
import { hasChanged, isObject } from "../shared/index"
import { reactive } from "./reactive";
class RefImpl {
    private _value: any;
    public dep;
    private _rawValue: any;
    private __v_isRef: boolean;
    constructor(value) {
        this._rawValue = value;
        //如果value是对象， 包装成 value:reactive
        this._value = convert(value);
        this.dep = new Set();
        this.__v_isRef = true;
    }

    get value() {
        //track
        trackRefValue(this);
        return this._value;
    }

    set value(newValue) {
        //对比
        if (hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue;
            //先修改value, 在triggerEffects
            this._value = convert(newValue);
            triggerEffects(this.dep);
        };
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
    //必须是有activeEffects且shouldTarck才收集，也就是通过effect()的才收集
    if (isTracking()) {
        //依赖收集
        trackEffects(ref.dep);
    }
}

export function ref(value) {
    return new RefImpl(value);
}

export function isRef(ref) {
    return !!ref.__v_isRef;
}

export function unRef(ref) {
    //是否是ref --> ref.value
    return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            } else {
                return Reflect.set(target, key, value)
            }
        }

    })
}