import {
  Transition,
  createBaseVNode,
  createBlock,
  createElementBlock,
  createVNode,
  defineComponent,
  openBlock,
  popScopeId,
  pushScopeId,
  renderSlot,
  resolveComponent,
  vShow,
  withCtx,
  withDirectives
} from "./chunk-6VGCA36B.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@vitepress-demo+components@1.0.7_vue@3.4.21/node_modules/@vitepress-demo/components/dist/index.js
(function() {
  "use strict";
  try {
    if (typeof document < "u") {
      var e = document.createElement("style");
      e.appendChild(document.createTextNode(".demo[data-v-b16f1177]{background-color:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);border-radius:10px;margin-bottom:1.2em;transition:background-color .5s ease}.demo p[data-v-b16f1177]{margin:0}.demo button[data-v-b16f1177]{background-color:var(--vp-c-bg-mute);border:1px solid var(--vp-c-divider);border-radius:10px;font-size:.9em;font-weight:600;transition:background-color .5s ease}.demo button+button[data-v-b16f1177]{margin-left:6px}.demo-header[data-v-b16f1177]{position:relative}.demo-header-prefix[data-v-b16f1177]{margin-left:20px;margin-right:20px;margin-top:18px}.demo-header-prefix-title[data-v-b16f1177]{font-size:1.1em;font-weight:700;margin-bottom:10px}.demo-header-prefix-desc[data-v-b16f1177]{font-size:.9em}.demo-header-suffix[data-v-b16f1177]{position:absolute;display:flex;top:-6px;right:10px}.fade-enter-active[data-v-b16f1177],.fade-leave-active[data-v-b16f1177]{transition:opacity .25s ease}.fade-enter-from[data-v-b16f1177],.fade-leave-to[data-v-b16f1177]{opacity:0}.demo-copy-button[data-v-b16f1177],.demo-code-button[data-v-b16f1177]{width:40px;height:40px;display:flex;justify-content:center;align-items:center}.demo-copy-icon[data-v-b16f1177],.demo-copied-icon[data-v-b16f1177]{width:20px;height:20px}.demo-code-icon[data-v-b16f1177],.demo-code-slash-icon[data-v-b16f1177]{width:17px;height:17px}.demo-content[data-v-b16f1177]{margin-top:20px;margin-bottom:18px}.demo-footer div[class*=language-]{background-color:var(--vp-c-bg-elv);border-radius:8px;margin:3px;box-shadow:var(--vp-shadow-1)}.dark .demo-footer div[class*=language-]{background-color:var(--vp-c-bg-alt);box-shadow:none}")), document.head.appendChild(e);
    }
  } catch (a) {
    console.error("vite-plugin-css-injected-by-js", a);
  }
})();
var k = defineComponent({
  name: "Demo",
  props: {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    highlight: {
      type: String,
      required: true
    }
  },
  computed: {
    decodeTitle() {
      return decodeURIComponent(this.title);
    },
    decodeDesc() {
      return decodeURIComponent(this.desc);
    },
    decodeLang() {
      return decodeURIComponent(this.lang);
    },
    decodeCode() {
      return decodeURIComponent(this.code);
    },
    decodeHighlight() {
      return decodeURIComponent(this.highlight);
    }
  },
  methods: {
    copyCode() {
      try {
        navigator.clipboard.writeText(this.decodeCode);
      } catch (e) {
        console.log(e);
      }
      this.copied = true, setTimeout(() => {
        this.copied = false;
      }, 2e3);
    }
  },
  data() {
    return {
      hover: false,
      copied: false,
      fold: false
    };
  }
});
var y = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [r, a] of t)
    l[r] = a;
  return l;
};
var i = (e) => (pushScopeId("data-v-b16f1177"), e = e(), popScopeId(), e);
var A = { class: "demo-header" };
var x = { class: "demo-header-prefix" };
var H = ["innerHTML"];
var z = ["innerHTML"];
var L = { class: "demo-content" };
var T = { class: "demo-header-suffix" };
var S = {
  key: 0,
  class: "demo-copied-icon"
};
var I = i(() => createBaseVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  viewBox: "0 0 20 20"
}, [
  createBaseVNode("g", { fill: "none" }, [
    createBaseVNode("path", {
      d: "M7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5v4.707a5.48 5.48 0 0 0-1-.185V4.5a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h4.1c.183.358.404.693.657 1H5.5A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3h1.585zM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM19 14.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0zm-2.146-1.854a.5.5 0 0 0-.708 0L13.5 15.293l-.646-.647a.5.5 0 0 0-.708.708l1 1a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0 0-.708z",
      fill: "currentColor"
    })
  ])
], -1));
var $ = [
  I
];
var b = {
  key: 1,
  class: "demo-copy-icon"
};
var B = i(() => createBaseVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  viewBox: "0 0 20 20"
}, [
  createBaseVNode("g", { fill: "none" }, [
    createBaseVNode("path", {
      d: "M7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3h1.585zM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM7.085 4H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1z",
      fill: "currentColor"
    })
  ])
], -1));
var q = [
  B
];
var D = {
  key: 0,
  class: "demo-code-icon"
};
var R = i(() => createBaseVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  viewBox: "0 0 512 512"
}, [
  createBaseVNode("path", {
    d: "M160 389a20.91 20.91 0 0 1-13.82-5.2l-128-112a21 21 0 0 1 0-31.6l128-112a21 21 0 0 1 27.66 31.61L63.89 256l109.94 96.19A21 21 0 0 1 160 389z",
    fill: "currentColor"
  }),
  createBaseVNode("path", {
    d: "M352 389a21 21 0 0 1-13.84-36.81L448.11 256l-109.94-96.19a21 21 0 0 1 27.66-31.61l128 112a21 21 0 0 1 0 31.6l-128 112A20.89 20.89 0 0 1 352 389z",
    fill: "currentColor"
  }),
  createBaseVNode("path", {
    d: "M208 437a21 21 0 0 1-20.12-27l96-320a21 21 0 1 1 40.23 12l-96 320A21 21 0 0 1 208 437z",
    fill: "currentColor"
  })
], -1));
var U = [
  R
];
var O = {
  key: 1,
  class: "demo-code-slash-icon"
};
var V = i(() => createBaseVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  viewBox: "0 0 512 512"
}, [
  createBaseVNode("path", {
    d: "M160 389a20.91 20.91 0 0 1-13.82-5.2l-128-112a21 21 0 0 1 0-31.6l128-112a21 21 0 0 1 27.66 31.61L63.89 256l109.94 96.19A21 21 0 0 1 160 389z",
    fill: "currentColor"
  }),
  createBaseVNode("path", {
    d: "M352 389a21 21 0 0 1-13.84-36.81L448.11 256l-109.94-96.19a21 21 0 0 1 27.66-31.61l128 112a21 21 0 0 1 0 31.6l-128 112A20.89 20.89 0 0 1 352 389z",
    fill: "currentColor"
  })
], -1));
var E = [
  V
];
var N = ["innerHTML"];
function j(e, t, l, r, a, F) {
  const v = resolveComponent("ClientOnly");
  return openBlock(), createBlock(v, null, {
    default: withCtx(() => [
      createBaseVNode("div", {
        class: "demo",
        onMouseover: t[2] || (t[2] = (d) => e.hover = true),
        onMouseleave: t[3] || (t[3] = (d) => e.hover = false)
      }, [
        createBaseVNode("div", A, [
          createBaseVNode("div", x, [
            createBaseVNode("div", {
              class: "demo-header-prefix-title",
              innerHTML: e.decodeTitle
            }, null, 8, H),
            createBaseVNode("div", {
              class: "demo-header-prefix-desc",
              innerHTML: e.decodeDesc
            }, null, 8, z),
            createBaseVNode("div", L, [
              renderSlot(e.$slots, "default", {}, void 0, true)
            ])
          ]),
          createVNode(Transition, { name: "fade" }, {
            default: withCtx(() => [
              withDirectives(createBaseVNode("div", T, [
                createBaseVNode("button", {
                  class: "demo-copy-button",
                  onClick: t[0] || (t[0] = (...d) => e.copyCode && e.copyCode(...d))
                }, [
                  e.copied ? (openBlock(), createElementBlock("div", S, $)) : (openBlock(), createElementBlock("div", b, q))
                ]),
                createBaseVNode("button", {
                  class: "demo-code-button",
                  onClick: t[1] || (t[1] = (d) => {
                    e.fold = !e.fold;
                  })
                }, [
                  e.fold ? (openBlock(), createElementBlock("div", D, U)) : (openBlock(), createElementBlock("div", O, E))
                ])
              ], 512), [
                [vShow, e.hover || e.copied]
              ])
            ]),
            _: 1
          })
        ]),
        withDirectives(createBaseVNode("div", {
          class: "demo-footer",
          innerHTML: e.decodeHighlight
        }, null, 8, N), [
          [vShow, e.fold]
        ])
      ], 32)
    ]),
    _: 3
  });
}
var J = y(k, [["render", j], ["__scopeId", "data-v-b16f1177"]]);
export {
  J as Demo
};
//# sourceMappingURL=@vitepress-demo_components.js.map
