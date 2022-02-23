<template>
  <div class="home">
    <!-- 疫情图片 -->
    <img src="@/assets/images/logo.png" width="100%" />
    <!-- 病毒信息 -->
    <CovInfo :covDesc="covDesc" :news="news" />
    <!-- 标签页 -->
    <CovTabs />
  </div>
</template>

<script>
import CovInfo from "./CovInfo/CovInfo.vue";
import CovTabs from "./CovTabs/CovTabs.vue";
export default {
  name: "Home",
  components: {
    CovInfo,
    CovTabs,
  },
  data() {
    return {
      covDesc: {}, //病毒信息介绍
      news: [],  //疫情热点
      active: "region",
    };
  },
  provide() {
    return {
      covData: this.covDataOrign, //确诊数据
    };
  },
  activated() {
  },
   created() {
     this.$api.getCovInfo().then((res) => {
      if (res.data.code === 200) {
        const data = res.data.newslist[0].desc;
        // 病毒信息
        this.covDesc = {
          notel: data.notel,
          note2: data.note2,
          note3: data.note3,
          remarkl: data.remarkl,
          remark2: data.remark2,
          remark3: data.remark3,
        };
        //数据更新时间
        // const time=new Date(data.modifyTime).toLocaleString("zh", { hour12: false })
        const time=new Date(data.modifyTime).pattern("yyyy-MM-dd hh:mm")
        this.$bus.$emit('modifyTime',time)
        //风险地区
        let riskarea=res.data.newslist[0].riskarea;
        riskarea=Object.assign({highNum:riskarea.high.length,midNum:riskarea.mid.length},...[riskarea])
        this.$bus.$emit('riskarea',riskarea)
        // 国内疫情确诊信息
        const covData = {
          currentConfirmedCount: data.currentConfirmedCount,
          confirmedCount: data.confirmedCount,
          suspectedCount: data.suspectedCount,
          curedCount: data.curedCount,
          deadCount: data.deadCount,
          seriousCount: data.seriousCount,
          suspectedIncr: data.suspectedIncr,
          currentConfirmedIncr: data.currentConfirmedIncr,
          confirmedIncr: data.confirmedIncr,
          curedIncr: data.curedIncr,
          deadIncr: data.deadIncr,
          seriousIncr: data.seriousIncr,
        };
        this.$bus.$emit('covData',covData)
        // 全球确诊信息
        const GolbalCovData = {
          currentConfirmedCount: data.globalStatistics.currentConfirmedCount,
          confirmedCount: data.globalStatistics.confirmedCount,
          curedCount: data.globalStatistics.curedCount,
          deadCount: data.globalStatistics.curedCount,
        };
        this.$bus.$emit('GolbalCovData',GolbalCovData)
        //疫情热点
        this.news = res.data.newslist[0].news;
        
      }
    });
  },
  methods: {
    toNucleicAcid() {
      this.$router.push("/nucleicAcid");
    },
  },
};
</script>
<style lang="less" scoped>
</style>
