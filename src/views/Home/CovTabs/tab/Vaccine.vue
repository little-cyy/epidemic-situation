<template>
  <div>
    <!-- 统计版块 -->
    <div class="num">
      <ul class="wrap">
        <li>
          <div class="number">
            <span>较昨日</span
            >{{ VaccineData["全球"].new_vaccinations | formatWan }}剂
          </div>
          <div class="bold">
            {{ VaccineData["全球"].total_vaccinations | formatYi }}剂
          </div>
          <strong>全球累计接种</strong>
        </li>
        <li>
          <div class="bold">
            {{ VaccineData["全球"].total_vaccinations_per_hundred }}剂
          </div>
          <strong>全球每百人接种</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span
            >{{ VaccineData["中国"].new_vaccinations | formatWan }}剂
          </div>
          <div class="bold">
            {{ VaccineData["中国"].total_vaccinations | formatYi }}剂
          </div>
          <strong>中国累计接种</strong>
        </li>

        <li>
          <div class="bold">
            {{ VaccineData["中国"].total_vaccinations_per_hundred }}剂
          </div>
          <strong>中国每百人接种</strong>
        </li>
      </ul>
    </div>
    <!-- 中国累计接种趋势 -->
    <div class="VaccineTrend">
      <div class="signTitle">中国累计接种趋势</div>
      <div
        id="lineVaccine"
        style="width: 6.9rem; height: 4rem; margin: 0 auto 0.3rem"
      ></div>
      <div
        id="lineVaccineHundred"
        style="width: 6.9rem; height:4rem; margin: 0 auto 0.3rem"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      VaccineData: {
        中国: {
          total_vaccinations: 0,
          new_vaccinations: 0,
          total_vaccinations_per_hundred: 0,
        },
        全球: {
          total_vaccinations: 0,
          new_vaccinations: 0,
          total_vaccinations_per_hundred: 0,
        },
      },
      ChinaVaccineTrendData: [],
    };
  },

  //定义过滤器
  filters: {
    number: function (val) {
      val = val > 0 ? "+" + val : val;
      if (val == 0) {
        return "";
      }
      return val;
    },
    formatWan: function (val) {
      val = (val / 10000).toFixed(1);
      return val + "万";
    },
    formatYi: function (val) {
      val = (val / 100000000).toFixed(1);
      return val + "亿";
    },
  },
  // created() {
  //   this.getData();
  // },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$api.getVaccine().then((res) => {
        const result = res.data;
        if (!result) return this.$toast.fail("提示文案");
        this.VaccineData = result.data.VaccineTopData;
        this.ChinaVaccineTrendData = result.data.ChinaVaccineTrendData;
        this.initLIne();
      });
    },
    initLIne() {
      let xAxisData = this.ChinaVaccineTrendData.map((item) =>
        item.date.split(".").join("-")
      );
      let total = this.ChinaVaccineTrendData.map((item) =>
        (item.total_vaccinations / 100000000).toFixed()
      );
      let per_hundred = this.ChinaVaccineTrendData.map(
        (item) => item.total_vaccinations_per_hundred
      );
      this.$myChart.line({
        id: "lineVaccine",
        colorList: ["#879BD7"],
        legend: ["中国累计接种趋势"],
        dataList: [total],
        xAxisData: xAxisData,
        showTooltip: true,
        areaStyle: true,
        showUnit:'亿',
        yAxisLabel: {
          formatter: "{value} 亿",
          fontSize:""
        },
      });
      this.$myChart.line({
        id: "lineVaccineHundred",
        colorList: ["#F86149"],
        legend: ["中国每百人接种趋势"],
        dataList: [per_hundred],
        xAxisData: xAxisData,
        showTooltip: true,
        areaStyle: true,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.num {
  background: #fff;
  padding: 0.3rem;
  min-height: 2rem;
  border-radius: 0.2rem 0.2rem 0 0;
  .title {
    color: #666;
    font-size: 0.24rem;
    margin-bottom: 0.2rem;
  }
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  padding-top: 0.2rem;
  border-radius: 0.1rem;
  box-shadow: 0 0 3px 2px rgba(194, 192, 192, 0.2);
  li {
    width: 50%;
    text-align: center;
    margin-bottom: 0.24rem;
    position: relative;
    font-size: 0.24rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .number {
      span {
        color: #777;
        font-weight: bold;
      }
    }
    strong {
      color: #333;
    }
  }
  // 1 2  3-  4 5 6-
  li::after {
    content: "";
    display: block;
    position: absolute;
    right: 1px;
    top: 0.2rem;
    height: 0.8rem;
    border-right: 1px solid #eee;
  }
  li:nth-child(2n)::after {
    content: "";
    border-right: 0;
  }
  .bold {
    font-weight: bold;
    font-size: 0.36rem;
  }
  li:nth-child(1) {
    color: red;
  }
  li:nth-child(2) {
    color: rgb(18, 143, 14);
  }
  li:nth-child(3) {
    color: #a25a4e;
  }
  li:nth-child(4) {
    color: rgb(189, 19, 98);
  }
  li:nth-child(5) {
    color: #677092;
  }
  li:nth-child(6) {
    color: #28b7a3;
  }
}
.VaccineTrend{
  padding: 0 0.3rem 0.3rem;
  #lineVaccine,#lineVaccineHundred{
  border: 0.01rem solid #ebebeb;
    border-radius: 0.08rem;
    box-shadow: 0 0 3px 2px rgba(194, 192, 192, 0.2);
    box-sizing: border-box;
  }
}
</style>