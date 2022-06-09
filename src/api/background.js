import request from '@/utils/request'

const base = '/admin/background'

export default {
  // 获取后台网站配置
  getBackgrounds() {
    return request({
      url: base + '/list',
      method: 'get'
    })
  },
  updateBackground(info) {
    return request({
      url: base + '/update',
      method: 'post',
      data: info
    })
  },
  // 删除背景
  deleteBackground(id) {
    return request({
      url: base + '/delete/' + id,
      method: 'get'
    })
  }

}
