<template>
  <div class="card">
    <div class="label">
      <div class="avater">
        <image :src="weibo.user.profile_image_url" />
      </div>
      <div class="title">
        <p class="uesr">{{weibo.user.screen_name}}</p>
        <p class="desc">
          <text>{{created_at}} </text>
          <text>来自 {{source}}</text>
        </p>
      </div>
    </div>
    <div class="content">
      <richContent :content="content"></richContent>
    </div>
    <div class="preview">
      <image v-if="pics.smalls.length > 0" class="pic"
        v-for="(url, index) in pics.smalls"
        :key="index" :src="url" :lazy-load="true" mode="aspectFill"
        @click="previewImage(index)" />
      <video v-if="video" :src="video.url" :poster="video.pic" controls></video>
    </div>
  </div>
</template>

<script>
import richContent from './richContent';

export default {
  components: {
    richContent,
  },
  props: ['weibo', 'now'],
  computed: {
    created_at() {
      return this.weibo.created_at;
    },
    source() {
      return this.weibo.source;
    },
    content() {
      if (this.weibo.text) {
        return this.weibo.text
          .replace(/https?:\/\/[\w\d./]+/g, '[网页链接]')
          .replace(/<br\/>/g, '\n')
          .replace(/&quot;/g, '"')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&amp;/g, '&');
      }
      if (this.weibo.page_info) {
        const page = this.weibo.page_info;
        if (page.type === 'video') {
          const { text } = this.readVideo(page);
          return text;
        }
        if (page.type === 'topic') {
          return this.readTopic(page).text;
        }
        if (page.type === 'webpage') {
          return this.readWebPage(page).text;
        }
      }
      return '这里一片荒芜...';
    },
    video() {
      if (this.weibo.page_info) {
        const page = this.weibo.page_info;
        if (page.type === 'video') {
          return this.readVideo(page);
        }
      }
      return null;
    },
    pics() {
      return this.weibo.pics;
    },
  },
  methods: {
    readVideo(page) {
      return {
        text: `${page.page_title} ${page.content2}`,
        url: page.media_info.stream_url,
        pic: page.page_pic.url,
      };
    },
    readTopic(page) {
      return {
        text: `${page.page_title} ${page.content1}`,
      };
    },
    readWebPage(page) {
      return {
        text: `${page.page_title} ${page.content2}`,
      };
    },
    previewImage(index) {
      wx.previewImage({
        current: this.pics.larges[index], // 当前显示图片的http链接
        urls: this.pics.larges, // 需要预览的图片http链接列表
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
