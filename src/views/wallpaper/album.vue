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
        新建相册
      </el-button>
      <div style="margin-left:auto">
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          style="margin-right:1rem"
          @click="checkDelete"/>
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入相册名"
          style="width:200px"
          @keyup.enter.native="searchAlbums"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchAlbums"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 相册列表 -->
    <el-row :loading="loading" class="album-container" :gutter="12">
      <!-- 空状态 -->
      <el-empty v-if="albumList === null" description="暂无相册" />
      <el-col v-for="item of albumList" :key="item.id" :md="6">
        <div class="album-item" @click="checkPhoto(item)">
          <!-- 相册操作 -->
          <div class="album-opreation">
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
          <div class="album-photo-count">
            <div>{{ item.photoCount }}</div>
            <i v-if="item.status === 2" class="iconfont el-icon-mymima" />
          </div>
          <el-image fit="cover" class="album-cover" :src="item.albumCover" />
          <div class="album-name">{{ item.albumName }}</div>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
      :hide-on-single-page="true"
      class="pagination-container"
      :current-page="current"
      :page-size="size"
      :total="count"
      layout="prev, pager, next"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 新增/修改模态框 -->
    <el-dialog :visible.sync="addOrEdit" width="35%" top="10vh">
      <div slot="title" ref="albumTitle" class="dialog-title-container" />
      <el-form label-width="80px" size="medium" :model="albumForum">
        <el-form-item label="相册名称">
          <el-input v-model="albumForum.albumName" style="width:220px" />
        </el-form-item>
        <el-form-item label="相册描述">
          <el-input v-model="albumForum.albumDesc" style="width:220px" />
        </el-form-item>
        <el-form-item label="相册封面">
          <el-upload
            class="upload-cover"
            drag
            :show-file-list="false"
            :before-upload="beforeUpload"
            :action="baseURL"
            multiple
            :on-success="uploadCover"
          >
            <i v-if="albumForum.albumCover === ''" class="el-icon-upload" />
            <div v-if="albumForum.albumCover === ''" class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img v-else :src="albumForum.albumCover" width="360px" height="180px">
          </el-upload>
        </el-form-item>
        <el-form-item label="发布形式">
          <el-radio-group v-model="albumForum.status">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">私密</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditAlbum">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :visible.sync="isDelete" width="30%">
      <div slot="title" class="dialog-title-container">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除该相册？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteAlbum">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

import * as imageConversion from 'image-conversion'
import AlbumAPI from '../../api/wallpaper/album'
import * as constants from '../../utils/constants'
export default {
  name: 'Album',
  data() {
    return {
      keywords: '',
      loading: true,
      isDelete: false,
      addOrEdit: false,
      albumForum: {
        id: null,
        albumName: '',
        albumDesc: '',
        albumCover: '',
        status: 1
      },
      albumList: [],
      current: 1,
      size: 8,
      count: 0,
      baseURL: 'http://localhost:8000/api/admin/album/uploadCover'
    }
  },
  created() {
    this.listAlbums()
  },
  methods: {
    openModel(item) {
      if (item) {
        console.log(item)
        this.albumForum = JSON.parse(item)
        this.$refs.albumTitle.innerHTML = '修改相册'
      } else {
        this.albumForum = {
          id: null,
          albumName: '',
          albumLabel: '',
          albumCover: '',
          status: 1
        }
        this.$refs.albumTitle.innerHTML = '新建相册'
      }
      this.addOrEdit = true
    },
    // 选择指定的相册，跳转到相册里去
    checkPhoto(item) {
      console.log(item.id)
      this.$router.push({ path: '/wallpaper/album/' + item.id })
    },
    checkDelete() {
      this.$router.push({ path: '/wallpaper/delete' })
    },
    listAlbums() {
      AlbumAPI.listPhotoAlbums().then(res => {
        this.albumList = res.data
        this.count = res.data.count
        this.loading = false
      })
    },
    addOrEditAlbum() {
      if (this.albumForum.albumName.trim() === '') {
        this.$message.error('相册名称不能为空')
        return false
      }
      if (this.albumForum.albumDesc.trim() === '') {
        this.$message.error('相册描述不能为空')
        return false
      }
      if (this.albumForum.albumCover == null) {
        this.$message.error('相册封面不能为空')
        return false
      }
      AlbumAPI.saveOrUpdate(this.albumForum).then(res => {
        if (res.flag) {
          this.$notify.success({
            title: '成功',
            message: res.message
          })
          this.listAlbums()
        } else {
          this.$notify.error({
            title: '失败',
            message: res.message
          })
        }
        this.listAlbums()
      }).catch(error => {
        console.log(error)
      })

      this.addOrEdit = false
    },
    uploadCover(response) {
      console.log(response)
      this.albumForum.albumCover = response.data
    },
    beforeUpload(file) {
      const c = new Promise(resolve => {
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
      console.log(c)
      return c
    },
    handleCommand(command) {
      const type = command.substring(0, 6)
      const data = command.substring(6)
      if (type === 'delete') {
        this.albumForum.id = data
        this.isDelete = true
      } else {
        console.log(data)
        this.openModel(data)
      }
    },
    deleteAlbum() {
      AlbumAPI.delete(this.albumForum.id).then(res => {
        if (res.flag) {
          this.$notify.success({
            title: '成功',
            message: res.message
          })
          this.isDelete = false
          this.listAlbums()
        } else {
          this.$notify.error({
            title: '失败',
            message: res.message
          })
        }
      })
    },
    searchAlbums() {
      this.current = 1
      AlbumAPI.searchAlbums(this.current, this.size, this.keywords).then(res => {
        this.albumList = res.data.recordList
        this.count = res.data.count
        this.loading = false
      })
    },
    sizeChange(size) {
      this.size = size
      this.listAlbums()
    },
    currentChange(current) {
      this.current = current
      this.listAlbums()
    }
  }

}
</script>

<style scoped>
.album-cover {
  position: relative;
  border-radius: 4px;
  width: 100%;
  height: 170px;
}

.album-cover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.album-photo-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  z-index: 1000;
  position: absolute;
  left: 0;
  right: 0;
  padding: 0 0.5rem;
  bottom: 2.6rem;
  color: #fff;
}

.album-name {
  text-align: center;
  margin-top: 0.5rem;
}

.album-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}

.album-opreation {
  position: absolute;
  z-index: 1000;
  top: 0.5rem;
  right: 0.8rem;
}
</style>
