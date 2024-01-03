import { provide, inject, onMounted, onUnmounted, InjectionKey, Ref } from "vue";
import { useStateInject } from "./useState";
import { px2Number } from "../utils";
import { CellMeta } from "../../state";

const ResizeObserverSymbol: InjectionKey<ResizeObserver | null> = Symbol("__resizeObserver__");

export function useBodyCellResiseProvide() {
  const { tableState } = useStateInject();

  let resizeObserver: ResizeObserver | null = new ResizeObserver((entries) => {
    const cellMetas = entries.reduce<CellMeta[]>((metas, entry) => {
      const { target, contentRect } = entry;
      const cell = target.parentElement!
      const { paddingTop, paddingBottom } = getComputedStyle(cell);
      const { colKey, rowIndex } = cell.dataset

      metas.push({
        // 以行的索引作为 key 值。
        colKey: colKey ?? "",
        rowIndex: rowIndex ? Number(rowIndex) : -1,
        height: Math.floor(contentRect.height) + px2Number(paddingTop) + px2Number(paddingBottom)
      })

      return metas;
    }, []);

    
    // TODO: 单元格调整后，这里需要更行列宽和行高
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