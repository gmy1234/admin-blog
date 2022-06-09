<template>
  <el-card class="main-card">
    <!-- 标题 -->
    <div class="title">{{ this.$route.name }}</div>
    <div class="operation-container">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openModel(null)"
      >
        新建页面
      </el-button>
    </div>
    <!-- 相册列表 -->
    <el-row :loading="loading" class="background-container" :gutter="12">
      <!-- 空状态 -->
      <el-empty v-if="backgroundList.length === 0" description="暂无页面" />
      <el-col v-for="item of backgroundList" :key="item.id" :md="6">
        <div class="background-item">
          <!-- 相册操作 -->
          <div class="background-operation">
            <el-dropdown @command="handleCommand">
              <i class="el-icon-more" style="color:#fff" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'update' + JSON.stringify(item)">
                  <i class="el-icon-edit" />编辑
                </el-dropdown-item>
                <el-dropdown-item :command="'delete' + item.id">
                  <i class="el-icon-delete" />删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-image fit="cover" class="background-cover" :src="item.backgroundCover" />
          <div class="background-name">{{ item.backgroundName }}</div>
        </div>
      </el-col>
    </el-row>
    <!-- 新增模态框 -->
    <el-dialog :visible.sync="addOrEdit" width="35%" top="10vh">
      <div slot="title" ref="backgroundTitle" class="dialog-title-container" />
      <el-form label-width="80px" size="medium" :model="backgroundForum">
        <el-form-item label="页面名称">
          <el-input v-model="backgroundForum.backgroundName" style="width:220px" />
        </el-form-item>
        <el-form-item label="页面标签">
          <el-input v-model="backgroundForum.backgroundLabel" style="width:220px" />
        </el-form-item>
        <el-form-item label="页面封面">
          <el-upload
            class="upload-cover"
            drag
            :show-file-list="false"
            :action="uploadBack"
            multiple
            :before-upload="beforeUpload"
            :on-success="uploadCover"
          >
            <i v-if="backgroundForum.backgroundCover === ''" class="el-icon-upload" />
            <div v-if="backgroundForum.backgroundCover === ''" class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
              v-else
              :src="backgroundForum.backgroundCover"
              width="360px"
              height="180px"
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditBackground">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :visible.sync="isDeleteBackground" width="30%">
      <div slot="title" class="dialog-title-container">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除该页面？</div>
      <div slot="footer">
        <el-button @click="isDeleteBackground = false">取 消</el-button>
        <el-button type="primary" @click="deleteBackground">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import BackgroundApi from '@/api/background'
import constants from '@/utils/constants'
import * as imageConversion from 'image-conversion'

export default {
  name: 'Background',
  data() {
    return {
      keywords: '',
      loading: true,
      current: 1,
      size: 8,
      count: 0,
      isDeleteBackground: false,
      addOrEdit: false,
      backgroundForum: {
        id: null,
        backgroundName: '',
        backgroundLabel: '',
        backgroundCover: ''
      },
      backgroundList: [],
      uploadBack: constants.BASE_UPLOAD_URL + '/admin/album/uploadCover'
    }
  },
  created() {
    this.listBackground()
  },
  methods: {
    openModel(item) {
      if (item) {
        console.log(item)
        this.backgroundForum = JSON.parse(item)
        this.$refs.backgroundTitle.innerHTML = '修改页面'
      } else {
        this.backgroundForum = {
          id: null,
          backgroundName: '',
          backgroundLabel: '',
          backgroundCover: ''
        }
        this.$refs.backgroundTitle.innerHTML = '新建页面'
      }
      this.addOrEdit = true
    },
    listBackground() {
      BackgroundApi.getBackgrounds().then(res => {
        this.backgroundList = res.data
        this.loading = false
      })
    },
    addOrEditBackground() {
      if (this.backgroundForum.backgroundName.trim() === '') {
        this.$message.error('页面名称不能为空')
        return false
      }
      if (this.backgroundForum.backgroundLabel.trim() === '') {
        this.$message.error('页面标签不能为空')
        return false
      }
      if (this.backgroundForum.backgroundCover == null) {
        this.$message.error('页面封面不能为空')
        return false
      }
      BackgroundApi.updateBackground(this.backgroundForum).then(res => {
        if (res.flag) {
          this.$notify.success({ title: '成功', message: res.message })
          this.listBackground()
        } else {
          this.$notify.error({ title: '失败', message: res.message })
        }
      })
      this.addOrEdit = false
    },
    uploadCover(response) {
      this.backgroundForum.backgroundCover = response.data
    },
    beforeUpload(file) {
      return new Promise(resolve => {
        if (file.size / 1024 < constants.UPLOAD_SIZE) {
          resolve(file)
        }
        // 压缩到200KB,这里的200就是要压缩的大小,可自定义
        imageConversion
          .compressAccurately(file, constants.UPLOAD_SIZE)
          .then(res => {
            resolve(res)
          })
      })
    },
    handleCommand(command) {
      const type = command.substring(0, 6)
      const data = command.substring(6)
      if (type === 'delete') {
        this.backgroundForum.id = data
        this.isDeleteBackground = true
      } else {
        console.log(data)
        this.openModel(data)
      }
    },
    deleteBackground() {
      BackgroundApi.deleteBackground(this.backgroundForum.id).then(res => {
        if (res.flag) {
          this.$notify.success({ title: '成功', message: res.message })
          this.listBackground()
        } else {
          this.$notify.error({ title: '失败', message: res.message })
        }
        this.isDeleteBackground = false
      }).catch(error => {
        console.log(error)
      })
    }
  }

}
</script>

<style scoped>
.background-cover {
  position: relative;
  border-radius: 4px;
  width: 100%;
  height: 170px;
}
.background-name {
  text-align: center;
  margin-top: 0.5rem;
}
.background-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}
.background-operation {
  position: absolute;
  z-index: 1000;
  top: 0.5rem;
  right: 0.8rem;
}
</style>
