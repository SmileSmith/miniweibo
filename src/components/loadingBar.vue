<template>
  <div class="loading">
    <div class="csshub-loading">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'loadingButton',
  props: ['loading'],
};
</script>

<style scoped>
.loading {
  font-size: 15px;
  color: #666;
  background-color: #eee;
  text-align: center;
}
.csshub-loading {
  text-align: center;
}
.csshub-loading > div {
  background-color: #999;
  width: 4px;
  height: 22px;
  border-radius: 2px;
  margin: 8px;
  animation-fill-mode: both;
  display: inline-block;
  animation: csshub-line-scale-pulse-out 0.9s -0.6s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
}
.csshub-loading > div:nth-child(2),
.csshub-loading > div:nth-child(4) {
  animation-delay: -0.4s !important;
}
.csshub-loading > div:nth-child(1),
.csshub-loading > div:nth-child(5) {
  animation-delay: -0.2s !important;
}
@-webkit-keyframes csshub-line-scale-pulse-out {
  0% {
    transform: scaley(1);
  }
  50% {
    transform: scaley(0.4);
  }
  100% {
    transform: scaley(1);
  }
}
@keyframes csshub-line-scale-pulse-out {
  0% {
    transform: scaley(1);
  }
  50% {
    transform: scaley(0.4);
  }
  100% {
    transform: scaley(1);
  }
}
</style>


