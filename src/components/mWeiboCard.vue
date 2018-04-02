<template>
  <div class="card">
    <weiboUser :user="weibo.user" :created="weibo.created_at" :source="weibo.source"></weiboUser>
    <div class="content">
      <richContent :content="weibo.text"></richContent>
    </div>
    <div class="preview">
      <image v-if="weibo.pics.smalls.length > 0" class="pic"
        v-for="(url, index) in weibo.pics.smalls"
        :key="index" :src="url" :lazy-load="true" mode="aspectFill"
        @click.stop="previewImage(index)" />
      <div class="video-wrapper" v-if="weibo.video" @click.stop="previewVideo">
        <image class="video" v-if="!videoSrc" :src="weibo.video.pic" lazy-load="true" mode="aspectFill" />
        <div class="video-button" v-if="!videoSrc"></div>
        <video class="video" v-if="videoSrc" @click.stop="doNothing" :id="'video_' + weibo.id" :src="videoSrc" controls></video>
      </div>
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
  data() {
    return {
      showVideo: false,
    };
  },
  computed: {
    videoSrc() {
      if (this.showVideo) {
        return this.weibo.video.url;
      }
      return '';
    },
  },
  methods: {
    previewVideo() {
      this.showVideo = true;
      this.videoContext = wx.createVideoContext(`video_${this.weibo.id}`);
      this.videoContext.play();
    },
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
.video-wrapper {
  height: 170px;
  width: 300px;
  display:flex;
  align-items: center;
  justify-content: center;
  background-color: #666;
}
.video-button {
  position: absolute;
  height: 0px;
  width: 0px;
  margin-bottom: 15px;
  border-top: 16px solid transparent;
  border-left: 25px solid #eee;
  border-bottom: 16px solid transparent;
  border-radius: 3px;
}
.video {
  width: 100%;
  height: 100%;
}
</style>
