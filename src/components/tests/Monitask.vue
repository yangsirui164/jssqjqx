<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试管理</el-breadcrumb-item>
      <el-breadcrumb-item>模拟考试配置管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="xlxq">模拟考试配置管理</div>
      <el-form :model="addform"  ref="addFormRef"
               class="addformclas1"
               :rules="addformrules"
      >
          <el-form-item label="单选题数:" label-width="115px"  prop="singleNum">
            <el-input class="duan" size="mini" v-model.number="addform.singleNum"></el-input><span>题</span>
            <span style="margin-left: 15px">题库题数:{{singlenumber}}</span>
          </el-form-item>
        <el-form-item label="多选题数:" label-width="115px"  prop="moreNum" class="mstop">
          <el-input class="duan" size="mini" v-model.number="addform.moreNum"></el-input><span>题</span>
          <span style="margin-left: 15px">题库题数:{{morenumber}}</span>
        </el-form-item>
        <el-form-item label="总分数:" label-width="115px" prop="score" class="mstop">
          <el-input class="duan" size="mini" v-model.number="addform.score"></el-input><span>分</span>
        </el-form-item>
        <el-form-item label="模拟考试时长:" label-width="115px"  prop="time" class="mstop">
          <el-input class="duan" size="mini" v-model.number="addform.time"></el-input><span>分钟</span>
        </el-form-item>
        <el-row>
          <el-col :offset="14">
            <el-button  type="info" @click="quxiao">取消</el-button>
            <el-button  type="primary" @click="saveedit">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

  </div>
</template>
<script>
  export default {
    data(){
      var singleCheck=(rule,value,callback)=>{
        console.log(typeof(value))
        if(value>this.singlenumber){
          return callback(new Error('超出题库数量'));
        }
        return callback()
      }

      var moreCheck=(rule,value,callback)=>{
        if(value>this.morenumber){
          return callback(new Error('超出题库数量'));
        }
        return callback()
      }
      return{
        addformrules:{
          singleNum:[
            { required: true, message: '请输入单选题数', trigger: 'blur' },
            { type: 'number', message: '请输入数字', trigger: 'blur'},
            {validator:singleCheck, trigger: 'blur'}
          ],
          moreNum:[
            { required: true, message: '请输入多选题数', trigger: 'blur' },
            { type: 'number', message: '请输入数字', trigger: 'blur'},
            {validator:moreCheck, trigger: 'blur'}
          ],
          score:[
            { required: true, message: '请输入总分数', trigger: 'blur' },
            {type:'number',message: '请输入数字',trigger: 'blur'}
          ],
          time:[
            { required: true, message: '请输入考试时长', trigger: 'blur' },
            {type:'number',message: '请输入数字',trigger: 'blur'}
          ],
        },
        singlenumber:0,
        morenumber:0,
        addform:{
          singleNum:0,
          moreNum:0,
          score:0,
          time:0
        },


      }
    },
    created() {
      this.getinfo()
      this.getTestCount()
    },

    methods:{
      getTestCount(){
        this.$http.post('api/Topic/getTopicNum',[]).then(res=>{
          this.singlenumber=res.data[0]
          this.morenumber=res.data[1]

        })
      },
      getinfo(){
        this.$http.get('api/TestValue/getTestValue').then(res=>{

          console.log('获取成功')
          console.log(res.data)
          this.addform=res.data
        }).catch(res=>{
          console.log('获取失败')
        })
      },
      saveedit(){
        //保存
        this.$refs.addFormRef.validate(valid=>{
          if(!valid){
            return
          }

          this.$http.post('api/TestValue/updateTestValue',this.addform).then(res=>{

            if(res.data=='Ok'){
              this.$message.success('保存成功')
            }
          }).catch(res=>{
            console.log('保存失败')
          })
        })

      },
      quxiao(){
        this.getinfo()

      }
    }

  }
</script>
<style lang="less" scoped>
  .actionel{
    margin-top: 20px;
  }
  .cell span{
    color: blue;
    cursor: pointer;
  }

  .leftdia{
    float: left;
  }
  .rightdia{
    margin-left: auto;
    float: right;

  }
  .sexclass{
    width: 55px;

  }
  .fuwenben img{
    width: 55px;
  }
  .casc{
    margin-left: 15px;
  }
  .el-upload__tip{
    line-height: 14px !important;
  }
  .addformclas1{
    overflow: hidden;
    .el-row{
      /*margin-bottom:15px !important;*/
    }
    .el-form-item{
      margin-bottom: 12px;
    }

  }
  .sles{
    width: 185px;
    height: 30px;
    border-radius: 3px;
    /*color:rgb(195,199,218);*/
    border: 1px solid rgb(195,199,218);
    font-size: 12px;
    outline: none;
  }
  .ctratetime{
    width: 105px !important;
  }
  .diacontent{
    width: 80%;
    max-width:550px;
  }
  .diq{
    text-align: center;
  }
  .diapdf{
    width: 100%;
    height: 850px;
  }
  .smal{
    width: 185px !important;
  }
  .contentcla{
    margin-top: 15px;
  }
  .botmcard{
    margin-top: 15px;
  }
  .addbutton{
    width: 100%;
    height: 35px;
    border: 1px dashed gray;
    text-align: center;
    align-items: center;
  }
  .smallcheck{
    display: inline-block;
    vertical-align: middle;
  }
  .savestyle{
    margin-top: 15px;

  }
  .mgtop{
    margin-top: 20px;
  }
  .singl{
    /*width: 340px !important;*/
  }

  .jkh{
    width: 115px;
    height: 40px;
    display: inline-block;
    line-height: 40px;
    padding-left: 10px;
    font-size: 14px;
    color: red;
  }
  .hddd{
    width: 100%;
  }
  .copy{
    border: 1px solid #DCDFE6;
    border-radius: 8px;
    padding: 10px;
  }
  .overclass{
    background:blue;
    height: 40px;
    cursor:pointer;
    margin-bottom: 10px;
  }
  .nooverclass{
    height: 40px;
    cursor:pointer;
    background: white;
    margin-bottom: 10px;
  }
  .hweg{
    cursor:pointer;
  }
  .overclass2{
    height: 40px;
    cursor:pointer;
    background: red;
    margin-bottom: 10px;
    cursor:pointer;
  }
  .bao{

    overflow: hidden;
    padding-bottom: 12px;
  }

  .mofang{
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 115px;
  }
  .suiyi{
    width:150px;
  }
  .stdenttable{
    min-width:960px;
  }
  .xlxq{
    width: 100%;
    font-size: 24px;
    padding: 20px;
    border-bottom: 3px solid #DCDFE6 ;
    margin-bottom: 20px;
  }
  .ovfl{
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  .duan{
    width: 100px;
  }

  .mstop{
    margin-top: 20px;
  }
</style>
