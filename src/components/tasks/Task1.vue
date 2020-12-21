<template>
  <div class="main" v-cloak>
  <div v-if="istasked" class="istakesd">
     <h1>您已经完成考试,请退出</h1>
  <el-button type="primary" @click="tuichu" class="eljhg">退出</el-button>
    </div>
 <div class="test_main" v-if="!istasked">
   <div class="nr_left">
     <div class="test">
       <div class="test_title">
         <p class="test_time">
           <span>{{this.h}}时</span>
           <span>{{this.m}}分</span>
           <span>{{this.s}}秒</span>

         </p>
         <div class="fg">
        <input type="button" name="test_jiaojuan" value="交卷" class="jiaojuan"
        @click="jiaojuan()">
         </div>
       </div>
       <div class="test_content">
         <div class="test_content_title">
           <h2>单选题</h2>
           <p>
             <span>共</span><i class="content_lit">{{singleform.length}}</i><span>题，</span><span>合计</span><i class="content_fs">{{totalsingle}}</i><span>分</span>
           </p>
         </div>
       </div>

       <div class="test_content_nr">
         <ul>
           <li v-for="(item,index) in singleform" :key="item.id" :id="'qu_0_'+index">
<!--             单选题目内容-->
             <div class="test_content_nr_tt">
               <i>{{index+1}}</i><span>({{item.score}}分)</span>{{item.contents}}
             </div>

             <!--                 单选答案-->
             <div class="test_content_nr_main">
<!--               <el-radio-group v-model="checkList0" :key="index" class="checkboxgroup">-->
<!--                 <el-radio v-for="(item2,index2) in item.answerArr" :label="index2"-->
<!--                              class="checkbb"-->
<!--                 :key="index2">-->
<!--                   {{xxArr[index2]+item2}}-->
<!--                 </el-radio>-->
<!--               </el-radio-group>-->
               <ul>
                 <li class="option" v-for="(item2,index2) in item.answerArr">
                   <input type="radio" class="radioOrCheck"
                          :name='"radio"+index'
                          :value="item.id+'_'+index2"
                          @click="checfun1"
                   />
                   <label>
                     {{xxArr[index2]}}
                     <p class="ue" style="display: inline;">{{item2}}</p>
                   </label>
                 </li>
               </ul>
             </div>
           </li>
         </ul>
       </div>


       <div class="test_content">
         <div class="test_content_title">
           <h2>多选题</h2>
           <p>
             <span>共</span><i class="content_lit">{{moreform.length}}</i><span>题，</span><span>合计</span><i class="content_fs">{{totalmore}}</i><span>分</span>
           </p>
         </div>
       </div>
       <div class="test_content_nr">
         <ul>
           <li :id="'qu_1_'+index" v-for="(item,index) in moreform" :key="item.id">
             <div class="test_content_nr_tt">
               <i>{{index+1}}</i><span>({{item.score}}分)</span>{{item.contents}}
             </div>
<!--多选答案-->
             <div class="test_content_nr_main">
               <el-checkbox-group v-model="checkList" :key="index" class="checkboxgroup">
                 <el-checkbox v-for="(item2,index2) in item.answerArr" :label="item.id+'_'+index2"
                 class="checkbb"
                 @change="checfun"
                 :key="index2">
                   {{xxArr[index2]+item2}}
                 </el-checkbox>
               </el-checkbox-group>
<!--               <ul>-->
<!--                 <li class="option" v-for="(item2,index2) in item.answerArr" :key="index2">-->
<!--                   <input type="checkbox" class="radioOrCheck" :name='"check"+index'-->
<!--                          :value="item.id+'_'+index2"-->
<!--                          @click="checfun2"-->
<!--                   />-->
<!--                   <label>-->
<!--                     {{xxArr[index2]}}-->
<!--                     <p class="ue" style="display: inline;">{{item2}}</p>-->
<!--                   </label>-->
<!--                 </li>-->
<!--               </ul>-->

             </div>
           </li>

         </ul>
       </div>
     </div>

   </div>




   <div class="nr_right">
     <div class="nr_rt_main">
       <div class="rt_nr1">
         <div class="rt_nr1_title">
           <h1>
             答题卡
           </h1>
         </div>

         <div class="rt_content">
           <div class="rt_content_tt">
             <h2>单选题</h2>
             <p>
               <span>共</span><i class="content_lit">{{singleform.length}}</i><span>题</span>
             </p>
           </div>
           <div class="rt_content_nr answerSheet">
             <ul>
               <li v-for="(item,index) in singleform" class="danxuan22" :id="item.id">
                 <a :href="'#qu_0_'+index">{{index+1}}</a>
               </li>
             </ul>
           </div>
         </div>

         <div class="rt_content">
           <div class="rt_content_tt">
             <h2>多选题</h2>
             <p>
               <span>共</span><i class="content_lit">30</i><span>题</span>
             </p>
           </div>
           <div class="rt_content_nr answerSheet">
             <ul>

               <li v-for="(item,index) in moreform" class="duoxuan22" :id="item.id">
                 <a :href="'#qu_1_'+index">{{index+1}}</a>
               </li>


             </ul>
           </div>
         </div>
       </div>

     </div>
   </div>




 </div>
