import type { PropType } from "vue";
import type { BodyCellSlot, TransformCellText } from ".";

// 表体一直透传到 cell 组件的属性
export const BodyCellInheritProps = {
  transformCellText: { type: Function as PropType<TransformCellText> },

  bodyCell: { type: Function as PropType<BodyCellSlot> },

  // 行数据 children 的 key 值
  childrenRowName: { type: String },

  // TODO: 1. 选中状态
}