<template>
  <div>
    <el-card>
      <el-button type="primary" @click="outputtests" size="mini">返回</el-button>
      <h3>考试信息</h3>
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef"
               label-width="70px"
               class="addformclas"
      >

          <el-form-item label="标题:" prop="title" label-width="115px">
            <el-input v-model="addform.title" size="mini" class="smal"></el-input>
          </el-form-item>
          <el-form-item label="试卷:" prop="paperIdArr" label-width="115px">
              <el-cascader
                :options="options"
                :props="paperProps"
                @change="subtechge"
                v-model="paperIdArr"
                clearable
                class="smal"
              >
              </el-cascader>
          </el-form-item>
        <el-form-item label="班级:" prop="gradeIdArr" label-width="115px">
          <el-cascader
            placeholder="请选择"
            v-model="gradeIdArr"
            :options="optionsgrade"
            @change="subtechge2"
            :props="defaultProps"
            clearable
            class="smal"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="考试开始时间:" label-width="115px" prop="startTime">
          <!--datepicker    Mon Mar 16 2020 00:00:00 GMT+0800 (中国标准时间)-->
          <el-date-picker
            size="mini"
            v-model="addform.startTime"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd HH:mm"
            class="smal"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试结束时间:" label-width="115px" prop="endTime">
          <!--datepicker    Mon Mar 16 2020 00:00:00 GMT+0800 (中国标准时间)-->
          <el-date-picker
            size="mini"
            v-model="addform.endTime"
            type="datetime"
            placeholder="选择时间"
            class="smal"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注:" prop="remark" label-width="115px">
          <el-input v-model="addform.remark"  class="smal"
                    type="textarea"
          ></el-input>
        </el-form-item>
                <el-row type="flex" justify="end">
                  <el-button @click="quxiao" size="mini">重置</el-button>
                  <el-button type="primary" @click.prevent="addTask" size="mini">保存</el-button>
                </el-row>
      </el-form>
    </el-card>

  </div>
