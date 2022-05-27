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
        type="danger"
        size="medium"
        class="save-btn"
        @click="saveArticleDraft"
        v-if="article.id == null || article.status == 3"
      >
        保存草稿
      </el-button>
      <el-button
        type="danger"
        size="medium"
        @click="openModel"
        style="margin-left:10px"
      >
        发布文章
      </el-button>
    </div>
  </el-card>

</template>

<script>
export default {
  name: 'Publish',
  data() {
    return {
      addOrEdit: false,
      autoSave: true,
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
      article: {
        id: null,
        articleTitle: this.$moment(new Date()).format('YYYY-MM-DD'),
        articleContent: '',
        articleCover: '',
        categoryName: null,
        tagNameList: [],
        originalUrl: '',
        isTop: 0,
        type: 1,
        status: 1
      }
    }
  },
  methods: {
    // 保存草稿
    saveArticleDraft() {

    },
    // 发布文章
    openModel() {

    },

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
