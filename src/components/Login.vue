<template>
  <div class="login_container">
   <div class="login_box">
         <img src="/static/loginbk2.png" alt="" class="loginbk2">
         <div class="posi">
           <!--登录表单区域-->
           <el-form ref="loginFormRef" class="login_form" :model="LoginForm" :rules="LoginFormRules">
             <el-form-item  prop="loginname">
               <el-input prefix-icon="iconfont icon-icon_User" v-model="LoginForm.loginname"
               placeholder="请输入用户名"
               class="login_input2"></el-input>
             </el-form-item>
             <el-form-item prop="password">
               <el-input prefix-icon="iconfont icon-mima" v-model="LoginForm.password"
                         type="password" placeholder="请输入密码"
               class="login_input2"></el-input>
             </el-form-item>
             <el-row class="btns">
               <input type="checkbox" id="checkbox" v-model="checked"
              >
               <label for="checkbox" class="remen">记住密码</label>
               <button @click.prevent="login"
                @mouseover="haha='elbtnwhite'"
               @mouseout="haha='elbtnblue'"
               :class="haha">立即登录</button>

             </el-row>
           </el-form>
         </div>






   </div>
  </div>
</template>
<script>
  export default {
   data(){
     return{
       checked:false,
       //表单登录信息对象
       LoginForm:{
         loginname:'',
         password:''
       },
       base:'',
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
   const localloginname=window.localStorage.getItem('loginName')
    const localpwd=window.localStorage.getItem('password')
      if(localloginname&&localpwd){
        this.LoginForm.loginname=localloginname
        this.LoginForm.password=localpwd
      }

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

         this.$http.post(`${this.base}/api/user/login`,this.LoginForm).then(res=>{
           console.log("菜单数据")
           console.log(res.data)

           if(res.data.result=="Ok"){
             const loginid=res.data.data.id

             console.log(loginid)
             //是否记住密码
               if(this.checked){

                   window.localStorage.setItem("password",this.LoginForm.password)
               }else if(!this.checked){
                 window.localStorage.removeItem("password")
               }
             window.localStorage.setItem("loginName",this.LoginForm.loginname)
             window.sessionStorage.setItem('loginid',loginid)
        if(res.data.type=='0'){
          console.log('是0啊')
          window.sessionStorage.setItem("type",'0')
          this.$router.push('/home')
        }else if(res.data.type=='1'){

          window.sessionStorage.setItem("type",'1')
          this.$router.push('/first')
        }





           }else{
             this.$message.error('登录信息错误')
             return
           }
           //获取菜单数组
           // console.log(this.$root.hub)
           // this.menudata=res.data
           //  this.$root.hub.$emit('tom-event',res.data)
           // this.$router.push('/home')
         })





       })
      }
    }
  }
</script>
<style lang="less" scoped>

.login_container{
 background: url("/static/loginbk.png");
  width: 100%;
  height: 100%;
  /*background-position: center;*/
  background-repeat: no-repeat;
  background-size: 100% 100%;
   display: flex;
  align-items: center;
  justify-content: center;
  /*min-width: 950px;*/
}
@font-face {
  font-family: "zaozi";
  src:url("../assets/fonts/zaozi.otf");
}
.posi{
  width: 80%;
  height: 100%;
  /*margin: 300px auto 0;*/
  margin: 0 auto;
  padding: 40px 10px 0;
  box-sizing: border-box;
}
  .login_box {
    width: 540px;
    height: 600px;
    position: relative;
    box-sizing: border-box;
    padding-top: 300px;

  }
  .bigp{
    font-family:"zaozi";
    color: rgb(17,120,207);
    font-size: 30px;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  .loginbk2{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
  }

  .login_form{
    width: 100%;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    align-items: center;
    overflow: hidden;

  input{
    width: 30px;
    height: 30px;


  }
    /*justify-content:flex-end;*/
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
.login_input2{
  width: 100%;

}
  .elbtnblue{
    width:200px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(48, 61, 111);
    color: white;
    border: none;
    float: right;
    margin-left: auto;
    border-radius: 3px;
    cursor: pointer;
    outline: none;
    transition: background-color .3s;

  }
  .remen{
    color: black;
    font-size: 18px;
    margin-left: 10px;

  }
  .elbtnwhite{
    width:200px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(48, 61, 111,.7);
    color: white;
    border: none;
    float: right;
    margin-left: auto;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color .3s;
    outline: none;
  }
  @media only screen and  (max-width:865px){
     .login_box{
       width: 480px;
       height: 550px;
     }
    .bigp{
      font-size: 18px;
    }
    .elbtnblue{
      width:200px;
      height: 35px;
      font-size: 8px;
    }
    .elbtnwhite{
      width:200px;
      height: 35px;
      font-size: 8px;
    }

  }
</style>
