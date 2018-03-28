<template>
  <view  class="rich-content">
    <!-- <view v-for="(content, index) in contentList" :key="index">
      <text v-if="content.type==='text'">{{content.text}}</text>
      <image v-if="content.type==='emotion'" class="rich-emotion" :src="'https:' + content.src" :lazy-load="true" mode="widthFix"/>
      <a v-if="content.type==='link'" class="rich-link">{{content.text}}</a>
    </view> 因为个人小程序不支持外链web-view  目前注释 屏蔽A标签-->
    <view class="rich-itemt" v-for="(content, index) in contentList" :key="index">
      {{content.text}}<image v-if="content.type==='emotion'" class="rich-emotion" :src="'https:' + content.src" :lazy-load="true" mode="widthFix"/>
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

      let tempText = '';
      for (let i = 0, l = fullContent.length; i < l;) {
        if (fullContent[i] !== '$') {
          tempText += fullContent[i];
          i += 1;
        }
        if (fullContent[i] === '$' && fullContent[i + 1] === 'e') {
          const emotionText = emotions.shift();
          contentList.push({ type: 'text', text: tempText });
          tempText = '';
          contentList.push({
            type: 'emotion',
            src: emotionText.match(/src=['"](.*?)['"]/)[1],
          });
          i += 2;
        }
        if (fullContent[i] === '$' && fullContent[i + 1] === 'l') {
          contentList.push({ type: 'text', text: tempText });
          tempText = '';
          const linkText = links.shift();
          contentList.push({
            type: 'link',
            text: linkText.match(/>([^>]*?)<\/a>/)[1],
            // src: linkText.match(/href=['"](.*?)['"]/)[1],
          });
          i += 2;
        }
      }
      if (tempText) {
        contentList.push({ type: 'text', text: tempText });
      }
      return contentList;
    },
  },
};
</script>

<style>
.rich-itemt {
  display: inline;
}
.rich-emotion {
  display: inline-block;
  width: 20px;
  height: 20px;
}
.rich-link {
  margin: 0 5px;
}
</style>
