import request from '@/utils/request'

const base = '/admin/article/category'

export default {
  // 获取分类列表
  getAllCategory(current, size, keywords) {
    return request({
      url: base + '/getAll',
      method: 'get'
    })
  }

}

