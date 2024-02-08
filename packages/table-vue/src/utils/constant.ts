import type { ExpandIconSlot } from "../typing";
import { h } from "vue";
import { RiArrowRightSFill, RiArrowDownSFill } from "@remixicon/vue"

// 展开列的标志位
export const EXPAND_COLUMN: Readonly<{}> = Object.freeze({});


function createSlotMap() {
  const map = new WeakMap<any, string>();
  map.set(EXPAND_COLUMN, "expandIcon");
  return map;
}

export const SlotMap = createSlotMap();

const ExpandIconPrefixClass = "s-table-row-expand-icon"

const Expand_Space = h("span", { class: [ExpandIconPrefixClass, `${ExpandIconPrefixClass}-space`] })

// 渲染展开图表的函数
export const renderExpandIcon: ExpandIconSlot = ({
  record,
  expanded,
  expandable,
  onExpand
}) => {
  if (!expandable) {
    return Expand_Space;
  }
  function handleExpandIconClick($event: MouseEvent) {
    $event.stopPropagation();
    onExpand($event, record)
  }

  const expandIcon = expanded ? RiArrowDownSFill : RiArrowRightSFill

  const expandClass = [ExpandIconPrefixClass];

  if (expanded) {
    expandClass.push(ExpandIconPrefixClass + "__expand")
  } else {
    expandClass.push(ExpandIconPrefixClass + "__shrink")
  }


  return h('span', { class: expandClass, onClick: handleExpandIconClick }, h(expandIcon))
}
