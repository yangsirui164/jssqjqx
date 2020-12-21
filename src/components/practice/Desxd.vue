<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>训练管理</el-breadcrumb-item>
      <el-breadcrumb-item>训练详情</el-breadcrumb-item>

    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="outputtests" size="mini">返回</el-button>
      <div class="xlxq">训练详情</div>



      <el-form :model="addform"  ref="addFormRef"
               class="addformclas1"
      >

   <el-row>
          <el-form-item label="训练计划名称:" label-width="115px" class="formitem">
            <span>{{addform.name}}</span>
          </el-form-item>
          <el-form-item  class="formitem" label="科目:" label-width="115px">
            <span>{{addform.subjectName}}</span>
          </el-form-item>
          <el-form-item
            class="formitem" label="授课班级:" label-width="115px"
          >
            <span>{{addform.gradeName}}</span>
          </el-form-item>

   </el-row>


<el-row>
  <el-form-item
    class="formitem"
    label="训练类型:" label-width="115px"
  >
    <span>{{addform.typeTxt}}</span>
  </el-form-item>
  <el-form-item
    class="formitem"
    label="计划开始时间:" label-width="115px"
  >
    <span>{{addform.startDate}}</span>
  </el-form-item>

  <el-form-item
    class="formitem"
    label="实际开始时间:" label-width="115px"
  >
    <span>{{addform.startTime}}</span>
  </el-form-item>
