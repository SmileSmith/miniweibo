<template>
  <div class="card">
      {{text}}
  </div>
</template>

<script>
export default {
  props: ['text'],
};
</script>

<style scoped>
.card {
  padding: 10px;
  height: 20px;
  font-size: 15px;
  color: #ccc;
  text-align: center;
}
</style>
