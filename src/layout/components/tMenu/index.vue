import { menuItem } from '../../config';
<style lang='scss' scoped>

</style>
<template>
  <el-sub-menu :index="menuData.url" v-if="menuData.children&&menuData.children.length > 0">
    <template #title>
      {{ menuData.title }}
    </template>
    <el-menu-item-group>
      <!-- <template #title>Group 1</template> -->
      <el-menu-item :index="child.url" v-for="child in menuData.children" :key="child.url">
        {{ child.title }}
      </el-menu-item>
    </el-menu-item-group>
  </el-sub-menu>
  <el-menu-item :index="menuData.url" v-else>
    <template #title>
      {{ menuData.title }}
    </template>
  </el-menu-item>
</template>
<script setup lang='ts'>
import {
  computed,
  defineProps,
} from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const menuData = computed(() => props.data)
</script>