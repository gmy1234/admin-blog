import request from '@/utils/request'

const base = '/admin/role'

export default {
  // 获取所有用户 角色
  getRole() {
    return request({
      url: base + '/getRole',
      method: 'get'
    })
  }

}
