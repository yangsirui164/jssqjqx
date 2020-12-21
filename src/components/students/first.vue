<template>
  <div>
  <div class="wrap1">
    <header class="bigheader">
      <div class="smallheader">
    <div class="centerheader">
      <div class="centerheaderleft">
        欢迎,登录学员教学辅助平台！
      </div>
      <div class="centerheaderright" @click="loginstudent">
           <i class="el-icon-user"></i>
        <span>登录</span>
      </div>
    </div>
      </div>
      <div class="hdceter">
        <div class="title">欢迎，登录学员教学辅助平台</div>
        <div class="smaltitle1">
          VR虚拟现实系统采用人机交互的方式进行装备仿真模拟操作，具有对四连站某型航空
          电源车进行演示、分解、提示、指导、实操等功能。
        </div>
        <div class="smaltitle2">
          让受训人员进入虚拟现实环境，实时感知和操作虚拟环境中的各种装设备，
          从而通过视觉、触觉和听觉等获得身临其境的真实感受。
        </div>
        <el-input placeholder="请输入课件/教学科目名称" class="pcsearch"
                  v-model="searchdata" suffix-icon="el-icon-search"
                  @keyup.enter.native="mainsearch">
        </el-input>
      </div>
      <div class="bottomheader">

        <div class="headerblock">
          <img :src="p1" alt=""
         @mouseover="p1=pic12" @mouseout="p1=pic11"
          >
          <p>首页</p>
        </div>
        <div class="headerblock">
          <img :src="p2" alt=""  @mouseover="p2=pic23" @mouseout="p2=pic22">
          <p>教学课件学习</p>
        </div>
        <div class="headerblock">
          <img :src="p3" alt=""  @mouseover="p3=p32" @mouseout="p3=p31">
          <p>VR模拟在线学习</p>
        </div>
        <div class="headerblock">
          <img :src="p4" alt="" @mouseover="p4=p42" @mouseout="p4=p41">
          <p>模拟考试</p>
        </div>
        <div class="headerblock">
          <img :src="p5" alt="" @mouseover="p5=p52" @mouseout="p5=p51">
          <p>模拟训练申请</p>
        </div>
        <div class="headerblock">
          <img :src="p6" alt="" @mouseover="p6=p62" @mouseout="p6=p61">
          <p>个人中心</p>
        </div>

      </div>




    </header>
    <div class="container">
      <div class="newsleft">
        <div class="newsleft1">
								<span>
									通知公告
								</span>
          <img src="../../assets/arrow.png" alt="" />
        </div>
