import Vue from 'vue'
import echarts from 'echarts'
// 引入地图的js文件
import '@/utils/map.js'
//导入映射的翻译-世界国家名称
import country from '../utils/country'
import remFontSize from '@/utils/remFontSize.js'
import debounce from '@/utils/debounce.js'
const install = function (Vue, options) {
  // 添加实例方法 
  // Vue.prototype.demo=function(){}  //obj.name    
  //Vue.prototype.$myChart={demo(),fun(),...}
  Object.defineProperties(Vue.prototype, {
    $myChart: {
      get() {
        return {
          //  绘制一个折线图
          line(config) {
            // console.log(config)
            var myChart = echarts.init(document.getElementById(config.id));
            // 指定图表的配置项和数据
            var option = {
              color: config.colorList,
              title: {
                show: config.title,
                text: '全国' + config.title,
                top: remFontSize(0.1),
                left: remFontSize(0.1)
              },
              tooltip: { //悬浮弹框
                show: config.showTooltip,
                trigger: 'axis', 
              },
              legend: {
                show: config.legend,
                data: config.legend,
                top:remFontSize(0.1),
                right:config.title&&remFontSize(0.1),
                itemWidth:remFontSize(0.2),
                itemHeight: remFontSize(0.06),

              },
              xAxis: {
                nameLocation: 'start',
                boundaryGap: false,
                // axisTick: {show: false},
                axisLabel: { fontSize: remFontSize(0.1) },
                type: 'category',
                data: config.xAxisData

              },
              yAxis: {
                axisLine: { show: false },  //隐藏竖线
                axisLabel: { fontSize: remFontSize(0.1) },
                type: 'value'
              },
              grid: {
                height: '70%',
                width: '90%',
                top: '20%',
                left: 'center',
                containLabel: true
              },
              series:
                config.dataList && config.dataList.map((item, idx) => {
                  const obj = {
                    name: config.legend[idx],
                    data: item,
                    type: 'line',
                    symbolSize: 3, // 拐点图形大小,
                    itemStyle: {
                      normal: {
                        lineStyle: {
                          width: 2//设置线条粗细
                        }
                      }
                    }
                  }
                  return obj
                })
               
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.addEventListener("resize",debounce( () => {myChart.resize() },2000));
          },
          //中国地图
          chinaMap(id, data) {
            const title = id === 'curConfirm' ? '当前确诊' : (id === 'confirm' ? '累计确诊' : '风险地区')
            var myChart = echarts.init(document.getElementById(id));
            var option = {
              tooltip: { //悬浮弹框
                triggerOn: 'click', //提示框触发的条件
                enterable: true,//鼠标是否可进入提示框浮层中，默认为false
                formatter(item) {//item=下面serves里面的data里面的每一项 //[{} ] data={} a b c d 
                  // return '<a href="/City?city=' + item.name + '" style="color:#fff" class="tooltip"><div class="tooltip_left"><div>省份：' + item.name +'</div><div>'+title+'：'+item.value+'</div></div><div class="tooltip_right">详情></div></a>'
                  return '<div style="pointer-events: all;color:#fff" class="tooltip" onclick="myClick(\'' + item.name + '\')"><div class="tooltip_left"><div>省份：' + item.name + '</div><div>' + title + '：' + item.value + '</div></div><div class="tooltip_right">详情></div></div>'
                }
              },
              visualMap: [{ //映射高亮颜色
                orient: "horizontal", //水平的
                type: "piecewise", //离散
                // bottom: 0,
                left: 'center',
                textGap: 2,  //两端文字主体之间的距离
                itemGap: 8,  //每两个图元之间的间隔距离
                itemWidth: 8,
                itemHeight: remFontSize(0.08),
                // padding: 2,
                textStyle: {
                  fontSize: remFontSize(0.09),
                },
                pieces: [ // 配置颜色区间
                  {
                    min: 0,
                    max: 0,
                    color: "#FFFFFF"
                  },
                  {
                    min: 1,
                    max: 9,
                    color: "#FAEBD2"
                  },
                  {
                    min: 10,
                    max: 99,
                    color: "#E9A188"
                  },
                  {
                    min: 100,
                    max: 499,
                    color: "#D56355"
                  },
                  {
                    min: 500,
                    max: 999,
                    color: "#BB3937"
                  },
                  {
                    min: 1000,
                    max: 10000,
                    color: "#772526"
                  },
                  {
                    min: 10000,
                    color: "#480F10"
                  }
                ]
              }],
              series: [{
                name: "省",
                type: "map", //地图  bar  line  map 
                map: "china", //中国地图 需要引入地图china.js 
                roam: false,
                zoom: 1.2,
                aspectScale: 0.75,
                top: remFontSize(0.3),
                layoutCenter: ['5%', '5%'],
                label: {
                  normal: {
                    show: true,
                    textStyle: {
                      fontSize: remFontSize(0.09)
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    areaColor: 'rgba(0,255,236,0)',
                    borderColor: 'rgba(0,0,0,0.2)',
                  },
                  emphasis: { // 选中的区域高亮颜色及阴影效果等
                    areaColor: 'rgba(255,180,0,0.8)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                  }
                },
                data
                // data: [
                //     { name: '内蒙古', value: 200 },
                //     { name: '北京', value: 800 },
                // ]
              }]
            }
            myChart.setOption(option);
            window.addEventListener("resize",debounce( () => {myChart.resize() },2000));
          },
          //省份地图
          cityMap(id, data, cityName) {
            const title = id === 'curConfirm' ? '当前确诊' : (id === 'confirm' ? '累计确诊' : '风险地区')
            var myChart = echarts.init(document.getElementById(id));
            var option = {
              tooltip: { //悬浮弹框
                triggerOn: 'click', //提示框触发的条件
                enterable: true,//鼠标是否可进入提示框浮层中，默认为false
                formatter(item) {//item=下面serves里面的data里面的每一项 //[{} ] data={} a b c d 
                  return ' <div>城市：' + item.name + '</div><div>' + title + '：' + item.value + '</div>'
                }
              },
              visualMap: [{ //映射高亮颜色
                orient: "horizontal", //水平的
                type: "piecewise", //离散
                // bottom: 0,
                left: 'center',
                textGap: 2,  //两端文字主体之间的距离
                itemGap: 8,  //每两个图元之间的间隔距离
                itemWidth: 8,
                itemHeight: remFontSize(0.08),
                // padding: 2,
                textStyle: {
                  fontSize: remFontSize(0.09),
                },
                pieces: [ // 配置颜色区间
                  {
                    min: 0,
                    max: 0,
                    color: "#FFFFFF"
                  },
                  {
                    min: 1,
                    max: 9,
                    color: "#FAEBD2"
                  },
                  {
                    min: 10,
                    max: 99,
                    color: "#E9A188"
                  },
                  {
                    min: 100,
                    max: 499,
                    color: "#D56355"
                  },
                  {
                    min: 500,
                    max: 999,
                    color: "#BB3937"
                  },
                  {
                    min: 1000,
                    max: 10000,
                    color: "#772526"
                  },
                  {
                    min: 10000,
                    color: "#480F10"
                  }
                ]
              }],
              series: [{
                name: "市",
                type: "map", //地图  bar  line  map 
                map: cityName, //中国地图 需要引入地图china.js 
                roam: false,
                zoom: 1.2,
                aspectScale: 0.75,
                top: remFontSize(0.3),
                layoutCenter: ['5%', '5%'],
                label: {
                  normal: {
                    show: true,
                    textStyle: {
                      fontSize: remFontSize(0.09)
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    areaColor: 'rgba(0,255,236,0)',
                    borderColor: 'rgba(0,0,0,0.2)',
                  },
                  emphasis: { // 选中的区域高亮颜色及阴影效果等
                    areaColor: 'rgba(255,180,0,0.8)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                  }
                },
                data
                // data: [
                //     { name: '内蒙古', value: 200 },
                //     { name: '北京', value: 800 },
                // ]
              }]
            }
            myChart.setOption(option);
            window.addEventListener("resize",debounce( () => {myChart.resize() },2000));
          },


        }
      }
    }
  })
}
Vue.use(install)