<template>
  <div>
    <div class="wrap1">
      <header class="bigheader">
        <div class="smallheader">
          <div class="centerheader">
            <div class="centerheaderleft">
              欢迎,登录学员教学辅助平台！
            </div>
            <div class="centerheaderright" @click="loginstudent" v-show="!isquie">
              <i class="el-icon-user"></i>
              <span>登录</span>
            </div>
            <div class="centerheaderright" @click="loginstudent" v-show="isquie">
              <i class="el-icon-switch-button"></i>
              <span>退出登录</span>
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
                 @click="shouye"
            >
            <p>首页</p>
          </div>
          <div class="headerblock">
            <img :src="p2" alt=""  @mouseover="p2=pic23" @mouseout="p2=pic22"
                 @click="studyye">
            <p>课件资源</p>
          </div>
          <!--          <div class="headerblock">-->
          <!--            <img :src="p3" alt=""  @mouseover="p3=p32" @mouseout="p3=p31">-->
          <!--            <p>VR模拟在线学习</p>-->
          <!--          </div>-->
          <div class="headerblock">
            <img :src="p42" alt="">
            <p>模拟训练</p>
          </div>
          <div class="headerblock">
            <img :src="p5" alt="" @mouseover="p5=p52" @mouseout="p5=p51"
                 @click="formaltask"
            >
            <p>在线考试</p>
          </div>
          <div class="headerblock">
            <img :src="p6" alt="" @mouseover="p6=p62" @mouseout="p6=p61"
                 @click="geren()">
            <p>个人中心</p>
          </div>

        </div>




      </header>
      <div class="container">
        <div v-if="iskaoshi=='0'" class="haskaoshi">
          <div class="notask">您当前暂无考试信息,请登录!</div>
        </div>
        <div v-if="iskaoshi=='1'" class="haskaoshi">
          <span>考试科目:</span>
          <el-cascader
            :options="options"
            :props="subjectProps"
            v-model="subjarr"
            clearable
            class="formhj"
          >
          </el-cascader>
          <el-button type="primary" class="ghfaa" @click="gomonitask">进入模拟考试</el-button>

        </div>

      </div>
      <footer class="wrap1footer">
        <div class="jhg">
          <span>服务协议|</span>
          <span>关于我们|</span>
          <span>联系我们</span>
        </div>
        <div>
          COPYRIGHT@2020空军勤务学院
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
        options:[],
        elbtn:'',
        btndis:false,
        isprepare:false,
        ingkaoshi:'',
        isquie:false,
        subjectarr:[],
        subjectId:'',
        isloged:'',
        searchdata:'',
        p1:'/static/home.png',
        pic11:'/static/home.png',
        pic12:'/static/homecopy.png',
        p2:'/static/xuexi.png',
        pic22:'/static/xuexi.png',
        pic23:'/static/xuexicopy.png',
        p3:'/static/VRD.png',
        p31:'/static/VRD.png',
        p32:'/static/VRDcopy.png',
        p4:'/static/kaoshi.png',
        p41:'/static/kaoshi.png',
        p42:'/static/kaoshicopy.png',
        p5:'/static/shenqing.png',
        p51:'/static/shenqing.png',
        p52:'/static/shenqingcopy.png',
        p6:'/static/man.png',
        p61:'/static/man.png',
        p62:'/static/mancopy.png',
        gonggaoarr:[],
        timer2:null,
        tabs:["教学文件学习","教学视频学习"],
        types:['426电源车','30电源车'],
        tabnum:0,
        overtime:false,
        // tabMain:['内容1','内容2','内容3']
        //默认426电源车
        typenum:0,
        total:0,
        nowTime:'',
        iskaoshi:'0',
        leftTime:'',
        queryInfo:{
          //资源类
          value1:0,
          //课程类
          value2:'',
          value3:'',
          pagenum:1,
          pagesize:1
        },
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        kaoshiform:{
          title:'这是一个考试',
          time:'33分钟'
        },
        subjarr:[],
        logintype:'',
        timer1:null,
        m:0,
        s:0

      }
    },
    created() {
      this.loginid=window.sessionStorage.getItem('loginid')
      this.loginName=window.localStorage.getItem('loginName')
      this.logintype=window.sessionStorage.getItem('type')

      if(this.loginid){
        console.log('有id')
        //  登录header
        this.isquie=true
        this.iskaoshi='1'
      }else{
        this.isquie=false
        this.iskaoshi='0'
      }

      this.getsubjectList()
    },
    beforeDestroy() {
      clearInterval(this.timer1)
      clearInterval(this.timer2)
      this.timer1=null
      this.timer2=null
    },
    watch:{

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
      gomonitask(){
       this.$http.post('api/Test/getTestPaper',this.subjarr).then(res=>{
          console.log('获取卷纸')
         console.log(res.data)
         window.sessionStorage.setItem('practiceobj',JSON.stringify(res.data))
         this.$router.push('/pratask')
       }).catch(res=>{
         console.log('')
       })

      },
      getsubjectList(){
        this.$http.get('api/Subject/getAllSubject').then(res=>{
          console.log('获取所有科目')
          console.log(res.data)
          this.options=res.data[0].children
        }).catch(res=>{
          console.log("获取所有科目失败")
        })
      },
      formaltask(){
        this.$router.push('/fmtask')
      },

      geren(){
        const logintype=this.logintype
        if(logintype==''){
          this.$message.warning('暂时无法访问个人中心')
        }else if(logintype=='1'){
          this.$router.push('/studenthome')
        }else if(logintype=='0'){
          this.$router.push('/home')
        }

      },
      gettaskinfo(){

      },
      tab(index){
        // 切换
        this.tabnum=index
        this.queryInfo.value1=index
      },
      tabtypes(index){
        this.queryInfo.value2=index
      },
      shouye(){
        this.$router.push('/first')
      },
      studyye(){
        this.$router.push('/firststudy')
      },
      loginstudent(){
        //  登录
        this.$router.push('/login')
      },
      mainsearch(data){
        console.log('监听')
      },

      hrefgonggao(id){
        console.log('id在这里')
        console.log(id)
        this.$router.push({
          path:'/opensources',
          query:{
            params:id
          }
        })
      },
      slecfunc($event,item){
        console.log('change了')
        console.log(item)
        this.queryInfo.pagenum=1
        this.getGongao()

      }
    }
  }
