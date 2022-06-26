<template>
  <el-card>
    <div class="title">{{ this.$route.name }}</div>
    <!-- 文章状态 -->
    <div class="status-menu">
      <el-button type="primary" plain @click="changeStatus(null)">全部</el-button>
      <el-button type="success" plain @click="changeStatus(1)">公开</el-button>
      <el-button type="danger" plain @click="changeStatus(2)">私密</el-button>
    </div>
    <el-empty v-if="talkList == null" description="暂无说说" />
    <!-- 说说列表 -->
    <div v-for="item of talkList" :key="item.id" class="talk-item">
      <!-- 用户信息 -->
      <div class="user-info-wrapper">
        <el-avatar class="user-avatar" :src="item.avatar" :size="36" />
        <div class="user-detail-wrapper">
          <div class="user-nickname">
            <div>{{ item.nickname }}</div>
            <!-- 操作 -->
            <el-dropdown trigger="click" @command="handleCommand">
              <i class="el-icon-more" style="color:#333;cursor: pointer;" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'1,' + item.id">
                  <i class="el-icon-edit" />编辑
                </el-dropdown-item>
                <el-dropdown-item :command="'2,' + item.id">
                  <i class="el-icon-delete" />删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 发表时间 -->
          <div class="time">
            {{ item.createTime | dateTime }}
            <span v-if="item.isTop === 1" class="top">
              置顶
            </span>
            <span v-if="item.status === 2" class="secret">
              私密
            </span>
          </div>
          <!-- 说说信息 -->
          <div class="talk-content" v-html="item.content" />
          <!-- 图片列表 -->
          <el-row v-if="item.imgList" :gutter="4" class="talk-images">
            <el-col v-for="(img, index) of item.imgList" :key="index" :md="8" :cols="6">
              <el-image class="images-items" :src="img" :preview-src-list="previewList"/>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="size"
      :total="count"
      layout="prev, pager, next"
      :hide-on-single-page="false"
      class="pagination-container"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 删除对话框 -->
    <el-dialog :visible.sync="isDelete" width="30%">
      <div slot="title" class="dialog-title-container">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除该说说？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteTalk">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import TalkAPI from '@/api/talk.js'
export default {
  name: 'TalkList',
  data() {
    return {
      current: 1,
      size: 5,
      count: 0,
      status: null,
      talkList: [],
      previewList: [],
      talkId: null,
      isDelete: false
    }
  },
  created() {
    this.listTalks()
  },
  methods: {
    // 切换说说状态
    changeStatus(status) {
      this.current = 1
      this.previewList = []
      this.status = status
      this.listTalks()
    },
    listTalks() {
      TalkAPI.talkList(this.current, this.size, this.status).then(res => {
        this.talkList = res.data.recordList
        this.talkList.forEach(item => {
          if (item.imgList) {
            this.previewList.push(...item.imgList)
          }
          this.count = res.data.count
        })
      })
    },
    // 编辑跳转
    handleCommand(command) {
      const arr = command.split(',')
      console.log(arr)
      this.talkId = arr[1]
      switch (arr[0]) {
        case '1':
          this.$router.push({ path: '/talk/edit/' + this.talkId })
          break
        case '2':
          this.isDelete = true
          break
      }
    },
    sizeChange(size) {
      this.previewList = []
      this.size = size
      this.listTalks()
    },
    currentChange(current) {
      this.previewList = []
      this.current = current
      this.listTalks()
    },
    deleteTalk() {
      TalkAPI.deleteTalk([this.talkId]).then(res => {
        if (res.data.flag) {
          this.$notify.success(res.data.message)
          this.listTalks()
        } else {
          this.$notify.error(res.data.message)
        }
        this.isdelete = false
      })
    }

  }
}
</script>

<style scoped>
.status-menu {
  font-size: 14px;
  margin-top: 40px;
  color: #999;
}
.status-menu span {
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
.talk-item:not(:first-child) {
  margin-top: 20px;
}
.talk-item {
  padding: 16px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 3px 8px 6px rgb(7 17 27 / 6%);
  transition: all 0.3s ease 0s;
}
.talk-item:hover {
  box-shadow: 0 5px 10px 8px rgb(7 17 27 / 16%);
  transform: translateY(-3px);
}
.user-info-wrapper {
  width: 100%;
  display: flex;
}
.user-avatar {
  border-radius: 50%;
}
.user-avatar {
  transition: all 0.5s;
}
.user-avatar:hover {
  transform: rotate(360deg);
}
.user-detail-wrapper {
  margin-left: 10px;
  width: 100%;
}
.user-nickname {
  font-size: 15px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}
.user-sign {
  margin-left: 4px;
}
.time {
  color: #999;
  margin-top: 2px;
  font-size: 12px;
}
.top {
  color: #ff7242;
  margin-left: 10px;
}
.secret {
  color: #999;
  margin-left: 10px;
}
.talk-content {
  margin-top: 8px;
  font-size: 14px;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}
.talk-images {
  margin-top: 8px;
}
.images-items {
  cursor: pointer;
  object-fit: cover;
  height: 200px;
  width: 100%;
  border-radius: 4px;
}
</style>
