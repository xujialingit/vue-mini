import { extend } from '../shared/index'
const targetMap = new Map();
let shouldTarck = false;
export class ReactiveEffect {
    private _fn;
    deps = [];
    active = true;
    onStop?: () => any;
    public scheduler: Function | undefined;
    constructor(fn, scheduler?) {
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        //已经stop了
        if (!this.active) {
            return this._fn();
        }
        shouldTarck = true;
        activeEffect = this;
        const result = this._fn();
        shouldTarck = false;
        return result;
    }
    stop() {
        if (this.active) {
            if (this.onStop) {
                this.onStop();
            }
            cleanupEffect(this);
            this.active = false;
        }
    }
}

function cleanupEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}



//依赖收集
export function track(target, key) {
    if (!isTracking()) return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}

export function trackEffects(dep) {
    //已经在dep中了
    if (dep.has(activeEffect)) return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

export function isTracking() {
    //判断是否effect, 不是effect方法收集依赖不收集
    // if (!activeEffect) return;
    //判断是否stop了， 如果是停止了也收集依赖
    // if (!shouldTarck) return;
    return shouldTarck && activeEffect !== undefined;
}

//执行依赖
export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) return;
    let dep = depsMap.get(key);
    triggerEffects(dep);
}

export function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}

let activeEffect;
export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn);
    extend(_effect, options);
    _effect.run();
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop(runner) {
    runner.effect.stop();
}