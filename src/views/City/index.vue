<template>
  <div>
    <div class="topLogo">
      <div class="back-btn" @click="goBack">返回疫情动态</div>
      <div class="city-switch" @click="switchCity">切换省份</div>
      <div class="cityName-div">
        <span class="cityName">{{ cityName }}</span>
        <span class="">疫情实时动态</span>
      </div>
      <img src="@/assets/images/logo-city.jpg" alt="" />
    </div>
    <div class="wrap">
      <div class="wrap-item">
        <ul class="total">
          <li>
            <div class="bold">
              {{ currCityInfo.nowConfirm | division }}
            </div>
            <strong>现存确诊</strong>
          </li>
          <li>
            <div class="bold">
              {{ currCityInfo.confirm | division }}
            </div>
            <strong>累计确诊</strong>
          </li>
          <li>
            <div class="bold">
              {{ currCityInfo.dead | division }}
            </div>
            <strong>累计死亡</strong>
          </li>
          <li>
            <div class="bold">
              {{ currCityInfo.heal | division }}
            </div>
            <strong>累计治愈</strong>
          </li>
        </ul>
      </div>
      <div class="wrap-item" v-if="!excludeList.includes(cityName)">
        <div class="signTitle">疫情地图</div>
        <div class="chartDiv">
          <van-tabs v-model="active" animated @change="tabChange">
            <van-tab title="现存确诊">
              <div
                id="curConfirm"
                style="width: 7.0rem; height: 6rem; margin: 0 auto"
              ></div>
            </van-tab>
            <van-tab title="风险地区">
              <div
                id="riskArea"
                style="width: 7.0rem; height: 6rem; margin: 0 auto"
              ></div>
            </van-tab>
            <van-tab title="累计确诊">
              <div
                id="confirm"
                style="width: 7.0rem; height: 6rem; margin: 0 auto"
              ></div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
      <div class="wrap-item">
        <div class="signTitle">风险地区</div>
        <ul class="total risk">
          <li>
            <div class="bold">
              {{ currCityInfo.higNum | division }}
            </div>
            <strong>高风险地区</strong>
          </li>
          <li>
            <div class="bold">
              {{ currCityInfo.midNum | division }}
            </div>
            <strong>中风险地区</strong>
          </li>
        </ul>
      </div>
      <div class="wrap-item">
        <div class="signTitle">{{ cityName }}疫情数据</div>
        <div style="padding: 0 0.3rem">
          <GTable :data="tableData" :column="column" :colorList="colorList" />
        </div>
      </div>
      <div class="wrap-item">
        <div class="signTitle">现存确诊</div>
        <div
          id="line-curConfirm"
          style="width: 7.2rem; height: 5rem; margin: 0 auto"
        ></div>
      </div>
      <div class="wrap-item">
        <div class="signTitle">新增（确诊、死亡、治愈）</div>
        <div
          id="line-add"
          style="width: 7.2rem; height: 6rem; margin: 0 auto"
        ></div>
      </div>
      <div class="wrap-item">
        <div class="signTitle">累计（确诊、死亡、治愈）</div>
        <div
          id="line-count"
          style="width: 7.2rem; height: 6rem; margin: 0 auto"
        ></div>
      </div>
    </div>
    <!-- 选择框弹出层 -->
    <van-popup v-model="showPopup" position="bottom" :style="{ width: '100%' }">
      <van-picker
        show-toolbar
        :columns="cityList"
        @cancel="showPopup = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import debounce from '@/utils/debounce.js'
