<template>
  <div class="mingh1">

    <el-card>
      <el-row :gutter="21">
        <el-col :span="8">
          <!--  clearable可清空-->
          <span class="smallspan">姓名:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1"
                    class="singleel_input"
                    size="mini"
                    clearable></el-input>

        </el-col>
        <el-col :span="8">
          <span class="smallspan">授课名称:</span>
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
        <el-button type="primary" @click="xinzeng"
                   size="mini" style="margin-left: 10px"  class="ghg">新增</el-button>
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
          prop="realName"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="teacherCode"
          label="教师编码"
        >
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="65px"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.sex">男</span>
            <span v-if="scope.row.sex">女</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="phone"
          label="联系电话">
        </el-table-column>

        <el-table-column
          prop="subjectIdLstTxt"
          label="授课名称">
        </el-table-column>
        <el-table-column
          prop="entryTime"
          label="入职日期"
          width="155px"
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
            <span>|</span>
            <span @click="showpassworddialog(scope.row.userId)">修改密码</span>
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
        :page-sizes="[10,15,total]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

    <!--新增教师-->
    <el-dialog
      title="新增教师"
      :visible.sync="addialogvisible"
      width="60%"
      @close="addialogclose"
    >
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef"
               label-width="70px"
               class="addformclas">
        <el-row class="rowclass">
          <el-col :span="9" class="leftdia">
            <el-form-item label="姓名:" prop="realName"  label-width="115px" class="gh">
              <el-input v-model="addform.realName" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="rightdia">
            <el-form-item label="性别:"
                          label-width="115px"
                          prop="sex"
            >
              <select v-model="addform.sex">
                <option disabled value="">请选择</option>
                <option value="0">男</option>
                <option value="1">女</option>
              </select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="教师编码:" prop="teacherCode"  label-width="115px" class="gh">
            <el-input v-model="addform.teacherCode" size="mini"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="13" class="leftdia">
            <el-form-item label="联系电话:" prop="phone"  label-width="115px">
              <el-input v-model="addform.phone" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="rightdia">
            <el-form-item label="职务/职称:" label-width="115px" prop="duty">

              <select v-model="addform.duty">
                <option disabled value="">请选择</option>
                <option value="0">无</option>
                <option value="1">初级</option>
                <option value="2">中级</option>
                <option value="3">高级</option>
              </select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="身份证号码:" prop="idCode" label-width="115px">
          <el-input v-model="addform.idCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="授课名称:" prop="subjectName" label-width="115px">
          <el-cascader
            :options="options"
            :props="subjectProps"
            @change="subtechge"
            v-model="subectteacher"
            clearable
            class="hddd"
            size="mini"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="入职日期:" label-width="115px" prop="entryTime">
          <!--datepicker    Mon Mar 16 2020 00:00:00 GMT+0800 (中国标准时间)-->
          <el-date-picker
            size="mini"
            v-model="addform.entryTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="上传附件:" prop="upload" label-width="115px">

          <el-upload
            action="http://192.168.1.15:8002/api/Home/uploads"
            :on-success="handlesuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            list-type="text"
            multiple
            ref="upload"
            accept=".xls,.xlsx,.png,.jpeg,.jpg,.rar,.zip,.doc,.docx,.pdf"
            name="files"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">（1）支持多文件上传,扩展名:.rar.zip.doc.docx.pdf.jpg...</div>
            <div slot="tip" class="el-upload__tip">（2）单文件不能超过100M</div>
          </el-upload>
        </el-form-item>


      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="addialogvisible = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="addUser" size="mini">确 定</el-button>
  </span>
    </el-dialog>



    <!--编辑用户-->
    <el-dialog
      title="编辑教师"
      :visible.sync="editalogvisible"
      width="60%"
      @close="editdialogclosed"
      class="addformclas"
    >
      <el-form  :model="editform1" label-width="70px" :rules="editformrules"
                ref="editformref"
      >
        <el-row class="rowclass">
          <el-col :span="9" class="leftdia">
            <el-form-item label="姓名:" prop="realName"  label-width="115px" class="gh">
              <el-input v-model="editform1.realName" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="rightdia">
            <el-form-item label="性别:"
                          label-width="115px"
                          prop="sex"
            >
              <select v-model="editform1.sex">
                <option disabled value="">请选择</option>
                <option value="false">男</option>
                <option value="true">女</option>
              </select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="教师编码:" prop="teacherCode"  label-width="115px" class="gh">
            <el-input v-model="editform1.teacherCode" size="mini"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="13" class="leftdia">
            <el-form-item label="联系电话:" prop="phone"  label-width="115px">
              <el-input v-model="editform1.phone" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="rightdia">
            <el-form-item label="职务/职称:" label-width="115px" prop="duty">

              <select v-model="editform1.duty">
                <option disabled value="">请选择</option>
                <option value="0">无</option>
                <option value="1">初级</option>
                <option value="2">中级</option>
                <option value="3">高级</option>
              </select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="身份证号码:" prop="idCode" label-width="115px">
          <el-input v-model="editform1.idCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="授课名称:" prop="subjectName" label-width="115px">
          <el-cascader
            :options="options"
            :props="subjectProps"
            @change="subtechge2"
            v-model="subectteacher2"
            clearable
            class="hddd"
            size="mini">
          </el-cascader>
        </el-form-item>

        <el-form-item label="入职日期:" prop="entryTime" label-width="115px">
          <!--datepicker    Mon Mar 16 2020 00:00:00 GMT+0800 (中国标准时间)-->
          <el-date-picker
            size="mini"
            v-model="editform1.entryTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="上传附件:" prop="upload" label-width="115px">

          <el-upload
            :file-list="filearryulan"
            action="http://192.168.1.15:8002/api/Home/uploads"
            :on-preview="handlePreview"
            :on-remove="handleRemove2"
            list-type="text"
            :before-upload="beforeUpload"
            multiple
            :on-success="handlesuccess2"
            ref="editref"
            name="files"
            accept=".xls,.xlsx,.png,.jpeg,.jpg,.rar,.zip,.doc,.docx,.pdf">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">（1）支持多文件上传,扩展名:.rar.zip.doc.docx.pdf.jpg...</div>
            <div slot="tip" class="el-upload__tip">（2）单文件不能超过100M</div>
          </el-upload>
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
        fileTemp:'',
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        entryTime:null,
        defaultProps:{
          label:'lable',
          value:'id'
        },
        filearryulan:[],
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
        datepicker:'',
        options2:[
          {
            value: '0',
            label: '批量启动'
          },
          {
            value: '1',
            label: '批量停用'
          },
          // {
          // value:'2',
          //   label:'导入表格'
          // },
          {
            value: '3',
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
          value1:'',
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
        ischange:false,
        addform:{
          //   //文件的数组
          pics:[],
          realName:'',
          teacherCode:'',
          phone:'',
          // idCode:'',
          sex:"",
          duty:0,
          entryTime:""
        },
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
            {min:6,max:15,message:'长度在6到15之间',trigger:'blur'},
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
          ]
          // idCode:[
          //   {required: true, message: '请输入身份证号码', trigger: 'blur'}
          //   // {validator:checkPersonCode,trigger:'blur'}
          // ],
          // duty:[
          // //  职称
          //   {required:true,validator:checkLevel,trigger:'blur'}
          // ]

        },
        checkList2:[],
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
        base:''



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
      this.base=this.BASE_URL
      //分页查询
      this.getUserlist()
      //  获取所有科目
      this.getsubjectList()
    },
    methods:{

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
          this.$confirm(`将要批量${warningtext}教师,是否继续？`,'提示',{
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
              // this.$message.warning(`已取消批量${warningtext}`)
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

      handleRe1(file,fileList){
        this.fileTemp = null
      },

      daochu(){

        // 批量导出
        /* generate workbook object from table */
        // let wb = XLSX.utils.table_to_book(document.querySelector(
        //   '.studenttable'));
        // let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        // try {
        //   FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '教师信息表.xlsx');
        // } catch (e)
        // {
        //   if (typeof console !== 'undefined')
        //     console.log(e, wbout)
        // }
        // return wbout
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../vendor/Export2Excel');
          const tHeader = ['姓名','教师编码','性别','联系电话','授课名称','入职日期'];            // 对应表格输出的title
          const filterVal = ['realName','teacherCode','sex','phone','subjectIdLstTxt','entryTime'];                             // 对应表格输出的数据
          const list = this.userlist;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '教师信息表');                   //对应下载文件的名字
        })





      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
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

        this.checkList1=val
        console.log('check后')
        console.log(this.checkList1)
      },
      openstates(){
        //批量启用
        this.$http.post(`${this.base}/api/Teacher/updateStates/true`,this.sels).then(res=>{

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
        this.$http.post(`${this.base}/api/course/delcourses/`,this.sels).then(res=>{
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
        this.$http.post(`${this.base}/api/Teacher/updateStates/false`,this.sels).then(res=>{

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
      getsubjectList(){
        this.$http.get(`${this.base}/api/Subject/getAllSubject`).then(res=>{
          console.log('获取所有科目')
          console.log(res.data)
          this.options=res.data[0].children
        }).catch(res=>{
          console.log("获取所有科目失败")
        })
      },
      chaxun(){
        this.queryInfo.pagenum=1
        this.getUserlist()
      },
      getUserlist(){
        // console.log('我给的')
        // console.log(this.queryInfo)
        this.$http.post(`${this.base}/api/Teacher/getTeacherByPage`,this.queryInfo).then(res=>{
          console.log('获取table信息')
          console.log(res.data)
          this.userlist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取教师列表失败")
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

      //添加对话框关闭事件
      addialogclose(){
        this.$refs.addFormRef.resetFields()
        this.subectteacher=''
        this.addform.pics=[]
        this.$refs.upload.clearFiles()
      },
      passwordaction(){
        //  确定修改密码
        this.$refs.passwordformref.validate(async valid=>{
          if(!valid){
            this.$message.error('请检查密码格式!')
            return
          }
          this.$http.post(`${this.base}/api/User/updatePassword`,{
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

          //添加性别 1/0
          this.addform.sex=Number(this.addform.sex)
          //添加授课级别
          // this.addform.duty=Number(this.teachlevel)
          //添加授课科目
          this.addform.subjectIdArr=this.checkList1

          this.$http.post(`${this.base}/api/Teacher/addTeacher`,this.addform).then(res=>{
            console.log('我的addform')
            console.log(this.addform)
            // return
            //新增返回
            console.log('新增返回')
            console.log(res.data)

            if(res.data=="OK"){
              this.getUserlist()
              this.$message.success('添加成功')
              this.addialogvisible=false


            }else{
              console.log('走了else')
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
        //编辑信息页面展示
        this.editform1.id=id
        this.$http.get(`${this.base}/api/Teacher/getTeacher/${id}`).then(res=>{
          console.log('获取单个信息')
          console.log(res.data)
          //赋值文件数组
          // this.editform1.pics=res.data.pics
          this.editform1=res.data
          this.subectteacher2=res.data.subjectIdArr
          this.editalogvisible=true


          let fileyulanarr=res.data.pics
          console.log('返回的fileyulanarr')
          console.log(res.data.pics)
          if(fileyulanarr==[]){
            //  如果是空文件返回
            this.filearryulan=[]
          }else{
            this.editform1.pics=res.data.pics
            fileyulanarr.forEach((item)=>{
              let obj2=new Object()
              obj2.url="http://192.168.1.15:8003/"+item
              // obj2.name=item.split("\\")[1]
              obj2.name=item
              this.filearryulan.push(obj2)

            })

          }




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
        this.$refs.editref.clearFiles()
        this.filearryulan=[]
      },
      editUserInfo(){
        this.$refs.editformref.validate(async valid=>{
          if(!valid){
            return
          }
          //编辑用户请求
          this.checkList2=[]
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

          console.log('我给的editform')
          console.log(this.editform1)
          // console.log(this.checkList2)
          this.$http.post(`${this.base}/api/Teacher/updateInfo`,this.editform1).then(res=>{
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
        this.$confirm('此操作将永久删除教师, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          //  如果用户确认了删除  返回的是confirm字符串
          //如果用户取消了删除  返回的是cancel字符串
        }).then(() => {
          this.$http.get(`${this.base}/api/Teacher/delTeacher/${id}`).then(
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
            this.$http.post(`${this.base}/api/user/delusers`,this.sels).then(res=>{
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

      setroledialog(){
        this.selectedroleid=""
        this.userinfo={

        }
      },

      resetquery(){
        //重置按钮事件
        this.queryInfo.value1=''
        this.queryInfo.value2=''
        this.cascadervalue=''
        this.getUserlist()
        this.queryInfo.pagenum=1
        this.sels=[]
        this.clearSelection()
      },
      levelhandlechange(){

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
      },
      xinzeng(){
        this.addialogvisible=true
        this.addform.pics=[]

      },
      handlesuccess(res,file,filelist){
        //  上传成功
        console.log('上传成功')
        console.log(res)
        this.addform.pics.push(res)

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
    margin-right: 20px;
  }
  .mingh1{
    min-width: 800px;
  }
  .hddd{
    width: 100%;
  }


</style>
