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
  // 在线用户
  online(current, size, keywords) {
    return request({
      url: base + '/online',
      method: 'get',
      params: {
        current: current,
        size: size,
        keywords: keywords
      }
    })
  },

  // 下线用户
  offlineUser(userInfoId) {
    return request({
      url: base + '/offline/' + userInfoId,
      method: 'delete'
    })

  },
  // 用户范围
  listUserArea(type) {
    return request({
      url: base + '/area',
      method: 'get',
      params: {
        type: type
      }
    })
  }

}
