<template>
  <div>
    <div class="num">
      <div class="title">截至{{ modifyTime && modifyTime }}全国数据统计</div>
      <ul class="wrap">
        <li>
          <div class="number">
            <span>较昨日</span>{{ covData.currentConfirmedIncr | number }}
          </div>
          <div class="bold">
            {{ covData.currentConfirmedCount | division }}
          </div>
          <strong>现存确诊</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span>{{ covData.suspectedIncr | number }}
          </div>
          <div class="bold">{{ covData.suspectedCount | division }}</div>
          <strong>境外输入</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span>{{ covData.seriousIncr | number }}
          </div>
          <div class="bold">{{ covData.seriousCount | division }}</div>
          <strong>现存无症状</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span>{{ covData.confirmedIncr | number }}
          </div>
          <div class="bold">{{ covData.confirmedCount | division }}</div>
          <strong>累计确诊</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span> {{ covData.deadIncr | number }}
          </div>
          <div class="bold">{{ covData.deadCount | division }}</div>
          <strong>累计死亡</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span> {{ covData.curedIncr | number }}
          </div>
          <div class="bold">{{ covData.curedCount | division }}</div>
          <strong>累计治愈</strong>
        </li>
      </ul>
    </div>
    <div class="epidemicTrend">
      <div class="signTitle">国内疫情趋势</div>
      <div class="chartDiv">
        <swiper ref="mySwiper" :options="swiperOptions">
          <swiper-slide v-for="it in btnList.length" :key="it">
            <div :id="'wrap' + it" class="line-box"></div>
          </swiper-slide>
        </swiper>
        <img
          src="@/assets/images/prevButton.png"
          class="prevButton"
          @click="toSlide(activeIdx - 1)"
        />
        <img
          src="@/assets/images/nextButton.png"
          class="nextButton"
          @click="toSlide(activeIdx + 1)"
        />
        <div class="btn-list">
          <div
            v-for="(item, index) in btnList"
            :key="index"
            @click="toSlide(index)"
            :class="{ active: activeIdx === index }"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="tableBox">
      <GTable
      type="tree"
      :data="tableData"
      :column="column"
      :colorList="colorList"
      showDetail
      @detailClick="detailClick"
    />
    </div>
    
  </div>
