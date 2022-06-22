import request from '@/utils/request'

const base = '/admin/comment'

export default {
  //  获取评论列表
  listComments(current, size, type, keywords, isReview) {
    return request({
      url: base + '/list',
      method: 'get',
      params: {
        current: current,
        size: size,
        keywords: keywords,
        type: type,
        isReview: isReview
      }
    })
  },
  deleteComment(ids) {
    return request({
      url: base + '/delete',
      method: 'post',
      data: ids
    })
  },
  reviewComments(reviewData) {
    return request({
      url: base + '/review',
      method: 'post',
      data: reviewData
    })
  }
}
