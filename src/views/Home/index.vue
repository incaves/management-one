<template>
  <el-container class="home-container">
    <el-header>
      <div><img src="~@/assets/img.jpeg" alt="" style= /></div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-tooltip
          effect="dark"
          content="To fold or unfold"
          :enterable="false"
        >
          <div class="toggle-button" @click="toggleCollapse">
            <i class="el-icon-loading"></i>
          </div>
        </el-tooltip>
        <!-- 侧边栏导航 -->
        <el-menu
          background-color="#126bae"
          text-color="#fff"
          active-text-color="#74787a"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单栏 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsItem[item.id]" style="color: #fff"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单栏 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i :class="itemSubItem[subItem.id]"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 二级路由入口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from '@/utils/token'
export default {
  name: 'Home',
  data () {
    return {
      menulist: [], // 左侧菜单栏数据
      isCollapse: false, // 控制侧边栏的折叠
      activePath: '', // 被激活的连接地址
      iconsItem: {
        125: 'el-icon-s-custom',
        103: 'el-icon-sunset',
        101: 'el-icon-view',
        102: 'el-icon-upload',
        145: 'el-icon-s-flag'
      },
      itemSubItem: {
        110: 'el-icon-finished',
        111: 'el-icon-tickets',
        112: 'el-icon-service',
        104: 'el-icon-s-data',
        115: 'el-icon-truck',
        121: 'el-icon-video-camera',
        107: 'el-icon-smoking',
        146: 'el-icon-message-solid'
      }
    }
  },
  created () {
    this.getMenuList()
    // 从本地存储中取到保存url的激活状态
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 获取左侧菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 菜单栏的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    logOut () {
      removeToken() // 删除token
      this.$router.push('/login')
    },
    // 保存二级菜单的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #126bae;
  display: flex;
  justify-content: space-between;
  padding-left: 70px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 0 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background-color: #126bae;
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #126bae;
  font-size: 17px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  margin-top: 10px;
}
</style>
