import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    //patch方法


    patch(vnode, container);
}

function patch(vnode, container) {

    //TODO 判断vnode是不是一个element
    //是element 那么久应该处理 element
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    } else if (isObject(vnode.type)) {
        //去处理组件
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container);
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container);
}

function mountElement(vnode: any, container: any) {
    const el = document.createElement(vnode.type);

    //string array
    const { children } = vnode;

    if (typeof children === "string") {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        mountChildren(vnode, el)
    }

    //props
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val)
    }
    container.append(el);
}

function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container);
    });
}

function mountComponent(vnode: any, container) {
    const instance = createComponentInstance(vnode);

    setupComponent(instance);
    setupRenderEffect(instance, container);

}

function setupRenderEffect(instance: any, container) {
    const subTree = instance.render();

    //vnode --> patch 虚拟节点树
    //vnode --> element --> mountElement

    patch(subTree, container)
}
