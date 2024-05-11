<template>
  <div v-if="scrollbarVisible" ref="rootRef" class="s-table-scroll__track" :class="scrollbarClass"
    :style="scrollbarStyle">
    <div class="s-table-scroll__thumb" :style="thumbStyle" @mousedown.stop="handleThumbMousedown"></div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, computed, ref } from "vue";

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

const emit = defineEmits(["update:scroll"])

const rootRef = ref<HTMLElement>();

const MIN_THUMB_SIZE = 16;

const sizeKey = props.isVertical ? 'height' : "width"
const marginKey = props.isVertical ? 'marginTop' : "marginLeft";

const ratio = computed(() => {
  const { client, content } = props;
  return client / content;
});

// 计算后的滚动条尺寸
const computedthumbSize = computed(() => Math.max(ratio.value * props.client, 1))

// 校准后的滚动条尺寸
const thumbSize = computed(() => Math.max(computedthumbSize.value, MIN_THUMB_SIZE));

const thumbStyle = computed(() => {
  let { client, content, scroll } = props;

  if (props.state?.position === 'inner') {
    client = client - (props.state?.size ?? 6);
  }

  if (client === content) {
    return { [sizeKey]: "0px", [marginKey]: "0px" };
  }

  // 因为thumb有最小的尺寸，基于原有的比例计算出来的margin有偏差，需要校准一下
  const adjustOffset = scroll / (client - thumbSize.value) * (thumbSize.value - computedthumbSize.value);
  let offset = Math.max(ratio.value * (scroll - adjustOffset), 0);
  offset = Math.min(offset, client - thumbSize.value);

  // thumbSize 应该给个最小尺寸

  return {
    [sizeKey]: thumbSize.value + "px",
    [marginKey]: offset + "px",
  }
})

// 当内容大于容器高度时，滚动条显式
const scrollbarVisible = computed(() => {
  const { content, client } = props;
  return content > client + Pixel_Error_Buffer;
});

// 滚动条样式类
const scrollbarClass = computed(() => {
  const { isVertical, state } = props;
  return {
    "is-vertical": isVertical,
    [state?.position ?? 'outer']: true
  }
});

// 滚动条样式
const scrollbarStyle = computed(() => {
  const { state } = props;
  return {
    "--table-scroll-size": (state?.size ?? 6) + "px"
  }
});

const getPosition = (function (isVertical: boolean) {
  return isVertical
    ? ($event: MouseEvent) => $event.pageY
    : ($event: MouseEvent) => $event.pageX;
})(props.isVertical);

const getTrackPosition = (function (isVertical: boolean) {
  return isVertical
    ? () => rootRef.value?.getBoundingClientRect().top ?? 0
    : () => rootRef.value?.getBoundingClientRect().left ?? 0
})(props.isVertical);

let mousedownStartPagePosition = 0;
let userSelect = "";
let start_scroll = 0;

// 鼠标按下 thumb 时，记录了当前的位置
function handleThumbMousedown($event: MouseEvent) {
  mousedownStartPagePosition = getPosition($event);
  userSelect = document.body.style.userSelect;
  start_scroll = props.scroll;
  document.body.style.userSelect = 'none';
  document.addEventListener("mousemove", handleMousemove);
  document.addEventListener("mouseup", handleMouseup);
}

let interval: NodeJS.Timeout | null = null;

function cancelInterval() {
  interval && clearInterval(interval);
}

// 在滚动条轨道点击时，需要计算相对于track的整体比例，来计算滚动距离
function handleTrackMousedown($event: MouseEvent) {

  interval = setInterval(() => {
    handleTrackClick($event)
  }, 200);


  // const { content, client } = props;
  // let mouseDownPosition = getPosition($event);
  // let trackPosition = getTrackPosition();
  // let newScroll = mouseDownPosition - trackPosition;
  // newScroll = Math.min(newScroll, content - client);
  // newScroll = Math.max(newScroll, 0);
  // emit('update:scroll', newScroll / ratio.value);
}

function handleTrackClick($event: MouseEvent) {
  const { client } = props;
  let mouseDownPosition = getPosition($event);
  let trackPosition = getTrackPosition();
  if (mouseDownPosition > trackPosition) {
    emit('update:scroll', props.scroll + client);
  }
}

function handleMousemove($event: MouseEvent) {
  const { content, client } = props;
  const moveLength = getPosition($event) - mousedownStartPagePosition;

  // 移动距离需要处理比例 + 起始滚动距离
  let newScroll = moveLength / ratio.value + start_scroll;
  newScroll = Math.min(newScroll, content - client);
  newScroll = Math.max(newScroll, 0);

  emit('update:scroll', newScroll);
}

function handleMouseup() {
  document.body.style.userSelect = userSelect;
  document.removeEventListener("mousemove", handleMousemove);
  document.removeEventListener("mouseup", handleMouseup);
}
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

.s-table-scroll__track:not(.is-vertical) {
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

  &__thumb:hover {
    background-color: var(--table-scroll-thumb-hover-bg);
  }
}
</style>