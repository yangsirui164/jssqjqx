// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//ip地址配置
// import  '../static/js/config.js'

//按需加载蚂蚁金服
import {Transfer,Table,Tree,TreeSelect } from 'ant-design-vue'
import 'ant-design-vue/lib/transfer/style/css'
import 'ant-design-vue/lib/table/style/css'
import 'ant-design-vue/lib/tree/style/css'
import 'ant-design-vue/lib/tree-select/style/css'

Vue.use(Transfer)
Vue.use(Table)
Vue.use(Tree)
Vue.use(TreeSelect)

//手动配置element-ui
import ElementUI from 'element-ui'
// import Antd from 'ant-design-vue'
import 'element-ui/lib/theme-chalk/index.css'
// import 'ant-design-vue/dist/antd.css'
//导入全局样式
import './assets/css/global.css'
//导入字体库图标
import '../src/assets/fonts/iconfont.css'
//导入axios请求包
import axios from 'axios'
//设置请求根路径   后改
// http://192.168.1.15:8003
// axios.defaults.baseURL='http://192.168.1.15:8005'
//导入付文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import * as Quill from 'quill'  // 引入编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize',ImageResize);
//ip配置第二种方式   无需config.js
//需要挂载
Vue.prototype.$http=axios
Vue.use(ElementUI)
// Vue.use(Antd)
Vue.use(VueQuillEditor)



import 'swiper/dist/css/swiper.min.css'
import 'swiper/dist/js/swiper.min'

axios.interceptors.request.use( config=>{
  console.log(config);
  return config
})


function getServerConfig () {
  return new Promise((resolve, reject) => {
    axios.get('./static/serverConfig.json').then(result => {
      console.log(result)
      let config = result.data;
      Vue.prototype.BASE_URL =config.BASE_URL;
      Vue.prototype.base_url =config.base_url;
      resolve();
    })
  })
}




Vue.config.productionTip = false


async function main () {
  await getServerConfig();

  new Vue({
    el: '#app',
    router,
    template: '<App />',
    components: { App }
  })
}
// 方法初始执行
main();
