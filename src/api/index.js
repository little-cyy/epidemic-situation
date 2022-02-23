/***
 * 请求的接口的方法
 */
//请求的axios
import axios from 'axios'
//接口地址
import base from './base'
//引入md5 
import md5 from 'md5-js'

//请求方法
const api = {
    /**
     * 病毒信息获取
     */
    getCovInfo() {
        return axios.get( base.covInfo)
    },
    /**
     * 获取国内疫情
     */
    getChinaData() {
        return axios.get(base.chinaData);
    },
    /**
     * 世界疫情
     */
    getWorldData() {
        return axios.get( base.worldData)
    },
    /**
     * 获取城市接口
     * 参数：format=json&appid=6938&city_name=城市名称&sign=md5加密字符串 
     */
    getCity(city_name) {
        //md5加密规则：sign = MD5( appid1formatjsontime1545829466密钥) 查看加密规则说明 密钥不需要键名，请直接跟上32位的密钥
        //步骤：1. 安装 npm i md5-js -S  2. 引入md5模块  3. 使用加密处理 
        let sign = md5('appid6938city_name' + city_name + 'formatjson709b25c001c8d3325061a5baf7bb7615');
        let canshu = 'format=json&appid=6938&city_name=' + city_name + '&sign=' + sign;
        return axios.get( base.city + '?' + canshu);
    },
    /**
     * 获取城市历史接口
     * */
    getCityDayInfo(city_name) {
        //md5加密规则：sign = MD5( appid1formatjsontime1545829466密钥) 查看加密规则说明 密钥不需要键名，请直接跟上32位的密钥
        //步骤：1. 安装 npm i md5-js -S  2. 引入md5模块  3. 使用加密处理 
        return axios.get( base.cityDayInfo + '?province=' + city_name);
    },
    /**
     * 城市的出行政策疫情  
     */
    getTravel() {
        return axios.get(base.travel)
    },
    /**
     * 风险地区可选城市列表 
     */
    getRiskCity(){
        return axios.get(base.riskCity)
    },
    /**
     * 全国风险地区汇总 
     */
    getRisk(){
        return axios.get(base.risk)
    },
    /**
     * 获取全国每日疫情统计信息
     */
    getDayInfo(){
        return axios.get(base.dayInfo)
    },
    /**
     * 获取疫苗接种信息
     */
    getVaccine(){
        return axios.get(base.Vaccine)
    }
}

export default api