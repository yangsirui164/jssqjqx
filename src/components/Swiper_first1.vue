<template>
  <div class="main">
    <div class="swiper_box">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in swiperimg" :key="index"
              >
            <div :class="['swiperzu',item1.imgUrl==''?'opa':'']" v-for="(item1,index1) in item" :key="item1.id"
                 @click="goxq(item1.id,item1.imgUrl)">
              <div class="cheimg">
                <img :src="base2+'/'+item1.imgUrl" alt="" v-if="item1.imgUrl!=''">
              </div>
              <div class="chename">
                {{item1.name}}
              </div>
            </div>
          </div>

        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

        <!-- 如果需要滚动条 -->
        <!--    <div class="swiper-scrollbar"></div>-->
      </div>




    </div>
  </div>
</template>
<script>
  import Swiper from 'swiper'

  export default {

    data(){
      return{
        checked:false,
        //表单登录信息对象
        LoginForm:{
          loginname:'',
          password:''
        },
        swiperimg:[
        ],
        myswiper:'',
        base:'',
        base2:'',
        haha:'elbtnblue',
        menudata:[],
        //表单验证规则对象
        LoginFormRules:{
          loginname:[
            { required: true, message: '请输入登录名称 ', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入登录密码 ', trigger: 'blur' },
            { min: 6, max:15, message: '长度在 6到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created(){

      this.base=this.BASE_URL
      this.base2=this.base_url
      this.getswiper()
      const localloginname=window.localStorage.getItem('loginName')
      const localpwd=window.localStorage.getItem('password')
      if(localloginname&&localpwd){
        this.LoginForm.loginname=localloginname
        this.LoginForm.password=localpwd
      }




    },
    mounted() {

    },
    methods:{

      getswiper(){
        this.$http.get(`${this.base}/api/car/getcarlstbypage`).then((res)=>{
          this.swiperimg=res.data
          for (let i = 0; i <this.swiperimg.length ; i++) {
            if(this.swiperimg[i].length<6){
              const cha=6-this.swiperimg[i].length
              for (let j = 0; j <cha ; j++) {
                const obj={
                  imgUrl:'',
                  id:'j'+j,
                }
                this.swiperimg[i].push(obj)
              }

            }
          }
          this.$nextTick(()=>{
            this.myswiper=new Swiper ('.swiper-container', {
              loop:true,
              observeParents:true,
              observer:true,
              // 如果需要分页器
              pagination: '.swiper-pagination',
              // 如果需要前进后退按钮
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev',
              autoplay : 3000,
              //交互以后是否关闭轮播
              autoplayDisableOnInteraction:false,

              onSlideChangeEnd:function(swiper) {

                swiper.update()

              }



            })
          })


          console.log(this.swiperimg)
        })
      },
      goxq(id,url){
        if(url==''){
          return false
        }else{
          this.$router.push({
            query:{
              id:id
            },
            path:'/swiperxq'
          })
        }

      }
    }
  }
</script>
<style lang="less" scoped>

  .main{
    background: url("../assets/pcbg1.png");
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

  }
  .swiper_box{
    width:85%;
    /*padding: 10px;*/
    box-sizing: border-box;
    background:rgba(255,255,255,.4);
    border-radius: 5px;
  }

  @font-face {
    font-family: "zaozi";
    src:url("../assets/fonts/zaozi.otf");
  }

  .swiperzu{
    width:28%;
    height: 180px;
    background: #E1E1E1;
    display: inline-block;
    margin: 15px 15px;

    border-radius: 3px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-sizing: border-box;


  }
  .swiper-container{
    height:480px;
    width: 100%;
    .swiper-wrapper{
      .swiper-slide{
        padding: 30px;
        width: 100%;
        height: 100%;


        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        /*align-items: center;*/
      }
    }
  }
  .cheimg{
    width: 84%;
    height: 120px;
    border: 1px solid #AEBDC8;
    margin: 0 auto;
    overflow: hidden;

  }
  .cheimg img{
    width: 100%;
    height: 100%;
  }
  .chename{
    width: 100%;
    height: 24px;
    margin-top: 15px;
    line-height: 24px;
    color: white;
    background: url("../assets/titlebg.png");
    padding-left: 16px;
    letter-spacing: .2px;
  }
  .opa{
    opacity: 0;
  }

</style>
