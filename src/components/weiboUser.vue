<template>
  <div class="label">
    <div class="avater">
      <image :src="user.profile_image_url" />
    </div>
    <div class="title">
      <p class="uesr">{{user.screen_name}}</p>
      <p class="desc">
        <text>{{created}} </text>
        <text>来自 {{source}}</text>
      </p>
    </div>
    <div v-if="likes" class="like"><text class="iconfont icon-dianzan"></text> {{likes}} </div>
  </div>
</template>

<script>
export default {
  props: ['user', 'created', 'source', 'likes'],
};
</script>

<style scoped>
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 15px;
}
.title .desc {
  font-size: 12px;
  color: #999;
}
.like {
  font-size: 12px;
  color: #999;
  margin-right: 10px;
}
</style>
