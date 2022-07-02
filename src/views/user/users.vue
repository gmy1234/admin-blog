<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <!-- 登录方式 -->
        <el-select v-model="loginType" clearable placeholder="请选择登录方式" size="small" style="margin-right:1rem">
          <el-option
            v-for="item in typeList"
            :key="item.type"
            :label="item.desc"
            :value="item.type"
          />
        </el-select>
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入昵称"
          style="width:200px"
          @keyup.enter.native="searchUsers"
        />
        <el-button type="primary" size="small" icon="el-icon-search" style="margin-left:1rem" @click="searchUsers">
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table v-loading="loading" border :data="userList">
      <!-- 表格列 -->
      <el-table-column prop="linkAvatar" label="头像" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="40" height="40"/>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center" width="140"/>
      <el-table-column prop="loginType" label="登录方式" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.loginType === 1" type="success">邮箱</el-tag>
          <el-tag v-if="scope.row.loginType === 2">QQ</el-tag>
          <el-tag v-if="scope.row.loginType === 3" type="danger">微博</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roleList" label="用户角色" align="center">
        <template v-slot="scope">
          <el-tag
            v-for="(item, index) of scope.row.roleList"
            :key="index"
            style="margin-right:4px;margin-top:4px"
          >
            {{ item.roleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="禁用" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDisable"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
            @change="changeDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" label="登录ip" align="center" width="140"/>
      <el-table-column prop="ipSource" label="登录地址" align="center" width="140"/>
      <el-table-column prop="createTime" label="创建时间" width="130" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px"/>
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="上次登录时间" width="130" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px"/>
          {{ scope.row.lastLoginTime | date }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openEditModel(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination-container"
      background
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 修改对话框 -->
    <el-dialog :visible.sync="isEdit" width="30%">
      <div class="dialog-title-container" slot="title">修改用户</div>
      <el-form label-width="60px" size="medium" :model="userForm">
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" style="width:220px"/>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIdList">
            <el-checkbox v-for="item of userRoleList" :key="item.id" :label="item.id">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import UserAPI from '../../api/user/user.js'
import RoleAPI from '../../api/user/role.js'

export default {
  name: 'Users',
  data() {
    return {
      loading: true,
      isEdit: false,
      userForm: {
        userInfoId: null,
        nickname: ''
      },
      loginType: null,
      userRoleList: [],
      roleIdList: [],
      userList: [], // 用户列表
      typeList: [
        {
          type: 1,
          desc: '邮箱'
        },
        {
          type: 2,
          desc: 'QQ'
        },
        {
          type: 3,
          desc: '微博'
        }
      ],
      keywords: null,
      current: 1,
      size: 10,
      count: 0
    }
  },
  watch: {
    loginType() {
      this.current = 1
      this.listUsers()
    }
  },
  created() {
    this.listUsers()
    this.listRoles()
  },
  methods: {
    // 获取用户
    listUsers() {
      UserAPI.getAllUsers(this.current, this.size, this.keywords, this.loginType)
        .then(res => {
          this.count = res.data.count
          this.userList = res.data.recordList
          this.loading = false
        }).catch(error => {
          console.log(error)
        })
    },
    // 获取角色
    listRoles() {
      RoleAPI.getRole().then(res => {
        this.userRoleList = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    searchUsers() {
      this.current = 1
      this.listUsers()
    },

    changeDisable(user) {

    },
    openEditModel(user) {
      this.roleIdList = []
      this.userForm = JSON.parse(JSON.stringify(user))
      this.userForm.roleList.forEach(item => {
        this.roleIdList.push(item.id)
      })
      this.isEdit = true
    },
    editUserRole() {
      this.userForm.roleIdList = this.roleIdList
      console.log(this.userForm)
      RoleAPI.updateRole(this.userForm).then(res => {
        console.log(res)
        if (res.flag) {
          this.$message.success('更新成功')
          this.isEdit = false
        } else {
          this.$message.error('更新失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    sizeChange(size) {
      this.size = size
      this.listUsers()
    },
    currentChange(current) {
      this.current = current
      this.listUsers()
    }
  }
}
</script>

<style scoped>

</style>
