<template>
  <div class="global">
    <!-- 统计版块 -->
    <div class="num">
      <div class="title">截至北京时间{{ WomWorld.lastUpdateTime }}</div>
      <ul class="wrap">
        <li>
          <div class="number">
            <span>较昨日</span>{{ WomWorld.nowConfirmAdd | number }}
          </div>
          <div class="bold">
            {{ WomWorld.nowConfirm | division }}
          </div>
          <strong>现存确诊</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span>{{ WomWorld.confirmAdd | number }}
          </div>
          <div class="bold">{{ WomWorld.confirm | division }}</div>
          <strong>累计确诊</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span> {{ WomWorld.deadAdd | number }}
          </div>
          <div class="bold">{{ WomWorld.dead | division }}</div>
          <strong>累计死亡</strong>
        </li>
        <li>
          <div class="number">
            <span>较昨日</span> {{ WomWorld.healAdd | number }}
          </div>
          <div class="bold">{{ WomWorld.heal | division }}</div>
          <strong>累计治愈</strong>
        </li>
      </ul>
    </div>
    <!-- 表格版块 -->
    <div class="table-box">
      <div class="tabList">
        <div
          class="tab"
          v-for="(item, index) in tabsTitles"
          :key="item"
          @click="tabsClick(index)"
          :class="active === index ? 'active' : ''"
        >
          {{ item }}
        </div>
      </div>
      <GTable
        class="gTable"
        type="tree"
        :key="0"
        :data="WomAboardTree"
        :column="column"
        :colorList="colorList"
        v-if="active === 0"
      />
      <GTable
        class="gTable"
        :data="WomAboard"
        :column="column"
        :key="1"
        :colorList="colorList"
        v-if="active === 1"
        limitHeight="400"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabsTitles: ["按大洲查看", "按国家查看"],
      active: 0,
      colorList: ["#E3E7F3", "#F3BAB0", "#E69A8D", "#B4C0D5", "#95DB9A"],
      WomWorld: {}, //世界疫情统计
      WomAboard: [], //个各个国家疫情
      WomAboardTree: [], //按洲生成树形结构,
      column: [
        { title: "地区", prop: "name" },
        { title: "现存确诊", prop: "nowConfirm" },
        { title: "累计确诊", prop: "confirm" },
        { title: "死亡", prop: "dead" },
        { title: "治愈", prop: "heal" },
      ],
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
  },
  methods: {
    tabsClick(liIdx) {
      if (this.active === liIdx) return;
      this.active = liIdx;
    },
    getData() {
      this.$api.getWorldData().then((res) => {
        const result = res.data;
        if (!result) return this.$toast.fail("提示文案");
        this.WomWorld = result.data.WomWorld;
        this.WomAboard = result.data.WomAboard;
        this.WomAboardTree = this.formatTree(result.data.WomAboard);
      });
    },
    formatTree(arr) {
      let tree = [
        {
          name: "欧洲",
          nowConfirm: 0,
          confirm: 0,
          dead: 0,
          heal: 0,
          children: [],
        },
        {
          name: "亚洲",
          nowConfirm: 0,
          confirm: 0,
          dead: 0,
          heal: 0,
          children: [],
        },
        {
          name: "北美洲",
          nowConfirm: 0,
          confirm: 0,
          dead: 0,
          heal: 0,
          children: [],
        },
        {
          name: "南美洲",
          nowConfirm: 0,
          confirm: 0,
          dead: 0,
          heal: 0,
          children: [],
        },
        {
          name: "非洲",
          nowConfirm: 0,
          confirm: 0,
          dead: 0,
          heal: 0,
          children: [],
        },
        {
          name: "大洋洲",
          nowConfirm: 0,
          confirm: 0,
          dead: 0,
          heal: 0,
          children: [],
        },
        {
          name: "其他",
          nowConfirm: 0,
          confirm: 0,
          dead: 0,
          heal: 0,
          children: [],
        },
      ];
      arr.forEach((item) => {
        tree.forEach((el) => {
          if (el.name === item.continent) {
            const children = item;
            el.nowConfirm = el.nowConfirm + item.nowConfirm;
            el.confirm = el.confirm + item.confirm;
            el.dead = el.dead + item.dead;
            el.heal = el.heal + item.heal;
            el.children.push(children);
          }
        });
      });
      tree.forEach((item) => {
        item.name = item.name + "(" + item.children.length + ")";
      });
      return tree;
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
}

.table-box {
  padding: 0 0.3rem 0.3rem;
  .tabList {
    display: flex;
    height: 0.88rem;
    align-items: center;
    .tab {
      margin: 0 0.08rem 0 0;
      font-size: 0.28rem;
      width: 1.58rem;
      text-align: center;
      line-height: 0.56rem;
      background-color: #f7f7f7;
      color: #666666;
    }
    .active {
      background-color: #f1f5ff;
      color: #4169e2;
    }
  }
}
</style>