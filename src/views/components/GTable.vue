<template>
  <div>
    <div
      :id="elId + 'cv'"
      :class="{ listNav: true, hide: !isFixed }"
      cellpadding="0"
      cellspacing="0"
    >
      <table>
        <thead>
          <tr>
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
    <div class="listWraper" :id="elId">
      <table cellpadding="0" cellspacing="0">
        <thead>
          <tr>
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
                      transform: isOpen && ' rotateZ(90deg)',
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
                  class="normalContainer "
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
            <tr v-for="(item, index) in data" :key="index" class="normalContainer">
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
  </div>
</template>
<script>
import { v4 } from "uuid"; // npm install -S uuid
import throttle from '@/utils/throttle.js'
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
  },
  data() {
    return {
      isOpen: false,
      isFixed: false,
      elId: "",
      tableData: [],
      isOpenList: [],
      throttle:throttle(this.handleScroll,200)
    };
  },
  created() {
    this.init();
  },
  mounted() {
   this.$nextTick(()=>{
      window.addEventListener("scroll", this.throttle);
   })
    this.$once('width',()=>{
      console.log(1)
      this.initWidth()
    })
  },
  activated() {
    // handleScroll为页面滚动的监听回调
    window.addEventListener("scroll", this.throttle);
  },
  methods: {

    initWidth() {
      const doc= document.querySelector("#" + this.elId)
      if(doc){
        const thList =doc.children[0]
          .children[0].children[0].children;
        const thCVList = document.querySelector("#" + this.elId + "cv")
          .children[0].children[0].children[0].children;
        for (let i = 0; i < thCVList.length; i++) {
          // console.log(getComputedStyle(thList[i]).getPropertyValue('width'))
          thCVList[i].style.width =window.getComputedStyle(thList[i]).width
        }
      }
    },
    preClick(index) {
      // console.log(111)
      // this.data[index].isOpen=!this.data[index].isOpen
      this.$set(this.isOpenList, index, !this.isOpenList[index]);
    },
    init() {
      this.elId = "aa" + v4(); // 避免key重复

      if (this.type === "tree") {
        this.isOpenList = new Array(this.data.length).fill(false);
      }
    },
    handleScroll() {
      // 得到页面滚动的距离
        let clientHeight = document.querySelector("#" + this.elId).clientHeight;
        let offsetTop = document.querySelector("#" + this.elId).offsetTop;
        let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
        // console.log(this.elId,offsetTop)
        if(scrollTop > offsetTop){this.$emit('width')}
      // 判断页面滚动的距离是否大于吸顶元素的位置
      this.isFixed =
        scrollTop > offsetTop && scrollTop < offsetTop + clientHeight - 40
          ? true
          : false;
    },
    detail(item) {
      this.$emit("detailClick", item);
    },
  },
  deactivated() {
    //  同时在deactivated回调中移除监听：
 console.log(this.elId)
    window.removeEventListener("scroll",  this.throttle);
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
.listNav {
  display: table-row ;
  
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
  width: 1.5rem;
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
</style>