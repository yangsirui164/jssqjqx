<template>
  <div>
    <div class="wrap1">
      <header class="bigheader">
        <div class="smallheader">
          <div class="centerheader">
            <div class="centerheaderleft">
              欢迎,登录反坦克教室系统！
            </div>
            <div class="centerheaderright" @click="loginstudent" v-show="!isquie">
              <i class="el-icon-user"></i>
              <span>登录</span>
            </div>
            <div class="centerheaderright" @click="logout" v-show="isquie">
              <i class="el-icon-switch-button"></i>
              <span>退出登录</span>
            </div>
          </div>
        </div>
        <div class="hdceter">
          <div class="title">欢迎，登录反坦克教室系统</div>
          <div class="smaltitle1">
            VR虚拟现实系统采用人机交互的方式进行装备仿真模拟操作，具有对四连站某型航空
            电源车进行演示、分解、提示、指导、实操等功能。
          </div>
          <div class="smaltitle2">
            让受训人员进入虚拟现实环境，实时感知和操作虚拟环境中的各种装设备，
            从而通过视觉、触觉和听觉等获得身临其境的真实感受。
          </div>
        </div>


        <div id="wrap2">
          <div class="smw">
            <div class="kuang">
              <img src="../../assets/shouye.png" alt="" class="smpic">
            </div>
            <h3>首页
              <span class="badge dba1"></span>
            </h3>

          </div>

          <div class="smw">
            <div class="kuang" @click="studyye">
              <img src="../../assets/zyxuexi.png" alt="" class="smpic">
            </div>
            <h3>课件资源学习
              <span class="badge dba1"></span>
            </h3>

          </div>
          <div class="smw">
            <div class="kuang" @click="$router.push('/fmtask')">
              <img src="../../assets/kaoshi2.png" alt="" class="smpic">
            </div>

            <h3>模拟考试
              <span class="badge dba2"></span>
            </h3>

          </div>
          <div class="smw">
            <div class="kuang" @click="geren">
              <img src="../../assets/geren.png" alt="" class="smpic">
            </div>
            <h3>个人中心
              <span class="badge dba3"></span>
            </h3>

          </div>
        </div>
      </header>
      <div class="container">
        <el-card class="cardhg">
          <!--        <div class="cardheader">-->
          <!--          -->
          <!--        </div>-->
          <div class="detailis">
            <h2>{{sourceslist.title}}</h2>
            <h4>作者:{{sourceslist.author}}</h4>
            <h4>发布日期:{{sourceslist.publishDate}}</h4>
          </div>
          <div class="showfiles">
            <div class="fuwenben">

            </div>
            <!--  图片显示-->
            <div class="imagesshow" v-show="isimages">
              <img  :src="base2+item" alt="" v-for="(item,index) in sourceslist.picFileArr" class="showimgs"
              >
            </div>


            <div class="pdfsshow" v-show="ispdfs">
              <!--        pdf显示-->
              <embed :src="base2+item" type="application/pdf" class="diapdf"
                     v-for="(item,index) in sourceslist.pdfFileArr">
            </div>

            <div class="videoshow" v-show="isvideos">
              <!--        video显示-->
              <video :src="base2+item"
                     controls="controls"
                     v-for="(item,index) in sourceslist.videoFileArr">

              </video>
            </div>
            <div class="downloadarea" v-if="ishj">
              <h4>课件资源下载</h4>
              <div class="dowladaea" v-for="(item,index) in sourceslist.sourceFileArr">
                <span>{{item}}</span>
                <a class="downloadbtn" download target="_blank"
                   :href="base2+item">下载</a>
              </div>
            </div>



          </div>

        </el-card>
      </div>
      <footer class="wrap1footer">
        <div class="jhg">
          <span>服务协议|</span>
          <span>关于我们|</span>
          <span>联系我们</span>
        </div>
        <div>
          COPYRIGHT@2020反坦克教室平台
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
        ishj:true,
        downloadarr:[],
        subjectarr:[],
        subjectId:'',
        isquie:false,
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
        gonggaoarr:[],
        tabs:["教学文件学习","教学视频学习"],
        types:['426电源车','30电源车'],
        tabnum:0,
        // tabMain:['内容1','内容2','内容3']
        //默认426电源车
        typenum:0,
        total:0,
        queryInfo:{
          //资源类
          value1:0,
          //课程类
          value2:'',
          value3:'',
          pagenum:1,
          pagesize:1
        },
        sourceslist:{
          title:'',
          author:'',
          contents:'',
          publishDate:'',
          picFileArr:[],
          sourceFileArr:[],
          viewFileObject:{

          }
        },
        //默认服务器地址
        baseurl:'http://192.168.1.15:8003/',
        isimages:false,
        ispdfs:false,
        isvideos:false,
        base:'',
        base2:''

      }
    },
    created() {
      this.base=this.BASE_URL
      this.base2=this.base_url+'/'
      this.loginid=window.sessionStorage.getItem('loginid')
      this.loginName=window.localStorage.getItem('loginName')
      if(this.loginid){
        //  已登录
        this.isquie=true
      }else{
        this.isquie=false
      }


    },
    mounted() {
      const sourceid=this.$route.query.params
      this.getSourceslist(sourceid)
    },
    methods:{
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
      logout(){
        window.sessionStorage.removeItem('loginid')
        this.$router.push('/login')
      },
      formaltask(){
        this.$router.push('/fmtask')
      },
      practice(){
        this.$router.push('/practice')
      },
      downloadfunc(item){

      },
      getSourceslist(id){
        const fuwenben=document.querySelector(".fuwenben")
        this.$http.get(`${this.base}/api/Resource/getResource/${id}`).then(res=>{
          console.log('返回资源')
          console.log(res.data)
          this.$route.meta.title=res.data.title
          if(res.data.contents){
            //富文本内容
            fuwenben.innerHTML=res.data.contents
          }
          this.sourceslist=res.data
          const picFileArr=res.data.viewFileObject.picFileArr
          // console.log('1111')
          // console.log(picFileArr)
          if(picFileArr.length!=0){
            this.isimages=true
            this.sourceslist.picFileArr=picFileArr
          }
          const pdfFileArr=res.data.viewFileObject.pdfFileArr
          if(pdfFileArr.length!=0){
            //有pdf
            this.ispdfs=true
            this.sourceslist.pdfFileArr=pdfFileArr
          }

          const videoFileArr=res.data.viewFileObject.videoFileArr
          if(videoFileArr.length!=0){
            //有视频
            this.isvideos=true
            this.sourceslist.videoFileArr=videoFileArr
            this.ishj=false
          }else{
            this.ishj=true
          }

          // const sourceleArr=res.data.sourceFileArr
          //
          // sourceleArr.forEach((item)=>{
          //   const sourceindex=item.indexOf('source\\')
          //   const newstr=item.substr(sourceindex)
          //   this.downloadarr.push(newstr)
          // })
          // console.log('下载数组名')
          // console.log(this.downloadarr)


        }).catch(res=>{
        console.log(res)
        })
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


    }
  }
