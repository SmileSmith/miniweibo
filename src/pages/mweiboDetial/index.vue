<template>
  <div class="detial">
    <mWeiboCard :weibo="weibo"></mWeiboCard>
    <weiboBar :bar="weibo.bar"></weiboBar>
    <ul class="comment-list" v-if="hotList.length > 0">
        <div class="comment-label">热门评论</div>
        <weiboComment v-for="(comment, index) in hotList" :key="index" :comment="comment"></weiboComment>
    </ul>
    <ul class="comment-list" v-if="commentList.length > 0">
      <div class="comment-label">最新评论</div>
      <weiboComment v-for="(comment, index) in commentList" :key="index" :comment="comment"></weiboComment>
    </ul>
    <loadingBar v-if="!noMore" v-show="loading"></loadingBar>
    <card v-if="hotList.length === 0 && noMore" text="暂无可展示的评论"></card>
  </div>
</template>

<script>
import mWeiboCard from '@/components/mWeiboCard';
import weiboComment from '@/components/weiboComment';
import weiboBar from '@/components/weiboBar';
import loadingBar from '@/components/loadingBar';
import card from '@/components/card';
import store from '@/store';
import { getCommentInfo } from '@/utils/mweibo';

export default {
  components: {
    mWeiboCard,
    weiboBar,
    weiboComment,
    loadingBar,
    card,
  },
  data() {
    return {
      commentList: [],
      hotList: [],
      page: 1,
      loading: false,
      noMore: false,
    };
  },
  computed: {
    weibo() {
      return store.getters.currentMWeibo;
    },
  },
  methods: {
    refreshComment() {
      // this.loading = true;
      wx.request({
        url: 'https://m.weibo.cn/api/comments/show',
        method: 'GET',
        data: {
          id: this.weibo.id,
          page: this.page,
        },
        success: ({ data }) => {
          if (!data.ok) {
            this.noMore = true;
            return;
          }
          if (data.data.hot_data) {
            this.hotList = this.filterData(data.data.hot_data);
            this.commentList = this.filterData(data.data.data);
          } else {
            this.commentList = this.commentList.concat(this.filterData(data.data.data));
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
    },
    filterData(commentList) {
      return commentList.map(comment => getCommentInfo(comment));
    },
  },
  onShow() {
    this.page = 1;
    this.noMore = false;
    this.hotList = [];
    this.commentList = [];
    this.refreshComment();
  },
  onReachBottom() {
    this.page += 1;
    this.loading = true;
    this.refreshComment();
  },
};
</script>

<style scoped>
.detial {
  background-color: #eee;
}
.comment-list {
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  background-color: #fff;
}
.comment-label {
  padding: 10px;
  color: #fd802c;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px #eee solid;
}
</style>
