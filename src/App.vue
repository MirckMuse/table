<template>
  <div style="padding: 10px;">
    <h1>数据量:{{ data_source_length }}</h1>
    <s-table :data-source="data_source" :columns="columns" :bordered="true" rowKey="id" :scroll="{ y: 400 }"
      :transform-cell-text="transformCellText" @resizeColumn="handleResizeColumn" :customRow="customRow">
      <template v-slot:bodyCell="{ text, column }">
        <span v-if="column.dataIndex === 'a'">{{ text + "011123" }}</span>
      </template>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from "@scode/table-typing";
import type { TransformCellText, TablePaginationProps } from "@scode/table-vue";
import { uniqueId } from "lodash-es";
import { computed, h, reactive, ref } from "vue";

function handleResizeColumn(width: number, col: TableColumn) {
  col.width = width;
}

const transformCellText: TransformCellText = ({ text, column }) => {
  if (column.dataIndex === "a") {
    return "这是A列"
  }
  return text
}

const pagination = reactive<TablePaginationProps>({
  current: 1,
  pageSize: 10,
  total: 0,
})

function customRow(row: any, index: number) {
  if (index === 0) {
    // console.log(row)
    return {
      // style: "background: red"
    }
  }
  return {}
}

const Enums = [
  { label: "选项 1", value: "001" },
  { label: "选项 2", value: "002" },
  { label: "选项 3", value: "003" },
]

function createItem(_: unknown, index: number) {
  return {
    id: uniqueId("uuid"),
    "a": index,
    "b": "很长很长的一段文本很长很长的一段文本",
    "c": Math.floor(Math.random() * 100),
    "d": index + 1,
    enums: Enums[(index % Enums.length)].value
  }
}

const data_source = ref<any[]>(Array(100000).fill(null).map(createItem));

const data_source_length = computed(() => data_source.value.length.toLocaleString())

const children = Array(100).fill(null).map(createItem) as any[];

children[0].children = Array(100).fill(null).map(createItem) as any[];
data_source.value[0].children = children;

setTimeout(() => {
  pagination.total = data_source.value.length;
}, 1000)

const columns = ref<TableColumn[]>([
  {
    dataIndex: 'a',
    title: "第一列",
    width: 100,
    fixed: true,
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
    ellipsis: true,
    resizable: true,
  },
  {
    dataIndex: 'enums',
    title: "筛选",
    ellipsis: true,
    filter: {
      options: Enums,
      onFilter(keyword, row) {
        return row.enums === keyword;
      }
    },
    customRender({ text }) {
      return Enums.find(item => item.value === text)?.label
    }
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
  {
    dataIndex: 'c',
    title: "第三列-4",
    sorter: true,
    resizable: true,
    width: 200
  },
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
