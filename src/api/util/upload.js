import request from '@/utils/request'

const base = '/admin/upload'

export default {
  // 后台发布文章
  uploadArticleImages(file) {
    return request({
      url: base + '/articles/images',
      method: 'post',
      data: file
    })
  }

}
