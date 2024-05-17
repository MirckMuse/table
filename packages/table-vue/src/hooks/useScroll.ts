import { useResizeObserver } from "@vueuse/core";
import { throttle } from "lodash-es";
import { type Ref, computed, onMounted, ref } from "vue";
import { TableState } from "@scode/table-state";
import { createLockedRequestAnimationFrame, optimizeScrollXY } from "../utils";

type BBox = {
  width: number;

  height: number;

  scrollWidth: number;

  scrollHeight: number;
}

export function useBBox(
  element: Ref<HTMLElement | undefined>,
  callback?: (el: HTMLElement) => void
) {
  const bbox = ref<BBox>({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  });

  useResizeObserver(element as any, (entities) => {
    const el = entities[0].target

    callback?.(el as HTMLElement);
    const {
      clientWidth: width,
      clientHeight: height,
      scrollWidth,
      scrollHeight
    } = el;
    bbox.value = { width, height, scrollWidth, scrollHeight };
  });

  return { bbox }
}

export function useTableHeaderScroll(
  tableHeader: Ref<HTMLElement | undefined>,
  headerLeftRef: Ref<HTMLElement | undefined>,
  tableCenterHeader: Ref<HTMLElement | undefined>,
  headerRightRef: Ref<HTMLElement | undefined>,
  tableState: Ref<TableState>,
) {
  function immediateUpdateClientWidth() {
    const el = tableHeader.value;
    if (!el) return;

    tableState.value.viewport.set_width(el.offsetWidth);
    tableState.value.adjust_scroll();
  }

  const { bbox: headerLeftBBox } = useBBox(headerLeftRef);
  const { bbox: headerRightBBox } = useBBox(headerRightRef);

  useBBox(tableHeader, throttle(immediateUpdateClientWidth, 16)); // 计算水平方向的宽度和滚动宽度;

  const maxXMove = computed(() => tableState.value.viewport.get_content_width() - tableState.value.viewport.get_width());

  onMounted(() => {
    if (!tableCenterHeader.value) return;

    tableCenterHeader.value.addEventListener("wheel", processWheel, { passive: false });
  })

  const animationWheel = createLockedRequestAnimationFrame(($event: WheelEvent) => {
    const { deltaX } = $event;

    let { left: scrollLeft } = tableState.value.scroll;

    scrollLeft = Math.max(
      0,
      Math.min(scrollLeft + deltaX, maxXMove.value)
    );

    Object.assign(tableState.value.scroll, { left: scrollLeft });
  });

  function processWheel($event: WheelEvent) {
    $event.preventDefault();

    animationWheel($event);
  }

  return {
    headerLeftBBox,
    headerRightBBox
  }
}

export function useTableBodyScroll(
  tableInnerBody: Ref<HTMLElement | undefined>,
  tableState: Ref<TableState>,
  heightChangeCallback?: () => void
) {

  useBBox(tableInnerBody, (el) => {
    const { offsetHeight } = el;
    if (offsetHeight === tableState.value.viewport.get_height()) return;

    tableState.value.viewport.set_height(offsetHeight);
    tableState.value.adjust_scroll();
    heightChangeCallback?.()
  }); // 计算垂直

  // 处理 body 的滚动事件
  const throttleUpdateScroll = throttle((deltaX: number, deltaY) => {
    const [optimizeX, optimizeY] = optimizeScrollXY(deltaX, deltaY);
    tableState.value.updateScroll(optimizeX, optimizeY);
    tableState.value.adjust_scroll();
  }, 16);

  const processWheel = ($event: WheelEvent) => {
    $event.preventDefault();
    const { deltaX, deltaY } = $event;
    throttleUpdateScroll(deltaX, deltaY)
  }

  onMounted(() => {
    if (!tableInnerBody.value) return;

    tableInnerBody.value.addEventListener("wheel", processWheel, { passive: false })
  })
}

