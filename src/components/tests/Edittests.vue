<template>
  <div>
    <el-card>
      <el-button type="primary" @click="outputtests" size="mini">返回</el-button>
      <h3>试题信息</h3>
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef"
               label-width="70px"
               class="addformclas"
      >
        <el-row type="flex">
          <el-form-item label="题目名称:" prop="title" label-width="115px">
            <el-input v-model="addform.title" size="mini" class="smal"></el-input>
          </el-form-item>
          <el-form-item label="科目:" prop="subject" label-width="115px">
            <select v-model="addform.subjectId">
              <option disabled value="">请选择</option>
              <option :value="item.id" v-for="(item,index) in subjectarr">
                {{item.lable}}
              </option>
            </select>
          </el-form-item>
          <el-form-item label="题目类型:"
                        prop="type"
                        label-width="115px"
          >
            <select v-model="addform.type" class="change1">
              <option disabled value="">请选择</option>
              <option value="0">
                单选题
              </option>
              <option value="1">
                多选题
              </option>
            </select>
          </el-form-item>
        </el-row>
        <el-form-item label="题目分数:" prop="score" label-width="115px">
          <el-input v-model="addform.score" size="mini" class="smal"></el-input>
        </el-form-item>
        <el-form-item label="题目内容:" prop="contents" label-width="115px"
        >
          <el-input
            class="contentcla"
            type="textarea"
            :rows="2"
            placeholder="请输入题目内容"
            v-model="addform.contents">
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="botmcard">
      <h3>答案</h3>
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
        <el-table-column type="index" label="序号" prop="number1"
        >
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="answerContent"
          label="*答案内容"
        >
          <template slot-scope="scope">
            <el-input v-show="scope.row.edit" size="small" v-model="scope.row.answerContent"
                      @blur="finishedit(scope.row)" @keyup.enter.native="finishedit(scope.row)"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.answerContent}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isCheck"
          label="*正确与否"
          width="95px"
        >
          <template slot-scope="scope">
            <input type="checkbox" v-model="scope.row.isCheck" class="smallcheck"
                   @click="checkdgf(scope.row)">
            <span>正确</span>
          </template>

        </el-table-column>

        <el-table-column width="160px"
                         label="操作"
                         prop="caozuo">
          <template slot-scope="scope">
              <span @click="edittests(scope.row,scope.row.id)"
              >编辑</span>

            <span>|</span>
            <span @click="removetest(scope.row,scope.$index)">删除</span>
          </template>
        </el-table-column>

      </el-table>
      <el-button @click="addRow()" class="addbutton" :disabled="overtests">新增</el-button>
      <el-row type="flex" justify="end">
        <el-button class="savestyle" type="primary"
                   @click="savesingletest">保存试题</el-button>
      </el-row>

    </el-card>



  </div>
</template>
<script>
  export default {
    data(){
      var checkType=(rule,value,callback)=>{
        // console.log(this.addform.type)
        if(this.addform.type==''){

          return callback(new Error('请选择类型'));
        }

        return callback()
      }
      var checkModule=(rule,value,callback)=>{
        if(this.addform.subject==''){
          return callback(new Error('请选择科目'));
        }

        return callback()
      }
      return{
        getRowKeys(row) {
          return row.id
        },
        moduleProps:{

        },
        subjectarr:[],
        wenben:true,
        fileType:'',
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        entryTime:null,
        iskuaisu:true,
        defaultProps:{
          label:'lable',
          value:'id'
        },
        mokuaiProps:{

        },
        overtests:false,
        fileData:'',
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
        cascadervalue:[],
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
          contents:'',
          type:'0',
          subjectId:'',
          title:'',
          score:'1'


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
        isqueding:false,
        subectteacher:'',
        checkList1:[],
        upload:"",

        dialogImageUrl:'',
        createdTime:'',
        //添加表单的验证规则
        addFormRules:{
          title:[
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          type:[
            //文件类型选择
            {required:true,validator:checkType}
          ],
          subject:[
            {required:true,validator:checkModule}
          ],
          score:[
            { required: true, message: '请填入分数', trigger: 'blur' }
          ],
          contents:[
            { required: true, message: '请填入题目内容', trigger: 'blur' }
          ]

        },
        checkList2:[],
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
      //  获取所有科目
      this.getsubjectList()
    },
    mounted() {
      const order=this.$route.query.item
      if(order){
        this.order=order
        this.getsourcelist(this.order)
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

      },
      "userlist":function(val) {
        if(val.length>=10){
          this.overtests=true
        }else{
          this.overtests=false
        }
      }

    },
    methods:{
      checkdgf(scoperow){
        console.log('。。。。。。')
        console.log(scoperow.isCheck)
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

      getsubjectList(){
        this.$http.get(`${this.base}/api/Subject/getAllSubject`).then(res=>{
          console.log('返回列表')
          console.log(res.data)
          this.subjectarr=res.data[0].children
          if(this.order){
            this.addform.subjectId=res.data[0].children[0].id
          }else{
            this.addform.subjectId=''
          }

        }).catch(res=>{
          console.log('获取科目失败')
        })
      },
      quxiao(){
        this.$router.push('/sourcemn')

      },
      getsourcelist(id){
        this.$http.get(`${this.base}/api/Topic/getTopic/${id}`).then(res=>{
          console.log('编辑返回')
          console.log(res.data)
          // this.addform=res.data
          this.addform=res.data.topic
          const daan=res.data.answer
          if(daan.length!=0){
            daan.forEach((item)=>{
              item.edit=false
            })
            this.userlist=res.data.answer
            console.log('.....')
            console.log(this.userlist)

          }


        })
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
      avatorsuccess(res){
        console.log(res)
        this.addform.coverPicArr.push(res)
      },
      handlePictureCardPreview(file){
        // console.log('头像路径')
        // console.log(file.url)
        // 头像预览
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
      editUserInfo(){
        this.$refs.editformref.validate(async valid=>{
          if(!valid){
            return
          }
          //编辑用户请求
          this.checkList2=[]

          //判断
          // console.log(this.checkList1)
          // console.log('类型')
          // console.log(typeof (this.checkList1[0])=='number')
          // return
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

            }


          }).catch(res=>{
            console.log('修改用户数据失败')
          })




        })

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
        this.cascadervalue=''

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
          isCheck:false,
          edit:true
        }
        this.userlist.push(row)
        console.log(data)
      },
      savetests(){

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
    width: 175px !important;
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
