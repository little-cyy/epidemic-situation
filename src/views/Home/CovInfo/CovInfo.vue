<template>
  <div class="CovInfo">
    <!-- 病毒信息 -->
    <div class="covDesc">
      <div class="signTitle">病毒信息</div>
      <p>{{ covDesc.note1 }}</p>
      <p>{{ covDesc.note2 }}</p>
      <p>{{ covDesc.note3 }}</p>
      <p>{{ covDesc.remark1 }}</p>
      <p>{{ covDesc.remark2 }}</p>
      <p>{{ covDesc.remark3 }}</p>
    </div>
    <!-- 疫情热点 -->
    <!-- <div class="covHot">
      <div class="signTitle">
        <div class="pTitle">疫情热点</div>
        <div class="more">
          查看更多
          <svg-icon icon-class="chevron-right" />
        </div>
      </div>
      <ul>
        <li v-for="item in news" :key="item.id">
          <div>
            <span class="icon-red">最新</span>
            <span class="new-title">{{ item.title }}</span>
          </div>
          <div class="icon-more">
            <svg-icon icon-class="chevron-right" />
          </div>
        </li>
      </ul>
    </div> -->
    <!-- 小导航 -->
    <div class="list">
      <div class="list-item">
        <img src="@/assets/images/1.png" />
        <div>免费问诊</div>
      </div>
      <div class="list-item" @click="toNucleicAcid">
        <img src="@/assets/images/2.png" />
        <div>核酸检测</div>
      </div>
      <div class="list-item" @click="toProtectGuide">
        <img src="@/assets/images/3.png" />
        <div>防疫物资</div>
      </div>
      <div class="list-item" @click="toPneumoniaPolicy">
        <img src="@/assets/images/4.png" />
        <div>出行政策</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CovInfo",
  components: {},
  props: {
    covDesc: {
      type: Object,
      default: () => {},
    },
    news: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    toNucleicAcid() {
      this.$router.push("/nucleicAcid");
    },
    toProtectGuide(){
      this.$router.push("/protectGuide");
    },
    toPneumoniaPolicy(){
      this.$router.push("/pneumoniaPolicy");
    }
  },
};
</script>
<style lang="less" scoped>
.CovInfo {
  padding: 0 0.32rem;
  background-color: #ffffff;
  > div {
    border-bottom: 1px solid #ebebeb;
    padding: 0.3rem 0;
  }
  .signTitle {
    display: flex;
    .pTitle {
      flex-grow: 1;
    }
    .more {
      color: #4169e2;
      flex-grow: 0;
      font-weight: 500;
      font-size: 0.28rem;
    }
  }
  p {
    line-height: 0.5rem;
    color: #666;
  }
  .covHot {
    ul li {
      display: flex;
      margin-bottom: 0.3rem;
      div {
        flex-grow: 1;
      }
      .icon-red {
        display: inline-block;
        background-color: #f74c32;
        color: #fff;
        font-size: .24rem;
        padding: 0 0.05rem;
        border-radius: 0.06rem;
        margin-right: 0.06rem;
        line-height: .36rem;
      }
      .new-title {
        font-size: 0.3rem;
        line-height: .36rem;
        letter-spacing: 0.06rem;
        vertical-align: middle;
      }
      .icon-more {
        display: inline-block;
        flex-grow: 0;

        color: #c9c9c9;
        .svg-icon {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .list {
    display: flex;
    justify-content: space-between;
    padding: 0.2 0rem;
    border-bottom: 1px solid #ebebeb;
    .list-item {
      flex-grow: 1;
      width: 20%;
      text-align: center;
      img {
        width: 50%;
      }
    }
  }
}
</style>
