<template>
  <div>
    <ul class="container weibo-list">
      <li v-for="(weibo, index) in weiboList" :key="index" class="weibo-item">
        <mWeiboCard :weibo="weibo.mblog"></mWeiboCard>
      </li>
    </ul>
    <icon class="refresh" type="download" size="50" color="#E6162D" @click="refreshLine"></icon>
  </div>
</template>

<script>
import mWeiboCard from '@/components/mWeiboCard';

export default {
  components: {
    mWeiboCard,
  },

  data() {
    return {
      weiboList: [],
      cached: false,
      sinceId: 0,
    };
  },
  methods: {
    refreshLine() {
      const cookie = wx.getStorageSync('cookie');
      wx.request({
        url: 'https://m.weibo.cn/api/container/getIndex?containerid=102803',
        method: 'GET',
        header: {
          cookie,
        },
        data: {
          since_id: this.sinceId,
        },
        success: ({ data, header }) => {
          wx.vibrateShort();
          if (data.ok) {
            this.weiboList = [];
            this.weiboList = data.data.cards;
            const lastUpdateTime = new Date().getTime();
            wx.setStorage({
              key: 'hot_cache',
              data: { lastUpdateTime, ...data },
            });
            wx.setStorageSync(
              'cookie',
              header['Set-Cookie']
                .replace(/,([^ ])/g, '; $1')
                .replace(/( expires| Max-Age| domain| path| HttpOnly)=?.*?;/g, ''),
            );
            this.sinceId += 1;
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
  },
  mounted() {
    if (this.cached) return;
    this.refreshLine();
  },
  created() {
    try {
      const data = wx.getStorageSync('hot_cache');
      const now = new Date().getTime();
      const oneHour = 5 * 60 * 1000;
      if (data && now - data.lastUpdateTime <= oneHour) {
        this.weiboList = data.data.cards;
        this.cached = true;
      }
    } catch (e) {
      console.log(`Read WX.getStorageSync(hot_cache) error: ${e}`);
    }
  },
};
</script>

<style scoped>
.weibo-list {
  display: flex;
  flex-direction: column;
  padding: 20rpx 0;
  background-color: #eee;
}

.weibo-item {
  width: 100%;
  margin: 10rpx 0;
  background-color: #fff;
}
.refresh {
  position: fixed;
  right: 10px;
  bottom: 10px;
  border-radius: 25px;
  background-color: #fff;
}
</style>
