<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 文章状态 -->
    <div class="article-status-menu">
      <el-button type="info" circle @click="selectType('all')">
        <Iconfont type="home" />全部
      </el-button>
      <el-button type="primary" icon="el-icon-edit" circle @click="selectType('public')">公开</el-button>
      <el-button type="success" icon="el-icon-view" circle @click="selectType('secret')">私密</el-button>
      <el-button type="warning" icon="el-icon-message" circle @click="selectType('draft')">草稿箱</el-button>
      <el-button type="danger" icon="el-icon-delete" circle @click="selectType('delete')">回收站</el-button>
    </div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        v-if="isDelete === 0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="articleIdList.length === 0"
        @click="updateIsDelete = true"
      >
        批量删除
      </el-button>
      <el-button
        v-else
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="articleIdList.length === 0"
        @click="remove = true"
      >
        批量删除
      </el-button>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <!-- 文章类型 -->
        <el-select
          v-model="type"
          clearable
          placeholder="请选择文章类型"
          size="small"
          style="margin-right:1rem"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 分类 -->
        <el-select
          v-model="categoryId"
          clearable
          size="small"
          filterable
          placeholder="请选择分类"
          style="margin-right:1rem"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
        <!-- 标签 -->
        <el-select
          v-model="tagId"
          clearable
          size="small"
          filterable
          placeholder="请选择标签"
          style="margin-right:1rem"
        >
          <el-option
            v-for="item in tagList"
            :key="item.id"
            :label="item.tagName"
            :value="item.id"
          />
        </el-select>
        <!-- 文章名 -->
        <el-input
          v-model="keywords"
          clearable
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入文章名"
          style="width:200px"
          @keyup.enter.native="searchArticles"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchArticles"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      v-loading="loading"
      border
      :data="articleList"
      @selection-change="selectionChange"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 文章修改时间 -->
      <el-table-column
        prop="articleCover"
        label="文章封面"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <el-image
            class="article-cover"
            :src="
              scope.row.articleCover
                ? scope.row.articleCover
                : 'https://static.talkxj.com/articles/c5cc2b2561bd0e3060a500198a4ad37d.png'
            "
          />
          <i class="el-icon-view article-status-icon" />
        </template>
      </el-table-column>
      <!-- 文章标题 -->
      <el-table-column prop="articleTitle" label="标题" align="center" />
      <!-- 文章分类 -->
      <el-table-column
        prop="categoryName"
        label="分类"
        width="110"
        align="center"
      />
      <!-- 文章标签 -->
      <el-table-column prop="tagDTOList" label="标签" width="170" align="center">
        <template slot-scope="scope">
          <el-tag
            v-for="item of scope.row.tagDTOList"
            :key="item.tagId"
            style="margin-right:0.2rem;margin-top:0.2rem"
          >
            {{ item.tagName }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章浏览量 -->
      <el-table-column prop="viewsCount" label="浏览量" width="70" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.viewsCount">
            {{ scope.row.viewsCount }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 文章点赞量 -->
      <el-table-column prop="likeCount" label="点赞量" width="70" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.likeCount">{{ scope.row.likeCount }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 文章类型 -->
      <el-table-column prop="type" label="类型" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="articleType(scope.row.type).tagType">
            {{ articleType(scope.row.type).name }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章发表时间 -->
      <el-table-column prop="createTime" label="发表时间" width="130" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <!-- 文章置顶 -->
      <el-table-column prop="isTop" label="置顶" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isTop"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :disabled="scope.row.isDelete === 1"
            :active-value="1"
            :inactive-value="0"
            @change="changeTop(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDelete === 0" type="primary" size="mini" @click="editArticle(scope.row.id)">
            编辑
          </el-button>
          <el-popconfirm
            v-if="scope.row.isDelete === 0"
            title="确定删除吗？"
            style="margin-left:10px"
            @confirm="updateArticleDelete(scope.row.id)"
          >
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
          <el-popconfirm
            v-if="scope.row.isDelete === 1"
            title="确定恢复吗？"
            @confirm="recoverArticleDelete(scope.row.id)"
          >
            <el-button slot="reference" size="mini" type="success">恢复</el-button>
          </el-popconfirm>
          <el-popconfirm
            v-if="scope.row.isDelete ===1"
            style="margin-left:10px"
            title="确定彻底删除吗？"
            @confirm="deleteArticles(scope.row.id)"
          >
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import Iconfont from '@/components/Iconfont'
import categoryAPI from '@/api/article/category'
import tagAPI from '@/api/article/tag'
import articleAPI from '@/api/article/article'
export default {
  name: 'List',
  components: { Iconfont },
  data() {
    return {
      isDelete: 0, // 选中文章的数量？
      remove: false,
      updateIsDelete: false,
      loading: true,
      activeStatus: 'all',
      articleList: [],
      articleIdList: [],
      categoryId: null,
      tagId: null,
      status: null,
      categoryList: [],
      tagList: [],
      type: null,
      typeList: [
        {
          value: 1,
          label: '原创'
        },
        {
          value: 2,
          label: '转载'
        },
        {
          value: 3,
          label: '翻译'
        }
      ],
      keywords: '',
      current: 1,
      size: 10,
      count: 0
    }
  },
  computed: {
    articleType() {
      return function(type) {
        let tagType = ''
        let name = ''
        switch (type) {
          case 1:
            tagType = 'danger'
            name = '原创'
            break
          case 2:
            tagType = 'success'
            name = '转载'
            break
          case 3:
            tagType = 'primary'
            name = '翻译'
            break
        }
        return {
          tagType: tagType,
          name: name
        }
      }
    }
  },
  created() {
    this.listArticles()
    this.listCategories()
    this.listTags()
  },
  methods: {
    // 获取所有文章
    listArticles() {
      articleAPI.getALlArticle(this.current,
        this.size,
        this.keywords,
        this.categoryId,
        this.status,
        this.tagId,
        this.type,
        this.isDelete).then(res => {
        // 数据填充
        this.articleList = res.data.recordList
        this.count = res.data.count
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    listCategories() {
      categoryAPI.searchCategories(null)
        .then(res => {
          this.categoryList = res.data
        }).catch(error => {
          console.log(error)
        })
    },
    listTags() {
      tagAPI.searchTag(null)
        .then(res => {
          this.tagList = res.data
        }).catch(error => {
          console.log(error)
        })
      console.log(this.$router)
    },
    // 选择对应的文章类型
    selectType(type) {
      switch (type) {
        case 'all':
          break
        case 'draft':
          break
        case 'public':
          break
        case 'secret':
          break
        case 'delete':
          break
      }
    },
    // 搜索文章
    searchArticles() {

    },
    // 选择对应的文章
    selectionChange() {

    },
    // 置顶
    changeTop() {

    },
    // 编辑文章
    editArticle(id) {
      // 动态路由：
      this.$router.push({ path: '/article/edit/' + `${id}` })
    },
    updateArticleDelete() {

    },
    // 恢复文章
    recoverArticleDelete() {

    },
    // 彻底删除
    deleteArticles() {

    }

  }
}
</script>

<style scoped>
.operation-container {
  margin-top: 1.5rem;
}

.article-status-menu {
  font-size: 14px;
  margin-top: 40px;
  color: #999;
}

.article-status-menu span {
  margin-right: 24px;
}

.status {
  cursor: pointer;
}

.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.article-cover {
  position: relative;
  width: 100%;
  height: 90px;
  border-radius: 4px;
}

.article-cover::after {
  content: "";
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.article-status-icon {
  color: #fff;
  font-size: 1.5rem;
  position: absolute;
  right: 1rem;
  bottom: 1.4rem;
}
</style>
