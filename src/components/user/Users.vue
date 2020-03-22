<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>

    </el-breadcrumb>
    <el-card>
      <el-row :gutter="21">
        <el-col :span="8">
          <!--  clearable可清空-->
          <span>姓名:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1"
                    class="singleel_input"
             ></el-input>

        </el-col>
        <el-col :span="8">
          <span>用户名:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value2"
                    class="singleel_input"
          ></el-input>
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
          <el-button type="primary" @click="addialogvisible=true">新增</el-button>
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
          prop="realName"
          label="姓名"
          width="180">
        </el-table-column>

        <el-table-column
          prop="loginName"
          label="用户名"
          width="180">
        </el-table-column>

        <el-table-column
          prop="userRole"
          label="角色">
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column width="190px"
                         label="操作">
          <template slot-scope="scope">
            <span @click="showepowerdialog(scope.row.id)">授权</span>
            <span>|</span>
            <span @click="showeditdialog(scope.row.id)">编辑</span>
            <span>|</span>
            <span @click="showpassworddialog(scope.row.id)">修改密码</span>
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

    <!--新增用户-->
    <el-dialog
    title=""
    :visible.sync="addialogvisible"
    width="30%"
    @close="addialogclose"
  >
    <el-form :model="addform" :rules="addFormRules" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="loginName">
        <el-input v-model="addform.loginName"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="addform.password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addialogvisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
  </el-dialog>



<!--编辑用户-->
    <el-dialog
      title="编辑用户"
      :visible.sync="editalogvisible"
      width="30%"
      @close="editdialogclosed"
    >
      <el-form  :model="editform1" label-width="70px" :rules="editformrules"
                ref="editformref">
        <el-form-item label="用户名">
          <el-input v-model="editform1.loginName" disabled></el-input>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="editform1.realName" clearable></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="editform1.phone" clearable></el-input>
        </el-form-item>

        <el-form-item label="籍贯">
          <el-input v-model="editform1.native" clearable></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform1.email" clearable></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="editform1.remark"></el-input>
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

    <!--分配角色的对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="setrolelogvisible"
      width="50%"
      @close="setroledialog"
    >
      <div>
        <p>当前用户:{{userinfo.username}}</p>
        <p>当前角色:{{userinfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedroleid" placeholder="请选择">
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editalogvisible = false">取 消</el-button>
    <el-button type="primary" @click="saveroleinfo">确 定</el-button>
  </span>
    </el-dialog>



<!--分配权限的对话框-->
    <el-dialog
      title="用户授权选择"
      :visible.sync="setpowervisible"
      width="70%"
      @close="setroledialog"
    >
<!--      <el-transfer-->
<!--        style="text-align: left; display: inline-block"-->
<!--        v-model="value4"-->
<!--        filterable-->
<!--        :titles="['Source', 'Target']"-->
<!--        :button-texts="['到左边', '到右边']"-->
<!--        :format="{-->
<!--        noChecked: '${total}',-->
<!--        hasChecked: '${checked}/${total}'-->
<!--      }"-->
<!--        @change="handleChange"-->
<!--        :data="transferData">-->
<!--        <span slot-scope="{ option }">这里 - {{ option.label }}</span>-->
<!--        <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>-->
<!--        <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
<!--      </el-transfer>-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editalogvisible = false">取 消</el-button>
    <el-button type="primary" @click="saveroleinfo">确 定</el-button>
  </span>
    </el-dialog>



  </div>
</template>
<script>

  export default {
    data(){
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
        //transfer数据源
        transferData:[],
        checkList:[],
        editform1:{
          loginName:'',
          realName:'',
          remark:'',
          native:'',
          phone:'',
          email:''

        },
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
          loginName:'',
          password:''
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
        //添加表单的验证规则
        addFormRules:{
          loginName:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 9 个字符', trigger: 'blur' }
          ]
        },
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

    },
    methods:{
     //  indexMethod(index){
     // // return '哈哈'
     //  },
      chaxun(){
        this.queryInfo.pagenum=1
        this.getUserlist()
      },
       getUserlist(){
        this.$http.post('api/user/getUserByPage',this.queryInfo).then(res=>{
          console.log('查询信息')
          console.log(this.queryInfo)
          // console.log(res)
          this.userlist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取用户列表失败")
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

          this.$http.post('api/user/adduser',this.addform).then(res=>{
            console.log(res)
            if(res.statusText=="OK"){
              this.$message.success('添加成功')
              this.addialogvisible=false
              this.getUserlist()
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
         this.$http.get(`api/user/getuser/${id}`).then(res=>{
           console.log(res.data)
           this.editform1.loginName=res.data.loginName
           this.editform1.realName=res.data.realName
           this.editform1.remark=res.data.remark
           this.editform1.phone=res.data.phone
           this.editform1.email=res.data.email
           this.editform1.native=res.data.native
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
          //编辑用户请求
          this.$http.post('api/user/updateinfo',{
            id:this.editform.id,
            realname:this.editform1.realName,
            remark:this.editform1.remark,
            phone:this.editform1.phone,
            native:this.editform1.native,
            email:this.editform1.email,

          }).then(res=>{
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
          this.$http.get(`api/user/deluser/${id}`).then(
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
      this.$http.post('api/user/delusers',this.sels).then(res=>{
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
        this.queryInfo.value2=''
        this.getUserlist()
        this.queryInfo.pagenum=1

      },
      handleSelectionChange(val){
         console.log(val)
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

</style>
