<template>
  <div>
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
          <select v-model="addform.type" class="change1">
            <option disabled value="">请选择</option>
            <option value="0">
              文本文件
            </option>
            <option value="1">
              视频文件
            </option>
          </select>
        </el-form-item>


        <el-form-item label="科目:" prop="subject" label-width="115px">
          <select v-model="addform.subjectId">
            <option disabled value="">请选择</option>
            <option :value="item.id" v-for="(item,index) in subjectarr">
              {{item.lable}}
            </option>
          </select>
        </el-form-item>
        <el-form-item label="作者:" prop="author" label-width="115px">
          <el-input v-model="addform.author" size="mini" class="smal"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="contents" label-width="115px">
          <quill-editor
            :options="editorOption"
            v-model="addform.contents"
            class="fuwenben"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="上传封面图:" prop="coverPicArr" label-width="115px">
          <el-upload
            :file-list="covericarr"
            :action="actionFM"
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
        <el-form-item label="上传源文件:" prop="upload" label-width="115px" v-if="wenben">

          <el-upload
            :file-list="filearr"
            :action="actionYWJ"
            :on-success="handlesuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            list-type="text"
            multiple
            ref="upload"
            accept=".xls,.xlsx,.rar,.zip,.doc,.docx,.pdf"
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
            :file-list="filearryulan"
            :action="actionUrl"
            :on-success="handlesuccessyulan"
            :on-preview="handlePreview"
            :on-remove="handleRemoveyulan"
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


        <el-form-item label="上传预览文件:" prop="upload" label-width="115px" v-if="wenben">

          <el-upload
            :file-list="filearryulan"
            :action="actionUrl"
            :on-success="handlesuccessyulan"
            :on-preview="handlePreviewyulan"
            :on-remove="handleRemoveyulan"
            :before-upload="beforeUpload"
            list-type="text"
            multiple
            ref="upload"
            accept=".pdf,.jpeg,.png,.jpg"
            name="files"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">（1）支持文件上传格式:.pdf,.jpeg,.jpg,.png</div>
            <div slot="tip" class="el-upload__tip">（2）单文件不能超过100M</div>
          </el-upload>
        </el-form-item>

        <el-row type="flex" justify="end">
          <el-button @click="quxiao" size="mini">取 消</el-button>
          <el-button type="primary" @click.prevent="addUser" size="mini">确 定</el-button>
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
      <!--     pdf预览-->
      <embed :src="fileData" type="application/pdf" class="diapdf"
             v-show="fileType === 'pdf'">
      <video v-show="fileType === 'video'" controls="controls" width="100%"
             :src="fileData" type="video/mp4">
        <!--        <source :src="fileData" type="video/mp4">-->
      </video>
      <div v-show="fileType==='otherstype'">
        如需在线预览,请上传.pdf格式文件
      </div>




      <!--      <div class="pdf" v-show="fileType === 'pdf'">-->
      <!--        <pdf :src="fileDta" ></pdf>-->
      <!--      </div>-->
      <!--      <a href="fileData"></a>-->

      <!--      <embed :src="fileData" type="application/pdf" width="100%" height="100%">-->

    </el-dialog>




  </div>
