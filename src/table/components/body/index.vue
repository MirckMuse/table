<template>
  <div
    v-resize:height
    ref="bodyRef"
    class="s-table-body"
    :class="bodyClass"
    :style="bodyStyle"
  >
    <div
      class="s-table-body__inner"
      ref="bodyInnerRef"
      @mouseover="handleMouseenter"
      @mouseout="handleMouseleave"
    >
      <template v-if="!isEmpty">
        <div
          v-if="leftColumnsVisible"
          ref="bodyLeftRef"
          class="s-table-body__inner-fixedLeft s-table-fixedLeft"
          :class="{ 'shadow': scroll.left > 0 }"
          :style="leftStyle"
        >
          <body-rows
            :columns="leftColumns"
            v-bind="commonRowProps"
          />
        </div>

        <div
          ref="bodyCenterRef"
          class="s-table-body__inner-center"
          :style="centerStyle"
        >
          <body-rows
            :columns="centerColumns"
            v-bind="commonRowProps"
          />
        </div>

        <div
          v-if="rightColumnsVisible"
          ref="bodyRightRef"
          class="s-table-body__inner-fixedRight s-table-fixedRight"
          :class="{ 'shadow': scroll.left < maxXMove }"
          :style="rightStyle"
        >
          <body-rows
            :columns="rightColumns"
            v-bind="commonRowProps"
          />
        </div>
      </template>

      <div v-else class="s-table-body__empty">
        <AEmpty></AEmpty>
      </div>
    </div>

    <Scrollbar
      v-if="!isEmpty"
      :state="scrollState"
      :client="viewport.height"
      :content="viewport.scrollHeight"
      :scroll="scroll.top"
      :is-vertical="true"
    />

    <Scrollbar
      :state="scrollState"
      :client="viewport.width"
      :content="viewport.scrollWidth"
      :scroll="scroll.left"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  reactive, ref, shallowRef, StyleValue, watch, toRef
} from "vue";
import {OuterRowMeta} from "../../../state";
import {resize} from "../../directives";
import {useBBox, useStateInject, useTableBodyScroll} from "../../hooks";
import {RowData} from "../../typing";
import {px2Number} from "../../utils";
import Scrollbar from "../scrollbar/index.vue";
import BodyRows from "./rows.vue";
import {Empty as AEmpty} from "ant-design-vue"

