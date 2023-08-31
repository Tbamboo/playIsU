import {
  computed,
  ref,
} from 'vue';

import en from 'element-plus/dist/locale/en.mjs';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { defineStore } from 'pinia';

import type { configProviderInterface } from './interface';

export const useCounterStore = defineStore('configProvider', () => {
  const configProvider: configProviderInterface = {
    locale: 'en',
  size: 'default',
  zIndex: 0,
  namespace: 'el',
  button: {autoInsertSpace: false},
  message: {}
  }
  const language = ref('zh-cn')
  configProvider.locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
  function toggle() {
    language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
  }

  return {   }
})