</template>
<script>
  //自定义字体类型
  var fonts = ['Microsoft-YaHei',
    'SimSun', 'SimHei',
    'KaiTi','Arial',
    'Times-New-Roman'];
  var Font = Quill.import("formats/font");
  Font.whitelist = fonts; //将字体加入到白名单
  Quill.register(Font, true);

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
        editorOption:{
          modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'],     //引用，代码块


              [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
              [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
              [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
              [{ 'direction': 'rtl' }],             // 文本方向

              //字体大小
              [{ 'size': ['12px', '14px', '16px' ,'18px', '22px', '26px', '30px', '36px', '42px'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题


              [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
              [{ 'font': fonts}],     //字体
              [{ 'align': [] }],    //对齐方式


              ['clean'],    //清除字体样式
              ['image','video']    //上传图片、上传视频

            ],
            imageResize:{} // 配置图片可缩放大小
          }
        },
        getRowKeys(row) {
          return row.id
        },
        moduleProps:{

        },
        actionYWJ:'',
        actionUrl:'',
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
        actionFM:'',

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
            // {required:true,validator:checkType}
          ],
          subject:[
            {required:true,validator:checkModule}
          ]

        },
        checkList2:[],
        setrolelogvisible:false,
        roleslist:{

        },
        selectedroleid:'',
        sourceid:'',
        order:''



      }
    },
    created() {
      this.base=this.BASE_URL
      this.base2=this.base_url
      //视频接口  预览文件接口
      this.actionUrl=this.base+'/api/Home/uploadView'
      //封面图接口
      this.actionFM=this.base+'/api/Home/uploads'

      //  源文件接口
      this.actionYWJ=this.base+'/api/Home/uploadsource'
      //  获取所有科目
      this.getsubjectList()
    },
    mounted() {
      const order=this.$route.query.item

      if(order){
        this.order=order
        this.getsourcelist(this.order)
      }
      const that=this
      const select1=document.querySelector(".change1")

      select1.onchange=function(){
        console.log('变了select')
        console.log(that.addform.type)
        if(that.addform.type=='0'){
          that.wenben=true
          that.addform.sourceFileArr=[]
          that.addform.viewFileArr=[]
          that.filearr=[]
          that.filearryulan=[]


          // that.$refs.upload11.clearFiles()
        }else if(that.addform.type=='1'){
          that.wenben=false
          that.addform.sourceFileArr=[]
          that.addform.viewFileArr=[]
          that.filearr=[]
          that.filearryulan=[]


        }else{

        }

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
      getsubjectList(){
        this.$http.get(`${this.base}/api/Subject/getAllSubject`).then(res=>{
          console.log('返回列表')
          console.log(res.data)
          this.subjectarr=res.data[0].children

        }).catch(res=>{
          console.log('获取科目失败')
        })
      },
      quxiao(){
        this.$router.push('/sourcemn')

      },
      getsourcelist(id){
        this.$http.get(`${this.base}/api/Resource/getResource/${id}`).then(res=>{
          console.log('编辑返回')
          console.log(res.data)
          this.addform=res.data

          //封面图设置
          let pictururl=res.data.coverPicArr
          pictururl.forEach((item)=>{
            let obj=new Object()
            obj.url=this.base2+'/'+item

            this.covericarr.push(obj)
          })
          let fileurl=res.data.sourceFileArr
          if(fileurl==[]){
            //  如果是空文件返回
            this.filearr=[]
          }else{
            this.addform.sourceFileArr=res.data.sourceFileArr
            console.log('编辑获取的sourceFileArr')
            console.log(this.addform.sourceFileArr)
            fileurl.forEach((item)=>{
              let obj1=new Object()
              obj1.url=this.base2+'/'+item
              obj1.name=item.split("\\")[1]
              this.filearr.push(obj1)

            })
          }

          let fileyulanarr=res.data.viewFileArr
          if(fileyulanarr==[]){
            //  如果是空文件返回
            this.filearryulan=[]
          }else{
            this.addform.viewFileArr=res.data.viewFileArr
            fileyulanarr.forEach((item)=>{
              let obj2=new Object()
              obj2.url=this.base2+'/'+item
              obj2.name=item.split("\\")[1]
              this.filearryulan.push(obj2)

            })
            console.log('现在的file预览数组')
            console.log(this.filearryulan)
          }


        })
      },
      typechange(val){

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
          this.$http.get(`${this.base}/api/Teacher/delTeacher/${id}`).then(
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
            this.$http.post(`${this.base}/api/user/delusers`,this.sels).then(res=>{
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
        const isLt100M = file.size / 1024 / 1024 <99;

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
            // console.log('预览pdf')

            this.fileData=this.base2+'/'+file.response
            // console.log(this.fileData)
          }else if(newstr=='.jpg'||newstr=='.png'||newstr==".jpeg"){
            this.fileData=this.base2+'/'+file.response
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
            this.fileData=this.base2+'/'+file.response
          }else if(newstr=='.jpg'||newstr=='.png'||newstr==".jpeg"){
            this.fileData=this.base2+'/'+file.response
            this.fileType='pic'
          }else if(newstr==".mp4"){
            console.log('是video')
            this.fileData=this.base2+'/'+file.response
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


</style>
