<template>
  <div class="mingh1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>训练区域管理</el-breadcrumb-item>

    </el-breadcrumb>
    <el-card>
      <el-row :gutter="21">
        <el-col :span="8">
          <span class="smallspan">训练区域:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1"
                    class="singleel_input"
                    size="mini"
                    clearable></el-input>

        </el-col>
        <el-col :span="8">
          <span class="smallspan">状态:</span>
          <select v-model="queryInfo.value2" class="sles">
            <option disabled value="">请选择</option>
            <option value="0">停用</option>
            <option value="1">在用</option>
          </select>
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
          class="casc"
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
          prop="name"
          label="训练区域"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        >
        </el-table-column>
        <el-table-column
          prop="info"
          label="设备信息"
        >
          <template slot-scope="scope">
            <span @click="connectsb(scope.row.id)">关联设备</span>
            <span>|</span>
            <span @click="findtable(scope.row.id)">查看</span>
          </template>
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

    <!--新增教师-->
    <el-dialog
      title="新增区域"
      :visible.sync="addialogvisible"
      width="30%"
      @close="addialogclose"
    >
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef"
               label-width="70px"
               class="addformclas">

        <el-form-item label="训练区域:" prop="name"  label-width="85px" class="gh">
          <el-input v-model="addform.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark"  label-width="85px" class="gh">
          <el-input v-model="addform.remark" size="mini" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="addialogvisible = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="addArea" size="mini">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="关联设备"
      :visible.sync="guanlianlogvisible"
      width="25%"
      @close="guanliandialogclosed"
      class="addformclas"
    >
      <template v-if="ischild">
      <el-tree
        :data="tree_data"
        :props="Props1"
        default-expand-all
        ref="tree"
        node-key="id"
        show-checkbox
        :default-checked-keys="defaulechecked"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="guanlianlogvisible = false">取 消</el-button>
    <el-button type="primary" @click="connectInfo">确 定</el-button>
  </span>
        </template>
      <template v-if="!ischild">
        目前没有可关联的设备
      </template>
    </el-dialog>


    <el-dialog
      title="查看设备"
      :visible.sync="chakanlogvisible"
      width="60%"
      @close="chakandialogclosed"
      class="addformclas"
    >
      <el-table
        border
        stripe
        :data="singleareasb"
        style="width: 100%"
        ref="multipleTable2"
        :row-key="getRowKeys"
        class="studenttable"

      >
        <!--        添加索引-->
        <el-table-column type="index" label="序号"
        >
          <template slot-scope="scope">
            <span>{{scope.$index+(queryInfo1.pagenum-1)*(queryInfo1.pagesize)+1}}</span></template>
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
            prop="roleArrTxt"
            label="角色"
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

        <el-table-column
          prop="remark"
          label="备注"
        >
        </el-table-column>

      </el-table>
      <el-pagination
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="queryInfo1.pagenum"
        :page-sizes="[10,15,20]"
        :page-size="queryInfo1.pagesize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total1">
      </el-pagination>

      <span slot="footer" class="dialog-footer">
<!--    <el-button @click="editalogvisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="editUserInfo">确 定</el-button>-->
  </span>
    </el-dialog>

  </div>
