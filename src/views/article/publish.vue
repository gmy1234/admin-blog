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
    <!-- 文章内容 -->
    <mavon-editor
      ref="md"
      v-model="article.articleContent"
      @imgAdd="uploadImg"
      style="height:calc(100vh - 260px)"
    />
    <!-- 添加文章对话框 -->
<!--    <el-dialog :visible.sync="addOrEdit" width="40%" top="3vh">-->
<!--      <div class="dialog-title-container" slot="title">-->
<!--        发布文章-->
<!--      </div>-->
<!--      &lt;!&ndash; 文章数据 &ndash;&gt;-->
<!--      <el-form label-width="80px" size="medium" :model="article">-->
<!--        &lt;!&ndash; 文章分类 &ndash;&gt;-->
<!--        <el-form-item label="文章分类">-->
<!--          <el-tag-->
<!--            type="success"-->
<!--            v-show="article.categoryName"-->
<!--            style="margin:0 1rem 0 0"-->
<!--            :closable="true"-->
<!--            @close="removeCategory"-->
<!--          >-->
<!--            {{ article.categoryName }}-->
<!--          </el-tag>-->
<!--          &lt;!&ndash; 分类选项 &ndash;&gt;-->
<!--          <el-popover-->
<!--            placement="bottom-start"-->
<!--            width="460"-->
<!--            trigger="click"-->
<!--            v-if="!article.categoryName"-->
<!--          >-->
<!--            <div class="popover-title">分类</div>-->
<!--            &lt;!&ndash; 搜索框 &ndash;&gt;-->
<!--            <el-autocomplete-->
<!--              style="width:100%"-->
<!--              v-model="categoryName"-->
<!--              :fetch-suggestions="searchCategories"-->
<!--              placeholder="请输入分类名搜索，enter可添加自定义分类"-->
<!--              :trigger-on-focus="false"-->
<!--              @keyup.enter.native="saveCategory"-->
<!--              @select="handleSelectCategories"-->
<!--            >-->
<!--              <template slot-scope="{ item }">-->
<!--                <div>{{ item.categoryName }}</div>-->
<!--              </template>-->
<!--            </el-autocomplete>-->
<!--            &lt;!&ndash; 分类 &ndash;&gt;-->
<!--            <div class="popover-container">-->
<!--              <div-->
<!--                v-for="item of categoryList"-->
<!--                :key="item.id"-->
<!--                class="category-item"-->
<!--                @click="addCategory(item)"-->
<!--              >-->
<!--                {{ item.categoryName }}-->
<!--              </div>-->
<!--            </div>-->
<!--            <el-button type="success" plain slot="reference" size="small">-->
<!--              添加分类-->
<!--            </el-button>-->
<!--          </el-popover>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash; 文章标签 &ndash;&gt;-->
<!--        <el-form-item label="文章标签">-->
<!--          <el-tag-->
<!--            v-for="(item, index) of article.tagNameList"-->
<!--            :key="index"-->
<!--            style="margin:0 1rem 0 0"-->
<!--            :closable="true"-->
<!--            @close="removeTag(item)"-->
<!--          >-->
<!--            {{ item }}-->
<!--          </el-tag>-->
<!--          &lt;!&ndash; 标签选项 &ndash;&gt;-->
<!--          <el-popover-->
<!--            placement="bottom-start"-->
<!--            width="460"-->
<!--            trigger="click"-->
<!--            v-if="article.tagNameList.length < 3"-->
<!--          >-->
<!--            <div class="popover-title">标签</div>-->
<!--            &lt;!&ndash; 搜索框 &ndash;&gt;-->
<!--            <el-autocomplete-->
<!--              style="width:100%"-->
<!--              v-model="tagName"-->
<!--              :fetch-suggestions="searchTags"-->
<!--              placeholder="请输入标签名搜索，enter可添加自定义标签"-->
<!--              :trigger-on-focus="false"-->
<!--              @keyup.enter.native="saveTag"-->
<!--              @select="handleSelectTag"-->
<!--            >-->
<!--              <template slot-scope="{ item }">-->
<!--                <div>{{ item.tagName }}</div>-->
<!--              </template>-->
<!--            </el-autocomplete>-->
<!--            &lt;!&ndash; 标签 &ndash;&gt;-->
<!--            <div class="popover-container">-->
<!--              <div style="margin-bottom:1rem">添加标签</div>-->
<!--              <el-tag-->
<!--                v-for="(item, index) of tagList"-->
<!--                :key="index"-->
<!--                :class="tagClass(item)"-->
<!--                @click="addTag(item)"-->
<!--              >-->
<!--                {{ item.tagName }}-->
<!--              </el-tag>-->
<!--            </div>-->
<!--            <el-button type="primary" plain slot="reference" size="small">-->
<!--              添加标签-->
<!--            </el-button>-->
<!--          </el-popover>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="文章类型">-->
<!--          <el-select v-model="article.type" placeholder="请选择类型">-->
<!--            <el-option-->
<!--              v-for="item in typeList"-->
<!--              :key="item.type"-->
<!--              :label="item.desc"-->
<!--              :value="item.type"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash; 文章类型 &ndash;&gt;-->
<!--        <el-form-item label="原文地址" v-if="article.type != 1">-->
<!--          <el-input-->
<!--            v-model="article.originalUrl"-->
<!--            placeholder="请填写原文链接"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="上传封面">-->
<!--          <el-upload-->
<!--            class="upload-cover"-->
<!--            drag-->
<!--            action="/api/admin/articles/images"-->
<!--            multiple-->
<!--            :before-upload="beforeUpload"-->
<!--            :on-success="uploadCover"-->
<!--          >-->
<!--            <i class="el-icon-upload" v-if="article.articleCover == ''" />-->
<!--            <div class="el-upload__text" v-if="article.articleCover == ''">-->
<!--              将文件拖到此处，或<em>点击上传</em>-->
<!--            </div>-->
<!--            <img-->
<!--              v-else-->
<!--              :src="article.articleCover"-->
<!--              width="360px"-->
<!--              height="180px"-->
<!--            />-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="置顶">-->
<!--          <el-switch-->
<!--            v-model="article.isTop"-->
<!--            active-color="#13ce66"-->
<!--            inactive-color="#F4F4F5"-->
<!--            :active-value="1"-->
<!--            :inactive-value="0"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="发布形式">-->
<!--          <el-radio-group v-model="article.status">-->
<!--            <el-radio :label="1">公开</el-radio>-->
<!--            <el-radio :label="2">私密</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer">-->
<!--        <el-button @click="addOrEdit = false">取 消</el-button>-->
<!--        <el-button type="danger" @click="saveOrUpdateArticle">-->
<!--          发 表-->
<!--        </el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
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
  methods: {
    // 保存草稿
    saveArticleDraft() {

    },
    // 发布文章
    openModel() {

    },
    uploadImg() {

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
