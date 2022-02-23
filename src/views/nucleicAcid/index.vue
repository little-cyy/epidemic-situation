<template>
  <div class="nucleicAcid">
    <div class="back-btn" @click="goBack">返回疫情动态</div>
    <img src="@/assets/images/hesuan.jpg" alt="" />
  </div>
</template>
<script>
export default {
    methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
}
</script>
<style lang="less" scoped>
.nucleicAcid {
  overflow: hidden;
  >img {
    width: 100vw;
    height: 100vh;
  }
}
</style>