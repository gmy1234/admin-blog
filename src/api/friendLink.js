import request from '@/utils/request'

const base = '/admin/links'

export default {
  // 获取后台友情连接
  getListFriendLink(keywords, current, size) {
    return request({
      url: base,
      method: 'get',
      keywords: keywords,
      current: current,
      size: size
    })
  },

  saveOrUpdateFriendLink(linkInfo) {
    return request({
      url: base + '/saveOrUpdate',
      method: 'post',
      data: linkInfo
    })
  },
  deleteFriendLink(ids) {
    return request({
      url: base + '/delete',
      method: 'delete',
      data: ids
    })
  },

}
