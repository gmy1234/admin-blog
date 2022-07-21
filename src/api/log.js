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
  },
  // 根据日志ID查看日志详情
  operationLogsDetailById(logId) {
    return request({
      url: base + '/logsDetail',
      method: 'get',
      params: { logId }
    })
  }
}
