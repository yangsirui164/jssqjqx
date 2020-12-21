<template>
  <div class="mingh1">
    <el-card>
      <el-row :gutter="21">
        <el-col :span="6">
          <span class="smallspan">考试时间:</span>
          <el-date-picker
            v-model="queryInfo.value7"
            type="daterange"
            size="mini"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd">
          </el-date-picker>

        </el-col>
        <el-col :span="4">
          <span class="smallspan">科目名称:</span>
          <el-cascader
            size="mini"
            placeholder="请选择"
            v-model="cascadervalue"
            :options="options"
            @change="handleChange"
            :props="defaultProps"
            class="singleel_input"
          ></el-cascader>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="chaxun" size="mini">
            查询
          </el-button>
          <el-button type="info" @click="resetquery" size="mini">
            重置
          </el-button>
        </el-col>
      </el-row>
      <el-row class="actionel">
        <el-button type="primary" @click="daochu1"
                   size="mini" >导出</el-button>

      </el-row>

      <!--          用户table-->
      <el-table
        border
        stripe
        :data="userlist"
        style="width: 100%"

        ref="multipleTable1"
        :row-key="getRowKeys"
        class="studenttable"

      >
        <!--        添加索引-->
        <el-table-column type="index" label="序号"
        >
          <template slot-scope="scope"><span>{{scope.$index+(queryInfo.pagenum-1)*(queryInfo.pagesize)+1}}</span></template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="考试开始时间"

        >
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="考试结束时间"

        >
        </el-table-column>

        <el-table-column
          prop="title"
          label="考试名称"

        >
        </el-table-column>
        <el-table-column
          prop="subjectIdTxt"
          label="科目名称">
        </el-table-column>



        <el-table-column
          prop="remark"
          label="状态">
          <template slot-scope="scope">
                <span v-if="scope.row.state==0">
                  <span style="width: 8px;height: 8px;border-radius: 4px;
                  background: green;display: inline-block;margin-right: 3px">
                  </span>
                  <span>未开始</span>
                </span>
            <span v-else-if="scope.row.state==1">
                  <span style="width: 8px;height: 8px;border-radius: 8px;
                  background: red;display: inline-block;margin-right: 3px">

                  </span>考试中</span>
            <span v-else="scope.row.state==2">
                  <span style="width: 8px;height: 8px;border-radius: 8px;
                  background: gray;display: inline-block;margin-right: 3px">

                  </span>已结束</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="score"
          label="成绩(分)"
          width="155px"
        >
        </el-table-column>

      </el-table>

      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10,15,20]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

  </div>
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    data(){
      var checkSex=(rule,value,callback)=>{
        if(this.addform.sex==''){
          return callback(new Error('请选择性别'));
        }

        return callback()
      }

      var checkPassword=(rule,value,callback)=>{
        if(value==''){
          return callback(new Error('请再次输入密码'));
        }
        if(this.passwordform.password1!=value){
          return callback(new Error('两次输入密码不一致!'));
        }
        return callback()
      }
      //自定义验证邮箱
      var checkEmail=(rule,value,callback)=>{
        const regEmail=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(!value){
          //邮箱可以为空
          return callback()
        }
        if(regEmail.test(value)){
          return  callback()

        }
        return callback(new Error('请输入合法邮箱'))



      }

      //自定义校验手机号规则
      var checkMobile=(rule,value,callback)=>{
        const regMobile=/^[1][3,4,5,7,8,9][0-9]{9}$/
        // console.log(value)
        if(!value){
          //电话号可以为空
          return callback()
        }else{
          if(regMobile.test(value)){
            return  callback()
          }
          return callback(new Error('请输入正确手机号'))
        }

      }
      var checkPersonCode=(rule,value,callback)=>{
        const Regpersoncode=/^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
        if(Regpersoncode.test(value)){
          return callback()
        }
        return callback(new Error('请输入合法身份证号码'))
      }
      return{
        getRowKeys(row) {
          return row.id
        },
        ischange:false,
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        defaultProps:{
          label:'lable',
          value:'id'
        },
        //transfer数据源
        transferData:[],
        checkList:[],
        editform1:{
          studentCode:'',
          realName:'',
          remark:'',
          nativeArr:[],
          phone:'',
          email:'',
          sex:''


        },

        datepicker:'',
        options2:[{
          value: '0',
          label: '批量删除'
        },
          {
            value: '1',
            label: '批量启动'
          },
          {
            value: '2',
            label: '批量停用'
          },
          {
            value:'3',
            label: '导出表格'
          }

        ],
        options:[],
        cascadervalue2:[],
        cascadervalue:[],
        hahhaha:'',//修改密码
        passworddiavisible:false,
        setpowervisible:false,
        sels: [],//选中的值显示
        //  获取用户列表的参数
        queryInfo:{
          //查询参数  可为空
          //考试时间
          value7:[],
          //科目名称
          value2:'',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:10
        },
        queryInfo2:{
          username:'',
          name:''
        },
        userlist:[],
        total:0,
        sexmodel:[],
        sexoption:[
          {
            value: '0',
            label: '男'
          },
          {
            value: '1',
            label: '女'
          }
        ],
        leveloption:[
          {
            value: '0',
            label: '初级'
          },
          {
            value: '1',
            label: '中级'
          },
          {
            value: '2',
            label: '高级'
          }

        ],
        //用户对话狂
        addialogvisible:false,
        editalogvisible:false,

        jobselect2:'',
        sexselect2:'',
        subectteacher2:'',
        datepicker2:'',
        addform:{
          //   //文件的数组
          //   pics:[],
          realName:'',
          // teacherCode:'',
          phone:'',
          // idCode:'',
          sex:"",
          studentCode:'',
          nativeArr:[],
          remark:'',
          email:'',
          gradeId:0




        },
        levelmodel:[],
        editform:{
          id:''
        },
        headerobj:{
          // Authorization:window.sessionStorage.getItem('token')
        },
        passwordform:{
          password1:'',
          password2:''
        },
        userinfo:{

        },
        subectteacher:'',
        passwordformrules:{
          password1:[
            {required:true,message:'请输入修改密码',trigger:'blur'},
            {min:3,max:9,message:'长度在3到9之间',trigger:'blur'},
            // {validator:oncePassword,trigger:'blur'}
          ],
          password2:[
            {required:true,message:'请输入修改密码',trigger:'blur'},
            {validator:checkPassword,trigger: 'blur'}
          ]
        },
        checkList1:[],
        jiguan:'',
        upload:"",


        setrolelogvisible:false,
        roleslist:{

        },
        grademodel2:'',
        selectedroleid:'',
        grademodel:'',
        jiguanProps:{
          value:'areaId',
          label:'areaName',
          children:'child'
        },
        loginid:'',
        jiguan2:'',
        base:''


      }
    },


    watch:{
      "sels":function(newval) {
        // console.log('监控')
        if(newval.length==1){
          this.isedit=false
        }else{
          this.isedit=true
        }

      },
      datepicker:function(val) {
        // console.log(val)
      }

    },
    created() {
      this.base=this.BASE_URL
      this.loginid=parseInt(window.sessionStorage.getItem('loginid'))
      //  获取所有科目
      this.getsubjectList()
      //分页查询
      this.getUserlist()

    },
    methods:{

      handg4(val){
        this.editform1.gradeId=val[0]
      },
      jiguanchange(val){
        //新增的籍贯
        this.addform.nativeArr=val
      },
      jiguanchange2(val){
        //籍贯选择
      },
      handg3(val){
        this.addform.gradeId=val[0]
      },

      handleChange(val){
        console.log('选择变化')
        console.log(val)
        this.queryInfo.value2=val[0]
      },

      getsubjectList(){
        this.$http.get(`${this.base}/api/Subject/getAllSubject`).then(res=>{
          console.log('获取所有科目')
          console.log(res.data)
          this.options=res.data[0].children
        }).catch(res=>{
          console.log("获取所有科目失败")
        })
      },
      daochu1(){
        this.queryInfo.pagenum=1
        this.queryInfo.pagesize=this.total
        this.getUserlist()
        //批量导出
        const that=this
        setTimeout(function() {
          that.daochu()
        },111)
      },
      daochu(){
        // 批量导出
        /* generate workbook object from table */
        let wb = XLSX.utils.table_to_book(document.querySelector(
          '.studenttable'));
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '学员成绩表.xlsx');
        } catch (e)
        {
          if (typeof console !== 'undefined')
            console.log(e, wbout)
        }
        return wbout

      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },




      chaxun(){
        this.queryInfo.pagenum=1
        this.getUserlist()
      },
      getUserlist(){
        console.log(this.queryInfo)
        // console.log('我给的')
        // console.log(this.queryInfo)
        if(this.queryInfo.value2){

        }
        this.$http.post(`${this.base}/api/student/getStudentScoreByPage/${this.loginid}`,this.queryInfo).then(res=>{
          console.log('获取table信息')
          console.log(res.data)
          this.userlist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取学生列表失败")
        })

      },

      //监听每页？条数据  的事件
      handleSizeChange(val){
        // console.log(val)
        this.queryInfo.pagesize=val
        this.getUserlist()
      },
      //监听页码值改变的事件
      handleCurrentChange(val){
        // console.log(val)
        this.queryInfo.pagenum=val
        this.getUserlist()
      },

      resetquery(){
        //重置按钮事件
        this.queryInfo={
          //查询参数  可为空
          //考试时间
          value7:[],
            //科目名称
            value2:'',
            //当前页码值
            pagenum:1,
            //每页显示条数
            pagesize:10
        },
        this.cascadervalue=''
        this.getUserlist()


      }
    }

  }
</script>
<style lang="less" scoped>
  .ghg{

    float: left !important;
  }
  .actionel{
    margin-top: 20px;

  }
  .cell span{
    color: blue;
    cursor: pointer;
  }
  .singleel_input{
    width:165px !important;
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

  .casc{
    margin-left: 15px;
  }
  .el-upload__tip{
    line-height: 14px !important;
  }
  .addformclas{
    .el-form-item{
      margin-bottom: 12px;
    }

  }
  .mingh1{
    min-width: 1800px;
  }
  .gh{
    width: 195px !important;
  }
</style>
