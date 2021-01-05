<template>
<div class="wrap">
  <el-breadcrumb separator="/" class="bread">
    <el-breadcrumb-item :to="{ path: '/swiper' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>详情页</el-breadcrumb-item>

  </el-breadcrumb>
  <div class="center">
    <div class="center-left">
      <div class="center-left-top">
        <div class="cltkuang">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item,index) in lunboPic" :key="index">
                    <img :src="base2+'/'+item" alt="">
                </div>
            </div>

          </div>
          <!-- 如果需要分页器 -->
          <div class="swiper-pagination"></div>
        </div>
        <div class="xqpics">
          <img src="" alt="" v-for="(item,index) in xqpics">
        </div>
      </div>
      <div class="center-left-bottom">

      </div>

    </div>

  </div>
</div>
</template>

<script>
  import Swiper from 'swiper'
  export default {
    data(){
       return{
         xqpics:[],
         queryid:0,
         lunboPic:[],
         myswiper:[]
       }
    },
    name: 'Swiper-xq',
    created() {
      this.base=this.BASE_URL

      this.base2=this.base_url
      //封面图接口
      this.actionFM=this.base+'/api/main/uploadCoverPic'
      //详情页接口
      this.actionXQ=this.base+'/api/main/uploadPicFile'
      //  源文件接口
      this.actionYWJ=this.base+'/api/main/uploadPdfFile'
    },
    mounted() {
      // console.log(this.$route.query)
        this.queryid=this.$route.query.id
        this.getcarInfo()
    },
    methods:{
      getcarInfo(){
        this.$http.get(`${this.base}/api/car/getcarinfo/${this.queryid}`).then((res)=>{
          console.log(res.data)
          const fmPic=JSON.parse(res.data.coverPic)
          const xqPic=res.data.xqPicArr
          this.lunboPic=xqPic.concat(fmPic)
          console.log(this.lunboPic)



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
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .wrap{
    width: 90%;
    margin: 0 auto;
    padding-top: 20px;

  }
  .bread{
    border-bottom: 1px solid #cccccc;
    padding: 20px;
  }
  .center{
    width: 100%;
  }
.center-left{
  width:350px;

}
  .center-left-top{
    width: 100%;
    height: 200px;
    border: 1px solid #cccccc;

    padding: 10px;
    box-sizing: border-box;
  }
  .swiper-slide{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .swiper-wrapper{
    width: 100%;
    height: 100%;
  }
  .cltkuang{
    width: 100%;
    height: 100%;
  }
  .swiper-container{
    width: 100%;
    height: 100%;
  }
  .swiper-slide img{
    width: 100%;
    height: 100%;
  }


</style>
