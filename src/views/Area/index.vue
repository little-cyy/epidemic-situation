<template>
  <div class="area">
    <div class="top-logn">
      <img src="@/assets/images/area.png" />
    </div>
    <div class="back-btn" @click="goBack">返回疫情动态</div>
    <div class="wrap">
      <div class="wrap-item">
        <!-- 地区选择框 -->
        <div class="signTitle">请选择地区</div>
        <div class="selectBox" @click="showPopup = !showPopup">
          {{(city.cityName && city.provinceShortName + " " + city.cityName) || "请选择" }}
          <svg-icon icon-class="xiala" class="xiala" />
        </div>
        <!-- 选择地区的风险查询结果展示 -->
        <div
          v-if="
            city.cityName &&
            selectInfo.hig.length === 0 &&
            selectInfo.mid.length === 0
          "
          style="text-align: center; padding-top: 0.4rem"
        >
          <img src="@/assets/images/noRisk.png" style="width: 1.3rem" />
          <div>全部低风险</div>
        </div>
        <div v-if="selectInfo.hig.length > 0" class="box-high">
          <div class="title">
            <div class="pTitle pTitle_high">
              <svg-icon icon-class="risk" />高风险地区{{
                selectInfo.hig.length
              }}个
            </div>
            <div class="modifyTime">截至北京时间{{ modifyTime }}</div>
          </div>
          <div clsss="block-item" id="block-item">
            <div class="line" v-for="(item,idx) in selectInfo.hig" :key="idx">
              <div class="city">{{ item.cityName }}</div>
              <div>{{ item.areaName }}</div>
            </div>
          </div>
        </div>
        <div v-if="selectInfo.mid.length > 0" class="box-mid">
          <div class="title">
            <div class="pTitle pTitle_high">
              <svg-icon icon-class="risk" />中风险地区{{
                selectInfo.mid.length
              }}个
            </div>
            <div class="modifyTime">截至北京时间{{ modifyTime }}</div>
          </div>
          <div clsss="block-item" id="block-item">
            <div class="line" v-for="(item,idx) in selectInfo.mid" :key="idx">
              <div class="city">{{ item.cityName }}</div>
              <div>{{ item.areaName }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 全球风险地区汇总 -->
      <div class="wrap-item">
        <div class="signTitle">全球风险地区汇总</div>
        <!-- 高风险地区 -->
        <div class="summary">
          <div v-if="higNum > 0" class="box-high">
            <div class="title">
              <div class="pTitle pTitle_high">
                <svg-icon icon-class="risk" />高风险地区{{ higNum }}个
              </div>
              <div class="modifyTime">截至北京时间{{ modifyTime }}</div>
            </div>
            <div class="list">
              <div class="list-item" v-for="(item,index) in riskarea[0].dangerPros" :key="index"> 
                <div class="Province">
                  <div>{{ item.provinceShortName }}</div>
                </div>
                <div clsss="block-item" id="block-item">
                  <div class="line" v-for="(ele,idx) in item.dangerAreas"  :key="idx">
                    <div class="city">{{ ele.cityName }}</div>
                    <div>{{ ele.areaName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 中风险地区 -->
          <div v-if="midNum > 0" class="box-mid">
            <div class="title">
              <div class="pTitle pTitle_mid">
                <svg-icon icon-class="risk" />中风险地区{{ midNum }}个
              </div>
              <div class="modifyTime">截至北京时间{{ modifyTime }}</div>
            </div>
            <div class="list">
              <div class="list-item" v-for="(item,index) in riskarea[1].dangerPros" :key="index">
                <div class="Province">
                  <div>{{ item.provinceShortName }}</div>
                </div>
                <div clsss="block-item" id="block-item">
                  <div class="line" v-for="(ele,idx) in item.dangerAreas" :key="idx">
                    <div class="city">{{ ele.cityName }}</div>
                    <div>{{ ele.areaName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
export default {
  data() {
    return {
      modifyTime: "",
      riskarea: [],
      cityList: [],
      showPopup: false,
      city: { cityName: "", provinceShortName: "" },
      selectInfo: { hig: [], mid: [] },
    };
  },
  computed: {
    higNum() {
      return this.riskarea.length > 0 && this.riskarea[0].dangerCount;
    },
    midNum() {
      return this.riskarea.length > 0 && this.riskarea[1].dangerCount;
    },
  },
  created() {
    this.getCity();
    this.initData();
    this.modifyTime = this.$route.params.modifyTime.split(' ')[0];
  },
  methods: {
    getCity() {
      this.$api.getRiskCity().then((res) => {
        const result = res.data;
        if (!result) return this.$toast.fail("提示文案");
        result.data.forEach((item) => {
          let obj = {};
          obj.text = item.provinceShortName;
          obj.value = item.provinceShortName;
          obj.children = [];
          item.cities.forEach((ele) => {
            let oneObj = {};
            oneObj.text = ele.cityName;
            oneObj.value = ele.cityName;
            obj.children.push(oneObj);
          });
          this.cityList.push(obj);
        });
      });
    },
    initData() {
      this.$api.getRisk().then((res) => {
        const result = res.data;
        if (!result) return this.$toast.fail("提示文案");
        this.riskarea = result.data;
      });
    },
    onConfirm(select) {
      this.city.provinceShortName = select[0];
      this.city.cityName = select[1];
      this.selectInfo = { hig: [], mid: [] };
      //高风险地区查找
      this.riskarea[0].dangerPros.forEach((item) => {
        if (item.provinceShortName === this.city.provinceShortName) {
          if (this.city.cityName === "全部地区") {
            this.selectInfo.hig = item.dangerAreas;
          } else {
            this.selectInfo.hig = item.dangerAreas.filter(
              (item) => item.cityName === this.city.cityName
            );
          }
        }
      });
      //中风险地区查找
      this.riskarea[1].dangerPros.forEach((item) => {
        if (item.provinceShortName === this.city.provinceShortName) {
          if (this.city.cityName === "全部地区") {
            this.selectInfo.mid = item.dangerAreas;
          } else {
            this.selectInfo.mid = item.dangerAreas.filter(
              (item) => item.cityName === this.city.cityName
            );
          }
        }
      });
      this.showPopup = false;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.top-logn {
  position: relative;
  width: 100%;
  margin-bottom: -44%;
  padding-top: 74.7%;
  img {
    position: absolute;
    top: 0;
    width: 100%;
  }
}

.selectBox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.96rem;
  background-color: #f7f7f7;
  border-radius: 0.12rem;
  font-size: 0.32rem;
  .xiala {
    color: #cdcdcd;
  }
}
.wrap {
  position: relative;
  margin: 0 0.32rem;
  .wrap-item {
    border-radius: 0.2rem;
    padding: 0.4rem 0.24rem;
    margin-bottom: 0.2rem;
    background-color: #ffffff;

    .box-high {
      .svg-icon {
        color: #f86a6a;
      }
      .Province {
        background-color: #ffeeed;
      }
    }
    .box-mid {
      .svg-icon {
        color: #fbb046;
      }
      .Province {
        background-color: #fff6e5;
      }
    }
    .title {
      display: flex;
      margin: 0.4rem 0;
      .pTitle {
        flex-grow: 1;
        font-size: 0.3rem;
        color: #333;
        .svg-icon {
          font-size: 0.36rem;
          padding-right: 0.15rem;
          vertical-align: text-top;
        }
      }
      .modifyTime {
        flex-grow: 0;
        font-size: 0.24rem;
        display: contents;
        color: #999;
      }
    }
    div#block-item {
      padding: 0.3rem 0.24rem;
      width: calc(100%-0.95rem) !important;
      background-color: #f7f7f7;
      border-radius: 0.14rem;
      flex-grow: 1;
      font-size: 0.26rem;
      overflow: hidden;
      .line {
        display: flex;
        margin-bottom: 0.3rem;
        .city {
          flex-grow: 0;
          flex-shrink: 0;
          width: 1.4rem;
        }
      }
      .line:last-of-type {
        margin-bottom: 0;
      }
    }
    .list .list-item {
      display: flex;
      margin-bottom: 0.3rem;
      .Province {
        padding: 0.3rem 0;
        font-size: 0.3rem;
        width: 0.75rem;
        margin-right: 0.2rem;
        flex: none;
        writing-mode: vertical-lr;
        -webkit-writing-mode: vertical-lr;
        border-radius: 0.14rem;

        div {
          text-align: center;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>