<!--    <el-dialog-->
<!--      title="提示"-->
<!--      :visible.sync="editalogvisible"-->
<!--      :showClose="false"-->
<!--      :close-on-click-modal="false"-->
<!--    >-->
<!--      <h2 style="color: red">考试时间结束,请退出考试</h2>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--      <el-button type="primary" @click="tuichu" class="hgja">退出考试</el-button>-->
<!--  </span>-->
<!--    </el-dialog>-->
  </div>

</template>
<script>
  export default{
  data(){
    return{
      istasked:false,
      duoxuan22:'',
      danxuans:'',
      timer2:null,
      addform:{

      },
      base:'',
      overtime:false,
      sgform:{
        haha:[]
      },
      mrform:{

      },
      xxArr:['A.','B.','C.','D.','E.','F.','G.','H','I','J'],
      totalsingle:0,
      totalmore:0,
     queryInfo:{

      },
      backform:{

      },
      singleform:{

      },
      moreform:{

      },
      singlearr:[],
      checkList:[],
      checkList0:[],
      qianduan:'',
      qianduan0:'',
      houduan0:'',
      houduan:'',
      chongfu:false,
      bjgarr:[],
      leftTime:'',
      nowTime:'',
      timer2:null,
      m:'',
      h:'',
      s:'',
      editalogvisible:false


    }
  },

    created() {
      this.base=this.BASE_URL
      this.queryInfo=this.$route.query
      this.getTaskInfo()
    },
    mounted() {



    },
    beforeDestroy() {
     clearInterval(this.timer2)
     this.timer2=null
    },

    watch:{

    },
    methods:{
      tuichu(){
        this.$router.push('/first')
      },
      countTime(){
        //时间差

        this.leftTime = this.leftTime-1000;
        //定义变量 d,h,m,s保存倒计时的时间
        if (this.leftTime >0) {
          this.h = Math.floor(this.leftTime / 1000 / 60 / 60 % 24);
          this.m = Math.floor(this.leftTime / 1000 / 60 % 60);
          this.s = Math.floor(this.leftTime / 1000 % 60);
          //递归每秒调用countTime方法，显示动态时间效果
          // this.timer2=setTimeout(this.countTime, 1000);
        }else if(this.leftTime <=0){
        // this.editalogvisible=true
          this.overtime=true
          this.sendAnswer()
        }
      },
      checfun2(){
        // console.log(event.target.getAttribute('value'))
        // const checkvalue0=event.target.getAttribute('value')
        // const bzindex0=checkvalue0.indexOf('_')
        // this.qianduan0=checkvalue0.substring(0,bzindex0)
        // this.houduan0=checkvalue0.substr(bzindex0+1)

      },
      checfun(){

        this.bjgarr=[]
        // console.log('多选答案')
        // console.log(this.checkList)
        this.checkList.forEach((item,index)=>{
          var zjindex=item.indexOf('_')
          var qianduan1=item.substring(0,zjindex)
          var houduan1=item.substr(zjindex+1)
          var obj={
            id:qianduan1,
            value2:[houduan1]

          }
          this.bjgarr.push(obj)
        })
        var linshi=[]
        for (var i=0;i<this.bjgarr.length;i++) {
          var linshiindex=linshi.indexOf(this.bjgarr[i].id)
          if(linshiindex!=-1){
            var chongfuindex=this.bjgarr.findIndex((item)=>{
              return item.id==linshi[linshiindex]
            })
            this.bjgarr[chongfuindex].value2.push(this.bjgarr[i].value2[0])

            this.bjgarr.splice(i,1);
            i--
          }else{
            linshi.push(this.bjgarr[i].id)
          }
        }
        // console.log(linshi)
        console.log(this.bjgarr)


        this.duoxuan22=document.querySelectorAll('.duoxuan22')
        console.log(this.duoxuan22)
        for (var i=0;i<this.duoxuan22.length;i++){
          this.duoxuan22[i].style.background="white"
        }

        var duoxuanle=[]
        this.bjgarr.forEach((item,index)=>{
          duoxuanle.push(item.id)
        })

        duoxuanle.forEach((item,index)=>{
          var dom1=document.getElementById(item)
          console.log('dommmmm')
          console.log(dom1)
          dom1.style.background="#303D6F"
        })

      },
      checfun1(){
        console.log('点了')
        const checkvalue=event.target.getAttribute('value')
        const bzindex=checkvalue.indexOf('_')
        this.qianduan=checkvalue.substring(0,bzindex)
        this.houduan=checkvalue.substr(bzindex+1)
        if(this.singlearr.length==0){
          this.singlearr.push({
            id:this.qianduan,
            value1:this.houduan
          })
        }else{
          this.chongfu=false
          this.singlearr.forEach((item,index)=>{
            if(item.id==this.qianduan){
              this.chongfu=true
              // console.log('相等的')
              item.value1=this.houduan
            }
          })
          if(!this.chongfu){
            this.singlearr.push({
              id:this.qianduan,
              value1:this.houduan
            })

          }
        }
        console.log(this.singlearr)


        // 单选是否选中
        this.danxuans=document.querySelectorAll('.danxuan22')
        console.log(this.danxuans)
        for (var i=0;i<this.danxuans.length;i++){
          this.danxuans[i].style.background="white"

        }
        var danxuanle=[]
        this.singlearr.forEach((item,index)=>{
          danxuanle.push(item.id)
        })
        console.log(danxuanle)
        danxuanle.forEach((item,index)=>{
          var dom=document.getElementById(item)
          console.log('dommmmm')
          console.log(dom)
          dom.style.background="#303D6F"
        })



      },
      sendAnswer(){
        this.addform.singleCheck=this.singlearr
        this.addform.moreCheck=this.bjgarr
        this.$http.post(`${this.base}/api/test/getStudentScore`,this.addform).then(
          res=>{
            console.log(res.data)
            this.$router.replace({
              path:'/backscore',
              query:{
                score:res.data
              }
            })
          }
        ).catch(res=>{
          console.log('提交试卷失败')
        })
      },
      jiaojuan(){
        this.addform.singleCheck=this.singlearr
        this.addform.moreCheck=this.bjgarr
         console.log(this.addform)
        this.$confirm('您将要提交试卷, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.sendAnswer()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交试卷'
          });
        });

      },
      getTaskInfo(){
        this.$http.get(`${this.base}/api/Test/getStudentTest/${this.queryInfo.ksid}/${this.queryInfo.loginid}`).then(res=>{
          console.log('获取试卷信息')
          console.log(res.data)

          this.backform=res.data
          this.addform.testStudentId=res.data.testStudentId
          this.singleform=res.data.singelCheck
          this.moreform=res.data.moreCheck
          this.nowTime=res.data.nowTime
          var date = new Date(this.nowTime);
          this.endTime=res.data.endTime
          var now = date.getTime();


          var endDate = new Date(this.endTime);
          var end = endDate.getTime();
          this.leftTime=end-now;
         console.log('lefttime')
          console.log(this.leftTime)
          this.timer2=setInterval(()=>{
            this.countTime()
          },1000)


          //单选题总分数
          var totalsinglescore=0
          this.singleform.forEach((item,index)=>{
            totalsinglescore=totalsinglescore+item.score
          })
          this.totalsingle=totalsinglescore
          //  多选题总分数
          var totalmorescore=0
          this.moreform.forEach((item,index)=>{
            totalmorescore=totalmorescore+item.score
          })
          this.totalmore=totalmorescore
                   }).catch(res=>{
          console.log('获取试卷信息失败')
        })
      }
    }
  }
</script>
<style scoped>
@import "../../assets/css/main1.css";
@import "../../assets/css/test.css";
  .checkbb{
    display: block;
    font-size: 22px !important;

  }
  .test_time{
    color: red;
    font-size: 18px;
  }
  .istakesd{
    width: 100%;
    height: 100%;
    padding-top: 150px;
    text-align: center;

  }
  .istakesd h1{
    color: red;
    margin-bottom: 20px;

  }
  .eljhg{
    width: 120px;
    height: 35px;
  }
  [v-cloak]{
    display: none;
  }


</style>
