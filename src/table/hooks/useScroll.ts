import { useResizeObserver, useScroll } from "@vueuse/core";
import { ComponentInternalInstance, InjectionKey, Ref, computed, getCurrentInstance, inject, onMounted, provide, ref, watch } from "vue";
import { runIdleTask } from "../utils";

interface IScrollContext {
  // 横向滚动距离
  scrollLeft: Ref<number>;

  // 注册需要同步滚动的元素
  registerElement: (instance: ComponentInternalInstance, el: HTMLElement) => void;

  // 同步滚动
  syncScroll: (instance: ComponentInternalInstance | null) => void;
}

type BBox = {
  width: number;

  height: number;

  scrollWidth: number;

  scrollHeight: number;
}

export function useBBox(element: Ref<HTMLElement | undefined>) {
  const bbox = ref<BBox>({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  });

  useResizeObserver(element as any, (entities) => {
    const el = entities[0].target
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

const Horizontal_Scroll_Context_Key: InjectionKey<IScrollContext> = Symbol("__scroll_context_key__");

export function useHorizontalScrollProvide() {
  const syncElementWeakMap = new WeakMap<any, HTMLElement>();

  const scrollLeft = ref(0);

  function registerElement(instance: ComponentInternalInstance, el: HTMLElement) {
    syncElementWeakMap.set(instance, el);

    el.addEventListener("scroll", onScroll)
  }

  let scrollingElement: HTMLElement | null = null;

  let timer: number | null = null;

  const onScroll = function ($event: Event) {
    if (timer) {
      window.clearTimeout(timer);
    }

    scrollingElement = $event.currentTarget as HTMLElement;
    scrollLeft.value = scrollingElement.scrollLeft;

    timer = window.setTimeout(() => {
      scrollingElement = null;
    });
  }

  // 同步滚动条
  function syncScroll(instance: ComponentInternalInstance | null) {
    if (!instance) return;

    const element = syncElementWeakMap.get(instance)
    if (!element) return;

    if (scrollingElement && (element === scrollingElement || element.contains(scrollingElement))) {
      return;
    };
    const tempScrollLeft = scrollingElement?.scrollLeft;

    runIdleTask(() => {
      element.scrollTo({ left: tempScrollLeft ?? scrollLeft.value });
    });
  }


  provide(Horizontal_Scroll_Context_Key, {
    scrollLeft,
    registerElement,
    syncScroll
  });
}

export function useHorizontalScrollInject(syncElement: Ref<HTMLElement | undefined>) {
  const instance = getCurrentInstance();

  const {
    scrollLeft,
    registerElement,
    syncScroll
  } = inject(Horizontal_Scroll_Context_Key, { scrollLeft: ref(0), registerElement() { }, syncScroll() { } });

  const { bbox } = useBBox(syncElement);

  const scrollRange = computed(() => {
    const { scrollWidth, width } = bbox.value;
    return Math.max(0, scrollWidth - width)
  });

  watch(scrollLeft, () => syncScroll(instance));

  onMounted(() => {
    if (!instance || !syncElement.value) return;

    registerElement(instance, syncElement.value);
  })

  return {
    scrollLeft, scrollRange, bbox
  }
}

export function useVerticalScrollState(element: Ref<HTMLElement | undefined>) {
  const { y: scrollTop } = useScroll(element as any);

  const { bbox } = useBBox(element);

  return { scrollTop, bbox }
}
