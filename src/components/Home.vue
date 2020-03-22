<template>
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/smlogo.png" alt="" class="smllogo">
          <span>考试管理系统</span>
        </div>
        <div class="exit_div" @mouseenter="show=true,isf1active=true" @mouseleave="show=false,isf1active=false" :class="{exit_f1active:isf1active}">
          <div class="exit_f1">
            <img src="../assets/smlogo.png" alt="" class="elbtn_img">
            <div class="userif">
                            <p>Administottor</p>
                            <p>超级管理员</p>
              </div>
            <div :class="['smicon',isf1active?'el-icon-arrow-down':'el-icon-arrow-up']"></div>

             </div>
            <button class="exit_f2" v-if="show" @click="logout">
              <i class="el-icon-switch-button"></i>
              退出登录
            </button>

                      </div>


                    </el-header>

                    <el-container>
<!--                      菜单部分-->
                      <el-aside :width="isCollapse? '64px':'200px'">
                        <div class="toggle-button" @click="toggleCollapse">
                        <i :class="['el-icon-s-fold',isCollapse?'':'Anim']"></i>
                        </div>
                        <el-menu
                          :collapse="isCollapse"
                          :unique-opened="true"
                          background-color="#333744"
                          text-color="#fff"
                          active-text-color="#409EFF"
                          router
                          :default-active="activePath"
                        >
              <!--            一级菜单-->
<!--            index只接收字符串-->
            <el-submenu :index="item.classId+''" v-for="(item,index) in menulist" :key="item.classId"
          >
<!--              一级菜单的模板区-->
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.className}}</span>
              </template>
<!--              :index="'/'+subitem.path"  路由跳转地址-->
                <el-menu-item :index="'/'+subitem.urlPath" v-for="subitem in item.permissionLst" :key="subitem.id"
                              @click="saveNavState('/'+subitem.urlPath)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subitem.permissionName}}</span>
                  </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>


</template>
<script>
export default{
  data(){
    return{
      loginid:'',
      show:false,
      isf1active:false,
      menulist:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
   created() {
    // const that=this
    // setTimeout(function() {
    //   that.loginid=parseInt(window.sessionStorage.getItem('loginid'))
    //   that.getmenuList()
    // },1111)
  },
  mounted() {


  },
  methods:{
    logout(){
      //清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse(){
    //  展开与折叠
      this.isCollapse=!this.isCollapse

    },
    saveNavState(activepath){
      this.activePath=activepath
    //  保存链接的激活状态
    window.sessionStorage.setItem('activepath',activepath)

    },
 getmenuList(){
this.$http.get(`api/Permission/getUserMenu/${this.loginid}`).then(res=>{
   // console.log(res.data)
  this.menulist=res.data
}).catch(res=>{
  console.log('获取菜单失败')
})
    }
  }
}
</script>
<style lang="less" scoped>
.el-header{
 width: 100%;
  background-color:#373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  align-items: center;
  color: white;
  font-size: 20px;
  >div{
    display: flex;
   align-items: center;
   span{
     margin-left: 15px;
   }
  }
}
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right:0;
    }

  }
  .el-main{
    background-color: #EAEDF1;
  }
  .home-container{
    height: 100%;
  }
  .smllogo{
    width: 40px;
  }
  .iconfont{
    margin-right: 9px;
  }
  .toggle-button{
    background-color:#4A5064;
    font-size: 25px;
    color: #fff;
    cursor: pointer;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;


  }
  .exit_div{
    width: 170px;
    height: 40px;
    border-radius: 3px;
    padding: 5px;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    transition:all .4s;


    >.exit_f1{
      width: 170px;
      height: 40px;
      display: flex;
      align-items: center;
      border-radius: 3px;
      padding: 5px;
      box-sizing: border-box;
      text-align: center;
      /*background: red;*/

      >.userif{
        display: inline-block;
        text-align: center;
        margin-right: 5px;
        >p{
          margin: 5px;

        }
      }
      >.elbtn_img{
        border-radius: 3px;
        width: 35px;
        height: 35px;
        display: inline-block;
      }

    }

    >.exit_f2{
      width: 150px;
      height: 35px;
      position: absolute;
      top: 100%;
      left: 8%;
      background-color:white;
      box-shadow:0 2px 1px rgba(0,0,0,0.3) ;
      border-radius: 5px;
        border: none;
    }



  }
.exit_f1active{
  background-color: rgba(255,255,255,0.4);

}

.Anim{
  transform: rotate(-90deg);
  transition: .4s;
  }





</style>
