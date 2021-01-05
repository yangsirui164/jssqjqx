import Vue from 'vue'
import Router from 'vue-router'
//带入登录组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import  Rights from '../components/power/rights'
import Users2 from '../components/user/Users2'
import Roles2 from '../components/user/Roles2'
import Swiper_first from '../components/Swiper_first'
import Swiper_first1 from '../components/Swiper_first1'
import Qxfan from '../components/Qxfan'
import History from '../components/History'
import Swiperxq from  '../components/Swiper-xq'

//vue把router当成组件安装了一下
Vue.use(Router)

const router= new Router({
  routes: [
    {
      //重定向
      path:'/',
      redirect:'/swiper1',
      //meta属于元信息
      meta: {
        title: '首页'
      }
    },
    {
      path:'/login',
      component:Login,
      meta: {
        title: '登录'
      }
    },
    {
      path:'/home',
      component:Home,
      children:[
        {
          path:'/swiper',
          component:Swiper_first,
          meta: {
            title: '首页'
          }
        },
        {
          path:'/swiper1',
          component:Swiper_first1,
          meta: {
            title: '首页'
          }
        },
        {
          path:'/swiperxq',
          component:Swiperxq,
          meta: {
            title: '详情页'
          }
        },
        {
          path:'/qxfan',
          component:Qxfan,
          meta: {
            title: '抢修方案'
          }
        },
        {
          path:'/history',
          component:History,
          meta: {
            title: '历史记录'
          }
        },
        {
          path:'/users',
          component: Users2,
          meta: {
            title: '用户管理'
          }
        },




        {
          path:'/rights',
          component:Rights
        },
        {
          path:"/roles",
          component:Roles2,
          meta: {
            title: '角色管理'
          }
        },



        // {
        //   path:'/studentmn',
        //   component:Studentmn,
        //   meta: {
        //     title: '学员管理'
        //   }
        // },


      ]
    }
  ]
})
//挂载路由导航守卫
// router.beforeEach((to,from,next)=>{
//   //to 将要访问的路径
//   //从哪个路径跳转而来
//   //next是一个函数  表示放行
//
//   // if(to.path==='/login'){
//   //  return next()
//   // }
//   //
//   // // //获取token
//   // const loginid=window.sessionStorage.getItem('loginid')
//   //
//   // if(!loginid) return next('/login')
//   //
//   // next()
//
// })
router.afterEach((to,from,next)=>{

  window.document.title=to.meta.title

})
export default router
