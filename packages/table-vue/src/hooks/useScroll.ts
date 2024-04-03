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

    const { offsetWidth } = el;

    tableState.value.viewport.width = offsetWidth;
    tableState.value.updateScroll();
  }

  const { bbox: headerLeftBBox } = useBBox(headerLeftRef);
  const { bbox: headerRightBBox } = useBBox(headerRightRef);

  useBBox(tableHeader, throttle(immediateUpdateClientWidth, 16)); // 计算水平方向的宽度和滚动宽度;

  const maxXMove = computed(() => tableState.value.viewport.scrollWidth - tableState.value.viewport.width);

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
) {
  useBBox(tableInnerBody, (el) => {
    const { offsetHeight } = el;
    tableState.value.viewport.height = offsetHeight;
    tableState.value.updateScroll();
  }); // 计算垂直

  const maxMove = computed(() => {
    const {
      width,
      height,
      scrollHeight,
      scrollWidth
    } = tableState.value.viewport;


    return {
      x: Math.max(0, scrollWidth - width),
      y: Math.max(0, scrollHeight - height),
    }
  });
  const throttleUpdateScroll = throttle((deltaX: number, deltaY) => {
    const [optimizeX, optimizeY] = optimizeScrollXY(deltaX, deltaY);
    let {
      left: scrollLeft,
      top: scrollTop
    } = tableState.value.scroll;

    scrollTop = Math.max(
      0,
      Math.min(scrollTop + optimizeY, maxMove.value.y)
    );
    scrollLeft = Math.max(
      0,
      Math.min(scrollLeft + optimizeX, maxMove.value.x)
    );

    Object.assign(tableState.value.scroll, {
      left: scrollLeft,
      top: scrollTop
    });
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

