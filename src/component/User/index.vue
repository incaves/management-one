<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="姓名" prop="role_name"></el-table-column>
        <el-table-column label="状态" width="80px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- scope 就是userlist的数据 -->
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配权限 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体部分 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="70px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobil">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'User',
  data () {
    // 自定义邮箱的验证规则
    const checkEmail = (rule, value, callback) => {
      const reg =
        /^[A-Za-z0-9-._]+@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,6})$/
      if (reg.test(value)) {
        // 合法
        return callback()
      }
      callback(new Error('Email is not valid'))
    }
    // 自定义手机号的验证规则
    const checkMobile = (rule, value, callback) => {
      const reg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (reg.test(value)) {
        // 合法
        return callback()
      }
      callback(new Error('Mobile is not valid'))
    }
    return {
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 默认显示第一页
        pagesize: 6 // 每页显示几条
      },
      userlist: [], // 用户列表
      total: 0, // 总数量
      addDialogVisible: false, // 添加用户的对话框 显示与隐藏
      // 添加用户对话框的form数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogVisible: false, // 修改用户的对话框 显示与隐藏
      // 修改用户对话框的form数据
      editForm: {},
      // 添加表单的验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: 'Please enter a user name',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'The length is three to five characters',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please enter a password',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: 'The password must be between six and sixteen',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: 'Please enter a email',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: 'Please enter a mobile',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 修改表单的验证规则
      editFormRules: {
        email: [
          {
            required: true,
            message: 'Please enter a email',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: 'Please enter a mobile',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 请求数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 下拉框 选择那一页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize // 等于最新的
      this.getUserList() // 重新获取数据
    },
    // 监听 页码值发生变化 切换页
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage // 等于最新的
      this.getUserList() // 重新获取数据
    },
    // 添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async (isOK) => {
        if (!isOK) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('Add failure')
        this.$message.success('Add a success')
        this.addDialogVisible = false // 隐藏对话框
        this.getUserList() // 重新获取新数据
      })
    },
    // 添加用户对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields() // 对话框关闭重置表单数据
    },
    // 修改用户的对话框请求数据
    async showEditDialog (id) {
      this.editDialogVisible = true // 弹出对话框
      const { data: res } = await this.$http.get(`/users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(
          'Description Failed to query user information'
        )
      }
      this.editForm = res.data
    },
    // 修改用户数据
    editUserInfo () {
      this.$refs.editFormRef.validate(async (isOK) => {
        if (!isOK) return
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) { return this.$message.error('Modify the failure') }
        this.editDialogVisible = false // 关闭对话框
        this.getUserList() // 刷新数据
        this.$message.success('Modify the success')
      })
    },
    // 监听修改用户对话框的关闭
    editDialogClose () {
      this.$refs.editFormRef.resetFields() // 重置表单
    },
    async removeUserById (id) {
      const result = await this.$confirm('Sure to delete?', 'deleteUser', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (result !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>
