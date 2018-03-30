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
      cached: false,
      page: 1,
      loading: false,
      topLoading: false,
    };
  },
  onReachBottom() {
    if (this.loading) return;
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
      if (this.topLoading) return;
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
        url: 'https://m.weibo.cn/api/container/getIndex?containerid=102803_ctg1_8999_-_ctg1_8999_home',
        method: 'GET',
        header: {
          Cookie: wx.getStorageSync('cookie'),
        },
        data: {
          page: this.page,
        },
        success: ({ data, header }) => {
          if (!data.ok) return;
          if (success) success();
          const weiboList = this.filterData(data.data.cards);
          if (top) {
            this.weiboList = weiboList;
          } else {
            this.weiboList = this.weiboList.concat(weiboList);
          }
          store.commit('setMWeiboList', this.weiboList);
          this.page += 1;
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
      const list = [];
      cardList.forEach((card) => {
        if (card.card_type === 9 && this.weiboIdSet.indexOf(card.mblog.id) === -1) {
          list.push(getWeiboInfo(card.mblog));
          this.weiboIdSet.push(card.mblog.id);
        }
      });
      return list;
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
      wx.setStorage({
        key: 'cookie',
        data: getCookieFilter(cookie),
      });
    },
    goDetial(id) {
      store.commit('setMWeiboId', id);
      const url = `../../pages/mweiboDetial/main?id=${id}`;
      wx.navigateTo({ url });
    },
  },
  mounted() {
    this.weiboIdSet = [];
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
