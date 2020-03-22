<template>
  <div class="login_container">
   <div class="login_box">
       <div class="avatar_box">
         <img src="../assets/logo.png" alt="">
       </div>



<!--登录表单区域-->
     <el-form label-width="80px" ref="loginFormRef" class="login_form" :model="LoginForm" :rules="LoginFormRules">
     <el-form-item label="用户名" prop="loginname">
       <el-input prefix-icon="iconfont icon-user" v-model="LoginForm.loginname"></el-input>
     </el-form-item>

       <el-form-item label="密码" prop="password">
         <el-input prefix-icon="iconfont icon-3702mima" v-model="LoginForm.password"
      type="password"></el-input>
       </el-form-item>


       <el-form-item class="btns">
         <el-button type="primary" @click="login">登录</el-button>
         <el-button type="info" @click="resetLofinForm">重置</el-button>
       </el-form-item>
     </el-form>



   </div>
  </div>
</template>
<script>
  export default {
   data(){
     return{
       //表单登录信息对象
       LoginForm:{
         loginName:'admin',
         password:'12345678'
       },
       menudata:[],
       //表单验证规则对象
       LoginFormRules:{
         loginname:[
           { required: true, message: '请输入登录名称 ', trigger: 'blur' },
           { min: 3, max:10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
         ],
         password:[
           { required: true, message: '请输入登录密码 ', trigger: 'blur' },
           { min: 6, max:15, message: '长度在 6到 15 个字符', trigger: 'blur' }
         ]
       }
     }
   },
    created(){
      // this.$http.get('/api/user/getalluser').then(res=>{
      //   console.log(res)
      // },res=>{
      //   console.log('失败')
      // })

    },
    methods:{

     //重置登录表单函数
      resetLofinForm(){
       //重置验证
       this.$refs.loginFormRef.resetFields()
     },
      login(){

       //预校验
       this.$refs.loginFormRef.validate(valid=>{
            //参数预校验的结果
            // console.log(valid)
         if(!valid)  return;
         this.$http.post("api/user/login",this.LoginForm).then(res=>{
           console.log("菜单数据")
           if(res.data.result=="OK"){
             const loginid=res.data.data.id
             console.log(loginid)
             window.sessionStorage.setItem('loginid',loginid)

           }else{
             this.$message.error('登录信息错误')
             return
           }
           //获取菜单数组
           // console.log(this.$root.hub)
           // this.menudata=res.data
           //  this.$root.hub.$emit('tom-event',res.data)

         }).catch(res=>{
           console.log('登录失败')
         })
         this.$message.success('登录成功')

         // window.sessionStorage.setItem('token',res.data.token)
       //通过编程式导航跳转到后台主页,  路由地址是home
         this.$router.push('/home')



       })
      }
    }
  }
</script>
<style lang="less" scoped>
.login_container{
  background-color:#2b4b6b;
  height: 100%;
}
  .login_box{
    width: 450px;
    height:300px;
    background-color: #fff;
    border-radius:3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);


    .avatar_box{
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius:50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      /*left: 50%;*/
      /*transform: translate(-50%,-50%);*/
      background-color: #fff;
      /*transition: all 1s;*/
      left:244px;
      top: -284px;
      animation: fly 2s linear;
      -webkit-animation:fly 1.3s linear;
      -moz-animation:fly 1.3s linear;
      -o-animation:fly 1.3s linear;
      animation-fill-mode: forwards;
      /*transform-style: preserve-3d;*/
      /*perspective: 400px;*/
      img{
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }

    }

  }
  .login_form{
    position: absolute;
    bottom:0;
    width: 80%;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content:flex-end;
  }
  @keyframes fly {
    0%{
       left:244px;
       top: -284px;
}
    /*10% {left:144px; top: -184px;}*/
    /*20%{left:-115px;top:-145px;transform: scale(1.1)}*/
    /*30%{left:-155px;top:-95px}*/
    /*40% {left:-115px;top:-45px;transform:scale(1.4)}*/
    40%{left:-195px;top:-15px}
    100%{left:0px;top:200px;transform:scale(1.5)}
  }

</style>
