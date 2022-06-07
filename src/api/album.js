import request from '@/utils/request'

const base = '/admin/album'

export default {

  // 获取所有相册
  listPhotoAlbums() {
    return request({
      url: base + '/list',
      method: 'get'
    })
  }

}
