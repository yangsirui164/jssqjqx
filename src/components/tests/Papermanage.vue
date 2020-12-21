<template>
  <div class="mingh1">

    <el-card>
      <el-row :gutter="21">
        <el-col :span="6">
          <!--  clearable可清空-->
          <span class="smallspan">试卷名称:</span>
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
        <el-col :span="4">
          <span class="smallspan">科目:</span>
          <select v-model="queryInfo.value3" class="sles">
            <option disabled value="">请选择</option>
            <option :value="item.id" v-for="(item,index) in subjectarr"
                    :key="item.id">
              {{item.lable}}
            </option>

          </select>
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
          prop="title"
          label="试卷名称"
          width="155px"
        >
        </el-table-column>
        <el-table-column
          prop="subjectTxt"
          label="科目"
        >
        </el-table-column>

        <el-table-column
          prop="publishUserName"
          label="发布人">
        </el-table-column>
        <el-table-column
          prop="publishDate"
          label="发布时间"

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

                  </span>未发布</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column width="160px"
                         label="操作">
          <template slot-scope="scope">
            <span @click="showeditdialog(scope.row.id,scope.row)"
                  :style="{color:(scope.row.state!=0?'gray':'blue')}">编辑</span>
            <span>|</span>
            <span @click="removeUserbyid(scope.row.id)">删除</span>
            <span>|</span>
            <span @click="chaKanbyid(scope.row.id)">查看</span>

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
    <!--    编辑试卷名-->
    <el-dialog
      :visible.sync="editdialogvisible"
      width="60%"
      @close="editdialogclose"
      class="diq"
    >
      <el-form ref="shijuanref" :rules="shijuanrules" :model="editform1">
        <el-form-item label="试卷标题:" prop="title"  label-width="95px">
          <el-input v-model="editform1.title" size="mini"
                    class="bvv"></el-input>
        </el-form-item>
        <el-row type="flex" justify="end">
          <el-button @click="editdialogvisible=false" size="mini">取 消</el-button>
          <el-button type="primary" @click="xiugaititle" size="mini">确 定</el-button>
        </el-row>
      </el-form>

    </el-dialog>

    <el-dialog
      :visible.sync="addialogvisible"
      width="60%"
      @close="addialogclose"
      class="diq"
    >
      <div class="papercontent">
        <h2 class="h2title">
          {{paperform.title}}
        </h2>
        <div class="publicuser">
          发布人:{{paperform.publishUser}}
        </div>
        <div class="zongscore">
          总分数:{{totalsingle+totalmore}}分
        </div>
        <div class="singlecheck">
          <h5 class="h555">一.单选题{{'('+totalsingle+'分)'}}</h5>
          <div v-for="(item,index) in paperform.singelCheck" class="singletest">
            <div class="timu">
              <span>{{index+1+'.'}}</span>
              <span>{{item.contents}}</span>
              <span>{{'('+item.score+'分)'}}</span>
            </div>
            <div class="daan">
              <!--           答案部分-->
              <div v-for="(item2,index2) in item.answerArr" class="daandiv">
                <span>{{xxArr[index2]}}</span>
                <span>{{item2}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="singlecheck">
          <h5 class="h555">二.多选题{{'('+totalmore+'分)'}}</h5>
          <div v-for="(item,index) in paperform.moreCheck" class="singletest">
            <div class="timu">
              <span>{{index+1+'.'}}</span>
              <span>{{item.contents}}</span>
              <span>{{'('+item.score+'分)'}}</span>
            </div>
            <div class="daan">
              <!--           答案部分-->
              <div v-for="(item2,index2) in item.answerArr" class="daandiv">
                <span>{{xxArr[index2]}}</span>
                <span>{{item2}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>




  </div>
</template>
<script>
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
        if(regEmail.test(value)){
          return  callback()

        }
        return callback(new Error('请输入合法邮箱'))



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
        xxArr:['A.','B.','C.','D.','E.','F.','G.','H','I','J'],
        dialogImageUrl:'',
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        wenben:true,
        entryTime:null,
        iskuaisu:true,
        defaultProps:{
          label:'lable',
          value:'id'
        },
        subjectarr:[],
        mokuaiProps:{

        },
        editid1:'',
        editdialogvisible:false,
        totalmore:'',
        //transfer数据源
        transferData:[],
        checkList:[],
        editform1:{
          title:'',
          id:0
        },

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
        queryInfo2:{
          username:'',
          name:''
        },
        userlist:[],
        total:0,
        optionsmokuai:'',
        mokuaidata:'',
        //用户对话狂
        addialogvisible:false,
        editalogvisible:false,

        jobselect2:'',
        sexselect2:'',
        subectteacher2:'',
        datepicker2:'',
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
        levelmodel:[],
        editform:{
          id:''
        },
        totalsingle:'',
        passwordform:{
          password1:'',
          password2:''
        },
        userinfo:{

        },
        subectteacher:'',
        shijuanrules:{
          title:[
            {required:true,message:'请输入试卷标题',trigger:'blur'}
          ]
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
        paperform:{

        },
        checkList2:[],
        loginid:'',
        base:'',
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
        dialogVisible:false



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
            this.getTestlist()
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
      //  获取所有科目
      this.getsubjectList()
      //分页查询
      this.getTestlist()
    },
    methods:{
      jiaojuan(){

      },
      xiugaititle(){
        this.$refs.shijuanref.validate(
          valid=>{
            if(!valid){
              return
            }
            this.editform1.id=this.editid1
            this.$http.post(`${this.base}/api/Paper/updatePaperTitle`,this.editform1).then(res=>{

              if(res.data=='OK'){
                this.$message.success('编辑试卷成功')
                this.editdialogvisible=false
                this.getTestlist()
              }
            }).catch(res=>{
              console.log('修改试卷失败')
            })
          }
        )

      },
      editdialogclose(){
        this.$refs.shijuanref.resetFields()
      },
      daoru(){

      },
      getsubjectList(){
        this.$http.get(`${this.base}/api/Subject/getAllSubject`).then(res=>{
          console.log('返回列表')
          console.log(res.data)
          this.subjectarr=res.data[0].children

        }).catch(res=>{
          console.log('获取科目失败')
        })
      },
      piliangpull(){
        this.$confirm('此操作将撤回发布试卷,是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http.post(`${this.base}/api/Paper/updateStates/${this.loginid}/false`,this.sels).then(res=>{
            console.log('批量撤回返回')
            console.log(res.data)
            if(res.data=='Ok'){
              this.$message.success('批量撤回成功')
              this.sels=[]
              this.clearSelection()
              this.getTestlist()
            }else{
              this.sels=[]
              this.clearSelection()
              // this.$message.error('批量撤回失败')
            }
          }).catch(res=>{
            this.sels=[]
            this.clearSelection()
            console.log('批量撤回失败')
          })
        }).catch(() => {
        });
      },
      avatorsuccess(res){
        this.ediform1.pics.push(res)
      },
      handlePictureCardPreview(file){
        console.log('头像路径')
        console.log(file.url)
        // 头像预览
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(val){
        console.log('选择变化')
        console.log(val)
        this.queryInfo.value2=val[0]
      },
      mokuaichange(val){

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
            this.getTestlist()
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
        this.$confirm('此操作将删除试卷,是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http.post(`${this.base}/api/Paper/delPapers`,this.sels).then(res=>{

            if(res.data=='OK'){
              this.$message.success('批量删除成功')
              this.sels=[]
              this.clearSelection()
              this.getTestlist()
            }else{
              this.sels=[]
              this.clearSelection()
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
        this.$confirm('此操作将发布试卷,是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http.post(`${this.base}/api/Paper/updateStates/${this.loginid}/true`,this.sels).then(res=>{
            console.log('批量发布返回')
            console.log(res.data)
            if(res.data=='Ok'){
              this.$message.success('批量发布成功')
              this.sels=[]
              this.clearSelection()
              this.getTestlist()
            }else{
              this.sels=[]
              this.clearSelection()
              this.$message.error('批量发布失败')
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
            this.getTestlist()
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
        this.getTestlist()

      },
      chaKanbyid(id){
        this.addialogvisible=true
        this.$http.get(`${this.base}/api/paper/getpaperinfo/${id}`).then(res=>{
          console.log('查看试卷')
          this.paperform=res.data
          console.log(this.paperform)
          const paperdata=res.data
          //单选题总分数
          var totalsinglescore=0
          paperdata.singelCheck.forEach((item,index)=>{
            totalsinglescore=totalsinglescore+item.score
          })
          this.totalsingle=totalsinglescore

          //  多选题总分数
          var totalmorescore=0
          paperdata.moreCheck.forEach((item,index)=>{
            totalmorescore=totalmorescore+item.score
          })
          this.totalmore=totalmorescore
        }).catch(res=>{
          console.log('获取失败')
        })

      },
      getTestlist(){
        this.$http.post(`${this.base}/api/paper/getPaperByPage`,this.queryInfo).then(res=>{
          console.log('获取table信息')
          console.log(res.data)
          this.userlist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取table失败")
        })

      },
      sexhandlechange(val){
        this.addform.sex=val
      },
      //监听每页？条数据  的事件
      handleSizeChange(val){
        // console.log(val)
        this.queryInfo.pagesize=val
        this.getTestlist()
      },
      //监听页码值改变的事件
      handleCurrentChange(val){
        // console.log(val)
        this.queryInfo.pagenum=val
        this.getTestlist()
      },

      //添加对话框关闭事件
      addialogclose(){
        // this.$refs.addFormRef.resetFields()
        // this.subectteacher=''
        // this.addform.pics=[]
        // this.$refs.upload.clearFiles()
      },

      showeditdialog(id,scoperow){
        this.editid1=id
        if(scoperow.state!=0){
          return
        }
        //编辑信息页面展示
        this.$http.get(`${this.base}/api/paper/getpaper/${id}`).then(res=>{
          this.editform1.title=res.data.title
          this.editdialogvisible=true
        }).catch(res=>{
          console.log('获取试卷信息失败')
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
      },
      removeUserbyid(id){
        this.editform.id=id
        //返回值是一个promise
        this.$confirm('此操作将删除试卷, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(`${this.base}/api/Paper/delPaper/${id}`).then(
            res=>{
              console.log(res.data)
              if(res.data=="Ok"){
                this.$message.success('删除成功')
                this.getTestlist()
              }
            }
          ).catch(res=>{
            console.log('删除资源失败')
          })
        }).catch(() => {

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
              this.getTestlist()
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
      async getsmallUserlist(){
        // 查询框函数

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
        this.queryInfo.value3=''
        this.getTestlist()
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
        this.$router.push('/addpaper')
      },
      handlesuccess(res,file,filelist){
        //  上传成功
        console.log('上传成功')
        console.log(res)
        // console.log(file)
        // console.log(filelist)
        this.addform.pics.push(res)

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
    width: 100px;
    height: 30px;
    border-radius: 3px;
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
  .bvv{
    width: 180px;
  }
  .h2title{
    font-weight:500;
    text-align: center;
  }
  .publicuser{
    font-weight:500;
    text-align: center;
  }
  .h555{
    color: rgb(103,194,58);
  }
  .zongscore{
    font-weight:500;
    text-align: center;
    margin-top: 5px;
  }
  .singletest{
    border-bottom: 1px solid lightgray;
    padding: 6px 0px;

  }
</style>
