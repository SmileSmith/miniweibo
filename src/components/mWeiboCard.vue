<template>
  <div class="card">
    <weiboUser :user="weibo.user" :created="weibo.created_at" :source="weibo.source"></weiboUser>
    <div class="content">
      <richContent :content="weibo.text"></richContent>
    </div>
    <div class="preview" @click.stop="doNothing">
      <image v-if="weibo.pics.smalls.length > 0" class="pic"
        v-for="(url, index) in weibo.pics.smalls"
        :key="index" :src="url" :lazy-load="true" mode="aspectFill"
        @click.stop="previewImage(index)" />
      <video v-if="weibo.video" :src="weibo.video.url" :poster="weibo.video.pic" controls></video>
    </div>
  </div>
</template>

<script>
import richContent from './richContent';
import weiboUser from './weiboUser';

export default {
  components: {
    richContent,
    weiboUser,
  },
  props: ['weibo'],
  methods: {
    previewImage(index) {
      wx.previewImage({
        current: this.weibo.pics.larges[index], // 当前显示图片的http链接
        urls: this.weibo.pics.larges, // 需要预览的图片http链接列表
      });
    },
    doNothing() {
      // 阻止事件冒泡
      return false;
    },
  },
};
</script>

<style scoped>
.card {
  padding: 10px;
  border-top: 0.5px #ccc solid;
  border-bottom: 0.5px #eee solid;
  background-color: #fff;
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
