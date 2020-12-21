<template>
  <div>
<el-card class="elcard">
  <h1>恭喜您</h1>
  <h3 class="title">您的得分是:<span class="hred">{{score}}分</span></h3>
  <el-button type="primary" @click="backfirst">返回首页</el-button>
</el-card>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        score:0
      }
    },
    mounted() {
    this.score=this.$route.query.score

    },
    watch: {},
    methods: {
      backfirst(){
        this.$router.push('/first')
      }
    }

  }
</script>
<style scoped>
  html,body{
    font-family: '微软雅黑';
  }
.elcard{
  text-align: center;
}
 .title{
   color: dimgray;
   font-size: 20px;
   /*margin: 0 auto;*/
 }
  .hred{
    color: red;
  }


</style>
