import request from '@/utils/request'

const base = '/admin/article'

export default {
  publishArticle(article) {
    return request({
      url: base + '/publish',
      method: 'post',
      data: article
    })
  },

}
