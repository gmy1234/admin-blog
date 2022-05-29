import request from '@/utils/request'

const base = '/admin/article'

export default {
  // 后台发布文章
  publishArticle(article) {
    return request({
      url: base + '/publish',
      method: 'post',
      data: article
    })
  },
  // 获取后台的所有文章
  getALlArticle(curren, size, keywords, categoryId, status, tagId, type, isDelete) {
    return request({
      url: base + '/getAll',
      method: 'get',
      params: {
        curren: curren,
        size: size,
        keywords: keywords,
        categoryId: categoryId,
        status: status,
        tagId: tagId,
        type: type,
        isDelete: isDelete
      }
    })
  },
  // 通过 ID 获取后台文章详情
  getArticle(articleId) {
    return request({
      url: base + '/getArticle/' + articleId,
      method: 'get'
    })
  },
  // 逻辑删除文章
  deleteArticles(deleteVo) {
    return request({
      url: base + '/deleteArticles',
      method: 'post',
      data: deleteVo
    })
  }



}