<!--        最新公告-->
        <div class="newsleft2">
          <div class="smalleft3" v-for="(item,index) in gonggaoarr"
          :key="index" @click="hrefgonggao(item.id)">
            <div class="smalleft31"></div>
            <div class="smalleft32">
             {{item.title}}

            </div>
            <div class="smalleft33">{{item.date}}</div>
          </div>
          </div>

        </div>
      <div class="newsright">
        <div class="newsleft1">
								<span>
									课程计划
								</span>
          <img src="../../assets/arrow.png" alt="" />
        </div>
        <!--        最新公告-->
        <div class="newsleft2">
          <div class="smallef3">
             <div class="disleveltop">
               <div class="smalleft31"></div>
              <span class="smle">426电源车训练1供电操作</span>
               <span class="smri">426电源车</span>
             </div>
              <div class="dislevelbot">
               <span class="fispan">上课时间：2111-11-11 11:11:11</span>
                <span>上课班级:1311</span>
                <span>授课老师:张文</span>
              </div>
          </div>

        </div>

      </div>
      </div>
    <footer class="wrap1footer">
      <div class="jhg">
        <span>服务协议|</span>
        <span>关于我们|</span>
        <span>联系我们</span>
      </div>
      <div>
        COPYRIGHT@2020空军情务学院
      </div>
      <div>
        技术支持:中国科学院沈阳计算研究所有限公司
      </div>
    </footer>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      searchdata:'',
      p1:'../../static/home.png',
      pic11:'../../static/home.png',
      pic12:'../../static/homecopy.png',
      p2:'../../static/xuexi.png',
      pic22:'../../static/xuexi.png',
      pic23:'../../static/xuexicopy.png',
      p3:'../../static/VRD.png',
      p31:'../../static/VRD.png',
      p32:'../../static/VRDcopy.png',
      p4:'../../static/kaoshi.png',
      p41:'../../static/kaoshi.png',
      p42:'../../static/kaoshicopy.png',
      p5:'../../static/shenqing.png',
      p51:'../../static/shenqing.png',
      p52:'../../static/shenqingcopy.png',
      p6:'../../static/man.png',
      p61:'../../static/man.png',
      p62:'../../static/mancopy.png',
      gonggaoarr:[]
    }
  },
  created() {
    this.getGongao()
  },
  mounted() {
    const searchicon=document.querySelector(".el-icon-search")
    const headerblock=document.querySelector('.headerblock')
    var that=this
    searchicon.onclick=function() {
    that.mainsearch(that.searchdata)
    }


  },
  methods:{
    loginstudent(){
    //  登录
      this.$router.push('/login')
    },
    mainsearch(data){
   console.log('监听')
    },
    getGongao(){
      this.$http.get('',res=>{
        console.log(res.data)
        this.gonggaoarr=res.data
      })
    },
    hrefgonggao(id){

    }
  }
}
</script>
<style>
  html,body{
    font-family: '微软雅黑';
  }
  .wrap1{
    min-width: 830px;
    background: rgb(245,247,250);

  }
  *{
    margin:0;
    padding: 0;

  }
  @font-face {
    font-family: "zaozi";
    src:url("../../assets/fonts/zaozi.otf");
  }
  header{
    width: 100%;
    height: 425px;
    min-height: 255px;

  }
  .hdceter{
    width:750px;
    margin:115px auto 0;
    text-align: center;
  }
  .headerimg{
    width: 100%;

  }
  .bigheader{
    background: url("../../assets/pcbg1.png");
    background-position: center;
    background-size:100% 100%;
  position: relative;
  }
  .smallheader{
    /*position: absolute;*/
    /*top:0;*/
    /*left:0;*/
    width: 100%;

    height: 28px;
    line-height: 28px;
    background: rgba(10,104,171,0.6);
  }
  .centerheader{
    width:70%;
    margin:0 auto;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color:white;
    align-items: center;
  }
  .pcsearch{
    width:466px;
    height: 35px;




  }
  .pcsearch .el-input__inner{
    border-radius: 35px;
    background-color: rgba(3,19,42,.6);
    color: white;
  }
  .centerheaderright{
    cursor: pointer;
  }
  .title{
    font-size: 1.9em;
    color: white;
    margin-bottom: 25px;
  }
  .smaltitle1{
   font-size: .5em;
    color: white;
    margin-bottom: 15px;
  }
  .smaltitle2{
   font-size: .5em;
    color: white;
    margin-bottom: 35px;
  }
  .bottomheader{
    position: absolute;
    bottom: -50px;
    height:100px;
    width:850px;
    background: white;
    box-shadow:0 3px 3px rgba(0,0,0,.2) ;
    border-radius: 10px;
    left: 50%;
    margin-left: -425px;
    text-align: center;
  }
  .headerblock{
    /*background: red;*/
    width: 16%;
    height: 100%;
    display: inline-block;
    padding: 7px 5px 5px 5px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .headerblock img{
    width: 55%;
  }
  .headerblock p{
    font-size: 14px;
    color:dimgray;
  }
  .container{
    width:850px;
    height: 355px;
    overflow: hidden;
    padding-top: 75px;
    margin:0 auto;
    background: rgb(245,247,250);
  }

  .smalleft3{
    width:100%;
    display: flex;
    align-items: center;
    margin-top:6px ;
    cursor: pointer;
    /*justify-content: space-between;*/

    overflow: hidden;

  }
  .smallef3{
    width:100%;
    margin-top:6px ;
    cursor: pointer;
    /*justify-content: space-between;*/


  }
  .newsleft1{
    width: 100%;
    height: 35px;
    border-bottom: 1px solid rgb(193,193,193);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .newsleft1 img{
    width: 15px;
    height: 15px;
    margin-top: -10px;
  }
  .newsleft1 span{
    font-family: "zaozi";
    color: rgb(0,138,234);
    font-size: 24px;
    border-bottom:1px solid rgb(0,138,234);
    /*padding-bottom: 8px;*/
    box-sizing: border-box;
    display: block;
    height: 100%;
  }
.newsleft{
  float: left;
  width:420px;
  /*height: 100%;*/
  /*border: 1px solid lightgray;*/
  box-shadow:0 1px 1px lightgray;
  background: white;
  padding: 20px;
  box-sizing: border-box;
}
.newsright{
  float: right;
  width:420px;
  /*height: 100%;*/
  /*border: 1px solid lightgray;*/
  box-shadow:0 1px 1px lightgray;
  background: white;
  padding: 20px;
  box-sizing: border-box;
}
  .smalleft32{
    width: 55%;
    color: grey;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-left: 10px;
    float: left;
  }
  .smalleft33{
    color: rgb(152,152,152);
    font-size: 12px;
    /*margin-left: 10px;*/
    margin-left: auto;
    float: right;
  }
  .smalleft31{
    width: 5px;
    height: 5px;
    background:rgb(0,138,234);
    float: left;
  }
  .disleveltop{
    overflow: hidden;
    width: 100%;
    color: grey;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
  .disleveltop .smalleft31{
    float: left;
  }
  .dislevelbot{
    width:100%;
    color: rgb(152,152,152);
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
  .smle{
    margin-left: 10px;
  }
  .smri{
    margin-left: auto;
    float: right;
  }
  .fispan{
    margin-left: 10px;
  }
  .wrap1footer{
    padding-top: 12px;
    width: 100%;
    height: 75px;
    background: rgb(235,238,240);
    font-size: 12px;
    color: grey;
    text-align: center;

  }
  .wrap1footer div{
    margin-bottom: 8px;
  }
  .jhg span{
    cursor: pointer;
  }

</style>
