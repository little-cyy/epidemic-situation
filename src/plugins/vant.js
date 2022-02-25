import Vue from 'vue'
// 按需引入vant组件
import { Toast ,Tab, Tabs } from 'vant';
import { Popup } from 'vant';
import { Picker } from 'vant';
import { Loading } from 'vant';
Vue.use(Loading);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Toast)
Vue.use(Tab)
Vue.use(Tabs)