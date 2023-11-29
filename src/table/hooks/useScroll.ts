import { ComponentInternalInstance, InjectionKey, Ref, getCurrentInstance, inject, onMounted, onUnmounted, provide, ref, watch } from "vue";
import { runIdleTask } from "../utils";

interface IScrollContext {
  // 横向滚动距离
  scrollLeft: Ref<number>;

  // 注册需要同步滚动的元素
  registerElement: (instance: ComponentInternalInstance, el: HTMLElement) => void;

  // 同步滚动
  syncScroll: (instance: ComponentInternalInstance | null) => void;
}

const Horizontal_Scroll_Context_Key: InjectionKey<IScrollContext> = Symbol("__scroll_context_key__");

const Scroll_Lock_Key = "__scroll_lock_key__";

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

type BBox = {
  width: number;

  height: number;

  scrollWidth: number;

  scrollHeight: number;
}

export function useHorizontalScrollInject(syncElement: Ref<HTMLElement | undefined>) {
  const instance = getCurrentInstance();

  const {
    scrollLeft,
    registerElement,
    syncScroll
  } = inject(Horizontal_Scroll_Context_Key, { scrollLeft: ref(0), registerElement() { }, syncScroll() { } });

  const bbox = ref<BBox>({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  });

  watch(scrollLeft, () => syncScroll(instance));

  onMounted(() => {
    if (!instance || !syncElement.value) return;

    registerElement(instance, syncElement.value);

    resizeObserver = new ResizeObserver((entities) => {
      const el = entities[0].target
      scrollRange.value = el.scrollWidth - el.clientWidth;

      bbox.value = {
        width: el.clientWidth,
        height: el.clientHeight,
        scrollWidth: el.scrollWidth,
        scrollHeight: el.scrollHeight,
      }
    })

    resizeObserver.observe(syncElement.value)
  })

  const scrollRange = ref(0);
  let resizeObserver: ResizeObserver | null = null;

  onUnmounted(() => {
    resizeObserver?.disconnect();

    if (syncElement.value) {
      resizeObserver?.unobserve(syncElement.value);
    }
    resizeObserver = null;
  })

  return {
    scrollLeft, scrollRange, bbox
  }
}

export function useVerticalScrollState(element: Ref<HTMLElement | undefined>) {
  const scrollTop = ref(0);

  const bbox = ref<BBox>({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  });

  let resizeObserver: ResizeObserver | null = null;

  function updateScrollTop($event: Event) {
    scrollTop.value = ($event.currentTarget as HTMLElement).scrollTop ?? 0;
  }

  onMounted(() => {
    if (!element.value) return;

    element.value.addEventListener('scroll', updateScrollTop);

    resizeObserver = new ResizeObserver((entities) => {
      const el = entities[0].target
      bbox.value = {
        width: el.clientWidth,
        height: el.clientHeight,
        scrollWidth: el.scrollWidth,
        scrollHeight: el.scrollHeight,
      }

      console.log(bbox.value)
    })

    resizeObserver.observe(element.value)
  });

  onUnmounted(() => {
    element.value?.removeEventListener('scroll', updateScrollTop);
    resizeObserver?.disconnect();
    if (element.value) {
      resizeObserver?.unobserve(element.value);
    }
    resizeObserver = null;
  })

  return { scrollTop, bbox }
}
