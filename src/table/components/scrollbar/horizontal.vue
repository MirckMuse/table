<template>
  <div class="s-table-scroll-horizontal__track" ref="rootRef">
    <div class="s-table-scroll-horizontal__thumb"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const rootRef = ref<HTMLElement>();
</script>

<style lang="less" scoped>
.s-table-scroll-horizontal {
  &__track,
  &__thumb {
    display: block;
    height: 4px;
  }


  &__track {
    width: 100%;
    background-color: var(--table-scroll-track);
  }

  &__thumb {
    width: 50%;
    background-color: var(--table-scroll-thumb);
    border-radius: 1px;
  }
}
</style>