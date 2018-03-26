<template>
  <div class="card">
    <div class="label">
      <div class="avater">
        <image :src="weibo.user.profile_image_url" />
      </div>
      <div class="title">
        <p class="uesr">{{weibo.user.name}}</p>
        <text class="desc">{{before}} </text>
        <text class="desc">来自 {{source}}</text>
      </div>
    </div>
    <div class="content">
      <text>{{content}}</text>
    </div>
    <div class="preview">
      <image v-if="weibo.pic_urls.length > 0" class="pic"
        v-for="(pic_url, index) in weibo.pic_urls"
        :key="index" :src="pic_url.thumbnail_pic" :lazy-load="true" :mode="aspectFill"/>
      <video v-if="video" :src="video" controls ></video>
    </div>
  </div>
</template>

<script>
export default {
  props: ['weibo', 'now'],
  data() {
    return {
      before: this.getBeforeTime(),
      source: this.getSourceText(),
      content: this.getContent(),
      video: this.getVideo(),
    };
  },
  methods: {
    getBeforeTime() {
      const time = new Date(this.weibo.created_at).getTime();
      const goneSecond = (this.now - time) / 1000;
      if (goneSecond <= 60) {
        return '刚刚';
      }
      if (goneSecond <= 60 * 60) {
        return `${parseInt(goneSecond / 60, 10)}分钟前`;
      }
      if (goneSecond <= 60 * 60 * 24) {
        return `${parseInt(goneSecond / 3600, 10)}小时前`;
      }
      if (goneSecond <= 60 * 60 * 24 * 365) {
        return `${parseInt(goneSecond / 3600 / 24, 10)}天前`;
      }
      return '宇宙大爆炸前';
    },
    getSourceText() {
      if (this.weibo.source) {
        return this.weibo.source.match('>(.*?)<')[1] || '火星';
      }
      return '火星';
    },
    getVideo() {
      // 目前似乎只有秒拍的视频可以预览，需要再分析
/*       const allLinks = this.weibo.text.match(/https?:\/\/[\w\d./]+/g);
      let shortUrl = '';
      allLinks.forEach((link) => {
        if (/https?:\/\/t\.cn[\w\d./]+/.test(link)) {
          shortUrl += `${link}&`;
        }
      }); */
      return '';
    },
    getContent() {
      if (/http[s]?:\/\//.test(this.weibo.text)) {
        return this.weibo.text.replace(/https?:\/\/[\w\d./]+/, '~');
      }
      return this.weibo.text;
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
