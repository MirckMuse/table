---
layout: home
---

基于 ant-design-vue table api 开发的虚拟化表格。

<script setup>
import { ref } from "vue";
import Mock from "mockjs";

const columns = ref([
  { title: "姓名", dataIndex: "name", fixed: true },
  { title: "年纪", dataIndex: "age", sorter: true },
  { title: "身份证号", dataIndex: "idCard", width: 180 },
  { title: "性别", dataIndex: "sex" },
  { title: "职业", dataIndex: "position" },
  { title: "公司", dataIndex: "company" },
  { title: "毕业学校", dataIndex: "school" },
  { title: "电话", dataIndex: "telephone", width: 180 },
  { title: "手机", dataIndex: "phoneNo" },
  { title: "QQ", dataIndex: "qq" },
  { title: "微信", dataIndex: "weichat" },
  { title: "国籍", dataIndex: "nationality" },
  { title: "民族", dataIndex: "nation" },
  { title: "地址", dataIndex: "address",  ellipsis: { showTooltip: true }, },
  { title: "收入", dataIndex: "income" },
  { title: "操作", dataIndex: "operation", width: 120, fixed: "right" },
])

const { list } = Mock.mock({
  "list|1000": [{
    "id|+1": 1,
    "name": "@cname",
    "age|18-60": 1,
    'position|1': ["前端", "后端", "产品", "测试"],
    'company': "大厂",
    idCard: "12345678909876xxxx",
    school: "知名大学",
    telephone: "0571-88888888",
    phoneNo: "1851088xxx1",
    qq: "123456xxx",
    weichat: "987654xxx",
    nationality: "中国",
    nation: "@region",
    address: "@city(true)",
    "income|10000-20000": 1,
    "sex|1": ['男', '女']
  }]
})

const datasource = ref(list)
</script>



<client-only>
  <s-table :columns="columns" :data-source="datasource" :scroll="{ y: 450 }" rowKey="id">
    <template v-slot:bodyCell="{ text, column }">
        <span v-if="column.dataIndex === 'operation'" style="display: flex; gap: 8px">
          <a-button type="link" style="padding: 0">详情</a-button>
          <a-button type="link" style="padding: 0" danger>删除</a-button>
        </span>
    </template>
  </s-table>
</client-only>