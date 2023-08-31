<style lang='scss' scoped>
  .login {
    width: 100%;
    height: 100%;
    background-image: url('../../assets/background.jpeg');
    position: relative;
    .login-form {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 450px;
      height: 600px;
      margin: -300px 0 0 -250px;
      h1 {
        text-align: center;
        margin-bottom: 30px;
      }
      .login-button {
        width: 100%;

      }
      .copy-right {
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #999;
      }
    }
  }
  :deep {
    .el-card__body {
      height: 100%;
    }
  }
</style>
<template>
  <div class="login">
    <el-card class="login-form">
      <h1>赛创智能定义平台</h1>
      <el-form :model="form" label-width="90px" label-position="top">
        <el-form-item label="应用名称：">
          <el-select v-model="form.project" style="width: 100%;">
            <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权值：">
          <el-input type="textarea" :autosize="{ minRows: 6 }" v-model="form.token"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-button" type="primary" @click="saveForm">确定</el-button>
        </el-form-item>
      </el-form>
      <div class="copy-right">
        赛创智能实验室
      </div>
    </el-card>
  </div>
</template>
<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { getAppMenu } from '../../api/system'
interface Form {
  project: string,
  token: string
}
const form: Ref<Form> = ref({
  project: '',
  token: ''
})
let appList: Ref = ref([])
const saveForm = () => {
  console.log(form.value);
}
onMounted(async () => {
  const res: any = await getAppMenu({ pageable: false }, 'app_info')
    console.log(res);
    if(res.code === '0') {
      appList.value = res.data?.data
    }
}) 
</script>