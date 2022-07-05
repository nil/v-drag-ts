// eslint-disable-next-line import/no-extraneous-dependencies
import { App, VNode, DirectiveBinding } from 'vue';

// import dragSetup from './events/dragSetup';

// import vueDragEvent from './utils/vueDragEvent';

// // Add draggable configuration to el for the first time
// const mountedHook = (el, binding) => {
//   dragSetup(el, binding);
// };

// // Update the drag configuration
// const updatedHook = (el, binding) => {
//   // Remove events from updated el
//   el.onmousedown = null;
//   el.ontouchstart = null;

//   const handle = typeof binding.oldValue === 'object'
//     ? binding.oldValue.handle
//     : binding.oldValue;

//   const oldHandleArray = document.querySelectorAll(handle);

//   oldHandleArray.forEach((oldHandle) => {
//   // Remove events from the old handle
//     oldHandle.onmousedown = null;
//     oldHandle.ontouchstart = null;

//     // Remove CSS classes related to the old handle
//     oldHandle.classList.remove(window.data.class.handle);
//     el.classList.remove(window.data.class.usesHandle);
//   });

//   // Vue event if anything is updated
//   Object.keys(binding.oldValue).forEach((key) => {
//     vueDragEvent(el, `update-${key}`);
//   });

//   // Add draggable configuration to el
//   dragSetup(el, binding);
// };

// // Create custom directive
// export default {
//   install(Vue, options) {
//     // Initialize 'data' object
//     window.data = {};

//     // Store default event classes
//     window.data.class = {
//       initial: 'drag-draggable',
//       usesHandle: 'drag-uses-handle',
//       handle: 'drag-handle',
//       down: 'drag-down',
//       move: 'drag-move',
//     };

//     let removeTransition = true;

//     // Replace default event classes with custom ones
//     if (options) {
//       if (options.eventClass) {
//         const classes = options.eventClass;

//         Object.keys(classes).forEach((key) => {
//           if (classes[key]) {
//             window.data.class[key] = classes[key];
//           }
//         });
//       }

//       if (typeof options.removeTransition === 'boolean') {
//         removeTransition = options.removeTransition;
//       }
//     }

//     // Create stylesheet with basic styling (position, z-index and cursors)
//     const styleElement = document.createElement('style');
//     styleElement.innerHTML = `.${window.data.class.initial}{position:relative;}.${window.data.class.initial}:not(.${window.data.class.usesHandle}),.${window.data.class.handle}{cursor:move;cursor:grab;cursor:-webkit-grab;}.${window.data.class.handle}.${window.data.class.down},.${window.data.class.initial}:not(.${window.data.class.usesHandle}).${window.data.class.down}{z-index:999;cursor:grabbing;cursor:-webkit-grabbing;}`;
//     styleElement.innerHTML += removeTransition === true ? `.${window.data.class.move}{transition:none;}` : '';
//     document.body.appendChild(styleElement);

//     // Register 'v-drag' directive
//     Vue.directive('drag', {
//       // Hooks for Vue3
//       mounted(el, binding) {
//         mountedHook(el, binding);
//       },

//       updated(el, binding) {
//         updatedHook(el, binding);
//       },

//       // Hooks for Vue2
//       inserted(el, binding) {
//         mountedHook(el, binding);
//       },

//       update(el, binding) {
//         updatedHook(el, binding);
//       },
//     });
//   },
// };

/*
 * Type definitions
 */
type OptionsProperties = {
  axis: 'x' | 'y' | 'all' | 'both';
  eventClass: {
    initial: string;
    usesHandle: string;
    handle: string;
    down: string;
    move: string;
  };
  handle: false | HTMLElementVNode;
};

type DragProperties = {
  size: number;
};

interface VNodeWithDrag extends VNode {
  dragProps: DragProperties;
}

interface HTMLElementVNode extends HTMLElement {
  __vnode: VNodeWithDrag
}

/*
 * Variables
 */
export const defaultOptions: OptionsProperties = {
  axis: 'all',
  eventClass: {
    initial: 'drag-draggable',
    usesHandle: 'drag-uses-handle',
    handle: 'drag-handle',
    down: 'drag-down',
    move: 'drag-move',
  },
  handle: false,
};

function objectDeepKeys(obj: any): string[] {
  return Object.keys(obj)
    .filter((key) => obj[key] instanceof Object)
    .map((key: string) => objectDeepKeys(obj[key]).map((k: string) => k))
    .reduce((x, y) => x.concat(y), Object.keys(obj));
}

console.log(objectDeepKeys(defaultOptions));

/**
 * Check if input is an object
 * @param input
 * @returns {boolean}
 */
export function isObject(input: any) {
  return (input && typeof input === 'object' && !Array.isArray(input));
}

/**
 * Deep merge two objects, throws error if there is
 * a key that is not availabe in `defaultOptions`
 *
 * @param target
 * @param ...sources
 */
export function deepMerge(target: any, ...sources: any): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else if (objectDeepKeys(defaultOptions).includes(key)) {
        Object.assign(target, { [key]: source[key] });
      } else {
        throw new Error(`"${key}" is not a valid option`);
      }
    }
  }

  return deepMerge(target, ...sources);
}

// const superReplace = (target: any, source: any) => {
//   const replace: any = {};

//   Object.keys(target).forEach((key) => {
//     if (source[key] !== undefined) {
//       if (Array.isArray(target[key])) {
//         replace[key] = source[key];
//       } else if (isObject(target[key]) && target[key] !== null) {
//         replace[key] = superReplace(target[key], source[key]);
//       } else {
//         replace[key] = source[key];
//       }
//     } else {
//       replace[key] = target[key];
//     }
//   });

//   return replace;
// };

/*
 * Plugin
 */
export default {
  install(app: App, options: OptionsProperties): void {
    // console.log('hello!');
    let count = 0;

    // console.log(options.eventClass);

    app.directive('drag', {
      // console.log('more hello');

      mounted(el: HTMLElementVNode, binding: DirectiveBinding): void {
        // Initialize 'drag' object in '__vnode'
        // Starting in v4, the data will no longer be stored in 'window',
        // but it will be attatch to the element on its '__vnode' property.
        el.__vnode.dragProps = {
          size: 0,
        };

        const { dragProps } = el.__vnode;
        // const definedOption;

        dragProps.size = count;

        // console.log(binding.value);

        // replace object values based on another object

        // First argument is an empty object to avoid modifying the original object
        const definedOptions = deepMerge({}, defaultOptions, binding.value);

        // console.log(el);
        // console.log(el.__vnode.children);
        // console.log(el);
        // console.log(binding);
      },

      updated(el: any, binding: any): void {
        const { dragProps } = el.__vnode;
        // console.log(count);

        // console.log(el.__vnode.drag.size);

        dragProps.size = count;

        console.warn(dragProps.size);
        // console.log(el);
        // console.log(binding);

        count += 1;
      },

    });
  },
};
