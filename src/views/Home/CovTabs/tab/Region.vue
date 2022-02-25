<template>
  <div class="region">
    <!-- 近期疫情分布 -->
    <div class="covDistribution">
      <!-- 风险地区统计版块 -->
      <div class="signTitle">
        <div class="pTitle">近期疫情分布</div>
        <div class="modifyTime">截至北京时间{{ modifyTime && modifyTime }}</div>
      </div>
      <div class="wrap">
        <div>
          高风险地区<span class="high">
            {{ riskarea && riskarea.highNum }} </span
          >个，中风险地区<span class="mid">
            {{ riskarea && riskarea.midNum }} </span
          >个
        </div>
        <div class="more" @click="toArea">
          查看全部
          <svg-icon icon-class="chevron-right" />
        </div>
      </div>
      <!-- 表格版块 -->
      <GTable
        type="tree"
        :data="tableData"
        :column="column"
        :colorList="colorList"
        showDetail
        limitHeight="500"
        @detailClick="detailClick"
      />
    </div>
    <!-- 国内疫情地图 -->
    <div class="ChinaMap">
      <div class="signTitle">国内疫情地图</div>
      <div class="chartDiv">
        <van-tabs :value="active" animated @change="tabChange">
          <van-tab title="现存确诊">
            <div
              id="curConfirm"
              style="width: 7.2rem; height: 6rem; margin: 0 auto"
            ></div>
          </van-tab>
          <van-tab title="风险地区">
            <div
              id="riskAreaArr"
              style="width: 7.2rem; height: 6rem; margin: 0 auto"
            ></div>
          </van-tab>
          <van-tab title="累计确诊">
            <div
              id="confirm"
              style="width: 7.2rem; height: 6rem; margin: 0 auto"
            ></div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    chinaInfo: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      active: 0,
      confirmArr: [],
      riskAreaArr: [],
      chinaMapData: [],
      modifyTime: "",
      riskarea: [],
      column: [
        { title: "地区", prop: "name" },
        { title: "昨日本土新增", prop: "AddConfirm" },
        { title: "现存确诊", prop: "nowConfirm" },
        { title: "风险地区", prop: "higAndMid" },
      ],
      tableData: [],
      colorList: ["#E3E7F3", "#E69A8D", "#F3BAB0", "#B4C0D5"],
    };
  },
  computed: {},
  created() {},
  watch: {
    chinaInfo(val) {
      this.getData();
      val.slice(2).forEach((item) => {
        if (item.AddConfirm > 0 || item.nowConfirm > 0 || item.higAndMid > 0) {
          let result = {
            name: item.name,
            AddConfirm: item.AddConfirm,
            nowConfirm: item.nowConfirm,
            higAndMid: item.higAndMid,
            children: [],
          };
          result.children = item.children.filter((ele) => {
            return (
              ele.AddConfirm > 0 || ele.nowConfirm > 0 || ele.higAndMid > 0
            );
          });
          this.tableData.push(result);
        }
      });
    },
  },
  mounted() {
    this.$bus.$on("modifyTime", (data) => {
      this.modifyTime = data;
    });
    this.$bus.$on("riskarea", (data) => {
      this.riskarea = data;
    });
  },
  methods: {
    detailClick(row) {
      this.$router.push({
        name: "City",
        query: { city: row.name },
      });
    },
    toArea() {
      this.$router.push({
        name: "Area",
        params: { modifyTime: this.modifyTime },
      });
    },
    tabChange(activeIdx) {
      if (activeIdx === 1) {
        this.$nextTick(() => {
          this.$myChart.chinaMap("riskAreaArr", this.riskAreaArr);
        });
      } else if (activeIdx === 2) {
        this.$nextTick(() => {
          this.$myChart.chinaMap("confirm", this.confirmArr);
        });
      }
    },
    getData() {
      let curConfirmArr = [];
      this.chinaInfo.forEach((item) => {
        //累计确诊
        const obj1 = {
          name: item.name,
          value: item.confirm,
        };
        //风险地区
        const obj2 = {
          name: item.name,
          value: item.higAndMid,
        };
        //当前确诊
        const obj3 = {
          name: item.name,
          value: item.nowConfirm,
        };
        this.confirmArr.push(obj1);
        this.riskAreaArr.push(obj2);
        curConfirmArr.push(obj3);
      });
      // console.log('a',curConfirmArr)
      this.$myChart.chinaMap("curConfirm", curConfirmArr);
    },
  },
};
</script>
<style lang="less" scoped>
.region {
  padding-bottom: 0.3rem;

  > div {
    margin: 0 0.32rem;
    border-bottom: 0.01rem solid #ebebeb;
    padding-top: 0.3rem;
    .signTitle {
      display: flex;
      .pTitle {
        flex-grow: 1;
      }
      .modifyTime {
        color: #999;
        font-size: 0.24rem;
        flex-grow: 0;
        font-weight: 400;
      }
    }
    .wrap {
      margin-bottom: 0.3rem;
      align-items: center;
      padding: 0.24rem;
      color: #333;
      font-size: 0.28rem;
      border: 0.01rem solid #d9d9d9;
      border-radius: 0.08rem;
      display: flex;
      > div {
        flex-grow: 1;
      }
      .more {
        flex-grow: 0;
        color: #4169e2;
        font-weight: 500;
        font-size: 0.24rem;
        .svg-icon {
          height: 0.18rem;
          vertical-align: 0;
        }
      }
      .high {
        color: #f74c31;
        font-weight: 600;
      }
      .mid {
        color: #fbb046;
        font-weight: 600;
      }
    }
  }
  .ChinaMap {
    margin: 0;
    .signTitle {
      margin: 0 0.32rem 0.2rem;
    }
    .chartDiv {
      background-color: #f7f7f7;
      .van-tabs {
        ::v-deep .van-tabs__wrap {
          height: 0.88rem;
        }
        ::v-deep .van-tabs__nav--line {
          padding-left: 0.32rem;
          .van-tab {
            flex: none;
            height: 0.88rem;
            padding: 0 0.08rem 0 0;

            .van-tab__text {
              display: flex;
              font-size: 0.28rem;
              justify-content: space-around;
              align-items: center;
              width: 1.28rem;
              height: 0.56rem;
              background-color: #f7f7f7;
              color: rgb(102, 102, 102);
            }
          }
          .van-tab--active .van-tab__text {
            background-color: rgb(241, 245, 255);
            color: rgb(65, 105, 226);
          }
        }
        ::v-deep.van-tabs__line {
          background-color: transparent;
        }
      }
    }
  }
}
</style>