</script>

<style lang="less" scoped>
  html,body{
    font-family:'微软雅黑';
  }
  .wrap1{
    min-width: 830px;
    background: rgb(245,247,250);

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
    height:450px;
    background: url("../assets/pcbg1.png");
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
    margin:30px auto 0;
    background: rgb(245,247,250);


  }
  .dimgray{
    color: dimgray;

  }
  .newsleft{
    float: right;
    width:100%;
    box-shadow:0 1px 1px lightgray;
    background: white;
    padding: 20px;
    box-sizing: border-box;
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
    padding-bottom:8px;
    width: 100%;
    /*height: 75px;*/
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
  .cttab1{
    width: 100%;
    height: 40px;
    background: darkgrey;
    color: darkslategray;
    text-align: center;
    line-height: 40px;
    margin-bottom: 15px;
    cursor: pointer;
  }
  .activetab{
    background: cornflowerblue;
    color: white;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin-bottom: 15px;
    cursor: pointer;
  }
  .normalbtn{
    width: 90px;
    height: 25px;
    border-radius: 3px;
    border: 1px solid cornflowerblue;
    color: cornflowerblue;
    margin-left: 8px;
    background: white;
  }
  .btnactive{
    width:  90px;
    height: 25px;
    border-radius: 3px;
    border: 1px solid cornflowerblue;
    color: white;
    background: cornflowerblue;
    margin-left: 8px;
  }
  .sles{
    width: 70px;
    height: 25px;
    border-radius: 4px;
    border: 1px solid cornflowerblue;
  }
  .notask{
    padding: 20px;
    color:cornflowerblue;
    font-size: 20px;
  }

  .crosstime{
    padding:8px;
    color: dimgray;
    font-size: 16px;
    /*color: red;*/
  }
  .crosstime1{
    padding:10px;
    color: red;
    font-size: 18px;
  }
  .title1{
    padding-bottom: 15px;
    color: dimgray;
    /*font-weight: bolder;*/
  }
  .elbtn{
    width:155px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 16px;

  }
  .formhj{
    width: 50%;
  }
  .ghfaa{
    margin-left: 20px;
  }
</style>
