<template>
  <div style="padding: 10px;">
    <s-table 
      :data-source="dataSource" 
      :columns="columns"
      :bordered="true" 
      :scroll="{ y: 400 }"
      @resizeColumn="handleResizeColumn"
    />
  </div>
</template>

<script lang="ts" setup>
import { TableColumn, RowData } from "./table/typing"
import { ref } from "vue";

const dataSource: RowData[] = Array(10).fill(null).map((_, index) => {
  return { a: index, b: "很长很长的一段文本很长很长的一段文本", c: index }
})

function handleResizeColumn(width: number, col: TableColumn) {
  col.width = width;
}

const columns = ref<TableColumn[]>([
  {
    dataIndex: 'a',
    title: "第一列",
    width: 100,
    customHeaderCell() {
      return {
        style: "color: red"
      }
    }
  },
  {
    dataIndex: 'b',
    title: "一段长文案长文案长文案长文案长文案长文案长文案长文案",
    ellipsis: true,
    fixed: true
  },
  {
    dataIndex: 'c',
    title: "第三列-2",
    colSpan: 2,
    customCell() {
      return { style: "color: red" }
    }
  },
  { dataIndex: 'c', title: "第三列-1", colSpan: 0 },
  {
    title: "分组",
    children: [
      { dataIndex: 'c', title: "第三列-2" },
      { dataIndex: 'c', title: "第三列-3", resizable: true, maxWidth: 200, minWidth: 100 },
    ]
  },
  { dataIndex: 'c', title: "第三列-4" },
  { dataIndex: 'c', title: "第三列-5" },
  { dataIndex: 'c', title: "第三列-6" },
  { dataIndex: 'c', title: "第三列-7" },
  { dataIndex: 'c', title: "第三列-8" },
  { dataIndex: 'c', title: "第三列-9" },
  { dataIndex: 'c', title: "第三列-last", fixed: 'right' },
]);
</script>