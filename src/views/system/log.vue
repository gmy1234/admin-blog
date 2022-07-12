<template>
  <el-card class="main-card">
    <!-- 标题 -->
    <div class="title">{{ this.$route.name }}</div>
    <div class="operation-container">
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="this.logIdList.length == 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <!-- 数据筛选 -->
      <div style="margin-left:auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入模块名或描述"
          style="width:200px"
          @keyup.enter.native="searchLogs"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchLogs"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 权限列表 -->
    <el-table
      @selection-change="selectionChange"
      v-loading="loading"
      :data="logList"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        prop="optModule"
        label="系统模块"
        align="center"
        width="120"
      />
      <el-table-column
        width="100"
        prop="optType"
        label="操作类型"
        align="center"
      />
      <el-table-column
        prop="optDesc"
        label="操作描述"
        align="center"
        width="150"
      />
      <el-table-column
        prop="requestMethod"
        label="请求方式"
        align="center"
        width="100"
      >
        <template v-if="scope.row.requestMethod" slot-scope="scope">
          <el-tag :type="tagType(scope.row.requestMethod)">
            {{ scope.row.requestMethod }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="操作人员" align="center"/>
      <el-table-column
        prop="ipAddress"
        label="登录ip"
        align="center"
        width="130"
      />
      <el-table-column
        prop="ipSource"
        label="登录地址"
        align="center"
        width="150"
      />
      <el-table-column
        prop="createTime"
        label="操作日期"
        align="center"
        width="190"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px"/>
          {{ scope.row.createTime | dateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            slot="reference"
            type="text"
            @click="check(scope.row)"
          >
            <i class="el-icon-view"/> 查看
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:10px"
            @confirm="deleteLog(scope.row.id)"
          >
            <el-button slot="reference" size="mini" type="text">
              <i class="el-icon-delete"/> 删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <span>日志列表</span>
    </div>
  </el-card>
</template>

<script>
import LogAPI from '@/api/log.js'

export default {
  name: 'Log',
  data() {
    return {
      isDelete: false,
      logIdList: [],
      keywords: '',
      size: 10,
      current: 0,
      loading: false,
      logList: [],
      count: 0 // 操作日志的数量
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
    this.listLogs()
  },
  methods: {
    // 搜索根据关键词日志
    searchLogs() {

    },
    selectionChange(logList) {
      this.logIdList = []
      logList.forEach(item => {
        this.logIdList.push(item.id)
      })
    },
    listLogs() {
      LogAPI.getOperatorLogs(this.keywords, this.current, this.size).then(res => {
        this.logList = res.data.recordList
        this.count = res.data.count
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },

    check() {

    },
    deleteLog() {

    }

  }

}
</script>

<style scoped>
label {
  font-weight: bold !important;
}
</style>
