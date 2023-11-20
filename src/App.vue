<template>
  <s-table :data-source="dataSource" :columns="columns"></s-table>
</template>

<script lang="ts" setup>
import { TableColumn, RowData } from "./table/typing"
const dataSource: RowData[] = Array(10).fill(null).map((_, index) => {
  return { a: index, b: "很长很长的一段文本很长很长的一段文本", c: index }
})

const columns: TableColumn[] = [
  { dataIndex: 'a', title: "第一列" },
  { dataIndex: 'b', title: "第二列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
  { dataIndex: 'c', title: "第三列" },
];
</script>