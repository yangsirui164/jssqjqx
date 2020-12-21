<template>

  <el-container class="home-container">
    <el-header>
      <div style="height: 24px;line-height: 24px">
        <i class="el-icon-user"></i>
        <span style="margin-left: 8px">学生中心</span>
      </div>
      <div class="exit_div">
       <span class="exjhg" @click="goout()">{{loginName}},退出|</span>
        <i class="el-icon-s-home"></i>
       <span class="backfirst" @click="backfirst()">返回首页</span>
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
          background-color="#ffffff"
          text-color="#909399"
          active-text-color="#303d6f"
          router
          :default-active="activePath"
        >
          <!--            一级菜单-->
          <!--            index只接收字符串-->
          <el-submenu :index="item.classId+''" v-for="(item,index) in menulist" :key="item.classId"
          >
            <!--              一级菜单的模板区-->
            <template slot="title">
              <i :class="iconObj[item.classId]"></i>
              <span>{{item.className}}</span>
            </template>
            <!--              :index="'/'+subitem.path"  路由跳转地址-->
            <el-menu-item :index="'/'+subitem.urlPath" v-for="subitem in item.permissionLst" :key="subitem.id"
                          @click="saveNavState('/'+subitem.urlPath)">
              <template slot="title">
<!--                <i class="el-icon-menu"></i>-->
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
        loginName:'',
        loginid:'',
        show:false,
        isf1active:false,
        menulist:[],
        iconObj:{
          '9':'iconfont icon-icon_User',

        },
        isCollapse:false,
        activePath:'',
        base:''
      }
    },
    created() {
      this.base=this.BASE_URL
      this.loginid=window.sessionStorage.getItem('loginid')
      this.loginName=window.localStorage.getItem('loginName')
      // console.log('登录id')
      // console.log(this.loginid)
      this.getmenuList()
    },
    mounted() {


    },
    methods:{
      backfirst(){
        this.$router.push('/first')
      },
      logout(){
        //清空token
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      toggleCollapse(){
        //  展开与折叠
        this.isCollapse=!this.isCollapse

      },
      goout(){
       // 退出
       window.sessionStorage.clear()
       this.$router.push('/login')
      },
      saveNavState(activepath){
        this.activePath=activepath
        //  保存链接的激活状态
        window.sessionStorage.setItem('activepath',activepath)

      },
      getmenuList(){

        this.$http.get(`${this.base}/api/Permission/getUserMenu/${this.loginid}`).then(res=>{
          console.log('菜单返回')
          console.log(res.data)
          this.menulist=res.data
          const firstmenupath=this.menulist[0].permissionLst[0].urlPath
          this.$router.push(`/${firstmenupath}`)
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
    background-color:rgb(48, 61, 111);
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
    background-color: #fff;
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
    background-color:rgb(48, 61, 111);
    font-size: 25px;
    color: #fff;
    cursor: pointer;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;


  }
  .backfirst{
    cursor: pointer;

  }
  .exit_div{
    /*width: 270px;*/
    height: 40px;
    padding: 5px;
    font-size: 14px;




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
  .exjhg{
    margin-right: 10px;
    cursor: pointer;
  }





</style>
