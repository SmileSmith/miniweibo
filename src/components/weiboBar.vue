<template>
  <div class="bar">
    <div class="item"><text class="iconfont icon-shuqian"></text> {{bar.reposts}} </div>
    <div class="item"><text class="iconfont icon-pinglun"></text> {{bar.comments}} </div>
    <div class="item"><text class="iconfont icon-dianzan"></text> {{bar.attitudes}} </div>
  </div>
</template>

<script>
export default {
  props: ['bar'],
};
</script>

<style scoped>
.bar {
  height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 0.5px #ccc solid;
  padding: 0 10px;
  font-size: 12px;
  color: #999;
  background-color: #fff;
}
.item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.item + .item {
  border-left: 0.5px #eee solid;
}
.item .iconfont {
  font-size: 15px;
  margin-right: 5px;
}
</style>
