<template>
  <div
    ref="rootRef" 
    class="s-table-header-cell-resizeHolder"
    :class="{ dragging: isDragging }"
    @mousedown="handleMousedown"
  >
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from "@stable/table-typing";
import type { PropType } from "vue";

import { isNaN } from "lodash-es";
import { computed, ref, shallowRef } from "vue";
import { useStateInject } from "../../hooks";
import { type AddEventListenerHandle, addEventListener } from "../../utils";

const props = defineProps({
  column: { type: Object as PropType<TableColumn>, required: true }
});

const {
  handleResizeColumn
} = useStateInject();

type EventName = {
  start: keyof HTMLElementEventMap;
  move: keyof HTMLElementEventMap;
  stop: keyof HTMLElementEventMap;
}

const MouseEventName: EventName = {
  start: "mousedown",
  move: "mousemove",
  stop: "mouseup"
};

// const TouchEventName: EventName = {
//   start: "touchstart",
//   move: "touchmove",
//   stop: "touchend"
// };

const rootRef = shallowRef<HTMLElement>();

const isDragging = ref(false);

let dragMoveHandle: AddEventListenerHandle | null = null;
let dragEndHandle: AddEventListenerHandle | null = null;
let parentOffsetWidth = 0;
let startX = 0;
const minWidth = computed(() => {
  const { minWidth: _minWidth } = props.column ?? {};
  return "number" != typeof _minWidth || isNaN(_minWidth) ? 50 : _minWidth;
})

const maxWidth = computed(() => {
  const { maxWidth: _maxWidth } = props.column ?? {};

  return "number" != typeof _maxWidth || isNaN(_maxWidth) ? Infinity : _maxWidth;
})

function createResizeHandle($event: MouseEvent, eventNameMap: EventName) {
  $event.stopPropagation?.();
  destory();
  document.body.style.cursor = "col-resize";
  isDragging.value = true;
  parentOffsetWidth = rootRef.value?.parentElement?.offsetWidth ?? 0;

  startX = $event.pageX;
  dragMoveHandle = addEventListener(document.documentElement, eventNameMap.move, handleDragMove);
  dragEndHandle = addEventListener(document.documentElement, eventNameMap.stop, handleDragEnd)
}

function processDrag($event: DragEvent) {
  let pageX = $event.pageX ?? 0;
  pageX = Math.min(pageX, window.screen.availWidth)
  const offsetX = startX - pageX;
  const adjustedWidth = Math.min(
    Math.max(parentOffsetWidth - offsetX, minWidth.value),
    maxWidth.value,
  );

  handleResizeColumn(adjustedWidth, props.column)
}

function handleDragMove($event: DragEvent) {
  processDrag($event);
}

function handleDragEnd($event: DragEvent) {
  isDragging.value = false;
  destory();
  processDrag($event);
  document.body.style.cursor = "default";
}

function destory() {
  dragMoveHandle?.remove();
  dragEndHandle?.remove();
}

function handleMousedown($event: MouseEvent) {
  createResizeHandle($event, MouseEventName)
}
</script>

<style lang="less" scoped>
.s-table-header-cell-resizeHolder {
  position: absolute;
  width: var(--table-resize-holder-width);
  height: 100%;
  top: 0;
  right: 0;
  transform: translateX(50%);
  z-index: 1;
  cursor: col-resize;

  &:hover::after {
    display: block;
  }

  &::after {
    display: none;
    position: absolute;
    height: 100%;
    width: var(--table-resize-holder-line-width);
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    content: "";
    background-color: var(--table-resize-holder-color);
  }
}

.s-table-header-cell-resizeHolder.dragging::after {
  display: block;
}
</style>