export default defineComponent({
  name: "STableBody",

  directives: {
    resize
  },

  components: {
    BodyRows,
    Scrollbar,
    AEmpty
  },

  setup() {
    const {
      tableState,
      tableProps,
      slots: tableSlots,
      handleTooltipEnter,
      handleTooltipLeave,
      getRowKey
    } = useStateInject();

    const scrollState = computed(() => {
      const {
        mode = "always",
        position = "outer",
        size = 6
      } = tableProps.scroll ?? {};
      return {
        mode,
        position,
        size
      }
    })

    const dataSource = ref<RowData[]>([]);
    const gridTemplateRows = computed(() => {
      return tableState.value.getViewportHeightList(dataSource.value).map(height => height + 'px').join(" ");
    })

    const leftColumns = computed(() => tableState.value.dfsFixedLeftFlattenColumns)
    const leftColumnsVisible = computed(() => leftColumns.value.length);
    const leftStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
      const {top: scrollTop} = scroll.value;
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
      style.transform = `translateY(${-scrollTop}px)`
      style.gridTemplateRows = gridTemplateRows.value;
      return style;
    });

    function createGetCellPadding() {
      const padding = {
        top: -1,
        bottom: -1
      }

      return function (el: HTMLElement) {
        if (padding.top >= 0 && padding.bottom >= 0) {
          return padding;
        }
        const {paddingTop, paddingBottom} = window.getComputedStyle(el)
        padding.top = px2Number(paddingTop);
        padding.bottom = px2Number(paddingBottom);
        return padding;
      }
    }

    const getCellPadding = createGetCellPadding();

    onUpdated(() => {
      const innserElements = (bodyRef.value?.querySelectorAll(".s-table-body-cell-inner") ?? []) as HTMLElement[];
      const metas: OuterRowMeta[] = [];
      for (const element of innserElements) {
        const cellElement = element.parentElement as HTMLElement;
        const {top, bottom} = getCellPadding(cellElement)
        const {rowKey} = cellElement.dataset
        metas.push({
          // 以行的索引作为 key 值。
          rowKey: rowKey!,
          height: Math.floor(element.getBoundingClientRect().height) + top + bottom
        })
      }
      tableState.value.updateRowMetas(metas);
    });

    const rightColumns = computed(() => tableState.value.dfsFixedRightFlattenColumns);
    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => {
      const style: StyleValue = {};
      const {top: scrollTop} = scroll.value;
      style.transform = `translateY(${-scrollTop}px)`;
      style.gridTemplateRows = gridTemplateRows.value;
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
      return style;
    });

    const bodyRef = ref<HTMLElement>();
    const bodyInnerRef = shallowRef<HTMLElement>();

    const viewport = toRef(tableState.value, 'viewport');
    const scroll = toRef(tableState.value, 'scroll');

    const bodyClass = computed(() => {
      const clas: string[] = [];
      if (scrollState.value.mode === "hover") {
        clas.push("s-table-body__scrollbar-hover")
      }
      return clas;
    });
    const bodyStyle = computed(() => {
      return {};
    });

    watch(
      () => [
        tableState.value.scroll.top,
        tableState.value.rowStateCenter.flattenRowKeys
      ],
      () => {
        dataSource.value = tableState.value.getViewportDataSource()
      }
    );

    onMounted(() => {
      setTimeout(() => {
        dataSource.value = tableState.value.getViewportDataSource()
      })
    })


    const bodyLeftRef = shallowRef<HTMLElement>();
    const bodyRightRef = shallowRef<HTMLElement>();
    const bodyCenterRef = shallowRef<HTMLElement>();

    const {bbox: bodyLeftBBox} = useBBox(bodyLeftRef);
    const {bbox: bodyRightBBox} = useBBox(bodyRightRef);

    useTableBodyScroll(bodyInnerRef, tableState);

    const centerColumns = computed(() => tableState.value.dfsCenterFlattenColumns);
    const centerStyle = computed(() => {
      const style: StyleValue = {}
      style.paddingLeft = (bodyLeftBBox.value?.width ?? 0) + 'px'
      style.paddingRight = (bodyRightBBox.value?.width ?? 0) + 'px'
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
      style.gridTemplateRows = gridTemplateRows.value;
      const {left: scrollLeft, top: scrollTop} = scroll.value;
      style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`
      return style;
    });

    function handleMouseenter($event: MouseEvent) {
      let target: HTMLElement | null = $event.target as HTMLElement;

      while (target) {
        if (target.dataset.type === "cell") {
          const {rowIndex, rowKey, colKey} = target.dataset;
          tableState.value.hoverState = {
            rowIndex: Number(rowIndex),
            rowKey: rowKey ?? "",
            colKey: colKey ?? ""
          }

          handleTooltipEnter(target)
          return;
        }
        target = target.parentElement;
      }
    }

    function handleMouseleave($event: MouseEvent) {
      tableState.value.hoverState = {rowIndex: -1, colKey: "", rowKey: -1}
      handleTooltipLeave($event)
    }

    const maxXMove = computed(() => viewport.value.scrollWidth - viewport.value.width);

    // 通用，需要向下传递的属性
    const commonRowProps = reactive({
      dataSource: dataSource,
      getRowKey: getRowKey,
      transformCellText: tableProps.transformCellText,
      bodyCell: tableSlots.bodyCell
    })

    return {
      scroll, scrollState, viewport, maxXMove,

      dataSource,

      bodyRef, bodyInnerRef, bodyClass, bodyStyle,

      bodyLeftRef, leftColumns, leftColumnsVisible, leftStyle,

      bodyRightRef, rightColumns, rightColumnsVisible, rightStyle,

      centerColumns, centerStyle, bodyCenterRef,

      handleMouseenter, handleMouseleave,

      isEmpty: computed(() => {
        return !tableState.value.isEmpty()
      }),

      commonRowProps,
    }
  }
});
</script>

<style lang="less" scoped>

.s-table-body {
  position: relative;
  transform: translateZ(0);

  &__scrollbar-vertical {
    position: fixed;
    display: inline-block;
    height: 100%;
    width: 4px;
    background-color: red;
    top: 0;
    right: 0;
  }
}

.s-table-body__inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }

  &-fixedLeft {
    z-index: 1;
  }

  &-fixedLeft,
  &-center,
  &-fixedRight {
    display: grid;
  }

  &-center {
    overflow: hidden;
    width: 100%;
    min-width: fit-content;
  }
}
</style>

<style lang="less">
.s-table-body {

  &__scrollbar-hover {
    &:hover > .s-table-scroll__track {
      opacity: 1;
    }

    > .s-table-scroll__track {
      opacity: 0;
      transition: opacity .16s cubic-bezier(0, .5, 1, .5);
    }
  }

  &__empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}</style>