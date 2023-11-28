<template>
  <div style="padding: 10px;">
    <s-table :data-source="dataSource" :columns="columns" :bordered="true"></s-table>
  </div>
</template>

<script lang="ts" setup>
import { TableColumn, RowData } from "./table/typing"

const dataSource: RowData[] = Array(10).fill(null).map((_, index) => {
  return { a: index, b: "很长很长的一段文本很长很长的一段文本", c: index }
})

const columns: TableColumn[] = [
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
    title: "第二列很高的肌肤徕卡减肥",
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
  { dataIndex: 'c', title: "第三列", colSpan: 0 },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列-last", fixed: 'right' },
];
</script>