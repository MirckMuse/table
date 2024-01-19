<template>
  <div style="padding: 10px;">
    <s-table
      :data-source="data_source"
      :columns="columns"
      :bordered="true"
      rowKey="id"
      :scroll="{ y: 700 }"
      :transform-cell-text="transformCellText"
      @resizeColumn="handleResizeColumn"
    >
      <template v-slot:bodyCell="{ text, column }">
        <span v-if="column.dataIndex === 'a'">{{ text + "011123" }}</span>
      </template>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from "vue";
import { RowData, TableColumn, TransformCellText } from "./table/typing";
import { uniqueId } from "lodash-es";

function handleResizeColumn(width: number, col: TableColumn) {
  col.width = width;
}

const transformCellText: TransformCellText = ({ text, column }) => {
  if (column.dataIndex === "a") {
    return "这是A列"
  }
  return text
}

function customRow(record: RowData, rowIndex: number) {
  if (rowIndex === 50) {
    return {
      style: "background-color: red"
    }
  }
}

function createItem(_: unknown, index: number) {
  return {
    id: uniqueId("uuid"),
    "a": index,
    "b": "很长很长的一段文本很长很长的一段文本",
    "c": index,
    "d": index + 1
  }
}


const data_source = ref<any[]>(Array(100).fill(null).map(createItem));

const children = Array(10).fill(null).map(createItem) as any[];

children[0].children = Array(10).fill(null).map(createItem) as any[];
data_source.value[0].children = children;

const columns = ref<TableColumn[]>([
  {
    dataIndex: 'a',
    title: "第一列",
    width: 100,
    resizable: true,
    customHeaderCell() {
      return {
        style: "color: red"
      }
    }
  },
  {
    dataIndex: 'id',
    title: "一段长文案长文案长文案长文案长文案长文案长文案长文案",
    fixed: true,
    ellipsis: true,
    resizable: true,
  },
  {
    dataIndex: 'c',
    title: "第三列-2",
    colSpan: 2,
    customCell() {
      return { style: "color: red" }
    }
  },
  { dataIndex: 'd', title: "第三列-1", colSpan: 0 },
  {
    title: "分组",
    children: [
      { dataIndex: 'd', title: "第三列-2" },
      { dataIndex: 'c', title: "第三列-3", resizable: true, minWidth: 100 },
    ]
  },
  { dataIndex: 'c', title: "第三列-4" },
  { dataIndex: 'c', title: "第三列-5" },
  { dataIndex: 'c', title: "第三列-6" },
  { dataIndex: 'c', title: "第三列-7" },
  { dataIndex: 'c', title: "第三列-8" },
  { dataIndex: 'd', title: "第三列-9" },
  {
    dataIndex: 'c',
    title: "操作",
    fixed: 'right',
    ellipsis: {
      showTooltip: true
    },
    customRender() {
      return h('button', "按钮")
    }
  },
]);
</script>