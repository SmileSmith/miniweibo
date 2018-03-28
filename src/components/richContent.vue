<template>
  <view  class="rich-content">
    <view v-for="(content, index) in contentList" :key="index">
      <text v-if="content.type==='text'">{{content.text}}</text>
      <image v-if="content.type==='emotion'" class="rich-emotion" :src="'https:' + content.src" :lazy-load="true" mode="widthFix"/>
      <a v-if="content.type==='link'" class="rich-link">{{content.text}}</a>
    </view>
  </view>
</template>

<script>
export default {
  props: ['content'],
  computed: {
    contentList() {
      const contentList = [];
      let fullContent = this.content;
      const links = this.content.match(/<(a).*?<\/\1>/g);
      fullContent = fullContent.replace(/<(a).*?<\/\1>/g, '$l');
      const emotions = this.content.match(/<(span).*?<\/\1>/g);
      fullContent = fullContent.replace(/<(span).*?<\/\1>/g, '$e');
      for (let i = 0, l = fullContent.length; i < l;) {
        if (fullContent[i] !== '$') {
          contentList.push({
            type: 'text',
            text: fullContent[i],
          });
          i += 1;
        }
        if (fullContent[i] === '$' && fullContent[i + 1] === 'e') {
          const emotionText = emotions.shift();
          contentList.push({
            type: 'emotion',
            src: emotionText.match(/src=['"](.*?)['"]/)[1],
          });
          i += 2;
        }
        if (fullContent[i] === '$' && fullContent[i + 1] === 'l') {
          const linkText = links.shift();
          contentList.push({
            type: 'link',
            text: linkText.match(/>([^>]*?)<\/a>/)[1],
            src: linkText.match(/href=['"](.*?)['"]/)[1],
          });
          i += 2;
        }
      }
      return contentList;
    },
  },
};
</script>

<style>
.rich-content {
  display: flex;
  flex-wrap: wrap;
}
.rich-emotion {
  width: 20px;
  height: 20px;
}
.rich-link {
  margin: 0 5px;
}
</style>
