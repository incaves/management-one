<template>
  <div class="login-container">
    <div class="login-form">
      <!-- 头像区域 -->
      <div class="avater">
        <img src="~@/assets/img.jpeg" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        label-width="0px"
        :rules="loginFormRules"
        class="loginForm"
        :model="loginForm"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-thumb"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="loginBtn">
          <el-button type="primary" @click="login">Login</el-button>
          <el-button type="info" @click="resetLoginForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setToken } from '@/utils/token'
export default {
  name: 'Login',
  data () {
    return {
      // 登录表单 数据同步
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      loginFormRules: {
        // 用户名
        username: [
          {
            required: true,
            message: 'Please enter a user name',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 16,
            message: 'The length is three to five characters',
            trigger: 'blur'
          }
        ],
        // 密码
        password: [
          {
            required: true,
            message: 'Please enter a password',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: 'The password is incorrect',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登录
    login () {
      this.$refs.loginFormRef.validate(async (isOk) => {
        if (isOk) { // 成功
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) { // 状态码不等于200
            return this.$message.error('Login failed')
          }
          this.$message.success('Login success') // 提示消息
          setToken('token', res.data.token) // 存储token
          this.$router.push('/home') // 跳转页面
        } else { // 失败
          return console.log('An unknown error')
        }
      })
    },
    // 点击重制按钮 重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #3170a7;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;
  }
  .avater {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    box-shadow: 0 0 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .loginForm {
    width: 100%;
    position: absolute;
    padding: 0 20px;
    bottom: 0;
    box-sizing: border-box;
  }
  .loginBtn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
