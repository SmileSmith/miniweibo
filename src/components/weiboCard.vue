<template>
  <div>
    <p class="card">
      {{weibo.user.name}}
    </p>
  </div>
</template>

<script>
export default {
  onLoad() {
  },
  props: ['weibo'],
};
</script>

<style>
.card {
  padding: 10px;
}
</style>
