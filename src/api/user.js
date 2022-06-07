import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 系统 原来的
// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

export function login(data) {
  return request({
    url: '/admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  const userToken = getToken()
  console.log(userToken)
  return request({
    url: '/admin/user/logout',
    method: 'post',
    header: { token: userToken }
  })
}
