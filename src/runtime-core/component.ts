import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { shallowReadonly } from "../reactive/reactive";
export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
    }

    return component;
}

export function setupComponent(instance) {
    //TODO
    initProps(instance, instance.vnode.props);
    //initSlots();

    //初始化一个有状态的组件
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
    const Component = instance.vnode.type;

    //ctx  组件代理对象 --> 后续在组件里面通过this获取组件上的数据
    instance.proxy = new Proxy({ _: instance },
        PublicInstanceProxyHandlers
    )

    const { setup } = Component;
    if (setup) {
        //function Object
        const setupResult = setup(shallowReadonly(instance.props));

        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult: any) {
    //function Object
    //TODO function

    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance)

}

function finishComponentSetup(instance: any) {
    const Component = instance.type;
    instance.render = Component.render;
}

