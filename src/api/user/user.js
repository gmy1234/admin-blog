import request from '@/utils/request'

const base = '/admin/user'

export default {
  // 获取所有用户
  getAllUsers(current, size, keywords, loginType) {
    return request({
      url: base + '/getAllUser',
      method: 'get',
      params: {
        current: current,
        size: size,
        keywords: keywords,
        loginType: loginType
      }
    })
  },
  getRole() {
    return request({
      url: base + '/getRole',
      method: 'get'
    })
  },
  online(current, size, keywords) {
    return request({
      url: base + '/online',
      method: 'get',
      params: {
        current: this.current,
        size: this.size,
        keywords: this.keywords
      }
    })
  }

}
