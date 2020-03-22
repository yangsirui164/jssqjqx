<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学员/教师管理</el-breadcrumb-item>
      <el-breadcrumb-item>年级/班级管理</el-breadcrumb-item>

    </el-breadcrumb>
    <el-card>
      <el-row :gutter="21">
        <el-col :span="8">
          <!--  clearable可清空-->
          <span>班级:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1"
                    class="singleel_input"
          ></el-input>

        </el-col>
        <el-col :span="8">
          <span>所学科目:</span>

          <el-cascader
            placeholder="请选择"
            v-model="cascadervalue"
            :options="options"
            @change="handleChange"
            size="mini"
            :disabled="iskuaisu"
            :props="defaultProps"></el-cascader>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="chaxun">
            查询
          </el-button>
          <el-button type="info" @click="resetquery">
            重置
          </el-button>
        </el-col>
      </el-row>
      <el-row class="actionel">
        <el-button type="primary" @click="addialogvisible=true">新增班级</el-button>
        <el-button type="info" @click="removeUsers()" :disabled="this.sels.length === 0">批量删除</el-button>
      </el-row>
      <!--          用户table-->
      <el-table
        border
        stripe
        :data="userlist"
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
          prop="name"
          label="班级"
          >
        </el-table-column>

        <el-table-column
          prop="subjectIdLstTxt"
          label="所学科目"
          width="190px"
        >
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column width="120px"
                         label="操作">
          <template slot-scope="scope">
            <span @click="showeditdialog(scope.row.id)">编辑</span>
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
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

    <!--新增-->
    <el-dialog
      title="新增班级"
      :visible.sync="addialogvisible"
      width="30%"
      @close="addialogclose"
    >
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="班级:" prop="name" label-width="105px">
          <el-input v-model="addform.name" placeholder="请输入"
            class="linput"
        ></el-input>
        </el-form-item>

        <el-form-item label="所学科目:" prop="password" label-width="105px">
          <el-cascader
            :options="subjectoptions"
            :props="subjectProps"
            @change="handleChange2"
            v-model="cascadervalue2"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="备注:" prop="remark" label-width="105px">
          <el-input v-model="addform.remark" class="linput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addialogvisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>



    <!--编辑用户-->
    <el-dialog
      title="编辑班级"
      :visible.sync="editalogvisible"
      width="30%"
      @close="editdialogclosed"
    >
      <el-form  :model="editform1" label-width="105px" :rules="editformrules"
                ref="editformref">
        <el-form-item label="班级：">
          <el-input v-model="editform1.name"
                    class="linput"
          ></el-input>
        </el-form-item>

        <el-form-item label="所学科目：" label-width="105px">
          <el-cascader
            :options="subjectoptions3"
            :props="subjectProps"
            @change="handleChange3"
            v-model="editform1.subjectIdArr"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="备注" label-width="105px">
          <el-input v-model="editform1.remark"
                    class="linput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editalogvisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>


    <!--修改密码-->
    <el-dialog
      title="修改密码"
      :visible.sync="passworddiavisible"
      width="30%"
      @close="passworddialogclosed"
    >
      <el-form :model="passwordform" label-width="70px" :rules="passwordformrules"
               ref="passwordformref">

        <el-form-item label="新密码" prop="password1" label-width="95px">
          <el-input type="password" v-model="passwordform.password1" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" label-width="95px">
          <el-input v-model="passwordform.password2" type="password" clearable></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="passworddialogclosed">取 消</el-button>
    <el-button type="primary" @click="passwordaction">确 定</el-button>
  </span>
    </el-dialog>






  </div>
