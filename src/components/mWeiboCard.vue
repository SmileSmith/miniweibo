<template>
  <div class="card">
    <div class="label">
      <div class="avater">
        <image :src="weibo.user.profile_image_url" />
      </div>
      <div class="title">
        <p class="uesr">{{weibo.user.screen_name}}</p>
        <p class="desc">
          <text>{{weibo.created_at}} </text>
          <text>来自 {{weibo.source}}</text>
        </p>
      </div>
    </div>
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

export default {
  components: {
    richContent,
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
