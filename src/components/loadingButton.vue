<template>
  <!-- <div class="button" :class="{loading: loading}"></div> -->
  <div class="button" :class="{ 'csshub-scale': loading }">
      <div></div>
      <div></div>
      <div></div>
  </div>
</template>
<script>
export default {
  name: 'loadingButton',
  props: ['loading'],
};
</script>

<style scoped>
.button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 5px solid #e6162d;
}
/* .loading {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 5px solid #fff;
  border-left: 5px solid #e6162d;
  animation: load 1s linear infinite;
}
@keyframes load {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
} */
@keyframes csshub-scale-multiple {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
.csshub-scale {
  position: relative;
}
.csshub-scale > div {
  background-color: #e6162d;
  border-radius: 50%;
  animation-fill-mode: both;
  position: absolute;
  top: -15px;
  left: -15px;
  opacity: 0;
  margin: 0;
  width: 60px;
  height: 60px;
  animation: csshub-scale-multiple 2s 0s linear infinite;
}
.csshub-scale > div:nth-child(2) {
  animation-delay: -0.8s;
}
.csshub-scale > div:nth-child(3) {
  animation-delay: -0.4s;
}
</style>


