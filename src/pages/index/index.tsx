import { useEffect, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Button, MiniUserButton } from '@antmjs/vantui';
import { Tabbar, TabbarItem } from '@antmjs/vantui';
import Taro from '@tarojs/taro';
import { useLogin, userUserStore } from '../../store/user';
import { getImage, uploadImage } from 'src/service/file';
import { isDev, sleep } from 'src/utils/common';

export default () => {
  const [active, setActive] = useState(0);
  const [paintId, setPaintId] = useState('');
  const [paintUrl, setPaintUrl] = useState<any>();

  useLogin();

  const [userState, setUserState] = userUserStore();
  useEffect(() => {
    if (userState.userId) {
      console.log('%celelee test:', 'background:#000;color:#fff', '拿到userId了', userState.userId);
    }
  }, [userState.userId]);

  const jump = () => {
    Taro.navigateTo({
      url: '/pages/detail/index',
      fail(err) {
        console.log('%celelee test:', 'background:#000;color:#fff', err);
      },
    });
  };

  useEffect(() => {
    if (!paintId) {
      return;
    }
    const getImg = async () => {
      let times = 5;
      while (times >= 0) {
        try {
          const res = await getImage(paintId);
          console.log('%celelee test:', 'background:#000;color:#fff', res.saved);
          if (res.file) {
            // @ts-ignore
            setPaintUrl(Taro.createBufferURL(res.file));
            // setPaintUrl(Taro.createBufferURL(Taro.base64ToArrayBuffer(res.file)));
            break;
          } else {
            await sleep(2000);
          }
        } catch (error) {
          console.log(error);
        } finally {
          times--;
        }
      }
      Taro.hideLoading();
      if (times <= 0) {
        Taro.showModal({ content: '当前排队人多，可稍后刷新资源页' });
      }
    };
    Taro.showLoading({ title: '图片合成中...' });
    setTimeout(getImg, isDev ? 2000 : 0);
  }, [paintId]);

  const uploadByClick = async () => {
    try {
      const _paintId = await uploadImage(userState.userId);
      setPaintId(_paintId);
    } catch (error) {
      console.error(error);
      Taro.showToast({
        title: '上传失败',
        icon: 'error',
      });
    }
  };

  const download = () => {
    Taro.downloadFile({
      url: paintUrl,
      success(res) {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        });
      },
    });
  };

  return (
    <View>
      <Tabbar active={active} onChange={e => setActive(e.detail as number)}>
        <TabbarItem icon="home-o">
          <Text>标签1</Text>
        </TabbarItem>
        <TabbarItem icon="search" dot>
          标签2
        </TabbarItem>
        <TabbarItem icon="setting-o" info="20">
          标签3
        </TabbarItem>
      </Tabbar>
      {active === 0 && (
        <div className="mt-8">
          <Button onClick={jump} type="primary" size="small">
            jump
          </Button>
          <Button type="info" size="small">
            <MiniUserButton
              onGetUserInfo={info => {
                console.log('%celelee test:', 'background:#000;color:#fff', info);
              }}
              onFail={err => {
                console.log('%celelee test:', 'background:#000;color:#f00', err);
              }}
            >
              getUser
            </MiniUserButton>
          </Button>
          <Button onClick={uploadByClick} type="primary" size="small">
            upload
          </Button>
          <div className="mt-8">
            {paintId}
            <Button type="primary" onClick={() => setPaintId(pre => (pre ? '' : '1_1683394635819'))}>
              对的paintId
            </Button>
            <Button type="primary" onClick={() => setPaintId('xxxx')}>
              错的paintId
            </Button>
            {paintUrl && (
              <div>
                <Image src={paintUrl}></Image>
                <Button onClick={download}>下载</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </View>
  );
};
