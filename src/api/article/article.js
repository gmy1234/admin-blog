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
  }


}
