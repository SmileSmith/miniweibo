<template>
  <div>
    <ul class="container weibo-list">
      <li v-for="(weibo, index) in weiboList" :class="{ red: aa }" :key="index" class="weibo-item">
        <weiboCard :weibo="weibo"></weiboCard>
      </li>
    </ul>
  </div>
</template>

<script>
import weiboCard from '@/components/weiboCard';

export default {
  onLoad() {
    this.access_token = this.$root.$mp.query.access_token;
  },
  components: {
    weiboCard,
  },

  data() {
    return {
      weiboList: [],
      cached: false,
    };
  },
  mounted() {
    if (this.cached) return;
    wx.request({
      url: 'https://api.weibo.com/2/statuses/home_timeline.json',
      method: 'GET',
      data: {
        access_token: this.access_token,
        count: 50,
      },
      success: ({ data }) => {
        if (data.statuses) {
          this.weiboList = data.statuses;
          const lastUpdateTime = new Date().getTime();
          wx.setStorage({
            key: 'weibo_cache',
            data: { lastUpdateTime, ...data },
          });
        }
      },
    });
  },
  created() {
    try {
      const data = wx.getStorageSync('weibo_cache');
      const now = new Date().getTime();
      const oneHour = 60 * 60 * 1000;
      if (data && data.lastUpdateTime - now <= oneHour) {
        this.weiboList = data.statuses;
        this.cached = true;
      }
    } catch (e) {
      console.log(`Read WX.getStorageSync(weibo_cache) error: ${e}`);
    }
  },
};
</script>

<style>
.weibo-list {
  display: flex;
  flex-direction: column;
  padding: 20rpx 10rpx;
}

.weibo-item {
  margin: 10rpx;
}
</style>
