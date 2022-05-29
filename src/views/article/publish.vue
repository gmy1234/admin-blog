<template>
  <el-card class="main-card">
    <div class="title">发布文章</div>
    <!-- 文章标题 -->
    <div class="article-title-container">
      <el-input
        v-model="article.articleTitle"
        size="medium"
        placeholder="输入文章标题"
      />
      <el-button
        v-if="article.id == null || article.status === 3"
        type="danger"
        size="medium"
        class="save-btn"
        @click="saveArticleDraft"
      >
        保存草稿
      </el-button>
      <el-button
        type="danger"
        size="medium"
        style="margin-left:10px"
        @click="openModel"
      >
        发布文章
      </el-button>
    </div>
    <!-- 文章内容 -->
    <mavon-editor
      ref="md"
      v-model="article.articleContent"
      style="height:calc(100vh - 260px)"
      @imgAdd="uploadImg"
    />
    <!-- 添加文章对话框 -->
    <el-dialog :visible.sync="addOrEdit" width="40%" top="3vh">
      <div slot="title" class="dialog-title-container">
        发布文章
      </div>
      <!-- 文章数据 -->
      <el-form label-width="80px" size="medium" :model="article">
        <!-- 文章分类 -->
        <el-form-item label="文章分类">
          <el-tag
            v-show="article.categoryName"
            type="success"
            style="margin:0 1rem 0 0"
            :closable="true"
            @close="removeCategory"
          >
            {{ article.categoryName }}
          </el-tag>
          <!-- 分类选项 -->
          <el-popover
            v-if="!article.categoryName"
            placement="bottom-start"
            width="460"
            trigger="click"
          >
            <div class="popover-title">分类</div>
            <!-- 搜索框 -->
            <el-autocomplete
              v-model="categoryName"
              style="width:100%"
              :fetch-suggestions="searchCategories"
              placeholder="请输入分类名搜索，enter可添加自定义分类"
              :trigger-on-focus="false"
              @keyup.enter.native="saveCategory"
              @select="handleSelectCategories"
            >
              <template slot-scope="{ item }">
                <div>{{ item.categoryName }}</div>
              </template>
            </el-autocomplete>
            <!-- 分类 -->
            <div class="popover-container">
              <div
                v-for="item of categoryList"
                :key="item.id"
                class="category-item"
                @click="addCategory(item)"
              >
                {{ item.categoryName }}
              </div>
            </div>
            <el-button slot="reference" type="success" plain size="small">
              添加分类
            </el-button>
          </el-popover>
        </el-form-item>
        <!-- 文章标签 -->
        <el-form-item label="文章标签">
          <el-tag
            v-for="(item, index) of article.tagNameList"
            :key="index"
            style="margin:0 1rem 0 0"
            :closable="true"
            @close="removeTag(item)"
          >
            {{ item }}
          </el-tag>
          <!-- 标签选项 -->
          <el-popover
            v-if="article.tagNameList.length < 5"
            placement="bottom-start"
            width="460"
            trigger="click"
          >
            <div class="popover-title">标签</div>
            <!-- 搜索框 -->
            <el-autocomplete
              v-model="tagName"
              style="width:100%"
              :fetch-suggestions="searchTags"
              placeholder="请输入标签名搜索，enter可添加自定义标签"
              :trigger-on-focus="false"
              @keyup.enter.native="saveTag"
              @select="handleSelectTag"
            >
              <template slot-scope="{ item }">
                <div>{{ item.tagName }}</div>
              </template>
            </el-autocomplete>
            <!-- 标签 -->
            <div class="popover-container">
              <div style="margin-bottom:1rem">添加标签</div>
              <el-tag
                v-for="(item, index) of tagList"
                :key="index"
                :class="tagClass(item)"
                @click="addTag(item)"
              >
                {{ item.tagName }}
              </el-tag>
            </div>
            <el-button slot="reference" type="primary" plain size="small">
              添加标签
            </el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="article.type" placeholder="请选择类型">
            <el-option
              v-for="item in typeList"
              :key="item.type"
              :label="item.desc"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <!-- 文章类型 -->
        <el-form-item v-if="article.type !== 1" label="原文地址">
          <el-input
            v-model="article.originalUrl"
            placeholder="请填写原文链接"
          />
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
            class="upload-cover"
            drag
            action="/api/admin/articles/images"
            multiple
            :before-upload="beforeUpload"
            :on-success="uploadCover"
          >
            <i v-if="article.articleCover === ''" class="el-icon-upload" />
            <div v-if="article.articleCover === ''" class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
              v-else
              :src="article.articleCover"
              width="360px"
              height="180px"
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch
            v-model="article.isTop"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="发布形式">
          <el-radio-group v-model="article.status">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">私密</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="danger" @click="saveOrUpdateArticle">
          发 表
        </el-button>
      </div>
    </el-dialog>
  </el-card>

</template>

<script>
import categoryAPI from '@/api/article/category'
import tagAPI from '@/api/article/tag'
import articleAPI from '@/api/article/article'