</script>

<style lang="less" scoped>
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


  .bigheader{
    width: 100%;
    height:550px;
    background: url("../../assets/pcbg1.png");
    background-position: center;
    background-size:100% 100%;
    position: relative;
    text-align: center;
  }
  .smallheader{
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: rgb(38, 57, 100);
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
  .hdceter{
    width:750px;
    margin:115px auto 0;
    text-align: center;
  }
  .centerheaderright{
    cursor: pointer;
  }

  .bottomheader{
    position: absolute;
    bottom: -30px;
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
    width:1480px;
    /*height: 355px;*/
    overflow: hidden;
    padding-top: 70px;
    margin:150px auto 0;
    background: rgb(245,247,250);
  }
  .cardhg{
    height:100%;
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
  .zaozinls{
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
    float: right;
    width:75%;
    margin-left: 5%;
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
    padding-bottom: 8px;
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
  .cttab{
    float: left;
    width: 20%;

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
  .diapdf{
    width: 100%;
    height: 450px;
  }
  .detailis{
    width: 100%;
    text-align: center;
  }
  .detailis h1{
    color: #404040;
    font-size: 22px;
  }
  .detailis h4{
    color: darkgray;
    font-size: 12px;
    font-weight: 500;
    margin: 12px 0;
  }
  .imagesshow{
    width:100%;
  }
  .imagesshow img{
   width: 400px;
    display: block;
    margin: 10px auto;
  }
  .pdfsshow{
    width:100%;
  }
  .videoshow{
    width:1000px;
    margin:0 auto;
    >video{
      width: 100%;
      margin-bottom: 20px;
    }
  }
  .fuwenben{
    width:100%;
    text-align: center;
  }

  .downloadbtn{

  }
  .downloadarea{
    width:100%;
    margin:10px auto;
  }
  .dowladaea{
    width:100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    box-sizing: border-box;
    /*border-bottom: 1px solid lightgray;*/

  }
  .downloadarea .dowladaea:nth-child(odd){
    background: rgba(211,211,211,0.4);
  }
  .dowladaea span{
    color: dimgray;
  }
  .downloadbtn{
    width: 75px;
    height: 25px;
    background: none;
    border-radius: 3px;
    border: 1px solid cornflowerblue;
    color: cornflowerblue;
    cursor: pointer;
    text-align: center;
    line-height: 25px;
    text-decoration: none;
  }
  .downloadbtn:hover{
    background: cornflowerblue;
    color: white;
    transition: all .3s;
  }
  .imagesshow{
    text-align: center;
  }
  .showimgs{
    max-width: 355px !important;
  }
  #wrap2{
    position: absolute;
    width: 1480px;
    bottom: -180px;

    left: 50%;
    margin-left: -740px;
    height: 300px;
    display: flex;
    justify-content: space-around;
  }
  .smw{
    width: 320px;
    height: 100%;
    background: white;
    box-shadow: 0px 1px 10px rgba(0,0,0,0.5);
    border: 3px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 20px;
  }
  .smpic{
    width: 100%;
    transition: all .7s;
  }
  .smpic:hover{
    transform: scale(1.3);
    transition: .7s;
  }
  .kuang{
    width: 86%;
    overflow: hidden;
    cursor: pointer;
  }
  .smw h3{
    font-size: 22px;
    margin-top: 20px;
  }

  .title{
    font-size: 3em;
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



</style>
