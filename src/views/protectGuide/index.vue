<template>
  <div class="protectGuide">
    <div class="warp">
      <div class="back-btn" @click="goBack">返回疫情动态</div>
      <div class="top-logo">
        <img src="@/assets/images/protectGuide.png" alt="" />
      </div>
      <van-tabs sticky>
        <van-tab v-for="item in tabList" :title="item.title" :key="item.title">
          <img :src="item.img" alt="" />
        </van-tab>
      </van-tabs>
    </div>
    <div class="foot">
      <button>抗疫物资购买</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabList: [
        { title: "消毒剂", img: require("@/assets/images/xiaoduji.png") },
        { title: "口罩", img: require("@/assets/images/kouzhao.png") },
        { title: "洗手液", img: require("@/assets/images/xishouye.png") },
        { title: "温度计", img: require("@/assets/images/wenduji.png") },
      ],
    };
  },
    methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.protectGuide {
  height: 100vh;
  display: flex;
  flex-flow: column;
  background-color: #3343ff;
  .foot {
    text-align: center;
    button {
      margin: 0.16rem 0;
      width: calc(100% - 1.2rem);
      line-height: 0.8rem;
      background-color: #f74c31;
      border: 0;
      border-radius: 0.5rem;
      color: #fff;
    }
  }
  .warp {
    position: relative;
    overflow-y: auto;
    .top-logo {
      img {
        width: 100%;
      }
    }

    .van-tabs {
      position: relative;
      
      ::v-deep.van-tabs__line {
        background-color: transparent;
      }
      ::v-deep.van-tabs__nav--line {
        padding: 0 0.32rem;
        background-color: #3343ff;
        .van-tab{
          padding: 0;
        }
        .van-tab+.van-tab{
          padding-left: .24rem;
        }
        .van-tab__text {
          background-color: #6874ff;
          color: #fff;
          width: 100%;
          text-align: center;
          line-height: 0.48rem;
          border-radius: 0.04rem;
        }
      }
       ::v-deep .van-tab--active .van-tab__text {
          background-color: #f78207;
        }
       ::v-deep .van-tabs__content {
         padding: 0 0.32rem;
      }
      .van-tab__pane {
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>