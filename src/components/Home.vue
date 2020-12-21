<template>

    <el-container class="home-container">
      <el-header>
        <div>
          <span>反坦克教室系统</span>
        </div>
        <div class="exit_div" @mouseover="show=true,isf1active=true"  :class="{exit_f1active:isf1active}">
          <div class="exit_f1">
            <div :class="['smicon',isf1active?'el-icon-arrow-down':'el-icon-arrow-up']">
              登录中心
            </div>

          </div>

          <div class="exit_f2" v-if="show">
            <button  @click="backfirst" class="hei">
              <i class="el-icon-back"></i>
              返回首页
            </button>

            <button  @click="logout" class="hei1">
              <i class="el-icon-switch-button"></i>
              退出登录
            </button>
          </div>
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
            <el-submenu :index="item.classId+''" v-for="(item,index) in menulist" :key="item.classId"
            >
              <template slot="title">
                <i :class="iconObj[item.classId]"></i>
                <span>{{item.className}}</span>
              </template>
              <el-menu-item :index="'/'+subitem.urlPath" v-for="subitem in item.permissionLst" :key="subitem.id"
                            @click="saveNavState('/'+subitem.urlPath)">
                <template slot="title">
                  <!--                    <i class="el-icon-menu"></i>-->
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
      base:'',
      active:'',
      loginName:'',
      loginid:'',
      iconObj:{
        //安全管理
        '8':'iconfont icon-icon_User',
        // //系统设置
        '7':'iconfont icon-xitongshezhi',
        //训练管理
        '10':'iconfont icon-jiachang_lianxi',
        //代办
        '6':'iconfont icon-daiban',
        //课件资源
        '5':'iconfont icon-ziyuan',
        //考试
        '4':'iconfont icon-kaoshi',
        //科目
        '3':'iconfont icon-kemu',
        //关系
        '2':'iconfont icon-guanxi',
        '1':'iconfont icon-zhizao',
      },
      show:false,
      isf1active:false,
      isCollapse:false,
      activePath:'',
      menulist:[
        {
        menuid:1,
        iconimg:'iconfont icon-guanxi',
        text:'用户管理',
        child:[{
          text:'学员管理',
          topath:'studentmn'
        },{
          text:'教师管理',
          topath:'teachermn'
        }]
      },
        {
          menuid:2,
        iconimg:'iconfont icon-kemu',
        text:'科目管理',
        child: [
          {
            text:"科目管理",
            topath:'subject'
          }
        ]
      },
        {
         menuid:3,
        iconimg:'iconfont icon-kaoshi',
        text:'考试管理',
        child:[{
          text:"试题库管理",
          topath:'testsmn'
        },{
          text:"试卷管理",
          topath:'papermn'
        },{
          text:"考试管理",
          topath:'taskmn'
        }]
      }
      ]
    }

  },
   created() {
    this.base=this.BASE_URL
     this.loginid=window.sessionStorage.getItem('loginid')
     this.loginName=window.localStorage.getItem('loginName')

     this.getmenuList()
  },
  mounted() {
    document.onclick=()=> {
      console.log('点了')
    this.show=false
    this.isf1active=false

    }

  },
  watch:{
    "$route.path":function(val) {
      console.log('路径变了')
      console.log(val)
      this.activePath=val
    }
  },
  methods:{

    saveNavState(path){
      // 保存导航路径
      window.sessionStorage.setItem('activepath',path)

    },

    mouin(event){
   event.currentTarget.style.background="rgba(0,0,0,.1)"
    },
    mouout(event){
      event.currentTarget.style.background=""
    },
    getmenuList(){
      this.$http.get(`${this.base}/api/Permission/getUserMenu/${this.loginid}`).then(res=>{
        console.log('菜单数据获取')
        console.log(res.data)
        this.menulist=res.data
//  取出第一个
        const firstmenupath=this.menulist[0].permissionLst[0].urlPath


        this.activePath='/'+this.menulist[0].permissionLst[0].urlPath
        this.$router.push(`/${firstmenupath}`)

      }).catch(res=>{
        console.log('获取菜单失败')
      })
    },
    logout(){
      //清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    backfirst(){
      this.$router.push('/first')
    },
    toggleCollapse(){
    //  展开与折叠
      this.isCollapse=!this.isCollapse

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
  .exit_div{
    width: 150px;
    height: 40px;
    border-radius: 3px;
    padding: 5px;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    transition:all .4s;







    >.exit_f3{
      width: 150px;
      height: 35px;
      position: absolute;
      top: 180%;
      left: 8%;
      background-color:white;
      box-shadow:0 2px 1px rgba(0,0,0,0.3) ;
      border-radius: 5px;
      border: none;
      color: black;
      cursor: pointer;
    }



  }
.exit_f1active{
  background-color: rgba(255,255,255,0.4);

}

.Anim{
  transform: rotate(-90deg);
  transition: .4s;
  }
  .ouseuin{
    background: rgba(0,0,0,.2);
  }

.exit_f2{
  z-index: 1000;
  width: 150px;
  position: absolute;
  top: 100%;
  left: 0;
  background-color:white;
  box-shadow:0 2px 1px rgba(0,0,0,0.3) ;
  border-radius: 5px;
  border: none;
  color: black;
  cursor: pointer;
}
.hei,.hei1{
  width: 100%;
  height: 40px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
.hei:hover{
  background: rgba(102, 113, 149,.4);
}
.hei1:hover{
  background: rgba(102, 113, 149,.4);
}
.exit_f1{
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  padding: 5px;
  box-sizing: border-box;
  justify-content: center;
  /*background: red;*/



}
.userif{
  display: inline-block;
  text-align: center;
  margin-right: 5px;
  >p{
    margin: 5px;

  }
}
.elbtn_img{
  border-radius: 3px;
  width: 35px;
  height: 35px;
  display: inline-block;
}

</style>
