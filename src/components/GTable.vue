<template>
  <div>
    <div
      :class="{ listNav: true, hide: !isFixed }"
      cellpadding="0"
      cellspacing="0"
    >
      <table>
        <thead>
          <tr ref="fixed-tr">
            <th
              v-for="(item, idx) in column"
              :key="idx"
              :style="{ backgroundColor: colorList[idx] }"
            >
              {{ item.title }}
            </th>
            <th v-if="showDetail" style="width: 0.8rem">疫情</th>
          </tr>
        </thead>
      </table>
    </div>
    <div
      class="listWraper"
      :style="{ maxHeight: OverHeight && showMore ? height + 'px' : '' }"
    >
      <table cellpadding="0" cellspacing="0" ref="table">
        <thead>
          <tr ref="table-tr">
            <th
              v-for="(item, idx) in column"
              :key="idx"
              :style="{ backgroundColor: colorList[idx] }"
            >
              {{ item.title }}
            </th>
            <th v-if="showDetail">疫情</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="type === 'tree'">
            <template v-for="(item, index) in data">
              <tr class="parentContainer" :key="item.title">
                <td
                  @click="preClick(index)"
                  v-for="(ele, idx) in column"
                  :class="
                    idx === 0 &&
                    (!item.children || !item.children.length) &&
                    'pdLeft'
                  "
                >
                  <svg-icon
                    v-if="
                      item.children && item.children.length > 0 && idx === 0
                    "
                    icon-class="triangle-right"
                    class="svgIcon"
                    :style="{
                      transform: isOpenList[index]
                        ? ' rotateZ(90deg)'
                        : ' rotateZ(0deg)',
                    }"
                  />
                  <span>{{ item[ele.prop] }}</span>
                </td>
                <td v-if="showDetail" class="detail" @click="detail(item)">
                  详情<svg-icon icon-class="chevron-right" />
                </td>
              </tr>
              <template v-if="item.children">
                <tr
                  class="normalContainer"
                  :class="{ hide: !isOpenList[index] }"
                  v-for="it in item.children"
                  :key="it.title"
                >
                  <td v-for="(ele, idx) in column" :key="idx">
                    {{ it[ele.prop] }}
                  </td>
                  <td v-if="showDetail"></td>
                </tr>
              </template>
            </template>
          </template>
          <template v-else>
            <tr
              v-for="(item, index) in data"
              :key="index"
              class="normalContainer"
            >
              <td v-for="(ele, idx) in column" :key="idx">
                {{ item[ele.prop] }}
              </td>
              <td v-if="showDetail" class="detail" @click="detail(item)">
                详情<svg-icon icon-class="chevron-right" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="limitHeight && OverHeight" class="showMore" @click="clickMore">
      {{ showMore ? "展开更多" : "收起" }}
      <svg-icon v-if="showMore" icon-class="chevron-down" />
      <svg-icon v-if="!showMore" icon-class="chevron-up" />
    </div>
  </div>
