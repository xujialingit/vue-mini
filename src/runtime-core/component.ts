import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    }

    return component;
}

export function setupComponent(instance) {
    //TODO
    // initProps();
    //initSlots();

    //初始化一个有状态的组件
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
    const Component = instance.vnode.type;

    //ctx
    instance.proxy = new Proxy({ _: instance },
        PublicInstanceProxyHandlers
    )

    const { setup } = Component;
    if (setup) {
        //function Object
        const setupResult = setup();

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

