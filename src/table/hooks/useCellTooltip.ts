import { computePosition, flip, shift, offset } from "@floating-ui/dom";
import { App, Transition, createApp, defineComponent, h, onUnmounted } from "vue";

// 判断node是否为文本节点
function isText(node: Node) {
  return node.nodeType === 3;
}

function isComment(node: Node) {
  return node.nodeType === 8;
}

// node列表有且只有一个text节点
function onlyHasOneTextNode(el: Element | null): Text | null {
  if (!el) return null;

  const nodes = Array.from(el.childNodes).filter(node => !isComment(node) && (isText(node) && node.textContent))

  if (nodes.length === 1 && isText(nodes[0])) {
    return nodes[0] as Text;
  }

  return null;
}

function createTooltipWrapper() {
  const wrapper = document.createElement("div");
  wrapper.className = "s-table-tooltip-wrapper ant-popover";
  document.body.appendChild(wrapper);

  onUnmounted(() => {
    document.body.removeChild(wrapper);
  })

  return wrapper;
}

const PrefixClass = "s-table-tooltip"

function isEllipsis(element: HTMLElement) {
  const {
    width, height
  } = element.getBoundingClientRect();

  const { scrollWidth, scrollHeight } = element;

  return width < scrollWidth || height < scrollHeight;
}

// 获取文本节点中的文本
function getText(text: Text) {
  return text.wholeText ?? "";
}

const TooltipArrowVNode = h(
  "div",
  { class: `${PrefixClass}-arrow ant-popover-arrow` },
  h("span", { class: `${PrefixClass}-arrow-content ant-popover-arrow-content` })
)

// 延迟时间
const Default_Delay = 500;

const STableTooltip = defineComponent({
  name: "STableTooltip",

  props: {
    content: { type: String },
  },

  setup(props) {
    return () => {
      const innerVNode = h('div', { class: `${PrefixClass}-inner ant-popover-inner` }, props.content)
      return h('div', { class: `${PrefixClass}-inner-content ant-popover-content` }, [innerVNode, TooltipArrowVNode])
    }
  }
})

interface ICellTooltipOption {
  tooltipVisible?: (el: HTMLElement) => boolean;

  // 单位毫秒
  mouseEnterDelay?: number;

  // 单位毫秒
  mouseLeaveDelay?: number;
}

export function useCellTooltip(option: ICellTooltipOption) {
  const {
    tooltipVisible = () => true,
    mouseEnterDelay = Default_Delay,
    mouseLeaveDelay = Default_Delay,
  } = option;

  const wrapper = createTooltipWrapper();
  let app: App | null = null;

  let preMountTooltipWrapper: HTMLElement | null = null;
  function handleTooltipOpen(target: HTMLElement, text: string) {
    preMountTooltipWrapper = target;

    app = createApp({
      render() {
        return h(STableTooltip, { content: text })
      }
    })
    app.mount(wrapper);

    computePosition(preMountTooltipWrapper, wrapper, {
      placement: "top-start",
      middleware: [
        flip(),
        shift(),
        offset(-12)
      ]
    }).then(({ x, y }) => {
      Object.assign(wrapper.style, {
        left: `${x}px`,
        top: `${y}px`
      })
    })
  }

  function handleTooltipClose($event: MouseEvent | null) {
    preMountTooltipWrapper = ($event?.target as HTMLElement) ?? null;
    app?.unmount()
  }

  let openTooltipTimeout: number | null = null;
  let closeTooltipTimeout: number | null = null;
  wrapper.addEventListener("mouseenter", () => {
    console.log(closeTooltipTimeout)
    if (closeTooltipTimeout) {
      window.clearTimeout(closeTooltipTimeout)
    }
  })
  wrapper.addEventListener('mouseleave', () => {
    closeTooltipTimeout = window.setTimeout(() => handleTooltipClose(null), mouseLeaveDelay)
  })

  function handleTooltipEnter(cellEl: HTMLElement) {
    if (!tooltipVisible?.(cellEl)) return;
    const inner = cellEl.querySelector('.s-table-body-cell-inner') as HTMLElement;
    if (!inner) return;

    const text = onlyHasOneTextNode(inner);

    if (!text) return;
    if (!isEllipsis(inner)) return;

    openTooltipTimeout && window.clearTimeout(openTooltipTimeout);
    openTooltipTimeout = window.setTimeout(() => handleTooltipOpen(cellEl, getText(text)), mouseEnterDelay)
  }

  function handleTooltipLeave($event: MouseEvent) {
    closeTooltipTimeout = window.setTimeout(() => handleTooltipClose($event), mouseLeaveDelay)
  }

  return {
    handleTooltipEnter,
    handleTooltipLeave
  }
}