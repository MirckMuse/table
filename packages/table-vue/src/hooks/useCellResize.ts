import type { InjectionKey, Ref } from "vue";
import { provide, inject, onMounted, onUnmounted } from "vue";
import { useStateInject } from "./useState";

const ResizeObserverSymbol: InjectionKey<ResizeObserver | null> = Symbol("__resizeObserver__");

export function useBodyCellResiseProvide() {
  useStateInject();

  let resizeObserver: ResizeObserver | null = new ResizeObserver((entries) => {
  });


  provide(ResizeObserverSymbol, resizeObserver);

  onUnmounted(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
  })
}

export function useBodyCellResizeInject(innerCell: Ref<HTMLElement | undefined>) {
  const observe = inject(ResizeObserverSymbol);
  onMounted(() => {
    if (!innerCell.value) return;

    observe?.observe(innerCell.value)
  })

  onUnmounted(() => {
    if (!innerCell.value) return;

    observe?.unobserve(innerCell.value)
  })
}