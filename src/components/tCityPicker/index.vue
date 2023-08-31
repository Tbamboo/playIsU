<style lang='scss' scoped>
@import "./city-picker.scss";
</style>
<template>
  <div class="vue-city-picker" @mouseout="endChoice" @mouseover="startMouseOver">
    <!-- <el-input :name="field" :id="field" v-model="currCityName" :placeholder="placeholder" @focus="startChoice" @keypress="startChoice" @blur="endChoice" @click="startChoice" ref="input" disabled></el-input> -->
    <div class="current-city" @click="startChoice" :title="currCityName">
      {{ currCityName }}<span style="color: #999" v-show="!currCityName">{{ placeholder }}</span>
      <div class="city-close" v-show="modelValue" @click.stop="handleClose">X</div>
    </div>
    <!--城市选择-->
    <div class="vcp-panel" v-show="cityPanelIsShow">
      <el-tabs v-model="tagKey">
        <el-tab-pane v-for="item in tagsArr" :key="item" :label="item" :name="item"></el-tab-pane>
      </el-tabs>
      <div class="vcp-list">
        <div :class="{'z-hot': initial == 'hot'}" v-for="(citys, initial) in cityList" :key="initial" v-show="currTagIncludes(initial)">
          <h6 v-if="initial != 'hot'">{{ initial }}</h6>
          <ul>
            <li v-for="v in citys" @click="choiceCity(v)" :key="v.id" :class="{'is-active': v.id === modelValue}" :title="v.name">{{ v.name }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import {
  defineEmits,
  onMounted,
  reactive,
  ref,
} from 'vue';

import cityList from 'china-city-data';

interface Tags  {[key:string]: string[]}
interface City {id: string, name: string}

const props = defineProps({
  modelValue: {
    type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    // 城市列表
    cityList: {
      type: Object,
      default: function() {
        return cityList
      }
    },
    // 没有热门城市
    noHot: {
      type: Boolean,
      default: false
    }
})
 // 基于类型
const emit = defineEmits<{
  (e: 'update:modelValue', id: string | null): void
  (e: 'change', city: object | null): void
}>()
    const tags: Tags = {}
    const inputEl = ref()
  // const cityData: object = reactive({ ...props.cityList })
  const currCityName = ref<string>('')
  const cityPanelIsShow = ref<boolean>(false)
  const isMouseOver = ref<boolean>(false)
  let tagsArr: string[] = reactive(['热门', 'ABC', 'DEF', 'GHJ', 'KLM', 'NPQ', 'RST', 'WXYZ'])
  const tagKey = ref<string>('热门')
  if (props.noHot) {
    tagsArr = ['ABCD', 'EFGH', 'JKL', 'MNPQ', 'RSTW', 'XYZ']
    tagKey.value = 'ABCD'
  }
    tagsArr.forEach((item) => {
      if (item === '热门') {
        tags[item] = ['hot']
      } else {
        tags[item] = item.split('')
      }
    })
    // const currCityId = computed(() => props.modelValue)
    onMounted(() => {
      // console.log('props.value', props.modelValue);
      Object.keys(props.cityList).forEach((item) => {
      const obj = props.cityList[item].find((c: City) => props.modelValue === c.id)
      if (obj) {
        // console.log('currCityName', currCityName);
        currCityName.value = obj.name
      }
    })
    })

const choiceTag = (key: string) => {
      tagKey.value = key
    }
    // 开始城市选择
const startChoice = (e: any) => {
  if (e && e.type === 'keypress') {
        e.returnValue = false
      }
      cityPanelIsShow.value = true
}
const endChoice = (e: any) => {
      // console.log(inputEl)
      if (e.type === 'mouseout') {
        isMouseOver.value = false
      }
      setTimeout(function() {
        if (!isMouseOver.value && inputEl.value !== document.activeElement) {
          cityPanelIsShow.value = false
        }
      }, 300)
}
const startMouseOver = () => {
  isMouseOver.value = true
}
const currTagIncludes = (ini: string) => {
  return tags[tagKey.value]?.includes(ini)
}
const choiceCity = (city: City) => {
  currCityName.value = city.name
      emit('update:modelValue', city.id)
      emit('change', city)
      immEndChoice()
} // 立即关闭城市面板
const immEndChoice = () => {
      isMouseOver.value = true
      cityPanelIsShow.value = false
    }
    const handleClose = () => {
      currCityName.value = ''
      cityPanelIsShow.value = false
      emit('update:modelValue', null)
      emit('change', null)
    }
</script>