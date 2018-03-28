<template>
  <div class="button" :class="{loading: loading}"></div>
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
.loading {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 5px solid #fff;
  border-left: 5px solid #e6162d;
  animation: load 1s linear infinite;
  -moz-animation: load 1s linear infinite;
  -webkit-animation: load 1s linear infinite;
  -o-animation: load 1s linear infinite;
}
@keyframes load {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>


