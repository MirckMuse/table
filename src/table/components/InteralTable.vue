<script lang="ts">
import { Spin as ASpin, Pagination as APagination } from "ant-design-vue";

import { useOverrideInject } from "../context/OverrideContext";
import { computed, defineComponent, h, ref } from "vue";
import { TableProps } from "../typing";
import { usePagination } from "../hooks";
import TableHeader from "./header/index.vue";
import TableBody from "./body/index.vue";


// 负责表格的渲染。
export default defineComponent<TableProps>({
  name: "SInteralTable",

  setup(props) {
    const {
      spin: overrideSpin,
      pagination: overridePagination,
    } = useOverrideInject();

    // table 相关的属性
    const tableRef = ref<HTMLElement>();
    const tableClass = computed(() => {
      // TODO:
      return "";
    });
    const tableStyle = computed(() => {
      // TODO:
      return "";
    });

    const tableHeaderRef = ref<any>();
    const tableBodyRef = ref<any>();

    // Spin 组件相关
    const Spin = overrideSpin?.component ?? ASpin;
    const spinProps = computed(() => Object.assign({}, overrideSpin?.props, { spinning: !!props.loading }));

    // Pagination 组件相关
    const Pagination = overridePagination?.component ?? APagination;
    const {
      props: paginationProps,
      onChange: onPaginationChange,
    } = usePagination(props);

    return () => {
      const pagination = h(Pagination, {
        class: `s-pagination s-pagination-${paginationProps.value.horizontal || 'right'}`,
        onChange: onPaginationChange,
        onShowSizeChange: onPaginationChange,
      });

      const tableStructure = [];

      if (paginationProps.value.vertical === "top") {
        tableStructure.push(pagination);
      }

      const tableContent = h(
        "div",
        {
          ref: tableRef,
          class: tableClass.value,
          style: tableStyle.value,
        },
        [
          // TODO: 塞入表头结构。
          h(TableHeader, { ref: tableHeaderRef }),

          // TODO: 塞入表体的结构
          h(TableBody, { ref: tableBodyRef }),
        ]
      );

      tableStructure.push(tableContent);

      const spin = h(Spin, { ...spinProps.value }, tableStructure);

      if (paginationProps.value.vertical === "bottom") {
        tableStructure.push(pagination);
      }

      return [
        spin
      ]
    };
  },
})
</script>