import request from '@/utils/request'

const base = '/admin/blog'

export default {
  // 获取后台网站配置
  getWebConfig() {
    return request({
      url: base + '/config',
      method: 'get'
    })
  }

}
