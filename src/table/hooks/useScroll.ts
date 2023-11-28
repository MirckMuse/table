
import { inject, provide, ref, getCurrentInstance, onMounted, InjectionKey, Ref, ComponentInternalInstance, watch } from "vue";
import { throttle } from "lodash-es"

interface IScrollContext {
  scrollLeft: Ref<number>;

  registerElement: (instance: ComponentInternalInstance, el: HTMLElement) => void;

  syncScroll: (instance: ComponentInternalInstance | null) => void;
}

const Scroll_Context_Key: InjectionKey<IScrollContext> = Symbol("__scroll_context_key__");

const SCROLL_LOCK_KEY = "__scroll_lock_key__";

export function useScrollProvide() {
  const syncElementWeakMap = new WeakMap<any, HTMLElement>();

  const scrollLeft = ref(0);

  function registerElement(instance: ComponentInternalInstance, el: HTMLElement) {
    syncElementWeakMap.set(instance, el);

    el.addEventListener("wheel", onWheel)
  }


  let scrollingElement: HTMLElement | null = null;

  let timer: number | null = null;

  const onWheel = function ($event: WheelEvent) {
    if (timer) {
      window.clearTimeout(timer);
    }

    const { deltaX } = $event;
    scrollingElement = $event.currentTarget as HTMLElement;
    scrollLeft.value = Math.max(
      0,
      Math.min(scrollLeft.value + deltaX, scrollingElement.scrollWidth - scrollingElement.clientWidth)
    );

    timer = window.setTimeout(() => {
      scrollingElement = null;
    });
  }

  // 同步滚动条
  function syncScroll(instance: ComponentInternalInstance | null) {
    if (!instance) return;

    const element = syncElementWeakMap.get(instance)
    if (!element) return;

    if ((element === scrollingElement || element.contains(scrollingElement))) {
      return;
    };

    window.requestAnimationFrame(() => {
      element.scrollTo({ left: scrollLeft.value });
    });
  }


  provide(Scroll_Context_Key, {
    scrollLeft,
    registerElement,
    syncScroll
  });
}

export function useScrollInject(syncElement: Ref<HTMLElement | undefined>) {
  const instance = getCurrentInstance();

  const {
    scrollLeft,
    registerElement,
    syncScroll
  } = inject(Scroll_Context_Key, { scrollLeft: ref(0), registerElement() { }, syncScroll() { } });

  watch(scrollLeft, () => syncScroll(instance));

  onMounted(() => {
    if (!instance || !syncElement.value) return;

    registerElement(instance, syncElement.value);
  })
}
