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
  // 删除分类
  deletedCategory(id) {
    return request({
      url: base + '/deleted/' + id,
      method: 'post'
    })
  },
  // 批量删除分类
  deletedCategoryBatch(ids) {
    return request({
      url: base + '/deleteBatch',
      method: 'delete',
      data: ids
    })
  }

}

