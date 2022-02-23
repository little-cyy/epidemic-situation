<template>
  <div class="CovTabs">
    <div class="list" v-for="idx in 4" :class="'lsit' + idx" :key="idx">
      <div class="tabs">
        <div
          class="tab"
          v-for="(item, index) in tabsTitles"
          :key="item"
          @click="tabsClick(index + 1, idx)"
          :class="idx === index + 1 ? 'active' : ''"
        >
          {{ item }}
        </div>
      </div>
      <Region :chinaInfo="chinaInfo" v-if="idx === 1"/>
      <Domestic :chinaInfo="chinaInfo" v-if="idx === 2"/>
      <Global v-if="idx === 3"/>
      <Vaccine v-if="idx === 4"/>
    </div>
  </div>
</template>
<script>
import Region from "./tab/Region.vue";
import Domestic from "./tab/Domestic.vue";
import Global from "./tab/Global.vue";
import Vaccine from "./tab/Vaccine.vue";
export default {
  components: {
    Region,
    Domestic,
    Global,
    Vaccine,
  },
  data() {
    return {
      chinaInfo:[],
      tabsTitles: ["地区疫情", "国内数据", "海外数据", "新冠疫苗"],
    };
  },
  created() {
    this.initData()
  },
  methods: {
    tabsClick(liIdx, ulIdx) {
      if (ulIdx === liIdx ) return;
      // console.log(document.getElementsByClassName('lsit' + liIdx)[0])
      document.getElementsByClassName("lsit" + liIdx)[0].scrollIntoView(true);
    },
    initData(){
      let higMap=new Map()
      let midMap=new Map()
      const forMat = (obj) => {
          obj.total.AddConfirm=obj.today.confirm
          obj={name:obj.name,...obj.total}
          obj.higNum=higMap.get(obj.name)||0
          obj.midNum=midMap.get(obj.name)||0
          obj.higAndMid=obj.higNum+obj.midNum
          delete obj.today
          delete obj.total
        return obj
       }
       //存储高风险地区city-count的映射
      this.$api.getRisk().then((res) => {
        const result = res.data;
        if (!result) return this.$toast.fail("提示文案");
        result.data[0].dangerPros.forEach((prov)=>{
          higMap.set(prov.provinceShortName,prov.dangerAreas.length)
          prov.dangerAreas.forEach(item=>{
            const value=higMap.get(item.cityName)?higMap.get(item.cityName)+1:1
            higMap.set(item.cityName,value)
          })
        })
        //存储地风险地区city-count的映射
        result.data[1].dangerPros.forEach((prov)=>{
          midMap.set(prov.provinceShortName,prov.dangerAreas.length)
          prov.dangerAreas.forEach(item=>{
            const value=midMap.get(item.cityName)?midMap.get(item.cityName)+1:1
            midMap.set(item.cityName,value)
          })
        })
        //存储到localStorage
      localStorage.setItem("higMap",JSON.stringify([...higMap]));
      localStorage.setItem("midMap",JSON.stringify([...midMap]));
      });
      
      this.$api.getChinaData().then((res) => {
        const result=res.data.data.diseaseh5Shelf.areaTree[0].children
        result.forEach((item)=>{
          const obj=forMat(item)
          obj.children=item.children&&item.children.map(it=>forMat(it))
          this.chinaInfo.push(obj)
        })
      })
   },
  },
};
</script>
<style lang="less" scoped>
.CovTabs {
  .list {
    background-color: #ffffff;
    margin-top: 0.3rem;
    border-radius: 0.2rem 0.2rem 0 0;
    .tabs {
      display: flex;
      background-color: #e6edff;
      border-radius: 0.2rem 0.2rem 0 0;
      .tab {
        line-height: 0.72rem;
        text-align: center;
        flex-grow: 1;
        font-size: .3rem;
      }
      .active {
        border-radius: 0.2rem 0.2rem 0 0;
        background-color: #ffffff;
        color: #4169e2;
      }
    }
  }
}
.box {
  height: 1000px;
}
</style>