// make sure to call Vue.use(Vuex) if using a module system
/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    mWeiboList: [],
    mWeiboId: 0,
    currentMWeibo: {},
  },
  mutations: {
    setMWeiboList: (state, mWeiboList) => {
      state.mWeiboList = mWeiboList;
    },
    setMWeiboId: (state, mWeiboId) => {
      state.mWeiboId = mWeiboId;
    },
  },
  getters: {
    mWeiboList: state => state.mWeiboList,
    currentMWeibo: state => state.mWeiboList.find(weibo => weibo.id === state.mWeiboId),
  },
});

export default store;
