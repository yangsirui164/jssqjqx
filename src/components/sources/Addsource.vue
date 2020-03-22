<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课件资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>资源管理/资源管理新增 </el-breadcrumb-item>

    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="outputsource" size="mini">返回</el-button>
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef"
               label-width="70px"
               class="addformclas"
              >

            <el-form-item label="标题:" prop="title" label-width="115px">
              <el-input v-model="addform.title" size="mini" class="smal"></el-input>
            </el-form-item>


            <el-form-item label="类型:"
                          prop="type"
                          label-width="115px"
            >
              <select v-model="addform.type" :onchange="typechange(addform.type)">
                <option disabled value="">请选择</option>
                <option value="0">
                  文本文件
                </option>
                <option value="1">
                 视频文件
                </option>
              </select>
            </el-form-item>
          <el-form-item label="模块:" prop="module" label-width="115px">
            <select v-model="addform.module">
              <option disabled value="">请选择</option>
              <option value="0">
                426电源车
              </option>
              <option value="1">
                30电源车
              </option>
            </select>
          </el-form-item>
            <el-form-item label="作者:" prop="author" label-width="115px">
              <el-input v-model="addform.author" size="mini" class="smal"></el-input>
            </el-form-item>
            <el-form-item label="内容:" prop="content" label-width="115px">
             <quill-editor
               v-model="addform.content"
             ></quill-editor>
            </el-form-item>
        <el-form-item label="上传封面图:" prop="fengmianpic" label-width="115px">
          <el-upload
            action="http://192.168.1.15:8002/api/Home/uploads"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            accept=".png,.jpeg,.jpg"
            :on-remove="handleRemove2"
            :on-success="avatorsuccess"
            :limit="1"
             name="files"
          id="slj">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>


<!--        上传文件-->
        <el-form-item label="上传文件:" prop="upload" label-width="115px" v-if="wenben">

          <el-upload
            action="http://192.168.1.15:8002/api/Home/uploadoffice"
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
<!--上传视频-->
        <el-form-item label="上传视频:" prop="upload" label-width="115px" v-if="!wenben">

          <el-upload
            action="http://192.168.1.15:8002/api/Home/uploads"
            :on-success="handlesuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            list-type="text"
            multiple
            ref="upload"
            accept=".mp4"
            name="files"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">（1）支持多文件上传,扩展名:.mp4..</div>
            <div slot="tip" class="el-upload__tip">（2）单文件不能超过100M</div>
          </el-upload>
        </el-form-item>

       <el-row type="flex" justify="end">
         <el-button @click="" size="mini">取 消</el-button>
         <el-button type="primary" @click="addUser" size="mini">确 定</el-button>
       </el-row>


      </el-form>

    </el-card>


    <el-dialog
      title="在线预览"
      :visible.sync="addialogvisible"
      width="60%"
      @close="addialogclose"
      class="diq"
    >

      <img :src="fileData" alt="" v-show="fileType === 'pic'" class="diacontent">
<!--      pdf预览-->
      <embed :src="fileData" type="application/pdf" class="diapdf"
             v-show="fileType === 'pdf'">

      <iframe
        :src="'//www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc='+fileData"
        width="100%"
        height="100%" />




<!--      <div class="pdf" v-show="fileType === 'pdf'">-->
<!--        <pdf :src="fileDta" ></pdf>-->
<!--      </div>-->
<!--      <a href="fileData"></a>-->

<!--      <embed :src="fileData" type="application/pdf" width="100%" height="100%">-->

    </el-dialog>




  </div>
</template>
<script>

  export default {
    data(){
      var checkType=(rule,value,callback)=>{
        if(this.addform.type==''){
          return callback(new Error('请选择类型'));
        }

        return callback()
      }
      var checkModule=(rule,value,callback)=>{
        if(this.addform.module==''){
          return callback(new Error('请选择模块'));
        }

        return callback()
      }
      return{
        getRowKeys(row) {
          return row.id
        },
        moduleProps:{

        },
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
          files:[],
          videos:[],
          content:'',
          type:'',
          module:'',
          title:'',
          author:''

        },
        modeldata:'',
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
          module:[
            {required:true,validator:checkModule}
          ]

        },
        checkList2:[],
        setrolelogvisible:false,
        roleslist:{

        },
        selectedroleid:'',
        sourceid:''



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

      // "addform.type":function(val) {
      //   console.log('文本/视频')
      //   console.log(val)
      //   if(val=='0'){
      //     //文本类型
      //     this.wenben=true
      //   }else if(val=='1'){
      //     //视频类型
      //     this.wenben=false
      //     this.addform.files=[]
      //
      //   }
      // }



    },
    methods:{
      typechange(val){
       if(val=='0'){
         this.wenben=true
         this.addform.videos=[]
         this.$refs.upload.clearFiles()
       }else if(val=='1'){
         this.wenben=false
         this.addform.files=[]
         this.$refs.upload.clearFiles()
       }
      },
      handleRemove2(file){
        this.addform.pics=[]
        console.log(this.addform.pics)
      },
      avatorsuccess(res){
         this.addform.pics.push(res)
      },
      handlePictureCardPreview(file){
        console.log('头像路径')
        console.log(file.url)
      // 头像预览
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
        this.$http.post('api/Teacher/updateStates/true',this.sels).then(res=>{

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
      piliangpush(){
        //  批量发布
        this.$http.post('api/course/delcourses/',this.sels).then(res=>{
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
      addUser(){
        this.$router.push('/sourcemn')
        return
        //点击确定按钮预校验
        this.$refs.addFormRef.validate(async valid=>{
          console.log(valid)
          if(!valid){
            return
          }

          //添加性别 1/0
          // this.addform.sex=Number(this.addform.sex)
          this.$http.post('api/Teacher/addTeacher',this.addform).then(res=>{

            //新增返回
            console.log('新增返回')
            console.log(res.data)

            if(res.data=="OK"){

              this.$message.success('添加成功')
              // this.addialogvisible=false



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
        this.$http.get(`api/Teacher/getTeacher/${id}`).then(res=>{
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
          this.$http.post('api/Teacher/updateInfo',this.editform1).then(res=>{
            if(res.data=="Ok"){
              this.$message.success('修改成功')
              this.editalogvisible=false

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
        this.addform.files.push(res)

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
      beforeUpload(file){
        const isLt100M = file.size / 1024 / 1024 <100;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过100M!');
        }
        return isLt100M
      },
      handlePreview(file){
       console.log('预览的文件')
       console.log(file)
        // this.fileType='pdf'
        this.fileData="http://192.168.1.15:8003/"+file.response
        this.addialogvisible=true
     if(file.raw.type=="image/jpeg"||file.raw.type=="image/jpg"||file.raw.type=="image/png"){
           this.fileType='pic'
     }else if(file.raw.type=="application/pdf"){
       this.fileType='pdf'
     }else if(file.raw.type=="application/msword"){
       console.log('是word')
       this.fileType='word'
     }


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


</style>
