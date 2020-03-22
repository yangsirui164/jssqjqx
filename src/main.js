// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//手动配置element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// //导入全局样式
import './assets/css/global.css'
//导入字体库图标
import '../src/assets/fonts/iconfont.css'
//导入axios请求包
import axios from 'axios'
//设置请求根路径
//  axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//导入付文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
axios.defaults.baseURL='http://192.168.1.15:8002'
axios.interceptors.request.use(config=>{
  // console.log("config"+config);
  console.log(config);
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
//需要挂载
Vue.prototype.$http=axios
Vue.use(ElementUI)
Vue.use(VueQuillEditor)



Vue.config.productionTip = false




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data:{
     //组件中心 用于兄弟组件传数据
     hub:new Vue()
  },
  components: { App },
  template: '<App/>'
})
