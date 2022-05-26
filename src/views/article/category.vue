<template>
  <el-card class="main-card">
    <div class="title">分类列表</div>
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
        :disabled="this.categoryIdList.length === 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <div style="margin-left:auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入分类名"
          style="width:200px"
          @keyup.enter.native="searchCategories"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchCategories"
        >
          搜索
        </el-button>
      </div>
    </div>

    <!-- 表格展示 -->
    <el-table
      v-loading="loading"
      border
      :data="categoryList"
      @selection-change="selectionChange()"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 分类名 -->
      <el-table-column prop="categoryName" label="分类名" align="center" />
      <!-- 文章量 -->
      <el-table-column prop="articleCount" label="文章量" align="center" />
      <!-- 分类创建时间 -->
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)" @confirm="deleteCategory(scope.row.id)">
            编辑
          </el-button>
          <el-popconfirm title="确定删除吗？" style="margin-left:1rem">
            <el-button slot="reference" size="mini" type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 TODO: bug-->
    <el-pagination
      class="pagination-container"
      background
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[5, 10]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 批量删除对话框 -->
    <el-dialog :visible.sync="isDelete" width="30%">
      <div slot="title" class="dialog-title-container">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteCategory(null)">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div slot="title" ref="categoryTitle" class="dialog-title-container" />
      <el-form label-width="80px" size="medium" :model="categoryForm">
        <el-form-item label="分类名">
          <el-input v-model="categoryForm.categoryName" style="width:220px" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import API from '../../api/category.js'
export default {
  name: 'Category',

  data() {
    return {
      categoryIdList: [], // 分类Id集合
      categoryList: [], // 分类集合
      keywords: '', // 关键词搜索
      isDelete: false,
      loading: false,
      addOrEdit: false,
      categoryForm: { // 添加分类时需要的数据
        id: null,
        categoryName: ''
      },
      current: 1, // 当前页
      size: 10, // 每页大小
      count: 0 // 总记录数

    }
  },
  created() {
    this.listCategories()
  },
  methods: {
    // 分页获取所有分类列表
    listCategories() {
      API.getAllCategory(this.current, this.size, this.keywords)
        .then(res => {
          this.categoryList = res.data.recordList
          this.count = res.count
          this.loading = false
        }).catch(error => {
          console.log(error)
        })
    },
    // 分类的ID放到 idList中
    selectionChange(val) {
      console.log(val)
      this.categoryIdList = []
      console.log(this.categoryIdList)
      this.categoryList.forEach(item => {
        this.categoryIdList.push(item.id)
      })
    },
    openModel(category) {
      if (category != null) {
        this.categoryForm = JSON.parse(JSON.stringify(category))
        this.$refs.categoryTitle.innerHTML = '修改分类'
      } else {
        this.categoryForm.id = null
        this.categoryForm.categoryName = ''
        this.$refs.categoryTitle.innerHTML = '添加分类'
      }
      this.addOrEdit = true
    },
    // 删除分类
    deleteCategory(id) {
      let param = {}
      if (id == null) {
        param = { data: this.categoryIdList }
        console.log(param)
        API.deletedCategoryBatch(param).then(res => {
          // TODO
        }).catch(error => {
          console.log(error)
        })
      } else {
        API.deletedCategory(id)
          .then(res => {
            if (res.flag) {
              this.$notify.success('成功', res.message)
              this.listCategories()
            }
          }).catch(error => {
            console.log(error)
          })
      }
    },
    addOrEditCategory() {

    },
    searchCategories() {
      this.current = 1
      this.listCategories()
    },
    sizeChange(size) {
      this.size = size
      this.listCategories()
    },
    currentChange(curren) {
      this.current = curren
      this.listCategories()
    }

  }

}
</script>

<style scoped>
.operation-container{
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
