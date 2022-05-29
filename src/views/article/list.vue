<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 文章状态 -->
    <div class="article-status-menu">
      <el-button circle>
        <Iconfont type="home"></Iconfont>全部
      </el-button>
      <el-button type="primary" icon="el-icon-edit" circle>公开</el-button>
      <el-button type="success" icon="el-icon-view" circle>私密</el-button>
      <el-button type="warning" icon="el-icon-message" circle>草稿箱</el-button>
      <el-button type="danger" icon="el-icon-delete" circle>回收站</el-button>

    </div>
  </el-card>
</template>

<script>
import Iconfont from '@/components/Iconfont'
export default {
  name: 'List',
  components: { Iconfont }
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
