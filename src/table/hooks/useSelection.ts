import { InjectionKey, provide, inject, reactive } from "vue";
import { ColKeySplitWord } from "../config";

export interface SelectionState {
  colKeys: string[];

  startRowIndex: number;

  endRowIndex: number;
}

interface ISelection {
  selection_state: SelectionState;
}

const Selection_Context_Key: InjectionKey<ISelection> = Symbol("__selection_context_key__");
export function useSelectionProvide() {
  const selection_state = reactive<SelectionState>({
    colKeys: [`b${ColKeySplitWord}1`, `a${ColKeySplitWord}0`, `c${ColKeySplitWord}2`],
    startRowIndex: 0,
    endRowIndex: 1,
  });

  provide(Selection_Context_Key, {
    selection_state
  })
}


export function useSelectionInject() {
  return inject(Selection_Context_Key) as ISelection;
}