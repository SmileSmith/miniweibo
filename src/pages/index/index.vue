<template>
  <div class="container">

    <div class="userinfo" @click="checkAccessToken">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <card v-if="userInfo.nickName" text="微信用户登录成功"></card>
      <card v-if="weiboInfo" text="微博账号认证成功"></card>
    </div>

    <a href="/pages/weibo/main" class="weibo">即将打开世界的大门...</a>
  </div>
</template>

<script>
import card from '@/components/card';
import api from '@/utils/api';

export default {
  data() {
    return {
      userInfo: {},
      weiboInfo: {},
    };
  },

  components: {
    card,
  },

  methods: {
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo;
            },
          });
        },
      });
    },
    checkAccessToken() {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发起网络请求
            wx.request({
              url: api.checktoken,
              data: {
                code: res.code,
              },
              success: ({ data }) => {
                if (data.access_token) {
                  const url = `../../pages/weibo/main?access_token=${data.access_token}`;
                  wx.redirectTo({ url });
                  return;
                }
                if (data.openid) {
                  const url = `../../pages/login/main?openid=${data.openid}`;
                  wx.redirectTo({ url });
                }
              },
            });
          } else {
            console.log(`Weixin login error: ${res.errMsg}`);
          }
        },
      });
    },
    getWeiboInfo() {},
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
  },
  mounted() {
    setTimeout(() => {
      const url = '../../pages/mweibo/main';
      wx.redirectTo({ url });
    }, 500);
  },
};
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  font-size: 20px;
}

.weibo {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: #e6162d;
  font-size: 25px;
}
</style>
