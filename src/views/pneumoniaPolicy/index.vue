<template>
  <div class="pneumoniaPolicy">
    <div class="top-logn">
      <img src="@/assets/images/pneumoniaPolicy.png" />
    </div>
    <div class="back-btn" @click="goBack">返回疫情动态</div>
    <div class="wrap">
      <!-- 出发地和目的地选择框 -->
      <div class="wrap-item">
        <div class="title">
          <svg-icon icon-class="travel" class="blue-icon" />
          <span>出行防疫政策查询</span>
        </div>
        <div class="content">
          <div
            class="departurePlace"
            :class="departurePlace && 'highlight'"
            @click="openPopup(0)"
            :style="{ order: isSwitch ? 3 : 1 }"
          >
            {{ departurePlace || "出发地" }}
            <svg-icon icon-class="xiala" class="xiala" />
          </div>
          <div style="flex: 0; order: 2">
            <svg-icon
              icon-class="switch"
              class="switch-icon"
              @click="handlerSwitch"
            />
          </div>
          <div
            class="destination"
            :class="destination && 'highlight'"
            @click="openPopup(1)"
            :style="{ order: isSwitch ? 1 : 3 }"
          >
            {{ destination || "目的地" }}
            <svg-icon icon-class="xiala" class="xiala" />
          </div>
        </div>
      </div>
      <!-- 未选择出发地和目的地 -->
      <template v-if="!this.from && !this.to">
        <div class="wrap-item">
          <img src="@/assets/images/tip.jpg" width="100%" />
          <div class="tipTitle">请先选择出发地和目的地</div>
        </div>
      </template>
      <!-- 选择了出发地和目的地，且不一样 -->
      <template v-else-if="this.from && this.to && this.from !== this.to">
        <div :class="['flex-wrap', isSwitch && 'isSwitch']">
          <div class="wrap-item">
            <div class="policyContent">
              <div class="block">
                <div class="left">
                  <img src="@/assets/images/yuandian.png" />
                  <div class="line"></div>
                  <img src="@/assets/images/yuandian.png" />
                </div>
                <div class="right">
                  <div class="cityName">出{{ this.departurePlace }}</div>
                  <div class="policyBlock">
                    <div
                      class="policyBlock-item"
                      :class="showList[0].showMore && 'limitHeight'"
                      v-html="fromInfo.outDesc"
                    ></div>
                    <span
                      v-if="showList[0].show"
                      @click="showList[0].showMore = !showList[0].showMore"
                      >{{ showList[0].showMore ? "展开全部" : "收起" }}</span
                    >
                  </div>

                  <div class="cityName">进{{ this.destination }}</div>
                </div>
              </div>
              <div>
                <div class="policyBlock" style="margin-left: 0.86rem">
                  <div
                    class="policyBlock-item"
                    :class="showList[1].showMore && 'limitHeight'"
                    v-html="toInfo.lowInDesc"
                  ></div>
                  <span
                    v-if="showList[1].show"
                    @click="showList[1].showMore = !showList[1].showMore"
                    >{{ showList[1].showMore ? "展开全部" : "收起" }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="wrap-item">
            <div class="policyContent">
              <div class="block">
                <div class="left">
                  <img src="@/assets/images/yuandian.png" />
                  <div class="line"></div>
                  <img src="@/assets/images/yuandian.png" />
                </div>
                <div class="right">
                  <div class="cityName">出{{ this.destination }}</div>
                  <div class="policyBlock">
                    <div
                      class="policyBlock-item"
                      :class="showList[2].showMore && 'limitHeight'"
                      v-html="toInfo.outDesc"
                    ></div>
                    <span
                      v-if="showList[2].show"
                      @click="showList[2].showMore = !showList[2].showMore"
                      >{{ showList[2].showMore ? "展开全部" : "收起" }}</span
                    >
                  </div>
                  <div class="cityName">进{{ this.departurePlace }}</div>
                </div>
              </div>
              <div class="policyContent">
                <div class="policyBlock" style="margin-left: 0.86rem">
                  <div
                    class="policyBlock-item"
                    :class="showList[3].showMore && 'limitHeight'"
                    v-html="fromInfo.lowInDesc"
                  ></div>
                  <span
                    v-if="showList[3].show"
                    @click="showList[3].showMore = !showList[3].showMore"
                    >{{ showList[3].showMore ? "展开全部" : "收起" }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 只选择一个地方或者选择了同一个地方 -->
      <template v-else>
        <div class="wrap-item">
          <div class="policyContent">
            <div class="block">
              <div class="left">
                <img src="@/assets/images/yuandian.png" />
                <div class="line"></div>
              </div>
              <div class="right">
                <div class="cityName">
                  {{ this.destination || this.departurePlace }}
                </div>
                <div class="policyBlock">
                  <div style="font-size: 0.32rem">外出政策</div>
                  <!-- {{ this.toInfo.outDesc }} -->
                  <div
                    class="policyBlock-item"
                    :class="showList[0].showMore && 'limitHeight'"
                    v-html="fromInfo.outDesc||toInfo.outDesc"
                  ></div>
                  <span
                    v-if="showList[0].show"
                    @click="showList[0].showMore = !showList[0].showMore"
                    >{{ showList[0].showMore ? "展开全部" : "收起" }}</span
                  >
                </div>
                <div class="policyBlock">
                  <div style="font-size: 0.32rem">进入政策</div>
                  <!-- {{ this.toInfo.lowInDesc }} -->
                  <div
                    class="policyBlock-item"
                    :class="showList[1].showMore && 'limitHeight'"
                    v-html="fromInfo.lowInDesc||toInfo.lowInDesc"
                  ></div>
                  <span
                    v-if="showList[1].show"
                    @click="showList[1].showMore = !showList[1].showMore"
                    >{{ showList[1].showMore ? "展开全部" : "收起" }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 出行防护小贴士 -->
      <div class="wrap-item">
        <div class="title">
          <svg-icon icon-class="travel" class="blue-icon" />
          <span>出行防护贴士</span>
        </div>
        <van-tabs v-model="active" animated>
          <van-tab
            v-for="(item, key, index) in contentList"
            :title="tabList[index]"
            :key="key"
          >
            <div class="contentList">
              <div class="content-item" v-for="(it, idx) in item" :key="idx">
                <div class="title">{{ it.title }}</div>
                {{ it.content }}
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <van-popup
      v-model="popupConfig.show"
      position="bottom"
      :style="{ width: '100%' }"
    >
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="popupConfig.show = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import { contentList } from "./index.js";
import remFontSize from "@/utils/remFontSize.js";
export default {
  data() {
    return {
      contentList,         //存储防护贴士信息
      active: 0,
      departurePlace: "",  //出发地城市名
      from: "",            //出发地城市ID
      destination: "",     //目的地城市名
      to: "",              //目的地城市ID
      fromInfo: [],        //出发地出行政策信息
      toInfo: {},          //目的地出行政策信息    
      popupConfig: {
        show: false,
        type: 0 /**0出发点  1目的地 */,
      },
      columns: [],
      tabList: ["火车", "飞机", "客运汽车", "自驾"],
      showList: [
        { show: false, showMore: false },
        { show: false, showMore: false },
        { show: false, showMore: false },
        { show: false, showMore: false },
      ],
      lineHeight: 0,
      InfoList: [],   //存储所有城市政策信息
      isSwitch: false,
    };
  },
  created() {
    this.getCityList();
    this.lineHeight = remFontSize(0.2);
  },
  methods: {
    getCityList() {
      this.$api.getTravel().then((res) => {
        let result = res.data.data;
        result.forEach((item) => {
          let obj = {};
          obj.text = item.provinceShortName;
          obj.value = item.locationId;
          obj.children = [];
          item.cities.forEach((it) => {
            let oneObj = {};
            oneObj.text = it.cityName;
            oneObj.value = it.locationId;
            obj.children.push(oneObj);
            //存储政策信息
            const info = {
              locationId: it.locationId,
              lowInDesc: it.lowInDesc,
              outDesc: it.outDesc,
            };
            this.InfoList.push(info);
          });
          // obj.children = JSON.parse(
          //   JSON.stringify(item.cities)
          //     .replace(/locationId/g, "value")
          //     .replace(/cityName/g, "text")
          // );
          //存储城市列表id与名称
          this.columns.push(obj);
        });
      });
    },

    openPopup(type) {
      this.popupConfig.type = type;
      this.popupConfig.show = true;
    },
    handlerSwitch() {
      this.isSwitch = !this.isSwitch;
    },
    goBack() {
      this.$router.go(-1);
    },
    onConfirm(value, index) {
      if (!this.columns) {
        this.popupConfig.show = false;
      }
      const res = this.columns[Number(index[0])].children[Number(index[1])];
      if (this.popupConfig.type === 0 && res.text !== this.departurePlace) {
        this.departurePlace = res.text;
        this.from = res.value;
        this.fromInfo = this.InfoList.find((item) => {
          if (item.locationId === this.from) return item;
        });
      } else if (this.popupConfig.type === 1 && res.text !== this.destination) {
        this.destination = res.text;
        this.to = res.value;
        this.toInfo = this.InfoList.find((item) => {
          if (item.locationId === this.to) return item;
        });
      }
      this.judgeRowNum();
      this.popupConfig.show = false;
    },
    // 判断行数
    judgeRowNum() {
      (this.showList = [
        { show: false, showMore: false },
        { show: false, showMore: false },
        { show: false, showMore: false },
        { show: false, showMore: false },
      ]),
        this.$nextTick(() => {
          const docList = [
            ...document.getElementsByClassName("policyBlock-item"),
          ];
          docList.forEach((item, idx) => {
            // console.log('四舍五入',(item.clientHeight / this.lineHeight).toFixed())
            if ((item.clientHeight / this.lineHeight).toFixed()> 6) {
              this.showList[idx].show = true;
              this.showList[idx].showMore = true;
            } else {
              this.showList[idx].show = false;
            }
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.top-logn {
  position: relative;
  width: 100%;
  padding-top: 30%;
  // margin-bottom: -44%;
  // padding-top: 74.7%;
  img {
    position: absolute;
    top: 0;
    width: 100%;
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
    position: relative;
    .tipTitle {
      position: absolute;
      font-size: 0.32rem;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);

      white-space: nowrap;
    }
    .title {
      margin-bottom: 0.24rem;
      .blue-icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.08rem;
        color: #336aea;
      }
      > span {
        font-size: 0.32rem;
        font-weight: 700;
        line-height: 0.4rem;
        vertical-align: text-bottom;
      }
    }
    .content {
      display: flex;
      align-items: center;
      height: 0.96rem;
      background-color: #f7f7f7;
      border-radius: 0.12rem;
      .departurePlace,
      .destination {
        flex: 1;
        text-align: center;
        font-size: 0.32rem;
        color: rgb(153, 153, 153);
        .xiala {
          color: #cdcdcd;
        }
      }
      .highlight {
        color: rgb(51, 51, 51);
      }
      .switch-icon {
        width: 0.5rem;
        height: 0.5rem;
        color: #909090;
      }
    }
  }
}
.policyContent {
  .block {
    display: flex;
  }
  .left {
    flex-grow: 0;
    margin: 0.3rem 0.4rem 0.3rem 0.16rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 0.3rem;
    }
    .line {
      flex-grow: 1;
      width: 0.04rem;
      // height: 100%;
      background-color: hsla(0, 0%, 92.2%, 0.4);
    }
  }
  .right {
    flex-grow: 1;
    .cityName {
      padding: 0 0.1rem 0 0.24rem;
      background-color: #40cca7;
      border-radius: 0.12rem;
      height: 0.8rem;
      display: flex;
      align-items: center;
      color: #fff;
      font-weight: 700;
      font-size: 0.36rem;
    }
  }
  .policyBlock {
    margin-top: 0.2rem;
    margin-bottom: 0.3rem;
    padding: 0.24rem;
    background-color: #f7f7f7;
    border-radius: 0.12rem;
    color: #4d4d4d;
  }
}
.contentList {
  background-color: #f7f7f7;
  margin-top: 0.32rem;
  padding: 0.24rem;
  border-radius: 0.12rem;
  .content-item {
    margin-bottom: 0.2rem;
    .title {
      font-size: 0.3rem;
      font-weight: bold;
      margin-bottom: 0.2rem;
      color: #4d4d4d;
    }
  }
}
.van-tabs {
  ::v-deep .van-tabs__nav--line {
    .van-tab {
      flex-grow: 1;
      padding: 0 0.08rem 0 0;
      .van-tab__text {
        width: 100%;
        display: flex;
        font-size: 0.28rem;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        border-radius: 0.1rem;
        background-color: #f7f7f7;
        color: rgb(102, 102, 102);
      }
    }
    .van-tab--active .van-tab__text {
      color: #fff;
      font-weight: 700;
      background-color: #4169e2;
    }
  }
  ::v-deep.van-tabs__line {
    background-color: transparent;
  }
}
.policyBlock-item {
  line-height: 0.4rem;
}
.policyBlock-item.limitHeight {
  height: 2.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
.policyBlock > span {
  margin-top: 0.12rem;
  color: grey;
  font-size: 0.24rem;
}

.flex-wrap {
  display: flex;
  flex-direction: column;
}
.isSwitch {
  .wrap-item:first-of-type {
    order: 2;
  }
  .wrap-item:last-of-type {
    order: 1;
  }
}
</style>