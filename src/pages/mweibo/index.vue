<template>
  <div>
    <ul class="weibo-list">
      <li v-for="(weibo, index) in weiboList" :key="index" class="weibo-item">
        <mWeiboCard :weibo="weibo"></mWeiboCard>
      </li>
    </ul>
    <div class="refresh"  @click="topRefresh">
      <loadingButton :loading="topLoading"></loadingButton>
    </div>
    <loadingBar v-show="loading"></loadingBar>
  </div>
</template>

<script>
import mWeiboCard from '@/components/mWeiboCard';
import loadingButton from '@/components/loadingButton';
import loadingBar from '@/components/loadingBar';

export default {
  components: {
    mWeiboCard,
    loadingButton,
    loadingBar,
  },
  data() {
    return {
      weiboList: [],
      cached: false,
      sinceId: 0,
      loading: false,
      topLoading: false,
    };
  },
  methods: {
    topRefresh() {
      wx.pageScrollTo({ scrollTop: 0, duration: 300 });
      this.topLoading = true;
      this.refreshWeiboList({
        top: true,
        complete: () => {
          this.topLoading = false;
        },
      });
    },
    refreshWeiboList(config = {}) {
      const { top, success, fail, complete } = config;
      wx.request({
        url: 'https://m.weibo.cn/api/container/getIndex?containerid=102803',
        method: 'GET',
        header: {
          cookie: wx.getStorageSync('cookie'),
        },
        data: {
          since_id: this.sinceId,
        },
        success: ({ data, header }) => {
          wx.vibrateShort();
          if (!data.ok) return;
          if (success) success();
          const weiboList = this.filterData(data.data.cards);
          if (top) {
            this.weiboList = weiboList;
          } else {
            this.weiboList = this.weiboList.concat(weiboList);
          }
          this.sinceId += 1;
          this.setCache(weiboList);
          this.setCookie(header);
        },
        fail: (err) => {
          if (fail) {
            fail();
          }
          console.log(err);
        },
        complete: () => {
          if (complete) {
            complete();
          }
        },
      });
    },
    filterData(cardList) {
      return cardList.map((card) => {
        const weibo = card.mblog;
        const createdAt = weibo.created_at || '宇宙大爆炸前';
        const source = weibo.source || '火星';
        return {
          user: {
            profile_image_url: weibo.user.profile_image_url,
            screen_name: weibo.user.screen_name,
          },
          created_at: createdAt,
          source,
          pics: {
            smalls: weibo.pics ? weibo.pics.map(pic => pic.url) : [],
            larges: weibo.pics ? weibo.pics.map(pic => pic.large.url) : [],
          },
          page_info: weibo.page_info,
          text: weibo.text,
        };
      });
    },
    setCache(weiboList) {
      const lastUpdateTime = new Date().getTime();
      wx.setStorage({
        key: 'hot_cache',
        data: { lastUpdateTime, weiboList },
      });
    },
    setCookie(header) {
      wx.setStorageSync(
        'cookie',
        header['Set-Cookie']
          .replace(/,([^ ])/g, '; $1')
          .replace(/( expires| Max-Age| domain| path| HttpOnly)=?.*?;/g, ''),
      );
    },
  },
  mounted() {
    if (this.cached) return;
    this.refreshWeiboList();
  },
  created() {
    try {
      const data = wx.getStorageSync('hot_cache');
      const now = new Date().getTime();
      const oneHour = 5 * 60 * 1000;
      if (data && now - data.lastUpdateTime <= oneHour) {
        this.weiboList = data.weiboList;
        this.cached = true;
      }
    } catch (e) {
      console.log(`Read WX.getStorageSync(hot_cache) error: ${e}`);
    }
  },
  onReachBottom() {
    this.loading = true;
    this.refreshWeiboList({
      complete: () => {
        this.loading = false;
      },
    });
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.refreshWeiboList({
      top: true,
      complete: () => {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      },
    });
  },
};
</script>

<style scoped>
.weibo-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #eee;
}
.weibo-item {
  width: 100%;
  margin: 10rpx 0;
  background-color: #fff;
}
.weibo-list .weibo-item:first-child {
  margin-top: 0px !important;
}
.weibo-list .weibo-item:last-child {
  margin-bottom: 0px !important;
}
.refresh {
  position: fixed;
  right: 10px;
  bottom: 10px;
  border-radius: 25px;
  background: #fff;
  box-shadow: 0px 0px 1px 0.01px #999;
}
</style>
