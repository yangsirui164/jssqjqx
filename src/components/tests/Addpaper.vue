<template>
  <div>

    <el-card   v-loading="loading"
               element-loading-text="正在生成试卷">
      <el-button type="primary" @click="outputsource" size="mini"
                 class="backbtn">返回</el-button>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick"
      >
        <el-tab-pane label="智能组卷" name="first">
          <el-form  :model="editform1" label-width="70px" :rules="editformrules"
                    ref="editformref"
          >
            <el-form-item label="科目名称:" prop="subjectName" label-width="95px">
              <el-cascader
                :options="options"
                :props="subjectProps"
                @change="subtechge"
                v-model="subectteacher"
                clearable
                class="formhj"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="试卷标题:" prop="title"  label-width="95px">
              <el-input v-model="editform1.title" size="mini"
                        class="formhj"></el-input>
            </el-form-item>
            <el-row type="flex" align="middle">
              <el-form-item label="单选题数:" prop="singleNum"  label-width="95px">
                <el-input v-model.number="editform1.singleNum" size="mini"
                          class="formhj"></el-input>
                <span style="margin-left: 15px">题库题数:{{singlenumber}}</span>
              </el-form-item>

            </el-row>
            <el-row>
              <el-form-item label="多选题数:" prop="moreNum"  label-width="95px">
                <el-input v-model.number="editform1.moreNum" size="mini"
                          class="formhj"></el-input>
                <span style="margin-left: 15px">题库题数:{{morenumber}}</span>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="备注:" prop="remark"  label-width="95px">
                <el-input v-model="editform1.remark" size="mini"
                          class="formhj"
                          type="textarea"
                ></el-input>
              </el-form-item>
            </el-row>

            <el-row type="flex" justify="end">
              <el-button @click="quxiaosavepaper()" size="mini">
                重置
              </el-button>
              <el-button @click="savepaper()" type="primary" size="mini" v-if="!isshengcheng">
                生成试卷
              </el-button>
              <el-button @click="yulantests()" type="success" size="mini"
                         v-show="createdpaper">
                预览试卷
              </el-button>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="手动组卷" name="second">
          <el-form :rules="editform2rules" ref="editform2ref" :model="editform2">
            <el-form-item label="试卷标题:" prop="title"  label-width="95px">
              <el-input v-model="editform2.title" size="mini"
                        class="formhj"
                        :disabled="hassc"></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="remark"  label-width="95px">
              <el-input v-model="editform2.remark" size="mini"
                        class="formhj"
                        type="textarea"
                        :disabled="hassc"></el-input>
            </el-form-item>
          </el-form>
          <el-row>
            <span class="hgf">试题库:</span>
            <el-button type="success" size="mini"
                       @click="getTestslist()"
                       :disabled="hassc">手动选择</el-button>
          </el-row>
        </el-tab-pane>


      </el-tabs>

    </el-card>
    <!--    已选试题外部-->
    <el-card class="haschoosed" v-show="showsecondcard">
      <h3>已选试题</h3>
      <el-table :data="choosedtests" border stripe
      >
        <el-table-column type="index" label="序号">
          <template slot-scope="scope"><span>{{scope.$index+(queryInfo.pagenum-1)*queryInfo.pagesize+1}}</span></template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">

              <el-form-item label="题目内容:" class="reditem">
                <span>{{ props.row.contents}}</span>
              </el-form-item>
              <el-form-item label="题目答案:">
                <div v-for="(item2,index2) in props.row.answerArr" class="daandiv">
                  <span>{{xxArr[index2]}}</span>
                  <span>{{item2}}</span>
                </div>

              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="380px"
        >
        </el-table-column>

        <el-table-column
          prop="score"
          label="分数"
        >
        </el-table-column>
        <el-table-column
          prop="typeTxt"
          label="类型"
        >
        </el-table-column>
        <el-table-column
          prop="subjectName"
          label="科目"
        >
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <span @click="removeUserbyid(scope.row.id)"
                  :style="{color:(hassc?'gray':'blue')}">删除</span>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange4"
        @current-change="handleCurrentChange4"
        :current-page="queryInfo2.pagenum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo2.pagesize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total4">
      </el-pagination>

      <el-row type="flex" justify="end">
        <el-button @click="quxiaosavepaper4()" size="mini">
          重置
        </el-button>

        <el-button @click="savepaper4()" type="primary" size="mini" v-if="!isshengcheng1">
          生成试卷
        </el-button>
        <el-button @click="yulantests()" type="success" size="mini"
                   v-show="createdpaper4">
          预览试卷
        </el-button>


      </el-row>
    </el-card>

    <!--选择试题弹出框-->
    <el-dialog
      title="试题库选择"
      :visible.sync="choosedialogvisible"
      width="60%"
      @close="choosedialogclose"
      class="diq"
    >
      <el-row :gutter="21" type="flex" align="middle">
        <el-col :span="8">
          <span class="smallspan">类型:</span>
          <el-cascader
            :options="typeoptions"
            :props="typeProps"
            @change="typechge"
            v-model="queryInfo.value5"
            clearable
            class="formhj1"
          >
          </el-cascader>
        </el-col>

        <el-col :span="8">
          <span class="smallspan">科目:</span>
          <el-cascader
            :options="options"
            :props="subjectProps"
            @change="subtechge1"
            v-model="queryInfo.value6"
            clearable
            class="formhj1"
          >
          </el-cascader>

        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="chaxun"
                     size="mini">
            查询
          </el-button>
          <el-button type="info" @click="resetquery"
                     size="mini">
            重置
          </el-button>
        </el-col>
      </el-row>
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
        <!--        展开行-->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">

              <el-form-item label="题目内容:" class="reditem">
                <span>{{ props.row.contents}}</span>
              </el-form-item>
              <el-form-item label="题目答案:">
                <div v-for="(item2,index2) in props.row.answerArr" class="daandiv">
                  <span>{{xxArr[index2]}}</span>
                  <span>{{item2}}</span>
                </div>

              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!--        添加索引-->
        <!--                  <el-table-column type="index" label="序号"-->
        <!--                  >-->
        <!--                    <template slot-scope="scope"><span>{{scope.$index+(queryInfo.pagenum-1)*(queryInfo.pagesize)+1}}</span></template>-->
        <!--                  </el-table-column>-->
        <el-table-column
          prop="title"
          label="标题"
          width="310px"
        >
        </el-table-column>
        <el-table-column
          prop="subjectName"
          label="科目"

        >
        </el-table-column>
        <el-table-column
          prop="score"
          label="分数"
        >
        </el-table-column>
        <el-table-column
          prop="typeTxt"
          label="类型"
        >
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10,20]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-row type="flex" justify="end">
        <el-button type="success"
                   @click="addtests"
                   size="mini">确定</el-button>
      </el-row>


    </el-dialog>


    <!--预览试卷-->
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
      var singleCheck=(rule,value,callback)=>{
        console.log(typeof(value))
        if(value>this.singlenumber){
          return callback(new Error('试题超出题库数量'));
        }
        return callback()
      }

      var moreCheck=(rule,value,callback)=>{
        if(value>this.morenumber){
          return callback(new Error('试题超出题库数量'));
        }
        return callback()
      }
      return{
        getRowKeys(row) {
          return row.id
        },
        moduleProps:{

        },
        showsecondcard:false,
        paperform:{

        },
        base:'',
        paperform4:{

        },
        uploadtests:[],
        isshengcheng1:false,
        isshengcheng:false,
        totalsingle:'',
        totalmore:'',

        activeName: 'first',
        subjectarr:[],
        wenben:true,
        fileType:'',
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        typeProps:{
          label:'label',
          value:'id',
          multiple: true
        },
        xxArr:['A.','B.','C.','D.','E.','F.','G.','H','I','J'],
        entryTime:null,
        iskuaisu:true,
        defaultProps:{
          label:'lable',
          value:'id'
        },

        mokuaiProps:{

        },

        editformrules:{
          title:[
            { required: true, message: '请输入试卷标题', trigger: 'blur' }
          ],
          singleNum:[
            { required: true, message: '请输入单选题数', trigger: 'blur' },
            { type: 'number', message: '必须为数字值', trigger: 'blur'},
            {validator:singleCheck, trigger: 'blur'}
          ],
          moreNum:[
            { required: true, message: '请输入多选题数', trigger: 'blur' },
            { type: 'number', message: '必须为数字值', trigger: 'blur'},
            {validator:moreCheck, trigger: 'blur'}

          ]

        },
        fileData:'',
        //transfer数据源
        transferData:[],
        checkList:[],
        hassc:false,
        editform2rules:{
          title:[
            { required: true, message: '请输入试卷标题', trigger: 'blur' }
          ],
          remark:[

          ]
        },
        editform3rules:{
          title:[
            { required: true, message: '请输入试卷标题', trigger: 'blur' }
          ],
          remark:[

          ]
        },
        editform1:{
          subjectIdArr:[],
          title:'',
          singleNum:'',
          moreNum:''
        },
        editform2:{
          title:'',
          remark:'',
          publishuser:''
        },
        editform3:{
          title:'',
          remark:'',
          id:0,
          publishUser:'',
          topicLst:[]

        },

        datepicker:'',
        typeoptions:[
          {
            id:0,
            label:'单选题'
          },
          {
            id:1,
            label:'多选题'
          }
        ],
        options:[],
        cascadervalue2:[],
        cascadervalue:[],
        hahhaha:'',//修改密码
        passworddiavisible:false,
        setpowervisible:false,
        sels: [],//选中的值显示
        dialogVisible: false,
        queryInfo2:{
          pagenum:1,
          pagesize:5
        },
        tabname:'',
        //  获取用户列表的参数
        queryInfo:{
          value1:0,
          //查询参数  可为空
          value5:'',
          value6:'',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:5
        },
        choosedtests:[],
        userlist:[],
        total:0,
        total4:0,
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
          coverPicArr:[],
          viewFileArr:[],
          sourceFileArr:[],
          contents:'',
          type:'0',
          subjectId:'',
          title:'',
          author:''
          // openstatus:'2'

        },
        modeldata:'',
        levelmodel:[],
        editform:{
          id:''
        },
        covericarr:[],
        filearr:[],
        filearryulan:[],
        videoarr:[],
        passwordform:{
          password1:'',
          password2:''
        },
        userinfo:{

        },
        fileTemp:'',
        loading:false,
        loading2:false,
        isqueding:false,
        subectteacher:'',
        checkList1:[],
        upload:"",
        loginid:'',
        dialogImageUrl:'',
        createdTime:'',
        checkList2:[],
        setrolelogvisible:false,
        roleslist:{

        },
        linshiid:'',
        ischange:false,
        disablesc:false,
        eventid:'',
        checkList3:[],
        choosedialogvisible:false,
        createdpaper:false,
        createdpaper4:false,
        singlenumber:'',
        morenumber:'',
        selectedroleid:'',
        sourceid:'',
        order:'',
        chooseform:{

        }



      }
    },
    created() {
      this.base=this.BASE_URL
      //  获取所有科目st
      this.getsubjectList()
      const loginid=window.sessionStorage.getItem('loginid')
      this.loginid=loginid

    },
    mounted() {
      this.getTestCount()

    },
    computed:{
      //定义一个对象
      bothvalue(){
        const {value5,value6}=this.queryInfo
        return{
          value5,
          value6
        }
      }
    },

    watch:{
      // 监听两个input值为空时  重新获取列表
      bothvalue:{
        handler:function(newval) {
          console.log("both有变化",newval)
          if(newval.value5==""&&newval.value6==""){
            this.getTestlist()
          }
        },
        deep:true
      },
      "sels":function(newval) {
        // console.log('监控')

      },
      datepicker:function(val) {
        // console.log(val)
      },
      "addform.type":function(val) {
        if(this.isqueding==false){
          // console.log(val)
          // console.log('数据变')

          if(val=='0'){
            this.wenben=true
            // this.$refs.upload.clearFiles()
          }else if(val=='1'){
            this.wenben=false
            // this.$refs.upload.clearFiles()
          }else{

          }
        }

      }

    },
    methods:{
      gethaschoes(){
        // 已选择试题
        this.queryInfo2.value1=this.queryInfo.value1
        this.$http.post(`${this.base}/api/paper/getPaperTopicByPage`,this.queryInfo2).then(res=>{
          console.log('返回试题列表')
          console.log(res.data)
          this.choosedtests=res.data.data
          this.total4=res.data.total
          this.choosedialogvisible=false
        }).catch(res=>{
          console.log('获取试题列表失败')
        })
      },
      addtests(){

        this.$http.post(`${this.base}/api/paper/updatePaperTopic/${this.queryInfo.value1}`,this.sels).then(res=>{
          // console.log('提交试题返回')
          // console.log(res.data)
          if(res.data=='OK'){
            console.log('添加试题成功')
            this.gethaschoes()
          }
        }).catch(res=>{
          console.log('提交试题失败')
        })
      },
      choosedialogclose(){
        console.log('关了')
        this.checkList2=[]
        this.checkList3=[]
        this.clearSelection()
      },
      typechge(val){
        this.checkList2=[]
        val.forEach((item)=>{
          this.checkList2.push(item[0])
        })

      },
      getTestslist(){
        //获取试题库
        this.$refs.editform2ref.validate(async valid=>{
          if(!valid){
            // this.$message.error('请输入试卷标题!')
            return
          }
          this.editform2.publishuser=Number(this.loginid)
          this.editform2.id=this.queryInfo.value1
          this.$http.post(`${this.base}/api/paper/addOrUpdatePaper`,this.editform2).then(res=>{
            console.log('返回id')
            console.log(res.data)
            //paper的id
            this.queryInfo.value1=res.data
            this.getTestlist()
          }).catch(res=>{

          })

          this.choosedialogvisible=true
        })

      },
      savepaper4(){

        this.hassc=true

        //第二个选项卡
        if(this.tabname=='second'){
          this.$refs.editform2ref.validate(async valid=>{
            if(!valid){
              return
            }
            this.editform1.subjectIdArr=this.checkList1
            this.editform2.id=this.queryInfo.value1
            this.$http.post(`${this.base}/api/paper/updatePaper1`,this.editform2).then(res=>{
              console.log('生成试卷返回')
              console.log(res.data)
              if(res.data.result=='OK'){
                this.$message.success('生成试卷成功')
                this.createdpaper4=true
                const paperdata=res.data.data
                this.paperform=paperdata

                // //单选题总分数
                var totalsinglescore=0
                paperdata.singelCheck.forEach((item,index)=>{
                  totalsinglescore=totalsinglescore+item.score
                })
                this.totalsingle=totalsinglescore

                // //  多选题总分数
                var totalmorescore=0
                paperdata.moreCheck.forEach((item,index)=>{
                  totalmorescore=totalmorescore+item.score
                })
                this.totalmore=totalmorescore
                this.isshengcheng1=true
              }else{
                this.createdpaper4=false
                this.$message.warning('生成试卷失败')

              }
            }).catch(res=>{
              this.createdpaper=false
              this.$message.warning('生成试卷失败')
              this.loading=false
            })
          })
        }



      },
      savepaper(){
        this.$refs.editformref.validate(async valid=>{
          if(!valid){
            // this.$message.error('请检查试卷格式!')
            return
          }
          this.loading=true
          this.editform1.subjectIdArr=this.checkList1
          this.$http.post(`${this.base}/api/paper/addpaper/${this.loginid}`,this.editform1).then(res=>{
            console.log('生成试卷返回')

            if(res.data.result=='OK'){





              this.loading=false
              this.$message.success('生成试卷成功')
              this.createdpaper=true
              const paperdata=res.data.data
              this.paperform=paperdata
              console.log('paperform')
              console.log(this.paperform)
              //单选题总分数
              var totalsinglescore=0
              paperdata.singelCheck.forEach((item,index)=>{
                totalsinglescore=totalsinglescore+item.score
              })
              this.totalsingle=totalsinglescore
              this.isshengcheng=true
              //  多选题总分数
              var totalmorescore=0
              paperdata.moreCheck.forEach((item,index)=>{
                totalmorescore=totalmorescore+item.score
              })
              this.totalmore=totalmorescore





            }else{
              this.createdpaper=false
              this.$message.warning('生成试卷失败')
              this.loading=false
            }
          }).catch(res=>{
            this.createdpaper=false
            this.$message.warning('生成试卷失败')
            this.loading=false
          })
        })
      },
      getTestCount(idarr){

        if(!idarr){
          idarr=[]
        }
        console.log(idarr)
        this.$http.post(`${this.base}/api/Topic/getTopicNum`,idarr).then(res=>{
          this.singlenumber=res.data[0]
          this.morenumber=res.data[1]

        })
      },
      quxiaosavepaper(){
        this.$refs.editformref.resetFields()
        //取消生成试卷
        this.editform1={

        }
        this.createdpaper=false
        this.subectteacher=[]
        this.isshengcheng=false


      },
      //删除手动组成的试卷
      quxiaosavepaper4(){
        this.hassc=false
        this.createdpaper4=false

        this.editform2={
          title:'',
          remark:'',
          publishuser:''
        }

        this.editform3={
          title:'',
          remark:'',
          id:0,
          publishUser:'',
          topicLst:[]
        }
        this.total4=0





        this.choosedtests=[]
        this.$refs.editform2ref.resetFields()

        this.isshengcheng1=false
      },
      yulantests(){
        this.addialogvisible=true
      },

      handleRe1(file,fileList){
        this.fileTemp = null
      },
      handleClick(tab,event){
        console.log('切换了tab')
        this.isshengcheng1=false
        this.hassc=false
        this.createdpaper4=false
        if(tab.paneName=='first'){
          this.tabname='first'
          this.showsecondcard=false


          this.$refs.editformref.resetFields()
          this.subectteacher=[]
          this.editform1={
            title:'',
            singleNum:'',
            moreNum:'',
            remark:''
          }
          this.createdpaper=false

        }
        if(tab.paneName=='second'){
          this.tabname='second'
          this.queryInfo.value1=0

          //  手动组卷
          this.showsecondcard=true
          this.editform2={

          }
          this.$refs.editform2ref.resetFields()
          this.createdpaper4=false
          this.choosedtests=[]

        }


      },
      handleCurrentChange(val){
        this.queryInfo.pagenum=val
        this.getTestlist()
      },
      handleCurrentChange4(val){
        this.queryInfo2.pagenum=val
        this.gethaschoes()
      },
      handleSizeChange(val){
        // console.log(val)
        this.queryInfo.pagesize=val
        this.getTestlist()
      },
      handleSizeChange4(val){
        this.queryInfo2.pagesize=val
        this.gethaschoes()
      },
      getTestlist(){
        // tab为2时的获取上面表格
        this.queryInfo.value5=this.checkList2
        this.queryInfo.value6=this.checkList3
        this.$http.post(`${this.base}/api/Topic/getTopicByPageAndState`,this.queryInfo).then(res=>{
          console.log('获取上面table信息')
          console.log(res.data)
          this.userlist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取table失败")
        })

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
      quxiao(){
        this.$router.push('/sourcemn')

      },
      typechange(val){
        // console.log('下拉框改变')
        // if(val=='0'){
        //   this.wenben=true
        //   this.addform.filePathArr=[]
        //   this.$refs.upload.clearFiles()
        // }else if(val=='1'){
        //   this.wenben=false
        //   this.addform.filePathArr=[]
        //   this.$refs.upload.clearFiles()
        // }
      },
      handleRemove2(file){
        this.addform.coverPicArr=[]
        console.log(this.addform.coverPicArr)
      },
      outputsource(){
        this.$router.go(-1)
      },

      modulechge(val){
        console.log('选择变化')
        console.log(val)
        this.queryInfo.value2=val[0]
      },
      mokuaichange(val){

      },
      subtechge(val){

        this.checkList1=[]
        val.forEach((item)=>{
          this.checkList1.push(item[0])
        })
        console.log('check后')
        console.log(this.checkList1)
        this.getTestCount(this.checkList1)

      },
      subtechge1(val){
        this.checkList3=[]
        val.forEach((item)=>{
          this.checkList3.push(item[0])
        })
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
      clearSelection(){
        //  取消所有的选择
        this.$refs.multipleTable1.clearSelection()
      },
      chaxun(){
        this.queryInfo.pagenum=1
        this.getTestslist()

      },
      sexhandlechange(val){
        this.addform.sex=val
      },
      //添加对话框关闭事件
      addialogclose(){
        // this.$refs.addFormRef.resetFields()
        // this.addform.pics=[]
        // this.$refs.upload.clearFiles()
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
        this.isqueding=true
        //点击确定按钮预校验
        this.$refs.addFormRef.validate(async valid=>{
          console.log(valid)
          if(!valid){
            return
          }
          console.log('科目id')
          console.log(this.addform.subjectId)
          //添加性别 1/0
          this.addform.type=Number(this.addform.type)
          this.addform.subjectId=Number(this.addform.subjectId)
          //资源开放性
          this.addform.openstatus=Number(this.addform.subject)
          if(this.order){
            //是编辑页面过来的
            this.addform.id=this.order
            this.$http.post(`${this.base}/api/Resource/updateInfo`,this.addform).then(res=>{

              //新增返回
              console.log('编辑返回')
              console.log(res.data)

              if(res.data=="Ok"){

                this.$message.success('编辑成功')
                this.$router.push('/sourcemn')

              }else{

                this.$message.error(res.data)
              }
            }).catch(res=>{
            })
          }else{
            //是新增页面过来的
            this.$http.post(`${this.base}/api/Resource/addResource`,this.addform).then(res=>{

              //新增返回
              console.log('新增返回')
              console.log(res.data)

              if(res.data=="OK"){

                this.$message.success('添加成功')
                this.$router.push('/sourcemn')

              }else{
                console.log('走了else')
                this.$message.error(res.data)
              }
            }).catch(res=>{
            })
          }
          // this.filearr=[]
          // this.addform.viewFileArr=[]
          // this.addform.sourceFileArr=[]
          // this.$refs.upload.clearFiles()
          // this.$refs.upload11.clearFiles()





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
      removeUserby(id){
        this.$http.get(`${this.base}/api/Paper/delPaper/${id}`).then(
          res=>{
            console.log(res.data)
            if(res.data=="Ok"){
              console.log('删除试卷成功')
            }
          }
        ).catch(res=>{
          console.log('删除资源失败')
        })
      },
      removeUserbyid(id){
        if(this.hassc){
          return
        }
        this.editform.id=id
        //返回值是一个promise
        this.$confirm('此操作将删除试题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(`${this.base}/api/paper/delPaperTopic/${id}`).then(
            res=>{

              if(res.data=="Ok"){
                this.$message.success('删除成功')
                this.gethaschoes()
              }
            }
          ).catch(res=>{
            console.log('删除数据失败')
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      resetquery(){
        //重置按钮事件
        this.checkList2=[]
        this.checkList3=[]
        this.queryInfo.value5=''
        this.queryInfo.value6=''
        this.cascadervalue=''
        this.queryInfo.pagenum=1
        this.clearSelection()
        this.getTestlist()
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
        // this.addialogvisible=true
        // this.addform.pics=[]
        this.$router.push('/addsource')
      },
      handlesuccess(res,file,filelist){
        //  上传文件成功
        console.log('上传成功')
        console.log(res)
        this.addform.sourceFileArr.push(res)
        console.log('现在的sourceFileArr')
        console.log(this.addform.sourceFileArr)

      },

      handleRemoveyulan(file){
        console.log('移除预览')
        const index=this.addform.viewFileArr.findIndex(item=>{

          if(file.response){
            return file.response==item
          }else{
            const viewindex=file.url.indexOf('view')
            const fdd=file.url.substr(viewindex)
            return item==fdd
          }

        })
        console.log('删除的')
        console.log(index)
        this.addform.viewFileArr.splice(index,1)
        console.log('现在的viewFileArr')
        console.log(this.addform.viewFileArr)
      },
      handleRemove(file){
        console.log('移除了、。')
        console.log(file)
        //从数组中移除
        const index=this.addform.sourceFileArr.findIndex(item=>{

          if(file.response){
            console.log("fileresponse----"+file.response)
            console.log("item----"+item)
            return file.response==item
          }else{
            const sourceindex=file.url.indexOf('source')
            const fdd=file.url.substr(sourceindex)
            console.log('这里')
            console.log(fdd)
            return item==fdd
          }

        })
        console.log('删除的')
        console.log(index)
        this.addform.sourceFileArr.splice(index,1)
        console.log('现在的sourceFileArr')
        console.log(this.addform.sourceFileArr)

      },
      beforeUpload(file){
        const isLt100M = file.size / 1024 / 1024 <100;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过100M!');
        }
        return isLt100M
      },
      handlePreviewyulan(file){
        console.log('预览文件预览')
        console.log(file)
        const filename=file.name
        const docindex=filename.indexOf(".")
        const newstr=filename.substr(docindex)
        if(file.response){
          if(newstr=='.pdf'){
            this.fileType='pdf'
            this.fileData="http://192.168.1.15:8003/"+file.response
          }else if(newstr=='.jpg'||newstr=='.png'||newstr==".jpeg"){
            this.fileData="http://192.168.1.15:8003/"+file.response
            this.fileType='pic'
          }
        }else{
          if(newstr=='.pdf'){
            this.fileType='pdf'
            this.fileData=file.url
          }else if(newstr=='.jpg'||newstr=='.png'||newstr==".jpeg"){
            this.fileData=file.url
            this.fileType='pic'
          }
        }


        this.addialogvisible=true
      },
      handlePreview(file){
        console.log('源文件预览')
        console.log(file)
        const filename=file.name
        const docindex=filename.indexOf(".")
        const newstr=filename.substr(docindex)
        console.log(newstr)
        if(file.response){
          //  如果有raw  是直接上传的预览
          if(newstr=='.pdf'){
            this.fileType='pdf'
            this.fileData="http://192.168.1.15:8003/"+file.response
          }else if(newstr=='.jpg'||newstr=='.png'||newstr==".jpeg"){
            this.fileData="http://192.168.1.15:8003/"+file.response
            this.fileType='pic'
          }else if(newstr==".mp4"){
            console.log('是video')
            this.fileData="http://192.168.1.15:8003/"+file.response
            this.fileType='video'
          }else{
            //  其他类型
            console.log('其他类型')
            this.fileType='otherstype'

          }

        }else{
          if(newstr=='.pdf'){
            this.fileType='pdf'
            this.fileData=file.url
          }else if(newstr=='.jpg'||newstr=='.png'||newstr==".jpeg"){
            this.fileData=file.url

            this.fileType='pic'
          }else if(newstr==".mp4"){
            this.fileData=file.url
            this.fileType='video'
          }else{
            //  其他类型
            console.log('其他类型')
            this.fileType='otherstype'

          }
        }

        this.addialogvisible=true
        // if(file.raw.type=="image/jpeg"||file.raw.type=="image/jpg"||file.raw.type=="image/png"){
        //       this.fileType='pic'
        // }else if(file.raw.type=="application/pdf"){
        //   this.fileType='pdf'
        // }else if(file.raw.type=="application/msword"){
        //   console.log('是word')
        //   this.fileType='word'
        // }


      },
      previewPDF(row){
        console.log(previewPDF)
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
  .fuwenben img{
    width: 55px;
  }
  .casc{
    margin-left: 15px;
  }
  .el-upload__tip{
    line-height: 14px !important;
  }
  .timu{
    font-size: 16px;
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
  .diacontent{
    width: 80%;
    max-width:550px;
  }
  .diq{
    /*text-align: center;*/
  }
  .diapdf{
    width: 100%;
    height: 850px;
  }
  .smal{
    width: 175px !important;
  }
  .backbtn{
    margin-bottom: 15px;
  }
  .h2title{
    font-weight:500;
    text-align: center;
  }
  .publicuser{
    font-weight:500;
    text-align: center;
  }
  .zongscore{
    font-weight:500;
    text-align: center;
    margin-top: 5px;
  }

  .formhj{
    width: 200px;
  }
  .formhj1{
    width: 120px;
  }
  .singletest{
    border-bottom: 1px solid lightgray;
    padding: 6px 0px;

  }
  .daandiv{
    font-size: 12px;

    /*display: inline-block;*/
  }
  .h555{
    color: rgb(103,194,58);
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf !important;
  }
  /*.demo-table-expand {*/
  /*  font-size: 0;*/
  /*}*/
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .hgf{
    font-size: 14px;
    color:#606266;
    width: 95px;
    height: 40px;
    vertical-align: middle;
    text-align: right;
    padding: 0 12px 0 0;
    display: inline-block;
    box-sizing: border-box;
    line-height:40px;

  }
  /*.el-table th {*/
  /*  display: table-cell!important;*/
  /*}*/
  .haschoosed{
    margin-top: 15px;
  }
  .reditem{
    width: 100% !important;
  }
  .reditem .el-form-item__label{
    color: greenyellow;
  }
</style>