</el-row>
 <el-row>
   <el-form-item
     class="formitem"
     label="计划结束时间:" label-width="115px"
   >
     <span>{{addform.endDate}}</span>
   </el-form-item>
   <el-form-item
     class="formitem"
     label="实际结束时间:" label-width="115px"
   >
     <span>{{addform.endTime}}</span>
   </el-form-item>

   <el-form-item
     class="formitem"
     label="时长:" label-width="115px"
   >
     <span>{{addform.duration}}分钟</span>
   </el-form-item>
 </el-row>
        <el-form-item label="训练区域:"
                      label-width="115px"

        >
          <span>{{addform.areaIdTxt}}</span>

        </el-form-item>

        <el-form-item label="任务:"
                      label-width="115px"

        >
          <span>{{addform.treeJsonName}}</span>
        </el-form-item>

        <el-form-item label="备注:" label-width="115px"
        >
          <span>{{addform.remark}}</span>
        </el-form-item>
      </el-form>
    </el-card>







    <el-card class="botmcard">
      <div class="xlxq">训练进程安排</div>
      <el-table
        border
        stripe
        :data="userlist"
        style="width: 100%"
        ref="multipleTable1"
        :row-key="getRowKeys"
        class="stdenttable"
      >
        <!--        添加索引-->
        <el-table-column type="index" label="序号" prop="number1"
        >
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="分组名称"
        >
          <template slot-scope="scope">
            <div>{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="studentId"
          label="人员"

        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.studentIdTxt" placement="top-start">
              <div class="ovfl">{{scope.row.studentIdTxt}}</div>
            </el-tooltip>

<!--            <el-cascader-->
<!--              collapse-tags-->
<!--              placeholder="请选择"-->
<!--              v-model="scope.row.studentId"-->
<!--              :options="peopleoptions"-->
<!--              :props="peopleProps"-->
<!--              class="singl"-->
<!--            ></el-cascader>-->
          </template>
        </el-table-column>

      </el-table>


    </el-card>

    <el-card class="botmcard">
      <div class="xlxq">文件资源</div>
      <div class="dowladaea" v-for="(item,index) in addform.filePathArr">
                      <span>{{item}}</span>
                      <a class="downloadbtn" download target="_blank"
                         :href="baseurl+item">下载</a>
                    </div>



    </el-card>



  </div>
</template>
<script>
  export default {
    data(){
      return{
        getRowKeys(row) {
          return row.id
        },
        coldata:[],
        isshowsingle:false,
        classProps:{
          label:'name',
          value:'id'
        },
        baseurl:'http://192.168.1.15:8003/',
        removetag1:'',
        isremove:false,
        timetest:false,
        teacheroptions:[],
        classvalue:[],
        classoptions:[],
        subjectarr:[],
        treeData:[],
        gradearr:[],
        wenben:true,
        fileType:'',
        hourlen:0,
        minlen:0,
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
        defaulechecked:[],
        singleProps:{
          label:'lable',
          value:'code',
          multiple:true
        },
        teacherProps:{
          label:'realName',
          value:'id'
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
        sourceslist:{
          title:'',
          author:'',
          contents:'',
          publishDate:'',
          picFileArr:[],
          sourceFileArr:[],
          viewFileObject:{

          }
        },
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
          duration:0,
          subjectId:'',
          name:'',
          gradeId:'',
          teacherId:'',
          filePathArr:[],
          singelIdArr:[],
          type:'',
          treedata:[]

        },
        modeldata:'',
        levelmodel:[],
        subjectoptions:[],
        editform:{
          id:''
        },
        covericarr:[],
        videoarr:[],
        passwordform:{
          password1:'',
          password2:''
        },
        userinfo:{

        },
        value:'',
        pickerOptions:{
          disabledDate(time){

            return time.getTime()<Date.now()-24*60*60*1000
          }
        },
        isqueding:false,
        subectteacher:'',
        checkList1:[],
        upload:"",
        showshunxu:true,
        dialogImageUrl:'',
        createdTime:'',
        filearr:[],
        tree_data:[],
        filearryulan:[],
        teacherarr:[],
        singleoptions:[],
        checkList2:[],
        setrolelogvisible:false,
        roleslist:{

        },
        checkList3:[],
        selectedroleid:'',
        peopleProps:{
          label:'realName',
          value:'id',
          multiple:true
        },
        treeProps:{
          label:'label',
          value:'value'
        },
        chooseindex:'',
        eltreedata:[],
        start0time:'',
        dxrudialogvisible:false,
        end0time:'',
        sourceid:'',
        order:'',
        singlevalue:[],
        areavalue:[],
        areaoptions:[],
        areaProps:{
          label:'name',
          value:'id',
          multiple:true
        },
        peopleoptions:[],
        notime:true,
        stucount:0,
        isover:false
      }
    },
    created() {


    },
    mounted() {
      const order=this.$route.query.item
      if(order){
        this.order=order
        this.getsourcelist(this.order)
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
          // console.log("both有变化",newval)
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
      }


    },
    methods:{
      pusharr1(Node,arr){
        var obj={
          label:'',
          value:''
        }
        if(Node.children.length==0){
          //有父级
          if(Node.parent){
            if(Node.parent.parent){
              obj={
                label:Node.parent.parent.label+'--'+Node.parent.label+'--'+Node.label,
                value:Node.value
              }
            }else {
              obj={
                label:Node.parent.label+'--'+Node.label,
                value:Node.value
              }
            }
          }else{
            obj={
              label:Node.label,
              value:Node.value
            }
          }


          return arr.push(obj)
        }

      },
      showdxrw(){

        if(!this.addform.subjectId){
          //没有科目
          this.$message.warning('请选择科目')
          return
        }

        this.getDxrw()

      },
      changesub2(){

      },
      getareaList(){
        this.$http.get('api/AreaClass/getAreaClassLstByState').then(res=>{
          console.log('获取所有区域')
          console.log(res.data)
          this.areaoptions=res.data
        }).catch(res=>{
          console.log("获取所有区域失败")
        })
      },
      xuanzele(val){
        console.log('选择了时间')
        console.log(val)
        // this.hourlen=val[1].substring(0,2)-val[0].substring(0,2)
        //
        // this.minlen=val[1].substring(3,5)-val[0].substring(3,5)

        this.userlist.forEach((item,index)=>{
          item.thinkend=''
          item.thinkstart=''
        })
        // this.userlist=[]
        // console.log(val)
      },
      shijian(val){

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

      },
      edittests(scoperow,scopeid){
        // console.log('scope')
        scoperow.edit=true
      },
      getClassList(){
        this.$http.get('api/Grade/getAllGrade').then(res=>{
          this.gradearr=res.data
        }).catch(res=>{
          console.log("获取所有班级失败")
        })
      },
      getAllteacher(){
        this.$http.get(`api/Teacher/getTeacherBySubject/${this.addform.subjectId}`).then(res=>{
            this.teacherarr=res.data

          }
        ).catch(res=>{
          console.log('获取所有教师失败')
        })
      },
      getsubjectList(){
        this.$http.get('api/Subject/getAllSubject').then(res=>{
          console.log('返回列表')
          console.log(res.data)
          this.subjectarr=res.data[0].children
          // if(this.order==''){
          //   this.addform.subjectId=res.data[0].children[0].id
          //   //  根据科目获取单项
          //   this.getDxrw()
          // }





        }).catch(res=>{
          console.log('获取科目失败')
        })
      },
      changesub(val){
        this.getDxrw()
        this.getAllteacher()
        this.addform.teacherId=''
        this.singlevalue=[]
        this.checkList1=[]
      },
      changesub1(){
        // 获取该班级下学生
        this.getclassStus()
        //已选学生置空
        this.userlist.forEach((item,index)=>{
          item.studentId=[]
        })
      },
      changetype(){

      },
      quxiao(){
        this.$router.go(-1)

      },
      filtermeth(node,keyword){
        console.log(node)
      },
      getDxrw(){
        this.$http.get(`api/Singel/getSingelLst/${this.addform.subjectId}`).then(res=>{
          console.log('获取单项任务返回')
          console.log(res.data)
          this.singleoptions=res.data
          // this.treeData=res.data
        }).catch(res=>{
          console.log('获取单项任务失败')
        })
      },
      getsourcelist(id){
        this.$http.get(`api/TrainPlan/seeTrainPlan/${id}`).then(res=>{
          console.log('编辑返回')
          console.log(res.data)
          this.addform=res.data.addform
          this.singlevalue=res.data.addform.singelIdArr
          this.checkList1=res.data.addform.singelIdArr
          this.getDxrw()
          this.getclassStus()
          this.getAllteacher()
          this.userlist=res.data.list
          this.eltreedata=res.data.addform.treedata
          let fileurl=res.data.addform.filePathArr
          if(fileurl==[]){
            //  如果是空文件返回
            this.filearr=[]
          }else{
            this.addform.filePathArr=res.data.addform.filePathArr
            console.log('编辑获取的filePathArr')
            console.log(this.addform.filePathArr)
            // fileurl.forEach((item)=>{
            //   let obj1=new Object()
            //   obj1.url="http://192.168.1.15:8003/"+item
            //   obj1.name=item.split("\\")[1]
            //   this.filearr.push(obj1)
            // })
          }

        })
      },
      outputtests(){
        this.$router.go(-1)
      },
      clearSelection(){
        //  取消所有的选择
        this.$refs.multipleTable1.clearSelection()
      },
      savexd(){
        this.$refs.addFormRef.validate(async valid=>{

          if(!valid){
            return
          }

          if(this.addform.subjectId==''||this.addform.gradeId==''||this.addform.teacherId==''){
            this.$message.warning('请完善选择信息 ')
            return
          }

          if(this.addform.thinkTime1==''||this.addform.thinkTime2==''){
            this.$message.warning('请选择训练计划时间 ')
            return

          }

          //判断时间相同区域时间段有重复
          // for (let i = 0; i <this.userlist.length; i++) {
          //   for (let j = i+1; j <this.userlist.length; j++) {
          //     if(this.userlist[i].areaClassId==this.userlist[j].areaClassId){
          //       if(this.userlist[i].thinkend<=this.userlist[j].thinkstart||this.userlist[i].thinkstart>=this.userlist[j].thinkend){
          //         continue
          //       }
          //       else{
          //         return this.$message.warning('数据'+(i+1)+'与数据'+(j+1)+'相同训练区域时间段有重复')
          //
          //       }
          //     }
          //   }
          // }


          for(let i=0;i<this.userlist.length;i++){
            if(this.userlist[i].timetest==false){
              console.log('有false')
              return false
            }
          }
          this.addform.type=Number(this.addform.type)
          this.addform.singelIdArr=this.checkList1
          this.addform.treedata=this.eltreedata
          this.addform.areaId=this.areavalue
          //编辑用户请求
          // this.checkList2=[]

          // if(typeof (this.checkList1[0])!='number'){
          //   console.log('不是一个数')
          //   // this.checkList1=[]
          //   //  说明包含数组
          //   this.checkList1.forEach(item=>{
          //     if(item.length==3){
          //
          //     }
          //     this.checkList2.push(item[0])
          //   })
          //   this.addform.singelIdArr=this.checkList2
          // }else{
          //   console.log('是一个数')
          //   this.addform.singelIdArr=this.checkList1
          // }



          this.userlist.forEach((item,index)=>{

            if(item.areaClassId==''){
              item.areaClassId=0
            }
            if(typeof (item.studentId[0])!='number'){
              const studentid=[]
              if(item.studentId!=''){
                item.studentId.forEach((item1,index1)=>{
                  // console.log('....')
                  studentid.push(item1[0])
                  // console.log(studentid)
                })
                item.studentId=studentid
              }else {
                item.studentId=[]
              }


            }

            if(typeof(item.areaClassId)=='object'){
              item.areaClassId=item.areaClassId[0]
            }
          })

          const sendform={
            addform:this.addform,
            list:this.userlist
          }



          if(this.order==''){
            this.$http.post('api/trainplan/addandupdatetrainplan',sendform).then(res=>{
              console.log('发送数据返回')
              console.log(res.data)
              if(res.data=='OK'){
                this.$message.success('保存成功')
                this.$router.go(-1)
              }else{
                this.$message.error(res.data)
              }
            }).catch(res=>{
              console.log('发送数据失败')
            })
          }else{
            sendform.id=this.order
            this.$http.post('api/trainplan/addandupdatetrainplan',sendform).then(res=>{
              console.log('发送数据返回')
              console.log(res.data)
              if(res.data=='OK'){
                this.$message.success('保存成功')
                this.$router.go(-1)
              }else{
                this.$message.error(res.data)
              }
            }).catch(res=>{
              console.log('发送数据失败')
            })
          }

        })

      },
      getclassStus(){
        //根据班级获取学生
        this.$http.get(`api/Student/getStudentByGrade/${this.addform.gradeId}`).then(
          res=>{
            console.log('获取此班级学生')
            console.log(res.data)
            this.stucount=res.data.length
            this.peopleoptions=res.data
          }
        ).catch(res=>{
          console.log('获取班级学生失败')
        })
      },
      removetest(scoperow,index){

        this.userlist.splice(index,1)

      },
      alldrop(draggingNode,dropNode,type){
        // console.log('树形数据')
        // console.log(this.eltreedata)

        if(type=='inner'){
          return false
        }else{
          return true
        }
      },
      removetag(removetag){
        // console.log(removetag)
        this.isremove=true
        this.removetag1=removetag
      },
      rwchge(val){

        if(this.isremove==true){
          //  移除了
          // console.log('移除了')
          // console.log(this.removetag1)
          if(this.removetag1.length==1){
            this.eltreedata.forEach((item,index)=>{
              if(item.value==this.removetag1[0]){
                // console.log('删除爷爷')
                this.eltreedata.splice(index,1)
              }
            })
          }
          if(this.removetag1.length==2){
            this.eltreedata.forEach((item,index)=>{
              if(item.value==this.removetag1[1]){
                // console.log('删除爸爸')
                this.eltreedata.splice(index,1)
              }
            })
          }

          if(this.removetag1.length==3){
            this.eltreedata.forEach((item,index)=>{
              if(item.value==this.removetag1[2]){
                // console.log('删除儿子')
                this.eltreedata.splice(index,1)
              }
            })
          }
          this.isremove=false

        }


        //如果不是tag处移除
        else if(this.isremove==false){
          const checkedNodes=this.$refs.cacader.getCheckedNodes()
          // console.log('........')
          // console.log(this.$refs.cacader.getCheckedNodes())
          this.eltreedata=[]
          checkedNodes.forEach((item,index)=>{
            this.pusharr1(item,this.eltreedata)
          })



          this.checkList1=val
        }




        //按钮方案


        // console.log(this.eltreedata)
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
      handlesuccess(res,file,filelist){
        //  上传文件成功
        console.log('上传成功')
        console.log(res)
        this.addform.filePathArr.push(res)
        console.log('现在的filePathArr')
        console.log(this.addform.filePathArr)

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
        const index=this.addform.filePathArr.findIndex(item=>{

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
        this.addform.filePathArr.splice(index,1)
        console.log('现在的filePathArr')
        console.log(this.addform.filePathArr)

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
          name: "",
          studentId: '',
          // thinkstart:'',
          // thinkend:'',
          caozuo:''

        }
        this.userlist.push(row)

      },
      upfunc(){
        const index=this.chooseindex
        if(index==0){
          this.$message.warning('到顶了')
        }else{
          const hwarr=document.querySelectorAll(".hweg")

          for(var i=0;i<hwarr.length;i++){
            hwarr[i].style.background="white"
          }
          hwarr[index-1].style.background="blue"
          this.eltreedata.splice(index-1,0,this.eltreedata[index])
          this.eltreedata.splice(index+1,1)
        }

        console.log(this.eltreedata)
      },
      // downfunc(){
      //
      // },
      itemcli(e,index){
        this.chooseindex=index
        const hwarr=document.querySelectorAll(".hweg")
        for(var i=0;i<hwarr.length;i++){
          hwarr[i].style.background="white"
        }
        e.target.style.background="blue"
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
      renderHeader(h, {column}) {
        let header = column.label.split(' ');
        return [h('div', [
          h('span', {style:{
              color:'#F56C6C'
            }}, header[0]),
          h('span', {}, header[1])
        ])];
      }, // 文本分别添加到p,span标签中
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
  .addformclas1{
    overflow: hidden;
    .el-row{
      /*margin-bottom:15px !important;*/
    }
    .el-form-item{
      margin-bottom: 12px;
    }

  }
  .sles{
    width: 185px;
    height: 30px;
    border-radius: 3px;
    /*color:rgb(195,199,218);*/
    border: 1px solid rgb(195,199,218);
    font-size: 12px;
    outline: none;
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
    width: 185px !important;
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
  .mgtop{
    margin-top: 20px;
  }
  .singl{
    /*width: 340px !important;*/
  }

  .jkh{
    width: 115px;
    height: 40px;
    display: inline-block;
    line-height: 40px;
    padding-left: 10px;
    font-size: 14px;
    color: red;
  }
  .hddd{
    width: 100%;
  }
  .copy{
    border: 1px solid #DCDFE6;
    border-radius: 8px;
    padding: 10px;
  }
  .overclass{
    background:blue;
    height: 40px;
    cursor:pointer;
    margin-bottom: 10px;
  }
  .nooverclass{
    height: 40px;
    cursor:pointer;
    background: white;
    margin-bottom: 10px;
  }
  .hweg{
    cursor:pointer;
  }
  .overclass2{
    height: 40px;
    cursor:pointer;
    background: red;
    margin-bottom: 10px;
    cursor:pointer;
  }
  .bao{

    overflow: hidden;
    padding-bottom: 12px;
  }
  .formitem{
    float: left;
    width: 28%;

  }
  .mofang{
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 115px;
  }
  .suiyi{
    width:150px;
  }
  .stdenttable{
    min-width:960px;
  }
.xlxq{
  width: 100%;
  font-size: 24px;
  padding: 20px;
  border-bottom: 3px solid #DCDFE6 ;
}
  .ovfl{
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .downloadbtn{
    width: 75px;
    height: 25px;
    background: none;
    border-radius: 3px;
    border: 1px solid cornflowerblue;
    color: cornflowerblue;
    cursor: pointer;
    text-align: center;
    line-height: 25px;
    text-decoration: none;
  }
  .downloadbtn:hover{
    background: cornflowerblue;
    color: white;
    transition: all .3s;
  }
  .dowladaea{
    width:100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    box-sizing: border-box;
    /*border-bottom: 1px solid lightgray;*/

  }
</style>