</template>
<script>
  import XLSX from 'xlsx'
  import FileSaver from 'file-saver'


  export default {
    data(){
      var checkSex=(rule,value,callback)=>{
        if(this.addform.sex==''){
          return callback(new Error('请选择性别'));
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
        if(!value){
          //邮箱可以为空
          return callback()
        }else{
          if(regEmail.test(value)){
            return  callback()
          }
          return callback(new Error('请输入正确邮箱'))
        }



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
        isedit:false,
        tree_data:[],
        findtableid:0,
        singleareasb:[],
        transferarr:[],
        fileTemp:'',
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        ischild:true,
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
          email:''


        },
        queryInfo1:{
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:10
        },
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
        options:[],
        areaoptions:[],
        areavalue:[],
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
          name:'',
          remark:""
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
            {validator:checkPassword,trigger: 'blur'}
          ]
        },
        checkList1:[],
        upload:"",
        //添加表单的验证规则
        addFormRules:{
          name:[
            { required: true, message: '请输入训练区域', trigger: 'blur' }
          ],
          remark:[


          ]


        },
        total1:0,
        checkList2:[],
        areaarr:[],
        defaulechecked:[],
        guanlianlogvisible:false,
        Props1:{
          children:'children',
          label:'lable'
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
        selectedroleid:'',
        file:'',
        shouquanid:'',
                editid:''




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

      },
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
      //分页查询
      this.getUserlist()
      //  获取所有区域
      this.getareaList()
    },
    methods:{
        findtable(id){
          this.findtableid=id
          this.chakanlogvisible=true
            this.queryInfo1.value1=id
        this.$http.post('api/Equipment/getEquipmentByPage1',this.queryInfo1).then(res=>{
          console.log('获取小table信息')
          console.log(res.data)
          this.singleareasb=res.data.data
          this.total1=res.data.total
        }).catch(res=>{
          console.log("获取小表格失败")
        })
      },
      hanChtransfer(value, direction, movedKeys){
        console.log('穿梭change')
        console.log(value)
        this.transferarr=value
      },
      connectInfo(){
        const keys=this.$refs.tree.getCheckedKeys()
        console.log('选中的keys')
        console.log(keys)
        this.$http.post(`api/TrainArea/updateAreaEquipment/${this.shouquanid}`,keys).then(res=>{
          console.log('关联设备返回')
          console.log(res.data)
          if(res.data=='Ok'){
            this.$message.success('关联设备成功')
            this.getUserlist()
            this.guanlianlogvisible=false
          }else{
            console.log('关联设备失败')
            // this.$message.error('关联设备失败')
            this.guanlianlogvisible=false
          }
        })
      },
      connectsb(id){
        this.shouquanid=id
          //关联设备
        this.$http.get(`api/TrainArea/getAllEquipmentByArea/${id}`).then(res=>{
          console.log('获取关联设备eri返回')
          console.log(res.data)
          if(res.data[0].children.length==0){
             this.ischild=false
          }else{
            this.ischild=true
            res.data[0].children.forEach((item,index)=>{
              if(item.isChecked==true){
                this.defaulechecked.push(item.id)
              }
            })
            this.tree_data=res.data
          }

          this.guanlianlogvisible=true
        }).catch(res=>{

        })

      },
      handleChange(val){
        console.log('选择变化')
        console.log(val)
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
        if(choiceval=='3'){
          this.queryInfo.pagenum=1
          this.queryInfo.pagesize=this.total
          this.getUserlist()
          //批量导出
          const that=this
          setTimeout(function() {
            that.daochu()
          },111)
          // this.daochu()
        }

        if(choiceval=='4'){
          this.daoru()
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
      daochu(){

        // 批量导出
        /* generate workbook object from table */
        let wb = XLSX.utils.table_to_book(document.querySelector(
          '.studenttable'));
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '学员信息表.xlsx');
        } catch (e)
        {
          if (typeof console !== 'undefined')
            console.log(e, wbout)
        }
        return wbout
      },
      subtechge(val){
        console.log('此时的val')
        console.log(val)
        this.checkList1=[]
        val.forEach((item)=>{
          this.checkList1.push(item[0])
        })
        console.log('check后')
        console.log(this.checkList1)

      },

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
        this.$http.post('api/TrainArea/updateStates/true',this.sels).then(res=>{
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
        this.$http.post('api/TrainArea/updateStates/false',this.sels).then(res=>{

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
        this.$http.get('api/TrainArea/getAllTrainArea').then(res=>{
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
        this.$http.post('api/TrainArea/getTrainAreaByPage',this.queryInfo).then(res=>{
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
      handleSizeChange2(val){
        this.queryInfo1.pagesize=val
       this.findtable(this.findtableid)
      },

      //监听页码值改变的事件
      handleCurrentChange(val){
        // console.log(val)
        this.queryInfo.pagenum=val
        this.getUserlist()
      },
      handleCurrentChange2(val){
        this.queryInfo1.pagenum=val
        this.findtable(this.findtableid)
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
        this.subectteacher=''


      },
      chakandialogclosed(){
         this.findtableid=0
        this.queryInfo1={
          pagenum:1,
          pagesize:2
        }
      },
      guanliandialogclosed(){
        this.defaulechecked=[]
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
      addArea(){
        //点击确定按钮预校验
        this.$refs.addFormRef.validate(async valid=>{
          console.log(valid)
          if(!valid){
            return
          }
            if(this.isedit){
              this.addform.id=this.editid
            }else {
              this.addform.id=0
            }

            this.$http.post('api/TrainArea/addAndUpdateArea',this.addform).then(res=>{
              //return
              //新增返回
              console.log('新增返回')
              console.log(res.data)
              if(res.data=="OK"){
                this.$message.success('设置区域成功')
                this.addialogvisible=false
                this.getUserlist()

              }else{
                this.$message.error(res.data)
              }
            }).catch(res=>{
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
        this.isedit=true
        //编辑信息页面展示
        this.editid=id
        this.$http.get(`api/TrainArea/getTrainArea/${id}`).then(res=>{
          console.log('获取单个信息')
          console.log(res.data)
          //赋值文件数组
          this.addform.name=res.data.name
          this.addform.remark=res.data.remark
          this.addialogvisible=true

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

      resetquery(){
        //重置按钮事件
        this.queryInfo.value1=''
        this.queryInfo.value2=''
        this.areavalue=''
        this.getUserlist()
        this.clearSelection()
        this.queryInfo.pagenum=1
      },

      handleSelectionChange(val){
        console.log(val)
        let id=val.map(function(item) {
          return item.id
        })
        this.sels=id
      },
      xinzeng(){
        this.addialogvisible=true
      },
      handlesuccess(res,file,filelist){
        //  上传成功
        console.log('上传成功')
        console.log(res)
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
    .el-form-item{
      margin-bottom: 12px;
    }

  }
  .ghg{

    float: left !important;
  }
  .mingh1{
    min-width: 800px;
  }
  .gh{
    margin-bottom: 25px !important;
  }
  .sles{
    width: 70px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #c3c7da;
    font-size: 12px;
    outline: none;
  }
  .el-cascader-menu__wrap{
    height: 200px !important;
  }

</style>
