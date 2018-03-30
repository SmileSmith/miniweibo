<template>
  <div class="detial">
    <mWeiboCard :weibo="weibo"></mWeiboCard>
    <weiboBar :bar="weibo.bar"></weiboBar>
    <ul class="comment-list">
        <weiboComment v-if="commentList.length > 0" v-for="(comment, index) in commentList" :key="index" :comment="comment"></weiboComment>
    </ul>
    <loadingBar v-show="loading"></loadingBar>
  </div>
</template>

<script>
import mWeiboCard from '@/components/mWeiboCard';
import weiboComment from '@/components/weiboComment';
import weiboBar from '@/components/weiboBar';
import loadingBar from '@/components/loadingBar';
import store from '@/store';
import { getCommentInfo } from '@/utils/mweibo';

export default {
  components: {
    mWeiboCard,
    weiboBar,
    weiboComment,
    loadingBar,
  },
  data() {
    return {
      commentList: [],
      page: 1,
      loading: false,
    };
  },
  computed: {
    weibo() {
      return store.getters.currentMWeibo;
    },
  },
  methods: {
    refreshComment() {
      this.loading = true;
      wx.request({
        url: 'https://m.weibo.cn/api/comments/show',
        method: 'GET',
        data: {
          id: this.weibo.id,
          page: this.page,
        },
        success: ({ data }) => {
          if (!data.ok) return;
          if (data.data.hot_data) {
            this.commentList = this.filterData(data.data.hot_data);
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

</style>
