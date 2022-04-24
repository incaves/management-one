<template>
  <el-button type="info" @click="logOut">退出</el-button>
</template>

<script>
import { removeToken } from '@/utils/token'
export default {
  methods: {
    logOut () {
      removeToken() // 删除token
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>