export default {
  name: 'Publish',
  data() {
    return {
      addOrEdit: false, // 发布文章对话框展示
      autoSave: true, // 自动保存
      categoryName: '',
      tagName: '',
      categoryList: [],
      tagList: [],
      typeList: [
        {
          type: 1,
          desc: '原创'
        },
        {
          type: 2,
          desc: '转载'
        },
        {
          type: 3,
          desc: '翻译'
        }
      ],
      // 文章
      article: {
        id: null,
        articleTitle: this.$moment(new Date()).format('YYYY-MM-DD'), // 文章标题，默认日期
        articleContent: '',
        articleCover: '', // 文章封面
        categoryName: null,
        tagNameList: [], // 标签集合
        originalUrl: '',
        isTop: 0, // 是否置顶
        type: 1,
        status: 1
      }
    }
  },
  computed: {
    tagClass() {
      return function(item) {
        const index = this.article.tagNameList.indexOf(item.tagName)
        return index !== -1 ? 'tag-item-select' : 'tag-item'
      }
    }
  },
  created() {
    this.editArticle()

  },
  destroyed() {
    // 自动保存
    this.autoSaveArticle()
  },
  methods: {
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
    },
    // 保存草稿
    saveArticleDraft() {
      if (this.article.articleTitle.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.articleContent.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      this.article.status = 3 // 草稿
      articleAPI.publishArticle(this.article)
        .then(res => {
          if (res.flag) {
            this.$message.success('发布成功')
          } else {
            this.$message.error('发布失败')
          }
        }).catch(error => {
          console.log(error)
        })
    },
    // 发布文章
    saveOrUpdateArticle() {
      // 校验
      if (this.article.articleTitle.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.articleContent.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      if (this.article.categoryName == null) {
        this.$message.error('文章分类不能为空')
        return false
      }
      if (this.article.tagNameList.length === 0) {
        this.$message.error('文章标签不能为空')
        return false
      }
      articleAPI.publishArticle(this.article)
        .then(res => {
          if (res.flag) {
            this.$message.success('发布成功')
          } else {
            this.$message.error('发布失败')
          }
        }).catch(error => {
          console.log(error)
        })
      this.addOrEdit = false
    },
    // 自动保存
    autoSaveArticle() {
      if (this.article.id != null && this.autoSave && this.article.articleTitle.trim() !== '' &&
        this.article.articleContent.trim() !== '') {
        articleAPI.publishArticle(this.article).then(res => {
          if (res.flag) {
            this.$message.success('自动保存成功')
          } else {
            this.$message.error('自动保存失败')
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 打开对话框
    openModel() {
      if (this.article.articleTitle.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.articleContent.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      this.listCategories()
      this.listTags()
      this.addOrEdit = true
    },
    // 上传图片
    uploadImg() {

    },
    // 以下是发布文章对话框里的方法： --------------------0.0----------------------
    //
    removeCategory() {
      this.article.categoryName = null
    },
    // 搜索文章分类
    searchCategories(keywords, callback) {
      categoryAPI.searchCategories(keywords)
        .then(res => {
          callback(res.data)
        })
    },
    // 新添加的保存分类
    saveCategory() {
      if (this.categoryName.trim() !== '') {
        this.addCategory({
          categoryName: this.categoryName
        })
      }
      this.categoryName = ''
    },
    // 分类
    handleSelectCategories(item) {
      this.addCategory({ categoryName: this.categoryName })
    },
    // 添加/选择分类
    addCategory(it) {
      this.article.categoryName = it.categoryName
    },

    // 移除标签
    removeTag(item) {
      // 获取标签对应的索引
      const index = this.article.tagNameList.indexOf(item)
      console.log(index)
      this.article.tagNameList.splice(index, 1)
    },
    // 搜索标签
    searchTags(keywords, callback) {
      tagAPI.searchTags(keywords).then(res => {
        callback(res.data)
      }).catch(error => {
        console.log(error)
      })
    },
    // 保存标签
    saveTag() {
      if (this.tagName.trim() === '') {
        this.addTag({ tagName: this.tagName })
      }
      this.tagName = ''
    },
    // 选择标签
    handleSelectTag(item) {
      this.addTag({ tageName: item.tagName })
    },
    addTag(item) {
      if (this.article.tagNameList.indexOf(item.tagName) === -1) {
        this.article.tagNameList.push(item.tagName)
      }
    },
    // TODO：上传文件
    beforeUpload() {

    },
    uploadCover() {

    },
    // 编辑文章时，跳转页面，数据回显
    editArticle() {
      const path = this.$route.path
      console.log(path)
      const articleId = this.$route.params.id
      console.log(articleId)
      if (articleId) {
        articleAPI.getArticle(articleId).then(res => {
          this.article = res.data
        }).catch(error => {
          console.log(error)
        })
      } else {

      }
    }

  }
}
</script>

<style scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}
.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}
.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}
</style>
