import { useResizeObserver } from "@vueuse/core";
import { Ref, computed, onMounted, ref } from "vue";
import { TableState } from "../../state";
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
  tableCenerHeader: Ref<HTMLElement | undefined>,
  tableState: Ref<TableState>,
) {
  useBBox(tableCenerHeader, (el) => {
    const { offsetWidth, scrollWidth } = el;
    tableState.value.viewport.width = offsetWidth;
    tableState.value.viewport.scrollWidth = scrollWidth;
  }); // 计算水平方向的宽度和滚动宽度;

  const maxXMove = computed(() => tableState.value.viewport.scrollWidth - tableState.value.viewport.width);

  onMounted(() => {
    if (!tableCenerHeader.value) return;

    tableCenerHeader.value.addEventListener("wheel", processWheel)
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
}

export function useTableBodyScroll(
  tableInnerBody: Ref<HTMLElement | undefined>,
  tableState: Ref<TableState>,
) {
  useBBox(tableInnerBody, (el) => {
    const { offsetHeight, scrollHeight } = el;
    tableState.value.viewport.height = offsetHeight;
    tableState.value.viewport.scrollHeight = scrollHeight;
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
  let wheelLock = false;

  const animationWheel = createLockedRequestAnimationFrame(($event: WheelEvent) => {
    const { deltaX, deltaY } = $event;

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
  });

  const processWheel = ($event: WheelEvent) => {
    $event.preventDefault();

    animationWheel($event);
  }

  onMounted(() => {
    if (!tableInnerBody.value) return;

    tableInnerBody.value.addEventListener("wheel", processWheel)
  })
}
