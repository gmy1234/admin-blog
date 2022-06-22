import request from '@/utils/request'

const base = '/admin/blog'

export default {
  // 获取后台网站配置
  getWebConfig() {
    return request({
      url: base + '/getConfig',
      method: 'get'
    })
  },
  updateWebConfig(configData) {
    return request({
      url: base + '/updateConfig',
      method: 'post',
      data: configData
    })
  },

  // 获取网站基本信息
  getBasicInfo() {
    return request({
      url: base + '/basic/info',
      method: 'get'
    })
  }

}
