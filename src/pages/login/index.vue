<template>
  <div class="weibo-warp">
    <div class="weibo-container">
      <p class="weibo-title">登录微博账号</p>
      <p class="weibo-input">
        <input id="username" v-model="username" placeholder="请用微博账号登录"/>
        <input id="password" v-model="password" placeholder="请输入密码"/>
      </p>

      <button @click="loginInWeibo" class="login">登录</button>
    </div>
  </div>
</template>

<script>
// Use Vuex
import card from '@/components/card';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    count() {},
  },
  onLoad() {
    this.openid = this.$root.$mp.query.openid;
  },
  methods: {
    loginInWeibo() {
      wx.request({
        url: 'http://localhost:3000/users/loginweibo',
        method: 'POST',
        data: {
          openid: this.openid,
          username: this.username,
          password: this.password,
        },
        success: ({ data }) => {
          if (data.access_token) {
            const url = `./../../pages/weibo/main?access_token=${data.access_token}`;
            wx.redirectTo({ url });
          }
        },
      });
    },
    goBack() {},
  },
  components: {
    card,
  },
};
</script>
<style>
.weibo-warp {
  text-align: center;
  margin-top: 50px;
}
.weibo-container {
  margin: 0 auto;
  width: 80%;
  border: 1px #ccc solid;
  border-radius: 20px;
}
.weibo-title {
  margin-top: 25px;
  font-size: 25px;
}
.weibo-input {
  margin-top: 50px;
  padding: 0 20px;
}
.weibo-input input {
  border: 1px #ccc solid;
  border-radius: 5px;
  margin: 25px auto;
}
.login {
  width: 80%;
  margin: 100px auto;
  padding: 5px 10px;
  background-color: #ff555f;
  color: #fff;
  border: 1px solid #eb192d;
}
</style>
