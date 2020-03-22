import Vue from 'vue'
import Router from 'vue-router'
//带入登录组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import  Users from '../components/user/Users'
import  Rights from '../components/power/rights'
import Roles from '../components/user/Roles'
import Subject from '../components/subject/Subject'
import Singlesub from '../components/subject/Singlesub'
import Curriculm from '../components/subject/Curriculum'
import  Usermanage from '../components/power/usermanage'
import  Transfer from '../components/transefer'
import Studentmn from '../components/relation/Studentmanage'
import Teachermn from '../components/relation/Teachermanage'
import Classmn from '../components/relation/Classmanage'
import Upload from '../components/upload'
import Sourcemn from  '../components/sources/Sourcemanage'
import Addsource from '../components/sources/Addsource'
import firstStu from '../components/students/first'
Vue.use(Router)

const router= new Router({
  routes: [
    {
      //重定向
      path:'/',
      redirect:'/login'
    },
    {
      //http://localhost:8080/#/login
      path:'/login',
      component:Login
    },
    {
      path:'/transfer',
      component:Transfer
    },
    {
      path:'/upload',
      component:Upload
    },
    {
    path:'/firststu',
      component:firstStu

    },
    {
      path:'/home',
      component:Home,
      redirect:'',
      children:[
        {path:'/welcome',
        component:Welcome},
        {
          path:'/users',
          component: Users
        },
        {
          path:'/rights',
          component:Rights
        },
        {
          path:"/roles",
          component:Roles
        },
        {
          path:'/orders',
          component:Usermanage
        },
        {
          path:'/subject',
          component:Subject
        },
        {
          path:'/singlesub',
          component:Singlesub
        },
        {
          path:'/curriculum',
          component:Curriculm
        },
        {
          path:'/studentmn',
          component:Studentmn
        },{
          path:'/teachermn',
          component:Teachermn
        },
        {
          path:'/classmn',
          component:Classmn
        },
        {
          path:'/sourcemn',
          component:Sourcemn
        },{
        path:'/addsource',
        component:Addsource
        }

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
//   if(to.path==='/login'){
//    return next()
//   }
//
//   // //获取token
//   const loginid=window.sessionStorage.getItem('loginid')
//
//   if(!loginid) return next('/login')
//
//   next()
//
// })
export default router
