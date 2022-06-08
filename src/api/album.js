import request from '@/utils/request'

const base = '/admin/album'

export default {

  // 获取所有相册
  listPhotoAlbums() {
    return request({
      url: base + '/list',
      method: 'get'
    })
  },
  // 根据ID获取相册信息
  getAlbumInfoById(albumId) {
    return request({
      url: base + '/info/' + albumId,
      method: 'get'
    })
  },
}
