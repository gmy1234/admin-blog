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
  searchCategories(keywords) {
    return request({
      url: base + '/search',
      method: 'get',
      params: {
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
  deletedCategoryBatch(param) {
    return request({
      url: base + '/deleteBatch',
      method: 'delete',
      config: param
    })
  },
  // 添加或者修改分类
  saveAndUpdateCategory(form) {
    return request({
      url: base + '/saveAndUpdateCategory',
      method: 'post',
      data: form
    })
  }

}

