<template>
  <div>
    <ul class="weibo-list">
      <li v-for="(weibo, index) in weiboList" :key="index" class="weibo-item"  @click.stop="goDetial(weibo.id)">
        <mWeiboCard :weibo="weibo"></mWeiboCard>
        <weiboBar :bar="weibo.bar"></weiboBar>
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
import weiboBar from '@/components/weiboBar';
import loadingButton from '@/components/loadingButton';
import loadingBar from '@/components/loadingBar';

import store from '@/store';
import { getCookieFilter, getWeiboInfo } from '@/utils/mweibo';

export default {
  components: {
    mWeiboCard,
    weiboBar,
    loadingButton,
    loadingBar,
  },
  data() {
    return {
      weiboList: [],
      markedWeibo: {},
      cached: false,
      sinceId: 1,
      loading: false,
      topLoading: false,
    };
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
          Cookie: wx.getStorageSync('cookie'),
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
            this.markedWeibo = {};
          } else {
            this.weiboList = this.weiboList.concat(weiboList);
          }
          store.commit('setMWeiboList', this.weiboList);
          this.sinceId += 1;
          this.setCache(weiboList);
          this.setCookie(header['Set-Cookie']);
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
      return cardList.map(card => getWeiboInfo(card.mblog));
    },
    setCache(weiboList) {
      const lastUpdateTime = new Date().getTime();
      wx.setStorage({
        key: 'hot_cache',
        data: { lastUpdateTime, weiboList },
      });
    },
    setCookie(cookie) {
      if (!cookie) return;
      wx.setStorageSync('cookie', getCookieFilter(cookie));
    },
    goDetial(id) {
      store.commit('setMWeiboId', id);
      const url = `../../pages/mweiboDetial/main?id=${id}`;
      wx.navigateTo({ url });
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
        store.commit('setMWeiboList', this.weiboList);
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