</template>
<script>
import GTable from "@/views/components/GTable.vue";
export default {
  components: {
    GTable,
  },
    props: {
    chinaInfo: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    const $this = this;
    return {
      colorList:['#E3E7F3','#F3BAB0','#E69A8D','#B4C0D5','#95DB9A'],
       column: [
        { title: "地区", prop: "name" },
        { title: "现存确诊", prop: "nowConfirm" },
        { title: "累计确诊", prop: "confirm" },
        { title: "死亡", prop: "dead" },
        { title: "治愈", prop: "heal" },
      ],
      tableData: [],
      btnList: [
        "新增确诊",
        "新增境外输入",
        "累计境外输入",
        "现存确诊",
        "累计确诊",
        "累计治愈",
        "累计死亡",
      ],
      activeIdx: 0,
      covData: {},
      modifyTime: "",
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
        },
        on: {
          slideChangeTransitionStart: function () {
            $this.activeIdx = this.activeIndex;
          },
        },
      },
      sendData: {
        addConfirme: { data: [], xAxisData: [] }, //  新增确诊
        addabroadConfirme: { data: [], xAxisData: [] }, //新增境外输入
        abroadConfirme: { data: [], xAxisData: [] }, //累计境外输入
        nowConfirme: { data: [], xAxisData: [] }, //  现存确诊
        confirme: { data: [], xAxisData: [] }, //  累计确诊
        cure: { data: [], xAxisData: [] }, //  累计治愈
        dead: { data: [], xAxisData: [] }, //  累计死亡
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  watch: {
    chinaInfo(val) {
      val.forEach((item) => {
        if(item.nowConfirm>0||item.confirm>0||item.dead>0||item.heal>0){
          let result = {
          name: item.name,
          confirm: item.confirm,
          nowConfirm: item.nowConfirm,
          dead: item.dead,
          heal: item.heal,
          children: []}
          result.children = item.children.filter((ele) => {
            return ele.nowConfirm>0||ele.confirm>0||ele.dead>0||ele.heal>0
          });
          this.tableData.push(result)
        }
      });
    },
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
    //js 中数字加逗号处理(每三位加逗号)
    division: function (num) {
      if (num == undefined) return "";
      // console.log('num---',num);
      //方式1：
      // console.log('格式---',num.toLocaleString());
      return num.toLocaleString();
      //方式2：正则处理
      //   return num.toString().replace(/\d+/, function (n) {
      //     return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      //   });
    },
  },
  created() {
    window.myClick = this.myClick;
  },
  mounted() {
    this.getDayInfo();
    this.$bus.$on("covData", (data) => {
      this.covData = data;
    });
    this.$bus.$on("modifyTime", (data) => {
      this.modifyTime = data;
    });
  },
  methods: {
    myClick(name) {
      this.$router.push({
        name: "City",
        query: { city:name },
      });
    },
    detailClick(row) {
      this.myClick(row.name)
    },
    getDayInfo() {
      this.$api.getDayInfo().then((res) => {
        const result = res.data;
        if (!result) return this.$toast.fail("提示文案");
        this.sendData = {
          addConfirme: { data: [], xAxisData: [] }, //  新增确诊
          addabroadConfirme: { data: [], xAxisData: [] }, //新增境外输入
          abroadConfirme: { data: [], xAxisData: [] }, //累计境外输入
          nowConfirme: { data: [], xAxisData: [] }, //  现存确诊
          confirme: { data: [], xAxisData: [] }, //  累计确诊
          cure: { data: [], xAxisData: [] }, //  累计治愈
          dead: { data: [], xAxisData: [] }, //  累计死亡
        };
        result.data.slice(-13).forEach((item) => {
          this.sendData.addConfirme.data.push(item.currentConfirmedIncr);
          this.sendData.addConfirme.xAxisData.push(
            String(item.dateId).slice(4, 6) +
              "-" +
              String(item.dateId).slice(-2)
          );
          this.sendData.addabroadConfirme.data.push(item.suspectedCountIncr); //新增境外输入
          this.sendData.addabroadConfirme.xAxisData.push(
            String(item.dateId).slice(4, 6) +
              "-" +
              String(item.dateId).slice(-2)
          ); //新增境外输入
        });
        result.data.slice(-360).forEach((item) => {
          this.sendData.addabroadConfirme.data.push(item.suspectedCountIncr); //新增境外输入
          this.sendData.abroadConfirme.data.push(item.suspectedCount); //累计境外输入
          this.sendData.nowConfirme.data.push(item.currentConfirmedCount); //  现存确诊
          this.sendData.confirme.data.push(item.confirmedCount); //  累计确诊
          this.sendData.cure.data.push(item.curedCount); //  累计治愈
          this.sendData.dead.data.push(item.deadCount); //  累计死亡
          this.sendData.abroadConfirme.xAxisData.push(
            String(item.dateId).slice(4, 6) +
              "-" +
              String(item.dateId).slice(-2)
          ); //累计境外输入
          this.sendData.nowConfirme.xAxisData.push(
            String(item.dateId).slice(4, 6) +
              "-" +
              String(item.dateId).slice(-2)
          ); //  现存确诊
          this.sendData.confirme.xAxisData.push(
            String(item.dateId).slice(4, 6) +
              "-" +
              String(item.dateId).slice(-2)
          ); //  累计确诊
          this.sendData.cure.xAxisData.push(
            String(item.dateId).slice(4, 6) +
              "-" +
              String(item.dateId).slice(-2)
          ); //  累计治愈
          this.sendData.dead.xAxisData.push(
            String(item.dateId).slice(4, 6) +
              "-" +
              String(item.dateId).slice(-2)
          ); //  累计死亡
        });
        this.init();
      });
    },
    init() {
     let colorList = ['#F86149','#F86149','#F86149','#F86149','#F86149',  '#657797','#37BCA9']
      this.btnList.forEach((item, idx) => {
        const key = [...Object.keys(this.sendData)][idx];
        // console.log(typeof this.sendData[key],[...this.sendData[key]])
        this.$myChart.line(
          {id:`wrap${idx + 1}`,
          title:item,
          colorList:[colorList[idx]],
          legend:[item],
          dataList:[this.sendData[key].data],
          xAxisData:this.sendData[key].xAxisData
           } );
      });
    },
    toSlide(idx) {
      if (idx === -1) idx = this.btnList.length - 1;
      else if (idx > this.btnList.length - 1) idx = 0;
      // console.log(idx);
      this.activeIdx = idx;
      this.swiper.slideTo(idx, 1000, false);
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
.tableBox{
  padding:0 0.3rem 0.3rem;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  padding-top: 0.2rem;
  border-radius: 0.1rem;
  box-shadow: 0 0 3px 2px rgba(194, 192, 192, 0.2);
  li {
    width: 33.33333%;
    text-align: center;
    margin-bottom: 0.24rem;
    position: relative;
    font-size: 0.24rem;
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
  li:nth-child(3n)::after {
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
.epidemicTrend {
  margin: 0 0.32rem;
  padding-bottom: 0.24rem;
  .btn-list {
    display: flex;
    flex-flow: wrap;
    margin: 0.12rem 0;
    font-size: 0.24rem;
    > div:first-of-type,
    > div:nth-of-type(6) {
      margin-left: 0;
    }
    > div:nth-of-type(6),
    > div:nth-of-type(7) {
      margin-top: 0.05rem;
    }
    > div {
      width: calc(20% - 0.04rem);
      margin-left: 0.05rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      color: #666;
      text-align: center;
      background: #f7f7f7;
      border-radius: 0.04rem;
      height: 0.88rem;
      box-sizing: border-box;
      font-size: 0.26rem;
    }
    .active {
      border: 0.01rem solid #dbe4ff;
      color: #4169e2;
      background: #f1f5ff;
    }
  }
}
.swiper-container {
  border: 0.01rem solid #ebebeb;

  //  padding-left: .3rem;
  border-radius: 0.08rem;
  box-shadow: 0 0 3px 2px rgba(194, 192, 192, 0.2);
  box-sizing: border-box;
  margin-bottom: 0.3rem;
}
.line-box {
  width: 100%;
  margin: 0 auto;
  height: 3.6rem;
}
.chartDiv {
  position: relative;
  .prevButton,
  .nextButton {
    width: 0.44rem;
    position: absolute;
    top: 1.8rem;
    transform: translateY(-50%);
    z-index: 99;
  }
  .prevButton {
    transform: translateX(-50%);
  }
  .nextButton {
    right: 0;
    transform: translateX(50%);
  }
}
</style>