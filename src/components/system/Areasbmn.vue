<template>
  <div class="mingh1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>资源训练环境配置</el-breadcrumb-item>

    </el-breadcrumb>
    <el-card>
      <el-row :gutter="21">
        <el-col :span="4">
          <span class="smallspan">设备名称:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1"
                    class="singleel_input"
                    size="mini"
                    clearable></el-input>
        </el-col>

        <el-col :span="4">
          <span class="smallspan">训练区域 :</span>
          <el-cascader
            placeholder="请选择"
            v-model="areavalue"
            :options="areaoptions"
            size="mini"
            :props="defaultProps"
            class="singleel_input"
            :show-all-levels="false"
          ></el-cascader>
        </el-col>
        <el-col :span="4">
          <span class="smallspan">角色:</span>
          <el-cascader
            placeholder="请选择"
            v-model="rolevalue"
            :options="roleoptions"
            size="mini"
            :props="defaultProps3"
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
        <el-button type="primary" @click="xinzeng"
                   size="mini" style="margin-left: 10px">新增</el-button>
        <el-cascader
          class="casc1"
          placeholder="快速操作"
          v-model="cascadervalue2"
          :options="options2"
          @change="handleChange2"
          size="mini"
        ></el-cascader>



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
        class="studenttable"

      >
        <el-table-column type="selection"  :reserve-selection="true">

        </el-table-column>
        <!--        添加索引-->
        <el-table-column type="index" label="序号"
        >
          <template slot-scope="scope"><span>{{scope.$index+(queryInfo.pagenum-1)*(queryInfo.pagesize)+1}}</span></template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
        >
        </el-table-column>
        <el-table-column
          prop="trainAreaTxt"
          label="训练区域"
        >
        </el-table-column>
        <el-table-column
          prop="roleArrTxt"
          label="角色"
        >
        </el-table-column>
      <el-table-column
      prop="rename"
      label="别名">

      </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        >
        </el-table-column>

        <el-table-column
          prop="remark"
          label="状态">
          <template slot-scope="scope">
                <span v-if="scope.row.state==true">
                  <span style="width: 8px;height: 8px;border-radius: 4px;
                  background: green;display: inline-block;margin-right: 3px">
                  </span>
                  <span>在用</span>
                </span>
            <span v-else="scope.row.state==false">
                  <span style="width: 8px;height: 8px;border-radius: 8px;
                  background: red;display: inline-block;margin-right: 3px">
                  </span>停用</span>
          </template>
        </el-table-column>
        <el-table-column width="160px"
                         label="操作">
          <template slot-scope="scope">
            <span @click="showeditdialog(scope.row.id)">编辑</span>
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

    <!--新增设备-->
    <el-dialog
      title="新增/编辑设备"
      :visible.sync="addialogvisible"
      width="30%"
      @close="addialogclose"
    >
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef"
               label-width="70px"
               class="addformclas">
        <el-form-item label="IP地址:" prop="ip"  label-width="85px" class="gh">
          <el-input v-model="addform.ip" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="设备名称:" prop="name"  label-width="85px" class="gh">
          <el-input v-model="addform.name" size="mini"></el-input>
        </el-form-item>


        <el-form-item label="训练区域:" prop="trainAreaId" label-width="85px">
          <el-cascader
            :options="areaoptions"
            :props="defaultProps"
            v-model="areavalue2"
            :disabled="iszongfen"
            size="mini"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="角色:" prop="juese"  label-width="85px" class="gh1">
          <el-cascader
            placeholder="请选择"
            v-model="rolevalue2"
            :options="roleoptions"
            @change="subtechge"
            :props="defaultProps1"
            style="width: 100%"

          ></el-cascader>
        </el-form-item>
        <el-form-item label="备注:" prop="remark"  label-width="85px" class="gh1">
          <el-input v-model="addform.remark" size="mini" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="addialogvisible = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="addSb" size="mini">确 定</el-button>
  </span>
    </el-dialog>




  </div>
