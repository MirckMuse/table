<template>
  <div :class="prefixClass">
    <div :class="`${prefixClass}__inner`"></div>
    <div :class="`${prefixClass}__arrow`"></div>
  </div>
</template>

<script lang="ts" setup>
const prefixClass = "s-table-tooltip";
</script>