</template>
<script>
import remFontSize from "@/utils/remFontSize.js";
// import { v4 } from "uuid"; // npm install -S uuid
import throttle from "@/utils/throttle.js";
import debounce from "@/utils/debounce.js";
export default {
  name: "GTable",
  props: {
    type: String,
    column: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    showDetail: {
      type: Boolean,
      default: () => false,
    },
    colorList: {
      type: Array,
      default: () => [],
    },
    limitHeight: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      isFixed: false, //是否吸顶
      tableData: [],
      isOpenList: [], //树形表格是否召开子节点
      throttle: throttle(this.handleScroll, 200), //包裹节流函数
      debounce:debounce(this.initWidth,800),
      OverHeight: false, //如果表格限制高度，是否超过高度
      showMore: true, //如果表格限制高度，是否显示【查看更多】文字,
      height: "", //如果表格限制高度，height是处理过的要限制高度，防止表格高度限制后最后一行数据显示不全,
      HeightList: [],
    };
  },
  watch: {},
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttle);
      window.addEventListener("resize",this.debounce);
      this.$once("initWidth", this.initWidth);
      this.$once("judeHeight", this.judeHeight);
    });
  },
  activated() {
    // handleScroll为页面滚动的监听回调
    window.addEventListener("scroll", this.throttle);
    window.addEventListener("resize",this.debounce);
  },
  methods: {
    init() {
      if (this.type === "tree") {
        this.isOpenList = new Array(this.data.length).fill(false);
        // console.log(this.isOpenList);
      }
    },
    judeHeight() {
      const height = this.$refs.table.offsetHeight;
      this.HeightList.push(height);
      this.height = height;
      // console.log(height,this.clientHeight)
      if (this.limitHeight && height > this.limitHeight) {
        const thHeight = remFontSize(0.32); //表头高度
        const trHeight = remFontSize(0.24); //表格单元高度
        const diff = ((this.limitHeight - thHeight) / trHeight).toFixed();
        this.height = thHeight + diff * trHeight;
        this.OverHeight = true;
        this.HeightList.push(this.height);
      }
    },
    clickMore() {
      this.showMore = !this.showMore;
      this.height = this.showMore ? this.HeightList[1] : this.HeightList[0];
    },
    //初始化吸顶表列头每个th的宽度
    initWidth() {
      // listNav>table>thead>tr>th
      const thList = this.$refs["table-tr"].children;
      const thCVList = this.$refs["fixed-tr"].children;
      for (let i = 0; i < thCVList.length; i++) {
        // console.log(getComputedStyle(thList[i]).getPropertyValue('width'))
        thCVList[i].style.width = window.getComputedStyle(thList[i]).width;
      }
    },
    preClick(index) {
      // console.log(111)
      // this.data[index].isOpen=!this.data[index].isOpen
      const flag = !this.isOpenList[index];
      this.$set(this.isOpenList, index, flag);
    },

    handleScroll() {
      // 得到页面滚动的距离
      let offsetTop = this.$refs.table.offsetTop;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (this.$refs.table.clientHeight > 32) {
        this.$emit("initWidth");
        this.$emit("judeHeight");
      }
      // 判断页面滚动的距离是否大于吸顶元素的位置
      this.isFixed =
        scrollTop > offsetTop && scrollTop < offsetTop + this.height - 40
          ? true
          : false;
    },
    //点击详情
    detail(item) {
      this.$emit("detailClick", item);
    },
  },
  deactivated() {
    //  同时在deactivated回调中移除监听：
    window.removeEventListener("scroll", this.throttle);
    window.removeEventListener("resize",this.debounce);
    this.isFixed = false;
  },
  destroyed() {
    window.removeEventListener("scroll", this.throttle);
    window.removeEventListener("resize",this.debounce);
    this.isFixed = false;
  },
};
</script>
<style lang="less" scoped>
.listNav,
table,
thead,
tbody,
tr {
  width: 100%;
}
.listWraper {
  overflow: hidden;
}
.listNav {
  display: table-row;
  z-index: 99;
  position: fixed;
  max-width: 750px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.hide {
  display: none;
}
table {
  text-align: center;
  border-collapse: collapse;
  font-size: 0.24rem;
}
thead > tr {
  height: 0.64rem;
  color: #333;
  font-weight: 600;
  background: #e3e7f3;
  th {
    box-sizing: border-box;
    border-right: 0.02rem solid #fff;
  }
}
tbody > tr {
  color: #333;
  height: 0.48rem;
  border-bottom: 0.01rem solid #ebebeb;
  td:first-of-type {
    text-align: left;
  }
}

tbody > .parentContainer {
  height: 0.64rem;
  color: #333;
  font-weight: 600;
  background-color: #f7f7f7;
  td {
    border-right: 0.02rem solid #fff;
  }
}

tbody > .normalContainer {
  td:first-of-type {
    text-align: left;
    padding-left: 0.32rem;
  }
}
tr > th:first-of-type,
tr > td:first-of-type {
  width: 1.6rem;
  box-sizing: border-box;
}
.pdLeft {
  padding-left: 0.32rem;
}
.svgIcon {
  color: #4169e2;
  width: 0.24rem !important;
  height: 0.24rem !important;
  padding-right: 0.04rem;
  padding-left: 0.04rem;
}
.detail {
  width: 0.8rem;
  color: #4169e2;
  font-size: 0.2rem;
  .svg-icon {
    width: 0.12rem;
  }
}
.showMore {
  color: #4169e2;
  font-size: 0.2rem;
  text-align: center;
  margin: 0.1rem 0;
  .svg-icon {
    width: 0.2rem;
  }
}
</style>