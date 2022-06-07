import request from '@/utils/request'

const base = '/admin/upload'

export default {
  // 上传文章封面
  uploadArticleImages(file) {
    return request({
      url: base + '/articles/images',
      method: 'post',
      data: file
    })
  }

}
