import { upload, post } from "src/utils/http";
import Taro from '@tarojs/taro'

export function uploadImage(userId: number) {
  return new Promise<string>((resolve, reject) => {
    Taro.chooseImage({
      async success(res) {
        const tempFilePaths = res.tempFilePaths
        try {
          const res = await upload({
            url: '/file/upload',
            filePath: tempFilePaths[0],
            name: 'test',
            data: {
              user_id: userId
            }
          })
          resolve(res.paint_id)
        } catch (error) {
          console.log(error)
          reject('')
        }
      }
    })
  })
}

export function getImage(paintId: string): Promise<{ file: Blob, paint_id: string, saved: boolean }> {
  return post('/file/get_file', { paint_id: paintId })
}