</template>
<script>
  export default {
    data(){
      var checksubject1=(rule,value,callback)=>{
        if(this.checkList.length==0){
          return callback(new Error('请选择科目'));
        }
        return callback()
      }
      var oncePassword=(rule,value,callback)=>{
        if(this.passwordform.password2!=''){
          this.$refs.passwordformref.validateField('password2');
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
        if(regEmail.test(value)){
          return  callback()

        }
        return callback(new Error('请输入合法邮箱'))



      }
      //自定义校验手机号规则
      var checkMobile=(rule,value,callback)=>{
        const regMobile=/^[1][3,4,5,7,8,9][0-9]{9}$/
        if(regMobile.test(value)){
          return  callback()
        }
        return callback(new Error('请输入正确手机号'))
      }
      return{
        getRowKeys(row) {
          return row.id
        },
        defaultProps:{
          label:'lable',
          value:'id'

        },
        //当前有的科目
        cascadervalue3:[],
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        subjectoptions3:[],
        subjectoptions:[],
        options:[],
        iskuaisu:false,
        //transfer数据源
        transferData:[],
        checkList:[],
        editform1:{
          name:'',
          remark:'',
          subjectIdArr:[]


        },
        cascadervalue:[],
        cascadervalue2:[],
        hahhaha:'',//修改密码
        passworddiavisible:false,
        setpowervisible:false,
        sels: [],//选中的值显示
        //  获取用户列表的参数
        queryInfo:{
          //查询参数  可为空
          value1:'',
          value2:'',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:2
        },
        queryInfo2:{
          username:'',
          name:''
        },
        userlist:[],
        total:0,
        //用户对话狂
        addialogvisible:false,
        editalogvisible:false,
        addform:{
          name:'',
          subjectIdArr:'',
          remark:''
        },
        editform:{
          id:''
        },
        passwordform:{
          password1:'',
          password2:''
        },
        userinfo:{

        },
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
        checksubjects:[],
        //添加表单的验证规则
        addFormRules:{
          name:[
            { required: true, message: '请输入班级名', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
          ],
          password:[

            {required:true,validator:checksubject1,trigger: 'blur'}
          ]
        },
        checkList1:[],
        editformrules:{
          realName:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
            //自定义校验规则
            // { validator: checkEmail, trigger: 'blur' }
          ],
          phone:[
            {validator:checkMobile,trigger:'blur'}
          ],
          email:[
            {validator:checkEmail,trigger:'blur'}
          ]
        },
        setrolelogvisible:false,
        roleslist:{

        },
        selectedroleid:''



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
      // 监听两个input值为空时  重新获取列表
      bothvalue:{
        handler:function(newval) {
          console.log("both有变化",newval)
          if(newval.value1==""&&newval.value2==""){
            this.getUserlist()
          }
        },
        deep:true

      }
    },
    created() {

      this.getUserlist()
      this.getsubjectList()

    },
    methods:{
      handleChange3(val){
      //编辑选择变化
        this.checkList1=val
        //新增班级点击所学科目
        console.log('开始选')
        // val.forEach((item)=>{
        //   this.checkList1.push(item[0])
        // })


      },
      handleChange(val){
         console.log('选择变化')
        console.log(val)
        this.queryInfo.value2=val[0]
      },
      handleChange2(val){
        this.checkList=[]
        //新增班级点击所学科目
        console.log('开始选')
         val.forEach((item)=>{
        this.checkList.push(item[0])
        })
        console.log(this.checkList)



      },
      getsubjectList(){
        this.$http.get('api/Subject/getAllSubject').then(res=>{
          console.log('获取所有科目')
          // console.log(res.data)
          this.options=res.data[0].children
          this.subjectoptions=res.data[0].children
          this.subjectoptions3=res.data[0].children
        }).catch(res=>{
          console.log("获取所有科目失败")
        })
      },
      chaxun(){
       this.queryInfo.pagenum=1
        this.getUserlist()
      },
      getUserlist(){
        console.log('查询信息')
        console.log(this.queryInfo)
        this.$http.post('api/Grade/getGradeByPage',this.queryInfo).then(res=>{
          console.log('班级表')
          console.log(res.data)
          this.userlist=res.data.data
          this.total=res.data.total
          // this.cascadervalue=''
        }).catch(res=>{
          console.log("获取班级列表失败")
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
      async userstatuschanged(changgestate){
        //修改后传递数据   用put请求
        const {data:res}=await this.$http.put(`users/${changgestate.id}/state/${changgestate.mg_state}`)
        if(res.meta.status!==200){
          changgestate.mg_state=!changgestate.mg_state
          return this.$message.error('更新用户状态失败')
        }

      },
      //添加对话框关闭事件
      addialogclose(){
        this.$refs.addFormRef.resetFields()
      },
      passwordaction(){
        //  确定修改密码
        this.$refs.passwordformref.validate(async valid=>{
          console.log('走到1')
          if(!valid){
            console.log('拦截')
            this.$message.error('请检查密码格式!')
            return
          }
          this.$http.post('api/user/updatepassword',{
            id:this.editform.id,
            password:this.passwordform.password2
          }).then(res=>{
            if(res.data=="Ok"){
              this.passworddiavisible=false
              this.$message.success('修改密码成功')
            }


          }).catch(res=>{
            console.log('获取数据失败')
          })

        })


      },
      addUser(){
        //点击确定按钮预校验
        this.$refs.addFormRef.validate(async valid=>{
          console.log(valid)
          if(!valid){
            return
          }
          this.addform.subjectIdArr=this.checkList
          this.$http.post('api/Grade/addGrade',this.addform).then(res=>{

            console.log(res.data)
            // console.log(this.addform)
            if(res.statusText=="OK"){
              this.$message.success('添加成功')
              this.addialogvisible=false
              this.getUserlist()
            }else{
              this.$message.error('添加失败')
            }
          }).catch(res=>{
            console.log(res)
          })

        })
      },
      showepowerdialog(id){
        //  显示授权页面
        this.setpowervisible=true



      },
      powerdialogclosed(){
        //  授权页面关闭

      },
      showeditdialog(id){
        //编辑信息页面展示
        this.editform.id=id
        this.$http.get(`api/Grade/getGrade/${id}`).then(res=>{
          // console.log('返回的编辑信息')
          // console.log(res.data)
          this.editform1=res.data
          this.editalogvisible=true
        }).catch(res=>{
          console.log('错了')
        })

      },
      showpassworddialog(id){
        //  显示修改密码页面
        this.passworddiavisible=true
        // 获取到修改密码的id
        this.editform.id=id

      },
      editdialogclosed(){
        this.$refs.editformref.resetFields()
      },
      editUserInfo(){
        this.$refs.editformref.validate(async valid=>{
          if(!valid){
            return
          }
          this.checkList2=[]
          //编辑用户请求
          this.editform1.id=this.editform.id
          if(typeof (this.checkList1[0])!='number'){
            console.log('不是一个数')
            // this.checkList1=[]
            //  说明包含数组
            this.checkList1.forEach(item=>{
              this.checkList2.push(item[0])
            })
            this.editform1.subjectIdArr=this.checkList2
          }else{
            console.log('是一个数')
            this.editform1.subjectIdArr=this.checkList1
          }

          this.$http.post('api/Grade/updateInfo',this.editform1).then(res=>{
            console.log(res.data)

            if(res.data=="Ok"){
              this.$message.success('修改成功')
              this.editalogvisible=false
              this.getUserlist()
            }


          }).catch(res=>{
            console.log('修改用户数据失败')
          })




        })

      },
      removeUserbyid(id){
        this.editform.id=id
        //返回值是一个promise
        this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          //  如果用户确认了删除  返回的是confirm字符串
          //如果用户取消了删除  返回的是cancel字符串
        }).then(() => {
          this.$http.get(`/api/Grade/delGrade/${id}`).then(
            res=>{
              if(res.data=="Ok"){
                this.$message.success('删除成功')
                this.getUserlist()
              }
            }
          ).catch(res=>{
            console.log('删除数据失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      removeUsers(){
        this.$confirm('将要批量删除用户，是否继续？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
            this.$http.post('api/Grade/delGrades',this.sels).then(res=>{
              console.log('删除成功 ')
              //重置空数组
              this.sels=[]
              //重新获取页面
              this.getUserlist()
            }).catch(res=>{
              console.log('删除失败')
            })



          }

        ).catch(()=>{
            this.$message({
              type:'info',
              message:'已取消删除'
            })
          }

        )
      },
      async setrole(info){
        this.setrolelogvisible=true
        //获取所有角色列表
        const {data:res}=await this.$http.get('roles')
        if(res.meta.status!=200){
          return this.$message.error('获取角色列表失败')
        }
        this.roleslist=res.data
        this.userinfo=info

      },
      //点击按钮分配角色
      async saveroleinfo(){
        //判断选择没选择
        if(!this.selectedroleid){
          return this.$message.error('请选择要分配的角色')
        }
        // console.log(this.userinfo.id);
        // console.log(this.selectedroleid)
        const {data:res}= await this.$http.put(`users/${this.userinfo.id}/role`,{
          rid:this.selectedroleid
        })
        if(res.meta.status!=200){

          return this.$message.error('更新角色失败')
        }
        this.getUserlist()
        this.setrolelogvisible=false

      },
      setroledialog(){
        this.selectedroleid=""
        this.userinfo={

        }
      },
      async getsmallUserlist(){
        // 查询框函数
        const {data:res}=await this.$http.get('query' +
          'users',{params:this.queryInfo2})
        // console.log(res)
        if(res.meta.status!=200){
          return this.$message.error('未查询到该用户')
        }
        this.userlist=res.data
        this.total=res.total


      },
      resetquery(){
        //重置按钮事件
        this.queryInfo.value1=''
        this.cascadervalue=''
        this.queryInfo.value2=''
        this.getUserlist()
        this.queryInfo.pagenum=1

      },
      handleSelectionChange(val){
        // console.log('现在的选择')
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
      passworddialogclosed(){
        //  密码对话框关闭
        this.$refs.passwordformref.resetFields()
        this.passworddiavisible=false
        this.passwordform.password1=''
        this.passwordform.password2=''
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
  .linput{
    width:217px !important;

  }

</style>
