import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags } from "../shared/ShapeFlags";
export function render(vnode, container) {
    //patch方法

    patch(vnode, container);
}

function patch(vnode, container) {
    //TODO 判断vnode是不是一个element
    //是element 那么就应该处理 element
    const { shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
    const el = (vnode.el = document.createElement(vnode.type));

    //string array
    const { children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) { //递归调用mountChildren();
        mountChildren(vnode, el)
    }
    //props
    const { props } = vnode;
    for (const key in props) {
        console.log(key);
        const val = props[key];
        //具体的click --> 通用
        // on + Event name
        //onMousedown
        const isOn = (key: string) => /^on[A-Z]/.test(key)
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val)
        } else {
            el.setAttribute(key, val)
        }
    }
    container.append(el);
}

function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container);
    });
}

function mountComponent(initialVNode: any, container) {
    const instance = createComponentInstance(initialVNode);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);

}

function setupRenderEffect(instance: any, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);

    //vnode --> patch 虚拟节点树
    //vnode --> element --> mountElement

    patch(subTree, container);
    initialVNode.el = subTree.el;
}
