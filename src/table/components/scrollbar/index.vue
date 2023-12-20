<template>
  <div 
    v-if="content > client + Pixel_Error_Buffer" 
    class="s-table-scroll__track"
    :class="{
      'is-vertical': isVertical,
      [state?.position ?? 'outer']: true
    }"
    :style="{
      '--table-scroll-size': (state?.size ?? 6) + 'px'
    }"
    ref="rootRef"
  >
    <div class="s-table-scroll__thumb" :style="thumbStyle"></div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from "vue";

// 浏览器是向下取整的，会有 1px 的误差
const Pixel_Error_Buffer = 1;

const props = defineProps({
  state: {
    type: Object as PropType<{
      position: "inner" | "outer";

      mode: "always" | "hover";

      size?: number;
    }>
  },
  client: { type: Number, default: 0 },

  content: { type: Number, default: 0 },

  scroll: { type: Number, default: 0 },

  isVertical: { type: Boolean, default: false }
});

const rootRef = ref<HTMLElement>();

const thunmSize = computed(() => {
  const { client, content } = props;
  let ratio = client / content;
  const thumnSize = ratio * client;
  return Math.max(thumnSize, 1);
})

const sizeKey = props.isVertical ? 'height' : "width"
const marginKey = props.isVertical ? 'marginTop' : "marginLeft"

const thumbStyle = computed(() => {
  let { client, content, scroll } = props;

  if (props.state?.position === 'inner') {
    client = client - (props.state?.size ?? 6);
  }

  if (client === content) {
    return { [sizeKey]: "0px", [marginKey]: "0px" };
  }

  const ratio = client / content;
  let offset = Math.max(ratio * scroll, 0);
  offset = Math.min(offset, client - thunmSize.value);



  return {
    [sizeKey]: thunmSize.value + "px",
    [marginKey]: offset + "px",
  }
})
</script>

<style lang="less" scoped>
.is-vertical.s-table-scroll {
  &__track,
  &__thumb {
    width: var(--table-scroll-size);
  }

  &__track {
    height: 100%;
    top: 0;
    right: 0;

    &.outer {
      transform: translateX(100%);
    }
  }
}

.s-table-scroll__track:not(.is-vertical){
  left: 0;
  bottom: 0;
}

.s-table-scroll__track.inner {
  z-index: 1;
  width: calc(100% - var(--table-scroll-size));
  height: var(--table-scroll-size);

  &.is-vertical {
    width: var(--table-scroll-size);
    height: calc(100% - var(--table-scroll-size));
  }
}

.s-table-scroll__track.outer {
  transform: translateY(100%);
}

.s-table-scroll {
  &__track,
  &__thumb {
    display: block;
    height: var(--table-scroll-size);
  }

  &__track {
    width: 100%;
    background-color: var(--table-scroll-track-bg);
    position: fixed;
    
  }

  &__thumb {
    background-color: var(--table-scroll-thumb-bg);
    border-radius: var(--table-scroll-radius);
  }
}
</style>