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
  // 修改或者保存相册信息
  saveOrUpdate(albumData) {
    return request({
      url: base + '/saveOrUpdate',
      method: 'post',
      data: albumData
    })
  },
  // 搜索相册
  searchAlbums(current, size, keywords) {
    return request({
      url: base + '/search',
      method: 'get',
      params: {
        current: current,
        size: size,
        keywords: keywords
      }
    })
  },
  // 删除 相册
  delete(id) {
    return request({
      url: base + '/delete/' + id,
      method: 'get'
    })
  }
}
