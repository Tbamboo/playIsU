<style lang='scss' scoped>
  .el-col{
    margin-top: 10px;
  }
</style>
<template>
  <el-row :gutter="10" style="padding: 0 10px">
    <el-col :span="4">
      <t-city-picker v-model="cityId" @change="selectCity" placeholder="请选择城市"></t-city-picker>
    </el-col>
    <el-col :span="4">
      <t-calendar-picker :isMultiple="2"></t-calendar-picker>
    </el-col>
  </el-row>
  <!-- <AboutView></AboutView> -->
</template>
<script setup lang='ts'>
import {
  onMounted,
  ref,
} from 'vue';

import tCalendarPicker from '../../components/tCalendarPicker/index.vue';
import tCityPicker from '../../components/tCityPicker/index.vue';
import AboutView from '../AboutView.vue';

const cityId = ref<string>('442000')
const selectCity = (city: object | null) => {
  console.log('city', city, 'cityId', cityId.value);
}
onMounted(() => {
  // console.log(process);
})
// import HomeView from '../HomeView.vue';
</script>