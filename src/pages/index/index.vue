<template>
  <div class="container">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card v-if="userInfo.nickName" text="微信用户登录成功"></card>
      </div>
      <div class="user-motto">
        <card v-if="weiboInfo" text="微博账号认证成功"></card>
      </div>
    </div>

    <a href="/pages/counter/main" class="weibo">即将打开世界的大门...</a>
  </div>
</template>

<script>
import card from '@/components/card';

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
    bindViewTap() {
      const url = '../logs/main';
      wx.navigateTo({ url });
    },
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
    getWeiboInfo() {

    },
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
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

.usermotto {
  margin-top: 120px;
  font-size: 15px;
  color: #ccc;
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
  color: #E6162D;
  font-size: 25px;
}
</style>
