import request from '@/utils/request'

const base = '/admin/tag'

export default {
  // 获取分类列表
  getAllTag(current, size, keywords) {
    return request({
      url: base + '/getAll',
      method: 'get',
      params: {
        current: current,
        size: size,
        keywords: keywords
      }
    })
  },
  saveOrUpdateTag(form) {
    return request({
      url: base + '/saveOrUpdateTag',
      method: 'post',
      data: form
    })
  },
  deletedTag(id) {
    return request({
      url: base + '/delete/' + id,
      method: 'post'
    })
  }
}
