import request from '@/utils/request'

const base = '/admin/wallpaper'

export default {
  // 获取照片列表
  listPhotos(current, size, albumId) {
    return request({
      url: base + '/photos',
      method: 'get',
      params: {
        current: current,
        size: size,
        albumId: albumId,
        isDelete: 0
      }
    })
  },
  savePhotos(photoData) {
    return request({
      url: base + '/uploadPhotos',
      method: 'post',
      data: photoData
    })
  },

}
