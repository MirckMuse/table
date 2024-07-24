<template>
  <s-table :columns="columns" :row-key="record => record.login.uuid" :data-source="dataSource" :pagination="pagination"
    @change:pagination="handleTableChange">
  </s-table>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import type { TableColumn } from "@scode/table-vue"

const columns: TableColumn[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    customRender({ text }: any) {
      return text.first + " " + text.last
    }
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filter: {
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ]
    }
  },
  { title: 'Email', dataIndex: 'email' },
];

const dataSource = ref([]);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 200
});

function query() {
  const { current, pageSize } = pagination.value;
  let params = {
    page: current,
    results: pageSize
  }

  axios.get('https://randomuser.me/api?noinfo', { params })
    .then(res => {
      dataSource.value = res.data.results;
      pagination.value.total = 200;
    })
}

query();

function handleTableChange(option) {
  Object.assign(pagination.value, {
    current: option.page,
    pageSize: option.size
  });
  query();
}
</script>