</template>
<script>
  export default {
    data(){
      var checkPaper=(rule,value,callback)=>{

        if(this.checkList1.length==0){
          return callback(new Error('请选择试卷'));
        }
        return callback()
      }
      var checkGrade=(rule,value,callback)=>{
        if(this.checkList2.length==0){
          return callback(new Error('请选择班级'));
        }

        return callback()
      }

      var checkstartTime=(rule,value,callback)=>{
        console.log('开始时间')
        console.log(value)
         this.beginTime=Date.parse(new Date(value))
        console.log(this.beginTime)
        if(!value){
          return callback(new Error('请选择开始时间'));
        }
        if(this.endTime){
          if(this.endTime<this.beginTime||this.endTime==this.beginTime){
            return callback(new Error('结束时间须大于等于开始时间'));
          }
        }



        return callback()
      }
      var checkendTime=(rule,value,callback)=>{
        console.log('结束时间')
        console.log(value)
        this.endTime=Date.parse(new Date(value))
        console.log(this.endTime)

        if(!value){
          return callback(new Error('请选择结束时间'));
        }if(this.endTime<this.beginTime||this.endTime==this.beginTime){
          return callback(new Error('结束时间须大于等于开始时间'));
        }

        return callback()
      }
      return{
        getRowKeys(row) {
          return row.id
        },
        moduleProps:{

        },
        pickerOptions:{
        disabledDate(time){
           return time.getTime()<Date.now()-24*60*60*1000
        }
        },
        subjectarr:[],
        wenben:true,
        fileType:'',
        paperProps:{
          label:'title',
          value:'id',
          multiple: true
        },
        entryTime:null,
        iskuaisu:true,
        defaultProps:{
          label:'name',
          value:'id',
          multiple: true

        },
        optionsgrade:[],
        mokuaiProps:{

        },
        beginTime:'',
        endTime:'',
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
        gradeIdArr:[],
        hahhaha:'',//修改密码
        passworddiavisible:false,
        setpowervisible:false,
        sels: [],//选中的值显示
        dialogVisible: false,
        //  获取用户列表的参数
        queryInfo:{
          //查询参数  可为空
          value1:'',
          value2:'',
          value3:'',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:2
        },
        queryInfo2:{
          username:'',
          name:''
        },
        userlist:[
        ],
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
          startTime:'',
          endTime:'',
          title:'',
          paperIdArr:[],
          remark:''



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
        paperIdArr:[],
        checkList1:[],
        checkList2:[],
        upload:"",

        dialogImageUrl:'',
        createdTime:'',
        //添加表单的验证规则
        addFormRules:{
          title:[
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          paperIdArr:[
            //试卷选择
            {required:true,validator:checkPaper}
          ],
          gradeIdArr:[
            {required:true,validator:checkGrade}
          ],
          startTime:[
            {required:true,validator:checkstartTime,trigger: 'blur'}
          ],
          endTime:[
            {required:true,validator:checkendTime,trigger: 'blur'}
          ]

        },

        setrolelogvisible:false,
        roleslist:{

        },
        selectedroleid:'',
        sourceid:'',
        order:'',
        base:''



      }
    },
    created() {
      this.base=this.BASE_URL
      //获取所有班级
      this.getClassList()
      //  获取所有试卷
      this.getAllpaper()
    },
    mounted() {
      const order=this.$route.query.item
      if(order){
        this.order=order
        this.getTaskInfo(this.order)
      }
      //已有的试题答案设置非input类型  待入函数中
      this.userlist.forEach((item,index)=>{
        item.edit=false
      })
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
      },
      "addform.type":function(val) {
        if(val=='0'){

        }else if(val=='1'){

        }

      }

    },
    methods:{
      getClassList(){
        this.$http.get(`${this.base}/api/Grade/getAllGrade`).then(res=>{
          // console.log('获取所有班级')
          // console.log(res.data)
          this.optionsgrade=res.data
        }).catch(res=>{
          console.log("获取所有班级失败")
        })
      },
      checkdgf(scoperow){

        if(!scoperow.isCheck){
          // console.log('走了')
          //选中
          if(this.addform.type=='0'){
            this.userlist.forEach((item,index)=>{
              item.isCheck=false
            })
            scoperow.isCheck=true
          }

        }
        if(this.addform.type){

        }
      },
      finishedit(scoperow){
        //完成编辑
        scoperow.edit=false
      },
      edittests(scoperow,scopeid){
        console.log('scope')
        scoperow.edit=true
      },

      getAllpaper(){
        this.$http.get(`${this.base}/api/Paper/getPaper`).then(res=>{
          // console.log('返回试卷列表')
          // console.log(res.data)
          this.options=res.data
        }).catch(res=>{
          console.log('获取试卷失败')
        })
      },
      quxiao(){
        this.$router.go(-1)

      },
      getTaskInfo(id){
        this.$http.get(`${this.base}/api/Test/getTest/${id}`).then(res=>{
          console.log('编辑返回')
          console.log(res.data)
          this.addform=res.data
          this.paperIdArr=res.data.paperIdArr
          this.gradeIdArr=res.data.gradeIdArr
          this.checkList1=this.paperIdArr
          this.checkList2=this.gradeIdArr
        })
      },
      outputtests(){
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
        console.log('此时的试卷val')
        console.log(val)
       this.checkList1=val
        console.log('试卷check后')
        console.log(this.checkList1)

      },

      subtechge2(val){
        // console.log('此时的班级val')
        // console.log(val)
        // this.checkList2=[]
        // val.forEach((item)=>{
        //   this.checkList2.push(item[0])
        // })
        this.checkList2=val
        console.log('试卷check后')
        console.log(this.checkList2)
      },
      openstates(){
        //批量启用
        this.$http.post(`${this.base}/api/Teacher/updateStates/true`,this.sels).then(res=>{

          if(res.data=='Ok'){
            this.$message.success('批量启动成功')

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
      piliangpush(){
        //  批量发布
        this.$http.post(`${this.base}/api/course/delcourses/`,this.sels).then(res=>{
          console.log('批量发布返回')
          console.log(res.data)
          if(res.data=='OK'){
            this.$message.success('批量发布成功')
            this.getsubjectinfo()
          }else{
            this.$message.error('批量发布失败')
          }
        }).catch(res=>{
          console.log('发布失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      chaxun(){
        this.queryInfo.pagenum=1

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
      addTask(){
        //点击确定按钮预校验
        this.$refs.addFormRef.validate(async valid=>{
          // console.log(valid)
          if(!valid){
            return
          }
          if(typeof (this.checkList1[0])!='number'){
            this.addform.paperIdArr=this.checkList1.map(item=>{
              return item[0]
            })
          }else{
            this.addform.paperIdArr=this.checkList1
          }
       if(typeof (this.checkList2[0])!='number'){
         this.addform.gradeIdArr=this.checkList2.map(item=>{
           return item[0]
         })
       }else{
         this.addform.gradeIdArr=this.checkList2
       }
          //新增
          if(!this.order){
          this.$http.post(`${this.base}/api/Test/addTest`,this.addform).then(res=>{
            if(res.data=='OK'){
              this.$message.success('添加成功')
              this.$router.go(-1)
            }else{
              this.$message.warning(res.data)
            }

          }).catch(res=>{
            console.log('新增失败')

          })
          }else{
            this.$http.post(`${this.base}/api/Test/updateTest`,this.addform).then(res=>{
              if(res.data=='OK'){
                this.$message.success('保存成功')
                this.$router.go(-1)
              }else{
                this.$message.warning(res.data)
              }

            }).catch(res=>{
              console.log('保存失败')

            })
          }

          console.log('现在的addform')
          console.log(this.addform)
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
          this.editform1.pics=res.data.pics
          this.editform1=res.data
          this.subectteacher2=res.data.subjectIdArr
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
        this.$refs.editref.clearFiles()
      },
      removetest(scoperow,index){

        this.userlist.splice(index,1)

      },
      savesingletest(){
        const checkoption=this.userlist.every((item)=>{
          //答案没选
          return !item.isCheck
        })
        if(this.addform.type=='0'){
          var gggg=0
          this.userlist.forEach((item,index)=>{
            console.log(item.isCheck)
            if(item.isCheck){
              gggg++
            }
          })
          console.log(gggg)
          if(gggg>1){
            return this.$message.warning('请注意单选格式')
          }
        }

        if(checkoption){
          console.log('没答案')
          this.$message.warning('请选择试题答案')
          return false
        }
        this.addform.type=Number(this.addform.type)
        this.addform.score=Number(this.addform.score)
        //保存试题
        const testobj={
          topic:this.addform,
          answer:this.userlist
        }
        this.$http.post(`${this.base}/api/Topic/addOrUpdateTopic`,testobj).then(res=>{
          if(res.data=='OK'){
            this.$message.success('添加成功')
             this.$router.go(-1)
          }else{
            this.$message.warning(res.data)
          }
        })
        console.log(testobj)
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
        this.gradeIdArr=[]

        this.queryInfo.pagenum=1
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
      handlesuccessyulan(res){
        console.log('上传预览文件成功')
        console.log(res)
        this.addform.viewFileArr.push(res)
      },
      handlesuccess2(res,file,filelist){

        this.editform1.pics.push(res)
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
      addRow(data){
        // 新增一行
        let row = {
          // number1: this.userlist.length+1,
          answerContent: "",
          score: "111",
          caozuo: "",
          edit:true
        }
        this.userlist.push(row)
        console.log(data)
      },
      savetests(){

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
    text-align: center;
  }
  .diapdf{
    width: 100%;
    height: 850px;
  }
  .smal{
    width: 275px !important;
    margin-top: 6px;
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
</style>
