import request from '@/utils/request'

const base = '/admin/log'

export default {
  // 获取后台网站配置
  getOperatorLogs(keywords, current, size) {
    return request({
      url: base + '/operationLogs',
      method: 'get',
      data: {
        keywords: keywords,
        current: current,
        size: size
      }
    })
  }
}
