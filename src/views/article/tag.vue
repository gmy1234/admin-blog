<template>
  <el-card class="main-card">
    <div class="title">标签管理</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openModel(null)"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="tagIdList.length === 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <div style="margin-left:auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入标签名"
          style="width:200px"
          @keyup.enter.native="searchTags"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchTags"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      v-loading="loading"
      border
      :data="tagList"
      @selection-change="selectionChange"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 标签名 -->
      <el-table-column prop="tagName" label="标签名" align="center">
        <template slot-scope="scope">
          <el-tag>
            {{ scope.row.tagName }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章量 -->
      <el-table-column prop="articleCount" label="文章量" align="center" />
      <!-- 标签创建时间 -->
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)">编辑</el-button>
          <el-button slot="reference" size="mini" type="danger" @click="deleteTag(scope.row.id)">删除</el-button>
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
    <!-- 批量删除对话框 -->
    <el-dialog :visible.sync="isDelete" width="30%">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteTag(null)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div class="dialog-title-container" slot="title" ref="tagTitle" />
      <el-form label-width="80px" size="medium" :model="tagForm">
        <el-form-item label="标签名">
          <el-input style="width:220px" v-model="tagForm.tagName" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditTag">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import API from '../../api/tag'
export default {
  inject: ['reload'], // 注入重新加载方法
  name: 'Tag',
  data() {
    return {
      isDelete: false,
      loading: false,
      addOrEdit: false,
      tagIdList: [], // 标签ID 集合
      tagList: [], // 标签集合
      keywords: '', // 搜索关键词
      tagForm: {
        id: null,
        tagName: ''
      },
      current: 1,
      size: 10,
      count: 0
    }
  },
  created() {
    this.listTag()
  },
  methods: {
    // 获取标签集合
    listTag() {
      console.log(this.current)
      API.getAllTag(this.current, this.size, this.keywords).then(res => {
        this.tagList = res.data.recordList
        this.count = res.data.count
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    // 打开修改对话框
    openModel(tag) {
      if (tag != null) {
        this.tagForm = JSON.parse(JSON.stringify(tag))
        this.$refs.tagTitle.innerHTML = '修改分类'
      } else {
        this.tagForm.id = null
        this.tagForm.categoryName = ''
        this.$refs.tagTitle.innerHTML = '添加分类'
      }
      this.addOrEdit = true
    },
    // 搜索对应名称的标签
    searchTags() {
      this.current = 1
      this.listTag()
    },
    sizeChange(size) {
      alert(size)
      this.listTag()
    },
    currentChange(current) {
      alert(current)
      this.current = current
      this.listTag()
    },
    selectionChange(click) {
      this.tagIdList = []
      console.log(this.tagIdList)
      click.forEach(item => {
        this.categoryIdList.push(item.id)
      })
    },
    // 删除单个标签
    deleteTag(id) {
      console.log(id)
      if (id != null) {
        this.$confirm(
          `确定进行删除操作?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          API.deletedTag(id).then(res => {
            if (res.flag) {
              this.reload()
              this.$message.success('成功', res.message)
            }
          }).catch(error => {
            console.log(error)
          })
        })
      } else {
        // TODO 批量删除
      }
    },
    // 添加或者更新标签
    addOrEditTag() {
      if (this.tagForm.tagName.trim() === '') {
        this.$message.error('分类名不能为空')
        return false
      }
      API.saveOrUpdateTag(this.tagForm).then(res => {
        if (res.flag) {
          this.$message.success('成功')
          this.listTag()
        } else {
          this.$message.error('失败')
        }
      }).catch(error => {
        console.log(error)
      })
      this.addOrEdit = false
    }
  }
}
</script>

<style scoped>
.operation-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.pagination-container {
  float: right;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}
</style>
