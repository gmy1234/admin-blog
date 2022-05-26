import request from '@/utils/request'

const base = '/admin/article/category'

export default {
  // 获取分类列表
  getAllCategory(current, size, keywords) {
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
  // 查询分页列表
  search(current, size, keywords) {
    return request({
      url: base + '/getAll',
      method: 'get'
    })
  }

}

