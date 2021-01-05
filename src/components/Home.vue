<template>

    <el-container class="home-container">
      <el-header>

          <span class="tilte">抢修辅助决策系统</span>

        <div class="centitle">
          <div :class='{"cen1":true,"cen1hover":nowactive==1}' @click="tab($event,1)"
         >
            <img src="../assets/icon1.png" alt="">
          <span>首页</span></div>
          <div  class="cen1" @click="tab($event,2)" :class='{"cen1":true,"cen1hover":nowactive==2}'>
            <img src="../assets/icon2.png" alt="">
          <span>抢修方案</span></div>
          <div class="cen1"  @click="tab($event,3)" :class='{"cen1":true,"cen1hover":nowactive==3}'>
            <img src="../assets/icon3.png" alt="">
            <span>历史记录</span>
          </div>
          <div class="cen1"  @click="tab($event,4)" :class='{"cen1":true,"cen1hover":nowactive==4}'>
            <img src="../assets/icon4.png" alt="">
            <span>用户管理</span>
          </div>
        </div>

        <div class="qiehuan">
          <img src="../assets/qiehuan.png" alt="">
          <span>切换账号</span>
        </div>

      </el-header>
      <el-container class="mainbody">
        <router-view></router-view>
      </el-container>
    </el-container>


</template>
<script>
export default{
  data(){
    return{
      nowactive:1,
      base:'',
      active:'',
      loginName:'',
      loginid:'',
      isCollapse:false,
      activePath:''
    }

  },
   created() {
    this.base=this.BASE_URL
     this.loginid=window.sessionStorage.getItem('loginid')
     this.loginName=window.localStorage.getItem('loginName')

     const nowpath=this.$route.path
     if(nowpath=='/swiper1'){
           this.nowactive=1
         }else if (nowpath=='/qxfan'){
           this.nowactive=2
         }else if(nowpath=='/history'){
           this.nowactive=3
         }else if(nowpath=='/users'){
           this.nowactive=4
         }else if(nowpath=='/swiperxq'){
          this.nowactive=0
     }




  },
  watch:{
    "$route.path":function(val) {
      this.activePath=val
      if(val=='/swiper1'){
        this.nowactive=1
      }else if (val=='/qxfan'){
        this.nowactive=2
      }else if(val=='/history'){
        this.nowactive=3
      }else if(val=='/users'){
        this.nowactive=4
      }else if(val=='/swiperxq'){
        this.nowactive=0
      }
    }
  },
  methods:{
    tab(e,index){
   // console.log(e)
    if(this.nowactive==index){
       return false
    }
      if(index==1){
        this.$router.push('/swiper1')
      }else if(index==2){
        this.$router.push('/qxfan')
      }else if (index==3){
        this.$router.push('/history')
      }
      this.nowactive=index
      // console.log(this.nowactive)
    },
    logout(){
      //清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    backfirst(){
      this.$router.push('/swiper1')
    },

  }
}
</script>
<style lang="less" scoped>
  @font-face {
    font-family: "zaozi";
    src:url("../assets/fonts/zaozi.otf");
  }
  .el-header{
    width: 100%;
    background-color:rgb(18, 45, 66);
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    align-items: center;



}
  .centitle{
    display: flex;
    color: rgb(191, 224, 250);



  }
  .cen1{

    margin: 0 8px;
    background: rgb(12, 37, 56);
    /*background: rgba(255,255,255,.1);*/
    border-radius: 4px;
    padding:4px 8px;
    display: flex;
    align-items: center;

  }
  .cen1hover{
    background: rgba(255,255,255,.1);
  }

  .qiehuan{
    display: flex;
    align-items: center;
  }
  .qiehuan span{
    color: white;
    margin-left: 10px;
  }
  .cen1 span{
    margin-left: 10px;
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
  .tilte{
   font-family: "zaozi";
    color: rgb(191, 224, 250);
    letter-spacing: 2px;
    font-size: 20px;
  }

</style>