</template>
<script>
  import XLSX from 'xlsx'
  import FileSaver from 'file-saver'


  export default {
    data(){
      var checkJuese=(rule,value,callback)=>{
        // console.log('触发了')
        if(this.rolevalue2.length==0){
          return callback(new Error('请选择角色'));
        }

        return callback()
      }
      //训练区域
      var checkArea=(rule,value,callback)=>{

        if(this.areavalue2.length==0){
          return callback(new Error('请选择训练区域'));
        }
        return callback()
      }
      return{
        getRowKeys(row) {
          return row.id
        },
        iszongfen:false,
        transferarr:[],
        fileTemp:'',
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        entryTime:null,
        //transfer数据源
        transferData:[],
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
        ishas:false,
        rolevalue:[],
        defaultProps:{
          label:'lable',
          value:'id',
          emitPath:false
        },
        defaultProps1:{
          label:'name',
          value:'id',
          multiple: true

        },
        defaultProps3:{
          label:'name',
          value:'id'
        },
        subjectarr:[

        ],
        datepicker:'',
        options2:[
          {
            value: '0',
            label: '批量启动'
          },
          {
            value: '1',
            label: '批量停用'
          }
        ],
        roleoptions:[],
        options:[],
        areaoptions:[],
        areavalue:[],
        rolevalue:[],
        cascadervalue2:[],
        cascadervalue:[],
        hahhaha:'',//修改密码
        passworddiavisible:false,
        setpowervisible:false,
        sels: [],//选中的值显示
        //  获取用户列表的参数
        queryInfo:{
          //查询参数  可为空
          value1:'',
          value2:'',
          value3:'',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:10
        },
        chakanlogvisible:false,
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
        ischange:false,
        addform:{
          ip:'',
          name:'',
          trainAreaId:'',
          remark:"",
          roleArr:[]
        },
        value4:[],
        arrrr:[],
        levelmodel:[],
        editform:{
          id:''
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

          ]
        },
        checkList1:[],
        areavalue2:[],
        upload:"",
        //添加表单的验证规则
        addFormRules:{
          ip:[
            { required: true, message: '请输入IP地址', trigger: 'blur' }
          ],
          name:[
            { required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
          // trainAreaId:[
          //   {
          //     required: true,validator:checkArea,trigger:'blur'
          //   }
          // ],
          juese:[
            {
             required: true,validator:checkJuese,trigger:'blur'
            }
          ],
          remark:[
          ]


        },
        checkList2:[],
        areaarr:[],
        guanlianlogvisible:false,
        editformrules:{
          realName:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
            //自定义校验规则
            // { validator: checkEmail, trigger: 'blur' }
          ]


        },
        setrolelogvisible:false,
        roleslist:{

        },
        selectedroleid:'',
        file:'',
        areavalue:[],
        areaoptions:[],
        rolevalue2:[]



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
      // bothvalue:{
      //   handler:function(newval) {
      //     console.log("both有变化",newval)
      //     if(newval.value1==""&&newval.value2==""){
      //       this.getUserlist()
      //     }
      //   },
      //   deep:true
      //
      // },
      "checkList1":function(val){

        if(val.length==0){
          this.iszongfen=false
        }else{
          if(typeof (val[0])=='number'){
            console.log('是一个数')
            // 找到了返回该元素   找不到返回undifined
            this.ishas=val.find((item,index)=>{
              return (item==0)||(item==1)
            })
            console.log(this.ishas)

          }else{
            console.log('不是一个数')
            //  是对象形式
            // val.forEach((item,index)=>{
            //   this.ishas=item.find((item1,index1)=>{
            //     return (item1==0)||(item1==1)
            //   })
            // })
            for(let i=0;i<val.length;i++){
              this.ishas=val[i].find((item,index)=>{
                 return (item==0)||(item==1)
               })
              if(this.ishas==0||this.ishas==1){
                break
              }
            }
            console.log(this.ishas)


          }


          if(this.ishas==0||this.ishas==1){

            //  选了总导或分岛
            this.iszongfen=true
            this.areavalue2=[]
          }else{
            this.iszongfen=false
          }

        }





      },
      "sels":function(newval) {

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

      //  获取所有区域
      this.getareaList()
    //  获取所有角色
      this.getRoleList()
      //分页查询
      this.getUserlist()
    },
    methods:{
      findtable(){

      },
      hanChtransfer(value, direction, movedKeys){
        // console.log('穿梭change')
        // console.log(value)
        this.transferarr=value
      },
      connectsb(){
        //关联设备

      },
      getRoleList(){
      this.$http.get('api/Equipment/getAllRole').then(res=>{
        console.log('获取角色')
        console.log(res.data)
       this.roleoptions=res.data

      }).catch(res=>{
        console.log('获取角色失败')
      })
      },
      handleChange(val){
        // console.log('选择变化')
        // console.log(val)
        this.queryInfo.value2=val[0]
      },
      handleChange2(val){
        const  choiceval=val[0]
        const warningarr=["启用","停用"]
        const warningtext=warningarr[val]
        if(choiceval=='0'||choiceval=='1'){
          console.log(this.sels)
          if(this.sels.length==0){
            this.cascadervalue2=[]
            this.$message.warning(`请选择要${warningtext}的对象`)
            return
          }
          //批量启停用
          this.$confirm(`将要批量${warningtext},是否继续？`,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(
            res=>{
              if(choiceval=='0'){
                //批量启动
                this.openstates()
              }else if(val=='1'){
                //批量停用
                this.closestates()
              }

            }
          ).catch(
            res=>{
              this.sels=[]
              this.clearSelection()
              this.cascadervalue=''
            }
          )

        }


        this.cascadervalue2=[]
      },
      daoru(obj){


      },
      handleRe1(file,fileList){
        this.fileTemp = null
      },
      handleCh1(file,fileList){
        console.log('jkjkjjk')
        console.log(this.ischange)
        if(this.ischange==false){
          this.ischange=true
          this.fileTemp = file.raw
          // 判断上传文件格式
          if(this.fileTemp){
            if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (this.fileTemp.type == 'application/vnd.ms-excel')){
              this.importfxx(this.fileTemp)
            } else {
              this.$message({
                type:'warning',
                message:'附件格式错误，请删除后重新上传！'
              })
            }
          } else {
            this.$message({
              type:'warning',
              message:'请上传附件！'
            })
          }
          // this.ischange=true
        }
        if(this.ischange==true){
          const that=this
          setTimeout(function() {
            that.ischange=false
          },1111)
        }

      },
      subtechge(val){
        this.checkList1=val
        console.log('checklist1')
        console.log(this.checkList1)
      },
      // subtechge(val){
      //   console.log('此时的val')
      //   console.log(val)
      //   this.checkList1=[]
      //   val.forEach((item)=>{
      //     this.checkList1.push(item[0])
      //   })
      //   console.log('check后')
      //   console.log(this.checkList1)
      //
      // },

      subtechge2(val){
        console.log('此时的val')
        console.log(val)
        // this.checkList1=[]
        // val.forEach((item)=>{
        //   this.checkList1.push(item[0])
        // })
        this.checkList1=val
        console.log('check后')
        console.log(this.checkList1)
      },
      openstates(){
        //批量启用
        this.$http.post('api/Equipment/updateStates/true',this.sels).then(res=>{
          if(res.data=='Ok'){
            this.$message.success('批量启动成功')
            this.getUserlist()
          }else{
            this.$message.error('批量启动失败')
          }
        }).catch(res=>{
          console.log('批量失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      clearSelection(){
        //  取消所有的选择
        this.$refs.multipleTable1.clearSelection()
      },
      piliangdelete(){
        //  点击了批量删除
        this.$http.post('api/course/delcourses/',this.sels).then(res=>{
          console.log('批量删除返回')
          console.log(res.data)
          if(res.data=='OK'){
            this.$message.success('批量删除成功')
            this.getsubjectinfo()
          }else{
            this.$message.error('批量删除失败')
          }
        }).catch(res=>{
          console.log('批量删除失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      closestates(){
        //批量停用
        this.$http.post('api/Equipment/updateStates/false',this.sels).then(res=>{

          if(res.data=='Ok'){
            this.$message.success('批量停用成功')
            this.getUserlist()
          }else{
            this.$message.error('批量停用失败')
          }
        }).catch(res=>{
          console.log('批量停用失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      getareaList(){
        this.$http.get('api/AreaClass/getAreaLst').then(res=>{
          console.log('获取所有区域')
          console.log(res.data)
          this.areaoptions=res.data
        }).catch(res=>{
          console.log("获取所有区域失败")
        })
      },
      chaxun(){
        this.queryInfo.pagenum=1
        this.getUserlist()
      },
      getUserlist(){
        if(this.areavalue.length!=0){
          this.queryInfo.value2=this.areavalue
        }

        if(this.rolevalue.length!=0){
          this.queryInfo.value3=this.rolevalue[0]
        }
        this.$http.post('api/Equipment/getEquipmentByPage',this.queryInfo).then(res=>{
          console.log('获取table信息')
          console.log(res.data)
          this.userlist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取区域列表失败")
        })

      },
      sexhandlechange(val){
        this.addform.sex=val
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
        this.addform={
          ip:'',
          name:'',
          trainAreaId:'',
          remark:"",
          roleArr:[]
        }
        this.areavalue2=[]
        this.rolevalue2=[]
        this.iszongfen=false
        this.$refs.addFormRef.resetFields()
      },
      chakandialogclosed(){

      },
      guanliandialogclosed(){

      },
      passwordaction(){
        //  确定修改密码
        this.$refs.passwordformref.validate(async valid=>{
          if(!valid){
            this.$message.error('请检查密码格式!')
            return
          }
          this.$http.post('api/User/updatePassword',{
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
      addSb(){
        //点击确定按钮预校验
        this.$refs.addFormRef.validate(valid=>{
            if(!valid){
            return
          }
           this.checkList2=[]
          console.log('现在的checklist1')
          console.log(this.checkList1)
          if(typeof (this.checkList1[0])!='number'){
            // console.log('不是一个数')
            //  说明包含数组
            this.checkList1.forEach(item=>{
              this.checkList2.push(item[0])
            })
            this.addform.roleArr=this.checkList2
          }else{
            // console.log('是一个数')
            this.addform.roleArr=this.checkList1
          }
          console.log('raeaaaaa')
          console.log(this.areavalue2)
          if(typeof (this.areavalue2)=='number'){
            this.addform.trainAreaId=this.areavalue2
          }else{
            this.addform.trainAreaId=this.areavalue2[0]
          }
          // this.addform.roleArr=this.checkList1
          this.$http.post('api/Equipment/addAndUpdateEquipment',this.addform).then(res=>{
            // return
            //新增返回
            console.log('新增返回')
            console.log(res.data)

            if(res.data=="OK"){
              this.getUserlist()
              this.$message.success('训练环境配置成功')
              this.addialogvisible=false


            }else{
              this.$message.error(res.data)
            }
          }).catch(res=>{
          })


        })
      },
      powerdialogclosed(){
        //  授权页面关闭

      },
      showeditdialog(id){
        //编辑信息页面展示
        this.$http.get(`api/Equipment/getEquipment/${id}`).then(res=>{
          console.log('获取单个信息')
          console.log(res.data)

          //赋值文件数组
         this.addform=res.data
          this.rolevalue2=res.data.roleArr
          this.areavalue2=res.data.trainAreaId
          this.checkList1=this.rolevalue2

          this.addialogvisible=true
        }).catch(res=>{
         console.log('获取单个信息失败')
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
          this.checkList2=[]
          if(typeof (this.checkList1[0])!='number'){
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

          console.log('我给的editform')
          console.log(this.editform1)
          // console.log(this.checkList2)
          this.$http.post('api/Teacher/updateInfo',this.editform1).then(res=>{
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
          this.$http.get(`api/Teacher/delTeacher/${id}`).then(
            res=>{
              if(res.data=="OK"){
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
        const {data:res}=await this.$http.get('queryusers',{params:this.queryInfo2})
        // console.log(res)
        if(res.meta.status!=200){
          return this.$message.error('未查询到该用户')
        }
        this.userlist=res.data
        this.total=res.total


      },
      resetquery(){
        //重置按钮事件
        this.queryInfo={
          //查询参数  可为空
          value1:'',
            value2:'',
            value3:'',
            pagenum:1,
            pagesize:5
        }
        this.areavalue=''
        this.rolevalue=''
        this.getUserlist()
        this.clearSelection()
        this.queryInfo.pagenum=1
      },
      levelhandlechange(){

      },
      handleSelectionChange(val){
        console.log(val)
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
      },
      xinzeng(){
        this.addialogvisible=true

      },

      handlesuccess2(res,file,filelist){

        this.editform1.pics.push(res)
      },
      handleRemove(file){
        //从数组中移除
        const index=this.addform.pics.findIndex(item=>{
          item==file
        })
        this.addform.pics.splice(index,1)
        // console.log('现在的')
        // console.log(this.addform.pics)

      },
      handleRemove2(file){
        const index=this.editform1.pics.findIndex(item=>{
          item==file
        })
        this.editform1.pics.splice(index,1)
      },
      beforeUpload(file){
        const isLt100M = file.size / 1024 / 1024 <100;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过100M!');
        }
        return isLt100M
      },
      handlePreview(){

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
    width:135px !important;
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
  .ghg{

    float: left !important;
  }
  .mingh1{
    min-width: 1390px;
  }
  .gh{
    /*width: 280px;*/
    margin-bottom: 25px !important;
  }
  .gh1{
    /*width: 480px;*/

    margin-top: 25px !important;
  }
  .sles{
    width: 100px !important;
    height: 30px;
    border-radius: 3px;
    color: #c3c7da;
    border: 1px solid #c3c7da;
    font-size: 12px;
    outline: none;
  }
  .sles1{
    width: 194px !important;
    height: 30px;
    border-radius: 3px;
    color: #c3c7da;
    border:1px solid #DCDFE6;
    font-size: 12px;
    outline: none;
  }
  .el-cascader-menu__wrap{
    height: 200px !important;
  }
  .sles{
  width: 70px;
  height: 30px;
  border-radius: 3px;
  color: #c3c7da;
  border: 1px solid #c3c7da;
  font-size: 12px;
  outline: none;
}
</style>
