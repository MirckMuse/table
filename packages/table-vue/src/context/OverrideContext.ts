import type { InjectionKey } from "vue";
import type { SpinProps, PaginationProps } from "ant-design-vue"
import { defineComponent, inject, provide } from "vue";

export type OverrideSpin = {
  props?: SpinProps;

  component?: any;
}

export type OverridePagination = {
  props?: PaginationProps;

  component?: any;
}


export type OverrideContextProps = {
  spin?: OverrideSpin;

  pagination?: OverridePagination;
}

const OverrideContextKey: InjectionKey<OverrideContextProps> = Symbol("OverrideContext");

// 提供入口让用户可以覆盖原有的组件功能
export function useOverrideProvide(props: OverrideContextProps) {
  provide(OverrideContextKey, props)
}

export function useOverrideInject() {
  return inject(OverrideContextKey, {})
}

export const OverrideContext = defineComponent<OverrideContextProps>({
  name: "OverrideContext",

  inheritAttrs: false,

  setup(props, { slots }) {
    useOverrideProvide(props);

    return () => slots.default?.();
  }
});
