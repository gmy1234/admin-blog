<template>
  <el-card class="main-card">
    <!-- 标题 -->
    <div class="title">{{ this.$route.name }}</div>
    <div class="operation-container">
      <!-- 数据筛选 -->
      <div style="margin-left:auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入用户昵称"
          style="width:200px"
          @keyup.enter.native="listOnlineUsers"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="listOnlineUsers"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 权限列表 -->
    <el-table v-loading="loading" :data="userList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="avatar" label="头像" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center" />
      <el-table-column prop="ipAddress" label="ip地址" align="center" />
      <el-table-column
        prop="ipSource"
        label="登录地址"
        align="center"
        width="200"
      />
      <el-table-column
        prop="browser"
        label="浏览器"
        align="center"
        width="160"
      />
      <el-table-column prop="os" label="操作系统" align="center" />
      <el-table-column
        prop="lastLoginTime"
        label="登录时间"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.lastLoginTime | dateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定下线吗？"
            style="margin-left:10px"
            @confirm="removeOnlineUser(scope.row)"
          >
            <el-button slot="reference" size="mini" type="text">
              <i class="el-icon-delete" /> 下线
            </el-button>
          </el-popconfirm>
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
  </el-card>
</template>

<script>
import UserAPI from '@/api/user/user'

export default {
  name: 'Online',
  data() {
    return {
      loading: true,
      userList: [],
      keywords: null,
      current: 1,
      size: 10,
      count: 0,
      isCheck: false,
      optLog: {}
    }
  },
  computed: {
    tagType() {
      return function(type) {
        switch (type) {
          case 'GET':
            return ''
          case 'POST':
            return 'success'
          case 'PUT':
            return 'warning'
          case 'DELETE':
            return 'danger'
        }
      }
    }
  },
  created() {
    this.listOnlineUsers()
  },
  methods: {
    listOnlineUsers() {
      UserAPI.online(this.current, this.size, this.keywords)
        .then(res => {
          this.count = res.data.count
          this.userList = res.data.recordList
          this.loading = false
        }).catch(error => {
          console.log(error)
        })
    },
    sizeChange(size) {
      this.size = size
      this.listOnlineUsers()
    },
    currentChange(current) {
      this.current = current
      this.listOnlineUsers()
    },
    // 下线用户
    removeOnlineUser(user) {
      UserAPI.offlineUser(user.userInfoId).then(res => {
        if (res.flag) {
          this.$notify.success({ title: '成功', message: res.message })
        } else {
          this.$message.error('下线失败')
        }
      })
    }
  }
}
</script>

<style scoped>
label {
  font-weight: bold !important;
}
</style>
