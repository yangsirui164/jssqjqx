<template>
  <div class="mingh1">
    <el-card>
      <el-row :gutter="21">
        <el-col :span="6">
          <!--  clearable可清空-->
          <span class="smallspan">标题:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1"
                    class="singleel_input"
                    size="mini"
                    clearable></el-input>

        </el-col>
        <el-col :span="6">
          <span class="smallspan">创建时间:</span>
          <el-date-picker
            size="mini"
            v-model="queryInfo.value2"
            type="date"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            class="ctratetime"
          >
          </el-date-picker>
        </el-col>

        <el-col :span="6">
          <el-button type="primary" @click="chaxun" size="mini">
            查询
          </el-button>
          <el-button type="info" @click="resetquery" size="mini">
            重置
          </el-button>
        </el-col>
      </el-row>
      <el-row class="actionel">
        <el-button type="primary" @click="xinzeng"
                   size="mini">新增</el-button>
        <el-button @click="piliangdelete"
                   :disabled="this.sels.length === 0"
                   size="mini">批量删除</el-button>
        <el-button @click="piliangpush"
                   :disabled="this.sels.length === 0"
                   size="mini">批量发布</el-button>
        <el-button @click="piliangpull"
                   :disabled="this.sels.length === 0"
                   size="mini">批量撤回发布</el-button>

      </el-row>
      <!--          用户table-->
      <el-table
        border
        stripe
        :data="tasklist"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        ref="multipleTable1"
        :row-key="getRowKeys"

      >
        <el-table-column type="selection"  :reserve-selection="true">

        </el-table-column>
        <!--        添加索引-->
        <el-table-column type="index" label="序号"
        >
          <template slot-scope="scope"><span>{{scope.$index+(queryInfo.pagenum-1)*(queryInfo.pagesize)+1}}</span></template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="165px"
        >
        </el-table-column>
        <el-table-column
          prop="gradeIdTxt"
          label="班级"
          width="155px"
        >
        </el-table-column>
        <el-table-column
          prop="paperIdTxt"
          label="试卷"
          width="155px"
        >
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
          prop="statues"
          label="发布状态">
          <template slot-scope="scope">
                <span v-if="scope.row.state==true">
                  <span style="width: 8px;height: 8px;border-radius: 4px;
                  background: green;display: inline-block;margin-right: 3px">
                  </span>
                  <span>已发布</span>
                </span>
            <span v-else="scope.row.state==false">
                  <span style="width: 8px;height: 8px;border-radius: 8px;
                  background: red;display: inline-block;margin-right: 3px">

                  </span>
              <span>未发布</span>
              </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="testState"
          label="考试状态">
          <template slot-scope="scope">
                <span v-if="scope.row.testState==0">
                  <span style="width: 8px;height: 8px;border-radius: 4px;
                  background: green;display: inline-block;margin-right: 3px">
                  </span>
                  <span>未开始</span>
                </span>

            <span v-if="scope.row.testState==1">
                  <span style="width: 8px;height: 8px;border-radius: 8px;
                  background: red;display: inline-block;margin-right: 3px">
                  </span>
                 <span>考试中</span>
              </span>

            <span v-if="scope.row.testState==2">
                  <span style="width: 8px;height: 8px;border-radius: 8px;
                  background:gray;display: inline-block;margin-right: 3px">

                  </span>
                 <span>已结束</span>
              </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">

            <span @click="chakanbyid(scope.row.id)">成绩</span>
            <span>|</span>
            <span @click="showeditdialog(scope.row.id,scope.row)"
                  :style="{color:(scope.row.state!=0?'gray':'blue')}">编辑</span>
            <span>|</span>
            <span @click="removeUserbyid(scope.row.id)">删除</span>


          </template>
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





    <el-dialog
      :visible.sync="chaxundialogvisible"
      width="60%"
      @close="chaxundialogclose"
      class="diq"
    >

      <el-table
        class="elltable"
        :data="scoretable"
        style="width: 100%"
        ref="multipleTable1"
      >

        <!--        添加索引-->
        <el-table-column type="index" label="序号"
        >
          <template slot-scope="scope"><span>{{scope.$index+1}}</span></template>
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"

        >
        </el-table-column>
        <el-table-column
          prop="studentCode"
          label="学号"

        >
        </el-table-column>
        <el-table-column
          prop="score"
          label="成绩（分）"
          sortable
        >
        </el-table-column>



      </el-table>
      <el-button type="primary" @click="daochu" size="mini" class="mstop">导出</el-button>
    </el-dialog>
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



      var checkLevel=(rule,value,callback)=>{
        if(this.addform.duty==''){
          return callback(new Error('请选择职务/职称'));
        }

        return callback()
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
        entryTime:null,
        iskuaisu:true,
        defaultProps:{
          label:'lable',
          value:'id'
        },
        subjectarr:[],

        checkList:[],
        editform1:{
          loginName:'',
          realName:'',
          remark:'',
          native:'',
          phone:'',
          email:'',
          pics:[]

        },
        base:'',
        scoretable:[],

        datepicker:'',
        options2:[
          {
            value: '1',
            label: '批量启动'
          },
          {
            value: '2',
            label: '批量停用'
          }

        ],
        options:[],
        sels: [],//选中的值显示
        //  获取用户列表的参数
        queryInfo:{
          //查询参数  可为空
          value1:'',
          value2:'',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:10
        },

        chaxundialogvisible:false,
        tasklist:[],
        total:0,
        //用户对话狂
        addialogvisible:false,
        editalogvisible:false,
        addform:{
          //   //文件的数组
          pics:[],
          realName:'',
          teacherCode:'',
          phone:'',
          // idCode:'',
          sex:"",
          duty:"",
          entryTime:""
        },

        editform:{
          id:''
        },


        subectteacher:'',

        checkList1:[],
        upload:"",
        createdTime:'',
        //添加表单的验证规则
        addFormRules:{
          teacherCode:[
            { required: true, message: '请输入教师编码', trigger: 'blur' }
          ],
          realName:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 4, message: '长度在 2到 4 个字符', trigger: 'blur' }
          ],
          phone:[
            {validator:checkMobile,trigger:'blur'}
          ],
          sex:[
            //性别选择
            {required:true,validator:checkSex,trigger:'blur'}
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 9 个字符', trigger: 'blur' }
          ],
          idCode:[
            {required: true, message: '请输入身份证号码', trigger: 'blur'}
            // {validator:checkPersonCode,trigger:'blur'}
          ],
          duty:[
            //  职称
            {required:true,validator:checkLevel,trigger:'blur'}
          ]

        },

        loginid:''


      }
    },
    computed:{
      //定义一个对象
      bothvalue(){
        const {value1,value2}=this.queryInfo
        return{
          value1,
          value2
        }
      }
    },

    watch:{
      // 监听对象需要深度监听
      bothvalue:{
        handler:function(newval) {
          console.log("both有变化",newval)
          if(newval.value1==""&&newval.value2==null){
            this.getTasklist()
          }
        },
        deep:true

      },
      "sels":function(newval) {
        // console.log('监控')
        if(newval.length==1){
          this.isedit=false
        }else{
          this.isedit=true
        }
        if(newval.length==0){
          this.iskuaisu=true
        }else{
          this.iskuaisu=false
        }
      },
      datepicker:function(val) {
        // console.log(val)
      }
    },
    created() {
      this.base=this.BASE_URL
      this.loginid=parseInt(window.sessionStorage.getItem('loginid'))
      //  获取所有班级
      this.getClassList()
      //分页查询
      this.getTasklist()
    },
    methods:{
      daochu(){
        let wb = XLSX.utils.table_to_book(document.querySelector(
          '.elltable'));
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '考试信息表.xlsx');
        } catch (e)
        {
          if (typeof console !== 'undefined')
            console.log(e, wbout)
        }
        return wbout
      },
      daoru(){

      },
      chaxundialogclose(){

      },
      getClassList(){
        this.$http.get(`${this.base}/api/Grade/getAllGrade`).then(res=>{
          // console.log('返回列表')
          // console.log(res.data)
          this.subjectarr=res.data

        }).catch(res=>{
          console.log('获取科目失败')
        })
      },
      piliangpull(){
        this.$confirm('此操作将撤回发布考试,是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http.post(`${this.base}/api/Test/updateStates/${this.loginid}/false`,this.sels).then(res=>{
            console.log('批量撤回返回')
            console.log(res.data)
            if(res.data=='Ok'){
              this.$message.success('批量撤回成功')
              this.sels=[]
              this.clearSelection()
              this.getTasklist()
            }else{

              this.sels=[]
              this.clearSelection()
              this.$message.error('已结束或已开始考试不能批量撤回发布')
              this.getTasklist()
            }
          }).catch(res=>{
            this.sels=[]
            this.clearSelection()
            console.log('批量撤回失败')
          })
        }).catch(() => {
        });
      },
      chakanbyid(id){
        this.chaxundialogvisible=true
        //考试成绩查询
        this.$http.get(`${this.base}/api/test/getTestScoreLst/${id}`).then(res=>{
          console.log(res.data)
          this.scoretable=res.data
        }).catch(res=>{
          console.log('批量失败')
        })
      },


      handleChange(val){
        console.log('选择变化')
        console.log(val)
        this.queryInfo.value2=val[0]
      },

      clearSelection(){
        //  取消所有的选择
        this.$refs.multipleTable1.clearSelection()
      },
      piliangdelete(){
        //  点击了批量删除
        this.$confirm('此操作将删除考试信息,是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http.post(`${this.base}/api/Test/delTests`,this.sels).then(res=>{
            if(res.data=='OK'){
              this.$message.success('批量删除成功')
              this.sels=[]
              this.clearSelection()
              this.getTasklist()
            }else{
              this.sels=[]
              this.clearSelection()
              this.$message.warning(res.data)
              this.getTasklist()
              // this.$message.error('批量删除失败')
            }
          }).catch(res=>{
            this.sels=[]
            this.clearSelection()
            console.log('批量删除失败')
          })
        }).catch(() => {
        });


      },
      piliangpush(){


        //  批量发布
        this.$confirm('此操作将发布考试,是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http.post(`${this.base}/api/Test/updateStates/${this.loginid}/true`,this.sels).then(res=>{
            console.log('批量发布返回')
            console.log(res.data)
            if(res.data=='Ok'){
              this.$message.success('批量发布成功')
              this.sels=[]
              this.clearSelection()
              this.getTasklist()
            }else{
              this.sels=[]
              this.clearSelection()
              // this.$message.error('批量发布失败')
            }
          }).catch(res=>{
            this.sels=[]
            this.clearSelection()
            console.log('批量删除失败')
          })
        }).catch(() => {
        });

      },
      closestates(){
        //批量停用
        this.$http.post(`${this.base}/api/Teacher/updateStates/false`,this.sels).then(res=>{

          if(res.data=='Ok'){
            this.$message.success('批量停用成功')
            this.getTasklist()
          }else{
            this.$message.error('批量停用失败')
          }
        }).catch(res=>{
          console.log('批量停用失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      chaxun(){
        this.queryInfo.pagenum=1
        this.getTasklist()

      },
      getTasklist(){
        this.$http.post(`${this.base}/api/Test/getTestByPage`,this.queryInfo).then(res=>{
          console.log('获取table信息')
          console.log(res.data)
          this.tasklist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取table失败")
        })
      },

      //监听每页？条数据  的事件
      handleSizeChange(val){

        this.queryInfo.pagesize=val
        this.getTasklist()
      },
      //监听页码值改变的事件
      handleCurrentChange(val){
        // console.log(val)
        this.queryInfo.pagenum=val
        this.getTasklist()
      },

      //添加对话框关闭事件
      addialogclose(){
        this.$refs.addFormRef.resetFields()
        this.subectteacher=''
        this.addform.pics=[]
        this.$refs.upload.clearFiles()
      },

      showeditdialog(id,scoperow){
        if(scoperow.state!=0){
          return
        }
        this.$router.push({
          path:'/edittasks',
          query:{
            item:id
          }
        })

      },

      editdialogclosed(){
        this.$refs.editformref.resetFields()
        this.$refs.editref.clearFiles()
      },

      removeUserbyid(id){
        this.editform.id=id
        //返回值是一个promise
        this.$confirm('此操作将删除考试信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(`${this.base}/api/Test/delTest/${id}`).then(
            res=>{
              console.log(res.data)
              if(res.data=="Ok"){
                this.$message.success('删除成功')
                this.getTasklist()
              }else{
                this.$message.warning('考试中禁止删除')
              }
            }
          ).catch(res=>{
            console.log('删除资源失败')
          })
        }).catch(() => {

        });
      },


      resetquery(){
        //重置按钮事件
        this.queryInfo.value1=''
        this.queryInfo.value2=''
        this.queryInfo.value3=''
        this.clearSelection()
        this.getTasklist()
        this.queryInfo.pagenum=1

      },

      handleSelectionChange(val){
        // console.log(val)
        //val是包含对象的数组
        // this.checkList=val
        //点击选框触发
        //返回一个数组
        // let id=val.map(item=>item.id)
        let id=val.map(function(item) {
          return item.id
        })
        this.sels=id
      },

      xinzeng(){
        this.$router.push('/edittasks')
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
  .singleel_input{
    width:185px !important;
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
    .el-row{
      /*margin-bottom:15px !important;*/
    }
    .el-form-item{
      margin-bottom: 12px;
    }

  }
  .ctratetime{
    width: 105px !important;
  }
  .sles{
    width: 70px;
    height: 30px;
    border-radius: 3px;
    color:rgb(195,199,218);
    border: 1px solid rgb(195,199,218);
    font-size: 12px;
    outline: none;
  }

  .singleel_input{
    width: 135px !important;
  }
  .mingh1{
    min-width: 840px;
  }
  .mstop{
    margin-top: 20px;
  }

</style>
