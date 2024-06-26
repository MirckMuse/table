import type { PropType } from "vue";
import type { BodyCellSlot, TransformCellText } from ".";
import type { HoverState } from "@scode/table-state";

// 表体一直透传到 cell 组件的属性
export const BodyCellInheritProps = {
  transformCellText: { type: Function as PropType<TransformCellText> },

  bodyCell: { type: Function as PropType<BodyCellSlot> },

  // 行数据 children 的 key 值
  rowChildrenName: { type: String },

  // 是否存在嵌套数据
  existNestDataSource: { type: Boolean },

  hoverState: { type: Object as PropType<HoverState> },

  // TODO: 1. 选中状态
};
