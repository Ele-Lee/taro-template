import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Button, MiniUserButton } from '@antmjs/vantui';
import { Tabbar, TabbarItem } from '@antmjs/vantui';
import Taro from '@tarojs/taro';

export default () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    console.log('%celelee test:', 'background:#000;color:#fff', '渲染后1', active);
  }, []);

  const jump = () => {
    Taro.navigateTo({
      url: '/pages/detail/index',
      fail(err) {
        console.log('%celelee test:', 'background:#000;color:#fff', err);
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
        </div>
      )}
    </View>
  );
};
