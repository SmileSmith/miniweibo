<template>
  <div class="detial">
    <mWeiboCard :weibo="weibo"></mWeiboCard>
  </div>
</template>

<script>
import mWeiboCard from '@/components/mWeiboCard';
import store from '@/store';

export default {
  components: {
    mWeiboCard,
  },
  computed: {
    weibo() {
      return JSON.parse(JSON.stringify(store.getters.currentMWeibo));
    },
  },
  methods: {
    previewImage(index) {
      wx.previewImage({
        current: this.weibo.pics.larges[index], // 当前显示图片的http链接
        urls: this.weibo.pics.larges, // 需要预览的图片http链接列表
      });
    },
  },
};
</script>

<style>
.card {
  padding: 10px;
  border-top: 1px #ccc solid;
  border-bottom: 1px #ccc solid;
}
.label {
  display: flex;
}
.avater image {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}
.title {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 15px;
}
.title .desc {
  font-size: 12px;
  color: #999;
}
.content {
  margin: 5px 0;
  font-size: 16px;
  line-height: 25px;
}
.preview {
  display: flex;
  flex-wrap: wrap;
}
.pic {
  margin: 2px;
  width: 110px;
  height: 110px;
}
.video {
  height: 170px;
  width: 300px;
}
</style>
