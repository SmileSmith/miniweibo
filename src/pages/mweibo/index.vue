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
import { getWeiboInfo } from '@/utils/mweibo';
import mv from '@/utils/mv';

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
  async onReachBottom() {
    if (this.loading) return;
    this.loading = true;
    await this.refreshWeiboList();
    this.loading = false;
  },
  async onPullDownRefresh() {
    wx.showNavigationBarLoading();
    await this.refreshWeiboList({ top: true });
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },
  methods: {
    async topRefresh() {
      wx.pageScrollTo({ scrollTop: 0, duration: 300 });
      if (this.topLoading) return;
      this.topLoading = true;
      await this.refreshWeiboList({ top: true });
      this.topLoading = false;
    },
    async refreshWeiboList(config = {}) {
      const { top } = config;
      await mv.request({
        url: 'https://m.weibo.cn/api/container/getIndex?containerid=102803_ctg1_8999_-_ctg1_8999_home',
        method: 'GET',
        data: { page: this.page },
      }).then(({ data }) => {
        if (!data.ok) return;
        this.page += 1;
        const weiboList = this.filterData(data.data.cards);
        this.setCache(weiboList);
        this.weiboList = top ? weiboList : this.weiboList.concat(weiboList);
        store.commit('setMWeiboList', this.weiboList);
      }).catch((err) => {
        mv.showToast({ title: '请求数据失败', duration: 500, mask: true });
        console.log(err);
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
