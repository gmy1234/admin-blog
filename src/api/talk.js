import request from '@/utils/request'

const base = '/admin/talk'

export default {
  // 获取后台说说
  talkList(current, size, status) {
    return request({
      url: base + '/list',
      method: 'get',
      current: current,
      size: size,
      status: status
    })
  },
  // 修改或保存说说
  saveOrUpdate(talk) {
    return request({
      url: base + '/saveOrUpdate',
      method: 'post',
      data: talk
    })
  },
  deleteTalk(talkId) {
    return request({
      url: base + '/delete',
      method: 'post',
      data: [talkId]
    })
  }
}