import { replaceList } from "./index.js";
export default {
  name: "City",
  data() {
    return {
      colorList: [
        "#E3E7F3",
        "#fbb046",
        "#F3BAB0",
        "#E69A8D",
        "#B4C0D5",
        "#95DB9A",
      ],
      column: [
        { title: "地区", prop: "name" },
        { title: "新增确诊", prop: "AddConfirm" },
        { title: "现存确诊", prop: "nowConfirm" },
        { title: "累计确诊", prop: "confirm" },
        { title: "死亡", prop: "dead" },
        { title: "治愈", prop: "heal" },
      ],
      tableData: [],
      showPopup: false,
      cityName: "",
      CityDayInfo: [],    //存放当前省份的疫情历史数据
      allCityInfo: new Map(),
      currCityInfo: {},  //存放当前省份的疫情信息
      active: 0,
      cityList: [],      //下拉选择框省份列表
      riskAreaArr: [],   //地图映射的数据--风险地区
      confirmArr: [],    //地图映射的数据--累计确诊
      excludeList: ["台湾", "香港", "澳门"],   
    };
  },
  //定义过滤器
  filters: {
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
    this.getData();
    this.getCity();
  },
  activated() {
    this.cityName = this.$route.query.city;
  },
  watch: {
    cityName() {
      if (this.allCityInfo.size > 0) {
        this.active = 0;
        this.initMap();
      }
      debounce(this.getCityDayInfo,500)();
      
    },
  },
  methods: {
    switchCity() {
      this.showPopup = true;
    },
    goBack() {
      this.$router.go(-1);
    },
    tabChange(activeIdx) {
      if (activeIdx === 1) {
        this.$nextTick(() => {
          this.$myChart.cityMap("riskArea", this.riskAreaArr, this.cityName);
        });
      }
      if (activeIdx === 2) {
        this.$nextTick(() => {
          this.$myChart.cityMap("confirm", this.confirmArr, this.cityName);
        });
      }
    },
    initMap() {
      let arr = JSON.parse(JSON.stringify(this.allCityInfo.get(this.cityName)));
      this.tableData = arr.children;
      this.confirmArr = [];
      this.riskAreaArr = [];
      let curConfirmArr = [];
      this.tableData&&this.tableData.forEach((item) => {
        let obj1 = {},
          obj2 = {},
          obj3 = {};
        //名称简单处理-- 和地图数据对应起来
        //处理当前的item.city的名称的最后一个标识：盟 州 区 旗  否则补字段+'市'
        /** */
        
        if (["北京", "上海"].includes(arr.name)) {
          obj1.name = item.name + "区";
          obj2.name = item.name + "区";
          obj3.name = item.name + "区";
        } else if (replaceList.has(item.name)) {
          obj1.name = replaceList.get(item.name);
          obj2.name = replaceList.get(item.name);
          obj3.name = replaceList.get(item.name);
        } else if (
          item.name.endsWith("市") ||
          item.name.endsWith("县") ||
          item.name.endsWith("区") ||
          item.name.endsWith("自治州") ||
          item.name.endsWith("盟") ||
          item.name.endsWith("旗")
        ) {
          obj1.name = item.name;
          obj2.name = item.name;
          obj3.name = item.name;
        } else {
          obj1.name = item.name + "市";
          obj2.name = item.name + "市";
          obj3.name = item.name + "市";
        }
        obj1.value = item.confirm;
        obj2.value = item.higAndMid;
        obj3.value = item.nowConfirm;
        this.confirmArr.push(obj1);
        this.riskAreaArr.push(obj2);
        curConfirmArr.push(obj3);
      });

      delete arr.children;
      this.currCityInfo = arr;
      if (this.excludeList.includes(this.cityName)) return;
      this.$nextTick(() => {
        this.$myChart.cityMap("curConfirm", curConfirmArr, this.cityName);
      });
    },
    getData() {
      let higMap = new Map(JSON.parse(localStorage.getItem("higMap")));
      let midMap = new Map(JSON.parse(localStorage.getItem("midMap")));
      const forMat = (obj) => {
        obj.total.AddConfirm = obj.today.confirm;
        obj = { ...obj, ...obj.total };
        obj.higNum = higMap.get(obj.name) || 0;
        obj.midNum = midMap.get(obj.name) || 0;
        obj.higAndMid = obj.higNum + obj.midNum;
        if (obj.children) {
          obj.children = obj.children.map((item) => forMat(item));
        }
        delete obj.total;
        delete obj.today;
        return obj;
      };
      this.$api.getChinaData().then((res) => {
        const result = res.data.data.diseaseh5Shelf.areaTree[0].children;
        result.forEach((item) => {
          const obj = forMat(item);
          this.allCityInfo.set(item.name, obj);
        });
        this.initMap();
      });
    },
    getCity() {
      this.$api.getRiskCity().then((res) => {
        const result = res.data;
        if (!result) return this.$toast.fail("提示文案");
        result.data.forEach((item) => {
          let obj = {};
          obj.text = item.provinceShortName;
          obj.value = item.provinceShortName;
          this.cityList.push(obj);
        });
      });
    },
    getCityDayInfo() {
      this.$api.getCityDayInfo(this.cityName).then((res) => {
        const result = res.data.data;
        if (!result) return this.$toast.fail("提示文案");
        this.CityDayInfo = result.slice(-730);
        let colorList = ['#F86149',  '#657797','#37BCA9']
        let xAxisData=this.CityDayInfo.map(item=>item.date.split('.').join('-'))
        //现存确诊
        let CurConfirmArr=this.CityDayInfo.map(item=>item.confirm-item.dead-item.heal)
        this.$myChart.line(
          {id:'line-curConfirm',
          colorList:['#F86149'],
          legend:['现存确诊'],
          dataList:[CurConfirmArr],
          xAxisData: xAxisData,
          showTooltip:true,
           })
   
        //新增（确诊、死亡、治愈）
        let AddConfirmArr=this.CityDayInfo.map(item=>item.newConfirm)
        let AddDeadArr=this.CityDayInfo.map(item=>item.newDead)
        let AddHealArr=this.CityDayInfo.map(item=>item.newHeal)
        this.$myChart.line(
          {id:'line-add',
          colorList,
          legend:['新增确诊','新增死亡','新增治愈'],
          dataList:[AddConfirmArr,AddDeadArr,AddHealArr],
          xAxisData: xAxisData,
          showTooltip:true
           })
        //累计（确诊、死亡、治愈）
        let confirmArr=this.CityDayInfo.map(item=>item.confirm)
        let deadArr=this.CityDayInfo.map(item=>item.dead)
        let healArr=this.CityDayInfo.map(item=>item.heal)
        this.$myChart.line(
          {id:'line-count',
          legend:['累计确诊','累计死亡','累计治愈'],
          colorList,
          dataList:[confirmArr,deadArr,healArr],
          xAxisData: xAxisData,
          showTooltip:true
           })
      });
    },
    onConfirm(select) {
      this.cityName = select.value;
      this.showPopup = false;
    },
  },
};
</script>
<style lang="less" scoped>
.topLogo {
  position: relative;
  .cityName-div {
    font-size: 0.46rem;
    font-weight: 700;
    position: absolute;
    top: 60%;
    left: 5%;
    display: flex;
    align-items: center;
    color: #fff;
    .cityName {
      padding: 0 0.06rem;
      margin-right: 0.08rem;
      background-color: #fff;
      color: #3443fe;
      font-size: 0.44rem;
      border-radius: 0.06rem;
    }
  }

  .city-switch {
    position: absolute;
    top: 0.24rem;
    right: 2.12rem;
    height: 0.48rem;
    padding: 0 0.24rem;
    color: #fff;
    font-size: 0.22rem;
    line-height: 0.48rem;
    background-color: rgba(19, 15, 133, 0.5);
    border-radius: 0.24rem;
  }
  > img {
    width: 100%;
  }
}
.wrap {
  .wrap-item {
    background-color: #fff;
    padding-top: 0.3rem;
    margin-bottom: 0.16rem;
    .signTitle {
      margin: 0 0.32rem 0.2rem;
    }
    .chartDiv {
      background-color: #f7f7f7;
      .van-tabs {
        ::v-deep .van-tabs__nav--line {
          padding-left: 0.32rem;
          .van-tab {
            flex: none;
            padding: 0 0.08rem 0 0;
            .van-tab__text {
              display: flex;
              justify-content: space-around;
              align-items: center;
              font-size: 0.28rem;
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
.total.risk {
  li {
    width: 50%;
  }
  li:nth-child(2) {
    color: #fbb046;
  }
}
.total {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 25%;
    text-align: center;
    margin-bottom: 0.24rem;
    position: relative;
    font-size: 0.24rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    height: 0.8rem;
    border-right: 1px solid #eee;
  }
  li:last-of-type::after {
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
    color: rgb(189, 19, 98);
  }
  li:nth-child(3) {
    color: #677092;
  }
  li:nth-child(4) {
    color: #28b7a3;
  }
}
</style>