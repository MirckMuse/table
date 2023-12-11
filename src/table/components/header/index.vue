<template>
  <div
    red="headerRef"
    class="s-table-header"
    :class="headerClass"
    :style="headerStyle"
  >
    <div class="s-table-header__inner">
      <div
        ref="headerCenterRef"
        class="s-table-header__inner-center"
        :style="centerStyle"
      >
        <header-cells :columns="centerColumns" :flatten-columns="centerFlattenColumns" type="center" />
      </div>

      <div 
        v-if="leftColumnsVisible" 
        class="s-table-header__inner-fixedLeft s-table-fixedLeft" 
        :class="{ 'shadow': scroll.left > 0 }"
        :style="leftStyle"
        ref="headerLeftRef"
      >
        <header-cells :columns="leftColumns" :flatten-columns="leftFlattenColumns" />
      </div>
      <div 
        v-if="rightColumnsVisible" 
        class="s-table-header__inner-fixedRight s-table-fixedRight" 
        :class="{ 'shadow': scroll.left < maxXMove }"
        :style="rightStyle"
        ref="headerRightRef"
      >
        <header-cells :columns="rightColumns" :flatten-columns="rightFlattenColumns" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StyleValue, computed, defineComponent, shallowRef } from "vue";
import { useStateInject, useTableHeaderScroll } from "../../hooks";
import HeaderCells from "./cells.vue";
import { TableColumn, TableColumnMeta } from "../../typing";
import { isNestColumn } from "../../utils";

export default defineComponent({
  name: "STableHeader",

  components: {
    HeaderCells
  },

  setup() {
    const {
      tableState
    } = useStateInject();

    const headerCenterRef = shallowRef<HTMLElement>();

    const headerRef = shallowRef<HTMLElement>();
    const headerLeftRef = shallowRef<HTMLElement>();
    const headerRightRef = shallowRef<HTMLElement>();

    useTableHeaderScroll(
      headerCenterRef,
      tableState
    );

    const headerClass = computed(() => {
      return [];
    });
    const headerStyle = computed(() => {
      return {};
    });

    const leftColumns = computed(() => tableState.value.fixedLeftColumns ?? []);
    const leftFlattenColumns = computed(() => {
      // 渲染列，需要考虑表头嵌套的情况
      return bfsFlattenColumns<TableColumn>(leftColumns.value ?? [], flattenColumnCallback);
    })
    const leftColumnsVisible = computed(() => leftColumns.value.length);
    const leftStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
      style.gridTemplateColumns = leftColumns.value.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });

    function bfsFlattenColumns<T>(columns: TableColumn[], callback: (column: TableColumn) => T): T[] {
      let stack = ([] as TableColumn[]).concat(columns);

      const result: T[] = [];
      while (stack.length) {
        const column = stack.shift()!;

        if (isNestColumn(column)) {
          stack = stack.concat(column.children ?? []);
        } else {
          column._s_meta = { isLast: true }
        }

        result.push(callback(column));
      }

      return result;
    }

    function flattenColumnCallback(column: TableColumn) {
      const meta: TableColumnMeta = column._s_meta || {};
      if (column._s_parent) {
        meta.deep = (column._s_parent._s_meta?.deep ?? 0) + 1;
      } else {
        meta.deep = 1;
      }
      column._s_meta = meta;
      return column;
    }

    function updateFlattenColumnsMeta(columns: TableColumn[], maxDeep: number = 1) {
      function _updateMeta(column: TableColumn) {
        column._s_meta = column._s_meta || {};
        if (column._s_meta?.isLast) {
          column._s_meta.rowSpan = maxDeep - (column._s_meta?.deep ?? 1) + 1;
          column._s_meta.colSpan = column._s_meta.colSpan ?? 1;

          let parent = column._s_parent;

          while (parent) {
            parent._s_meta = parent._s_meta || {};
            parent._s_meta.colSpan = parent.children?.reduce((colSpan, col) => colSpan + (col._s_meta?.colSpan ?? 1), 0);
            parent = parent._s_parent;
          }
        } else {
          column._s_meta.rowSpan = 1;
        }
      }

      for (const column of columns) {
        _updateMeta(column);
      }

      console.log(columns)

      return columns;
    }

    const centerColumns = computed(() => tableState.value.columns ?? []);

    function getMaxDeep(columns: TableColumn[]) {
      return columns.reduce((maxDeep, column) => Math.max(maxDeep, column._s_meta?.deep ?? -Infinity), -Infinity);
    }

    const centerFlattenColumns = computed(() => {
      const flattenColumns = bfsFlattenColumns<TableColumn>(centerColumns.value ?? [], flattenColumnCallback);

      const maxDeep = getMaxDeep(flattenColumns);

      // 渲染列，需要考虑表头嵌套的情况
      return updateFlattenColumnsMeta(flattenColumns, maxDeep);
    });

    const centerStyle = computed(() => {
      const style: StyleValue = {};
      style.paddingLeft = (headerLeftRef.value?.clientWidth ?? 0) + "px";
      style.paddingRight = (headerRightRef.value?.clientWidth ?? 0) + "px";

      const lastColumns = centerFlattenColumns.value.filter((column) => column._s_meta?.isLast);

      const maxDeep = getMaxDeep(lastColumns);

      style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
      style.gridTemplateColumns = lastColumns.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });


    const rightColumns = computed(() => tableState.value.fixedRightColumns ?? []);
    const rightFlattenColumns = computed(() => {
      // 渲染列，需要考虑表头嵌套的情况
      return bfsFlattenColumns<TableColumn>(rightColumns.value ?? [], flattenColumnCallback);
    });
    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
      style.gridTemplateColumns = rightColumns.value.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });

    const scroll = computed(() => tableState.value.scroll);

    const maxXMove = computed(() => tableState.value.viewport.scrollWidth - tableState.value.viewport.width);

    return {
      scroll, maxXMove,

      headerRef, headerClass, headerStyle,

      headerLeftRef, leftColumnsVisible, leftColumns, leftFlattenColumns, leftStyle,

      headerCenterRef, centerColumns, centerFlattenColumns, centerStyle,

      headerRightRef, rightColumnsVisible, rightColumns, rightFlattenColumns, rightStyle
    }
  }
});
</script>

<style lang="less" scoped>

.s-table-header__inner {
  position: relative;

  &-fixedLeft,
  &-center,
  &-fixedRight {
    display: grid;
  }
  &-center {
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>