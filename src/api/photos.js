import request from '@/utils/request'

const base = '/admin/wallpaper'

export default {
  // 获取照片列表
  listPhotos(current, size, keywords) {
    return request({
      url: base + '/photos',
      method: 'get',
      params: {
        current: current,
        size: size,
        keywords: keywords
      }
    })
  },


}
