import Vue from 'vue'
import Router from 'vue-router'
//带入登录组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import firstStu from '../components/first'
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
import openresources from '../components/sources/Openresources'
import firststudy from '../components/firststudy'
import studenthome from '../components/Studenthome'
import studentinfo from '../components/students/Studentinfo'
import testsmanage from '../components/tests/Testsmanage'
import Edittests from '../components/tests/Edittests'
import Papermanage from '../components/tests/Papermanage'
import Addpaper from '../components/tests/Addpaper'
import Taskmanage from '../components/tests/Taskmanage'
import Edittasks from '../components/tests/Edittasks'
import fmtask from '../components/Fmtask'
import Task1 from  '../components/tasks/Task1'
import Hasuptask from '../components/tasks/Hasuptask'
import Areamn from '../components/system/Areamn'
import Areasbmn from '../components/system/Areasbmn'
import Xdmn from '../components/practice/Xdmn'
import Editxd from '../components/practice/Editxd'
import Areamn2 from '../components/system/Areamn2'
import Users2 from '../components/user/Users2'
import Roles2 from '../components/user/Roles2'
import Desxd from '../components/practice/Desxd'
import Systemset from '../components/system/Systemset'
import Taskquery from '../components/students/taskquery'
import Monipractie from '../components/practice'
import Monitask from '../components/tests/Monitask'
import Pratask from '../components/tasks/Pratask'

//vue把router当成组件安装了一下
Vue.use(Router)

const router= new Router({
  routes: [
    {
      //重定向
      path:'/',
      redirect:'/first',
      //meta属于元信息
      meta: {
        title: '首页'
      }
    },
    {
      //http://localhost:8080/#/login
      path:'/login',
      component:Login,
      meta: {
        title: '登录'
      }
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
      path:'/first',
      component:firstStu,
      meta: {
        title:'学员辅助平台'
      }
    },
    {
      path:'/fmtask',
      component:fmtask,
      meta: {
        title: '在线考试'
      }
    },
    {
      path:'/opensources',
      component:openresources,
      meta: {
        title: '在线学习'
      }
    },
    {
      path:'/firststudy',
      component:firststudy,
      meta: {
        title: '课件资源学习'
      }
    },
    {
      path:'/pratask',
      component:Pratask,
      meta: {
        //在线模拟考试
        title: '模拟考试'
      }
    },
    {
      path:'/practice',
      component:Monipractie,
      meta: {
        title: '模拟考试'
      }
    },
    {
      path:'/task1',
      component:Task1,
    },
    {
      path:'/backscore',
      component:Hasuptask,
    },
    {
      path:'/studenthome',
      component:studenthome,
      meta: {
        title: '学生中心'
      },
      children:[
        {
          path:'/studentinfo',
          component:studentinfo,
          meta: {
            title: '用户信息'
          },
        },
        {
          path:'/taskquery',
          component:Taskquery,
          meta: {
            title: '考试查询'
          },

        }
      ]
    },
    {
      path:'/home',
      component:Home,
      children:[
        {path:'/welcome',
          component:Welcome},
        {
          path: '/xdmn',
          component: Xdmn,
          meta: {
            title: '训练管理'
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
          path:'/testsmn',
          component: testsmanage,
          meta: {
            title: '网站试题管理'
          }
        },
        {
          path:'/papermn',
          component: Papermanage,
          meta: {
            title: '网站试卷管理'
          }
        },
        {
          path:'/monitaskpz',
          component: Monitask,
          meta: {
            title: '模拟考试配置管理'
          }
        },
        {
          path:'/taskmn',
          component: Taskmanage,
          meta: {
            title: '网站考试管理'
          }
        },
        {
          path:'/addpaper',
          component: Addpaper,
          meta: {
            title: '网站试卷管理'
          }
        },
        {
          path:'/edittests',
          component: Edittests,
          meta: {
            title: '试题编辑'
          }
        },
        {
          path:'/edittasks',
          component: Edittasks
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
        {
          path:'/orders',
          component:Usermanage
        },
        {
          path:'/subject',
          component:Subject,
          meta: {
            title: '科目管理'
          }
        },
        {
          path:'/singlesub',
          component:Singlesub,
          meta: {
            title: '单项管理'
          }
        },
        {
          path:'/curriculum',
          component:Curriculm,
          meta: {
            title: '课程管理'
          }
        },
        {
          path:'/studentmn',
          component:Studentmn,
          meta: {
            title: '学员管理'
          }
        },{
          path:'/teachermn',
          component:Teachermn,
          meta: {
            title: '教师管理'
          }
        },
        {
          path:'/classmn',
          component:Classmn,
          meta: {
            title: '年级/班级管理'
          }
        },
        {
          path:'/sourcemn',
          component:Sourcemn,
          meta: {
            title: '课件资源管理'
          }
        },{
          path:'/addsource',
          component:Addsource,
          meta: {
            title: '课件资源编辑'
          }

        },
        {
          path:'/areamn',
          component: Areamn2,
          // component:Areamn,
          meta: {
            title: '训练区域管理'
          }
        },
        {
          path:'/areasbmn',
          component:Areasbmn,
          meta: {
            title: '资源训练环境配置'
          }
        },
        {
          path:'/systemset',
          component:Systemset,
          meta: {
            title: '系统参数设置'
          }
        },
        {
          path: '/editxd',
          component: Editxd,
          meta: {
            title: '训练管理'
          }
        },
        {
          path: '/desxd',
          component: Desxd,
          meta: {
            title: '训练详情'
          }
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
