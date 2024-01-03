import { PropType } from "vue";
import { BodyCellSlot, TransformCellText } from ".";

// 表体一直透传到 cell 组件的属性
export const BodyCellInheritProps = {
  transformCellText: { type: Function as PropType<TransformCellText> },

  bodyCell: { type: Function as PropType<BodyCellSlot> },

  // TODO: 1. 选中状态
}