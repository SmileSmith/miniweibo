<template>
  <div class="card">
    <div class="label">
      <div class="avater">
        <image :src="weibo.user.profile_image_url" />
      </div>
      <div class="title">
        <p class="uesr">{{weibo.user.screen_name}}</p>
        <text class="desc">{{created_at}} </text>
        <text class="desc">来自 {{source}}</text>
      </div>
    </div>
    <div class="content">
      <richContent :content="content"></richContent>
    </div>
    <div class="preview">
      <image v-if="weibo.pics.length > 0" class="pic"
        v-for="(pic_url, index) in weibo.pics"
        :key="index" :src="pic_url.url" lazy-load="true" mode="aspectFill"/>
      <video v-show="video" :id="video + index" :src="video" controls></video>
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
  data() {
    return {
      created_at: this.getBeforeTime(),
      source: this.getSourceText(),
      content: this.getContent(),
      video: this.getVideo(),
    };
  },
  methods: {
    getBeforeTime() {
      return this.weibo.created_at;
    },
    getSourceText() {
      return this.weibo.source;
    },
    getVideo() {
      if (this.weibo.page_info) {
        const page = this.weibo.page_info;
        if (page.type === 'video') {
          const { video } = this.readVideo(page);
          return video;
        }
      }
      return '';
    },
    readVideo(page) {
      // 目前似乎只有秒拍的视频可以预览，需要再分析
      /*       const allLinks = this.weibo.text.match(/https?:\/\/[\w\d./]+/g);
      let shortUrl = '';
      allLinks.forEach((link) => {
        if (/https?:\/\/t\.cn[\w\d./]+/.test(link)) {
          shortUrl += `${link}&`;
        }
      }); */
      return {
        text: `${page.page_title} ${page.content2}`,
        video: page.media_info.stream_url,
      };
    },
    readTopic(page) {
      return {
        text: `${page.page_title} ${page.content1}`,
      };
    },
    readWebPage(page) {
      return {
        text: page.content2,
      };
    },
    getContent() {
      if (this.weibo.page_info) {
        const page = this.weibo.page_info;
        if (page.type === 'video') {
          const { video, text } = this.readVideo(page);
          this.video = video;
          return text;
        }
        if (page.type === 'topic') {
          return this.readTopic(page).text;
        }
        if (page.type === 'webpage') {
          return this.readWebPage(page).text;
        }
      }
      return this.weibo.text.replace(/https?:\/\/[\w\d./]+/g, '[网页链接]').replace(/<br\/>/g, '\n');
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
  display: inline-block;
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
</style>
