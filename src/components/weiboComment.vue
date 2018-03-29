<template>
  <div class="comment">
    <weiboUser :user="comment.user" :created="comment.created_at" :source="comment.source"></weiboUser>
    <div class="comment-content">
      <richContent :content="comment.text"></richContent>
    </div>
  </div>
</template>

<script>
import weiboUser from './weiboUser';
import richContent from './richContent';

export default {
  components: {
    weiboUser,
    richContent,
  },
  props: ['comment'],
};
</script>

<style scoped>
.comment {
  padding: 10px;
  border-bottom: 0.5px #eee solid;
  font-size: 15px;
}
.comment-content {
  color: #333;
  margin-top: 5px;
  margin-left: 50px;
  line-height: 25px;
}
</style>
