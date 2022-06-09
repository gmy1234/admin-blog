import request from '@/utils/request'

const base = '/admin/wallpaper'

export default {
  // 获取照片列表
  listPhotos(current, size, albumId, isDelete) {
    return request({
      url: base + '/photos',
      method: 'get',
      params: {
        current: current,
        size: size,
        albumId: albumId,
        isDelete: isDelete
      }
    })
  },
  // 保存图片
  savePhotos(photoData) {
    return request({
      url: base + '/uploadPhotos',
      method: 'post',
      data: photoData
    })
  },
  // 移动图片
  movePhotos(photoData) {
    return request({
      url: base + '/moveOtherAlbum',
      method: 'post',
      data: photoData
    })
  }

}
