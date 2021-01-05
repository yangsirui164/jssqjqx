<template>
  <div @click="nullclick" class="ghff">
    <el-card style="height: 100%">
      <div class="card_left">
        <div class="cardlefttou">
          <div class="smallbao">
          <el-input placeholder="请输入查询关键字" v-model="filterText" :disabled="isedit"
                    class="gjz">
            <i slot="suffix" class="el-input__icon el-icon-circle-close closeicon"
            @click="chongzhi"></i>
          </el-input>
          </div>
          <div class="smallbao2">
            <el-button  size="mini" @click="daoru" class="addbtn" type="primary">
            批量导入
          </el-button>
           <el-button  size="mini" @click="daochu" class="addbtn" type="primary">
              批量导出
            </el-button>

            <el-button  size="mini" @click="daochubg" class="addbtn" type="primary">
              导出报表
            </el-button>

            <el-button  size="mini" @click="piliangdelete" class="addbtn" type="primary">
              批量删除
            </el-button>

          </div>
          <el-button v-if="nosubject" size="mini" @click="addsamelevel" style="margin-top: 10px;width: 100%">
            新增车辆
          </el-button>
        </div>


        <el-tree
          class="filter-tree"
          :data="tree_data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="dianji"
          ref="tree"
          node-key="key"
          highlight-current
          :current-node-key="parentid"
          show-checkbox
          @check-change="handleCheckChange"
          :check-strictly="true"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
           <span>{{ node.label }}</span>
        <i class="el-icon-c-scale-to-original bianji" @click.stop="youji($event,node,data)"></i>
          </span>
        </el-tree>
        <div id="menu" v-show="ismenu">
          <div @click="addsamelevel">新增同级</div>
          <div @click="addnextlevel" v-if="nowlevel!=3">新增下级</div>
          <div @click="editlevel">编辑</div>
          <div @click="deletecar">删除</div>

        </div>

      </div>


    <div class="card_right">
    <!--一级显示卡片-->
   <div v-if="fakelevel==1" style="height: 100%">

     <div class="level1_head">
       <div class="level1_had">
         <div class="xitongimg">
           <img src="../assets/xitong.png" alt="" >
         </div>

         <div class="xitogdiv">
           <span class="vdc">系统数量</span>
           <div class="vdcd">{{sysNum}}个系统</div>
         </div>
       </div>
       <div class="level1_had">
         <div  class="xitongimg">
           <img src="../assets/sunshang.png" alt="">
         </div>

         <div class="xitogdiv">
           <span class="vdc">损伤项目</span>
           <div  class="vdcd">{{damNum}}个损伤项目</div>
         </div>
       </div>
     </div>

     <el-card class="level1_body">
      <el-row class="body_head1">
        <span class="guier"></span>
        <span class="guier2">系统占比</span>
      </el-row>
<!--       饼状图-->
      <div id="main" style="width: 500px;height:450px;"></div>
     </el-card>
   </div>



<!--      三级显示卡片-->
      <div v-if="fakelevel==3" style="height: 100%">

        <div class="formfirst">
          <el-row class="body_head1">
            <span class="guier"></span>
            <span class="guier2">损伤项目信息</span>
          </el-row>
            <el-form :model="addform3" :rules="addform3rules" ref="addfor3mref">
              <el-col>
                <el-form-item label="车型:" prop="carName" label-width="90px">
                  <el-input v-model="addform3.carName" disabled></el-input>
                </el-form-item>

                <el-form-item label="系统:" prop="carSystem" label-width="90px">
                  <el-input v-model="addform3.carSystem" disabled></el-input>
                </el-form-item>
                <el-form-item label="损伤项目:"  label-width="90px" prop="carDamage">
                  <el-input v-model="addform3.carDamage" :disabled="!isedit"></el-input>
                </el-form-item>
              </el-col>


              <el-form-item label="备注:"  label-width="90px" prop="remark">
                <el-input v-model="addform3.remark" :disabled="!isedit"></el-input>
              </el-form-item>
              <el-form-item label="上传图片:" prop="xqPicArr">
                <el-upload
                  :file-list="damageicArr"
                  :action="actionFM"
                  :on-preview="xqPreview1"
                  list-type="picture-card"
                  accept=".png,.jpeg,.jpg"
                  :on-remove="handleRemove"
                  :on-success="xqsuccess"
                  :limit="5"
                  name="files"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="xqVisible" append-to-body>
                  <img width="100%" :src="dialogxqUrl" alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item label="上传文件:" prop="upload">

                <el-upload
                  :file-list="filearr"
                  :action="actionYWJ"
                  :on-success="handlesucss"
                  :on-preview="handlePre"
                  :on-remove="handleRve"
                  :before-upload="beforeUpload"
                  list-type="text"
                  multiple
                  ref="upload"
                  accept=".pdf"
                  name="files"
                >
                  <el-button type="primary" size="mini">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">（1）支持pdf文件上传,扩展名.pdf
                    （2）单文件不能超过100M</div>
                </el-upload>
              </el-form-item>
          </el-form>
        </div>



      </div>



      </div>

    </el-card>
    <!--  一级   新增/编辑  同级-->
    <el-dialog
      :title="diatitle"
      :visible.sync="addsame1visible"
      width="70%"
      @close="addsame1closed"
    >
      <el-form label-width="90px" :model="addform1"
               ref="addsame1ref" :rules="addsamerules">
        <el-form-item label="车辆名称:" prop="name">
          <el-input v-model="addform1.name" size="mini" class="duaninput"></el-input>
        </el-form-item>

        <el-form-item label="上传封面图:" prop="coverPicArr">
          <el-upload
            :file-list="covericarr"
            :action="actionFM"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            accept=".png,.jpeg,.jpg"
            :on-remove="handleRemove1_1"
            :on-success="avatorsuccess1_1"
            :limit="1"
            name="files"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="diacover1Visible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item label="上传详情图:" prop="xqPicArr">
          <el-upload
            :file-list="xqicaArr"
            :action="actionXQ"
            :on-preview="xqPreview1"
            list-type="picture-card"
            accept=".png,.jpeg,.jpg"
            :on-remove="handleRemove1_2"
            :on-success="xqsuccess"
            :limit="5"
            name="files"
           >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="xqVisible" append-to-body>
            <img width="100%" :src="dialogxqUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item label="上传文件:" prop="upload">

          <el-upload
            :file-list="filearr"
            :action="actionYWJ"
            :on-success="pdfsucess1"
            :on-preview="pdfPre1"
            :on-remove="handleRemove1_3"
            :before-upload="beforeUpload"
            list-type="text"
            multiple
            ref="upload"
            accept=".pdf"
            name="files"
          >
            <el-button type="primary" size="mini">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">（1）支持pdf文件上传,扩展名.pdf
              （2）单文件不能超过100M</div>
          </el-upload>
        </el-form-item>
<!--        <el-form-item label="说明:" prop="remark">-->
<!--          <el-input v-model="addform1.remark"></el-input>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addsame1closed" size="mini">取 消</el-button>
    <el-button type="primary" @click="addsamelevel1" size="mini">确 定</el-button>
  </span>
    </el-dialog>

<!--新增2级   编辑2级-->

    <el-dialog
      :title="diatitle"
      :visible.sync="addsame2visible"
      width="70%"
      @close="addsame2closed"
    >
      <el-form label-width="90px" :model="addform2"
               ref="addsame2ref" :rules="addsamerules2">
        <el-form-item label="装置名称:" prop="name">
          <el-input v-model="addform2.name" size="mini" class="duaninput"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addsame2closed" size="mini">取 消</el-button>
    <el-button type="primary" @click="addsamelevel2" size="mini">确 定</el-button>
  </span>
    </el-dialog>



    <el-dialog
      title="在线预览"
      :visible.sync="dpfvisible"
      width="60%"
      @close="addialogclose"
      class="diq"
    >
      <!--     pdf预览-->
<!--      <embed :src="fileData" type="application/pdf" class="diapdf">-->

<!--      移动端-->
      <pdf :src="fileData"  v-for="item in numPages" :page="item" :key="item"></pdf>
    </el-dialog>

  </div>
</template>
<script>
  import pdf from 'vue-pdf'
  import * as echarts from 'echarts'
  export default{
    components: {pdf},
    data(){

      return{
        addform3:{
          carName:'',
          carSystem:'',
          carDamage:'',

        },
        chosesels:[],
        numPages:0,
       fileData:'',
       addorupdate1:1,
        actionFM:'',
        diatitle:'新增同级',
        //取消  保存按钮
        isbutton:false,
        addform1:{
          name:'',
          sourceFileArr:[],
          coverPicArr:[],
          xqPicArr:[],
          remark:'',
          // key:''
        },
        damageicArr:[],
        xqicaArr:[],
        covericarr:[],
        nowlevel:1,
        nosubject:true,
        addsame1visible:false,
        addsame2visible:false,
        actionYWJ:'',
        xqVisible:false,
        queryinfo:{
          id:''
        },
        dialogxqUrl:'',
        ismenu:false,


        addsamerules:{
          name:[
            { required: true, message: '请输入车辆名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2到 15 个字符', trigger: 'blur' }
          ],


        },
        sysNum:0,
        damNum:0,
        myChart:'',
        filearr:[],
        addform3rules:{
          subjectName:[
            { required: true, message: '请输入科目名称', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
          ],





        },
        addsamerules2:{
          name:[
            { required: true, message: '请输入装置名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2到 15个字符', trigger: 'blur' }
          ]
        },
        addform2:{
         name:''
        },
        fakelevel:1,
        dpfvisible:false,
        diacover1Visible:false,
        dialogImageUrl:'',
        parentid:'',
        isedit:false,
        filterText:'',
        defaultProps:{
          children:'children',
          label:'name'
        },
        tree_data:[],
        base:'',
        firstid:0,
        //0代表操作后高亮第一个    1代表高亮新增的那个
        caouzo:0,
        actionXQ:'',
        addorupdate2:1


      }
    },
    created() {
      this.base=this.BASE_URL

      this.base2=this.base_url
      //封面图接口
      this.actionFM=this.base+'/api/main/uploadCoverPic'
      //详情页接口
      this.actionXQ=this.base+'/api/main/uploadPicFile'
      //  源文件接口
      this.actionYWJ=this.base+'/api/main/uploadPdfFile'

      this.gettreeList()

    },
   mounted() {

     this.myChart = echarts.init(document.getElementById('main'));





   },
    watch:{
      filterText(val){
        this.$refs.tree.filter(val);
      }

    },
    methods:{
      //参数为对象
      digui(arr){
        //console.log(arr.length)
        if(arr != null){
          if(arr.length!=0){
            arr.forEach((item,index)=>{
              const iscf=this.chosesels.find((item1)=>{
                return item1==item.key})
              //没有重复的
              if(!iscf){
                this.chosesels.push(item.key)
              }

              if(item.children != null){
                this.digui(item.children)
              }

            })
          }
        }
      },
      pdfsucess1(res){
      //pdf上传成功
        console.log('上传成功')
        console.log(res)
        this.addform1.sourceFileArr.push(res)
      },
      handleRemove1_2(file){
        //删除详情图片
        const index=this.addform1.xqPicArr.findIndex(item=>{
          if(file.response){
            return file.response==item
          }else{
            const sourceindex=file.url.indexOf('source')
            const fdd=file.url.substr(sourceindex)
            return item==fdd
          }

        })
        this.addform1.xqPicArr.splice(index,1)
      },
      handleRemove1_3(file){
      //删除pdf文件
        const index=this.addform1.sourceFileArr.findIndex(item=>{
          if(file.response){
            return file.response==item
          }else{
            const sourceindex=file.url.indexOf('source')
            const fdd=file.url.substr(sourceindex)
            return item==fdd
          }

        })
        this.addform1.sourceFileArr.splice(index,1)
        // console.log('现在的sourceFileArr')
        // console.log(this.addform1.sourceFileArr)
      },
      beforeUpload(file){
        const isLt100M = file.size / 1024 / 1024 <99;

        if (!isLt100M) {

          this.$message.error('上传文件大小不能超过100M!');
        }
        return isLt100M
      },
      pdfPre1(file){
        console.log(file)
        if(file.response){
          //  如果有raw  是直接上传的预览
          this.fileData=pdf.createLoadingTask(this.base2+'/'+file.response)

          this.numPages=this.fileData.then(pdf => {this.numPages = pdf.numPages})

          // this.fileData=this.base2+'/'+file.response
        }else{


            this.fileData=pdf.createLoadingTask(file.url)
          this.numPages=this.fileData.then(pdf => {this.numPages = pdf.numPages})
          // this.fileData=file.url
        }
          console.log(this.fileData)

        this.dpfvisible=true
      },
      addialogclose(){

      },
      xqPreview1(file){
       this.dialogxqUrl=file.url
        this.xqVisible=true
      },
      handlePictureCardPreview(file){
        // console.log(file)
        // 头像预览
        this.dialogImageUrl = file.url;
        this.diacover1Visible = true;
      },
      xqsuccess(res){
        this.addform1.xqPicArr.push(res)
      },
      avatorsuccess1_1(res){
        this.addform1.coverPicArr.push(res)
      },
      handleRemove1_1(file){
        this.addform1.coverPicArr=[]

      },
      gettreeList(){
        //只高亮第一个   右面卡面显示第一个
        this.$http.get(`${this.base}/api/car/getcarlst`).then(res=>{
          console.log('返回tree数据')
          console.log(res.data)
          if(res.data.length==0){
            //没有科目
            this.nosubject=true
          }else{
            this.nosubject=false
            this.tree_data=res.data


            console.log(this.caouzo)
            //默认高亮第一个  删除  mounted  批量删除
            if(this.caouzo==0){
              this.parentid=res.data[0].key
              this.queryinfo.id=res.data[0].key
              this.$nextTick(function() {
                var that=this
                setTimeout(function() {
                  that.$refs.tree.setCurrentKey(that.parentid)

                },3000)
              })
              this.fakelevel=1
              this.nowlevel=1
              this.getyijiinfo()

            }

            //  添加  1级   编辑
            else if(this.caouzo==1){
              this.fakelevel=1
              this.$nextTick(function() {
                var that=this
                setTimeout(function() {
                  that.$refs.tree.setCurrentKey(that.parentid)
                },3000)
              })
              this.getyijiinfo()
            }



          }



        }).catch(res=>{
         console.log(res)
        })
      },
      getsanjiinfo(){

      },

      saveedit(){
        this.$refs.editformref.validate(valid=>{
          if(!valid){
            // this.$message.error('请检查格式正确!')
            return
          }

          this.$http.post(`${this.base}/api/Subject/updateInfo`,this.subjectform).then(res=>{
            console.log('编辑post返回值')
            console.log(res)
            if(res.data=="Ok"){
              this.$message.success('编辑成功')
              this.gettreeList()
            }

            this.isbutton=false
            this.isedit=false
          }).catch(res=>{
            this.$message.error('保存失败')
          })
        })
      },
      nullclick(){
        //  点击空白menu不显示
        this.ismenu=false

      },
      filterNode(value,data){
        if (!value) return true;
        // console.log(data)
        return data.lable.indexOf(value) !== -1;
      },
      dianji(object,value,element){
        this.ismenu=false
        if(value.level==2){

          return false
        }



        if(value.level!=2){
          this.fakelevel=value.level
        }
        this.queryinfo.id=value.data.key
        this.nowlevel=value.level
        if(this.isedit){
          this.$message.warning('您已进入编辑状态')
          return
        }

        if(value.level==1){
          //车辆信息
         this.getyijiinfo()

        }else if(value.level==3){
          this.getsanjiinfo()
        }

      },
      async getyijiinfo (){
      //获取一级信息
        const {data:res}=await this.$http.get(`${this.base}/api/car/getcarinfo/${this.queryinfo.id}`)
       console.log(res)
        this.sysNum=res.sysNum
        this.damNum=res.damNum


        this.myChart = echarts.init(document.getElementById('main'));
        var option={

          legend: {
            orient: 'vertical',
            x: 'left',
            y:'bottom',
            selectedMode: false,
            data: res.nameLst,
            formatter:function(name) {
              let data = option.series[0].data;
              let total=0;
              var tarValue = 0;
              for (var i = 0;i < data.length;i++) {
                total += data[i].value;
                if (data[i].name == name) {
                  tarValue = data[i].value;
                }
              }
              let p=0
              if(total==0){
                 p=0
              }else{
                 p = (tarValue / total * 100).toFixed(1);
              }

              return name + '  ' + '  '+'  ' + p + '%'+'  '+'  '+'  '+tarValue;
            }
          },
          series: [
            {

              type: 'pie',
              radius: '45%',
              center: ['50%', '30%'],
              data: res.objLst,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        this.myChart.setOption(option)
      },
      getlevel2(){
      this.$http.get(`${this.base}/api/carSystem/getcarsysteminfo/${this.queryinfo.id}`).then((res)=>{
              this.addform2.name=res.data.name
      })
      },
      treeinfomain(){
        //获取右面卡片信息
        this.$http.get(`${this.base}/api/Subject/getSubject/${this.queryinfo.id}`).then(res=>{
          console.log('返回单个')
          console.log(res.data)
          this.subjectform=res.data










        })
      },
      youji(event,node,data){

        // console.log('右击了')
        console.log(event.clientY)
        // console.log(node)
        // console.log(data)
        // if(node.level!=2){
        //   this.nowlevel=node.level
        // }

        if(node.level!=2){
          this.fakelevel=node.level
        }
        this.nowlevel=node.level
        // if(this.isedit){
        //   this.$message.warning('您已进入编辑状态')
        //   return
        //
        // }
        this.queryinfo.id=node.key
        this.$refs.tree.setCurrentKey(data.key)


          this.ismenu=true
          let menu=document.getElementById("menu")
          menu.style.left=event.clientX-15+"px"
          menu.style.top=event.clientY-65+"px"








      },
      addnextlevel(){
       if(this.nowlevel==1){
          this.addsame2visible=true
         //一级新增下级 、或二级新增同级  或编辑同级
         this.addorupdate2=1

       }


      },
      addsamelevel(){
        this.diatitle='新增同级'
        this.addorupdate1=1
        if(this.nowlevel==1){

          //  一级新增同级函数
          this.addsame1visible=true
        }else if(this.nowlevel==2){
          this.addorupdate2=1
        //  二级新增同级
          this.addsame2visible=true
        }


      },

      editlevel(){
        this.diatitle='编辑'

        if(this.nowlevel==1){
          this.addorupdate1=0
          //  一级编辑同级
          this.addsame1visible=true

          //调用编辑函数
          this.edit1()
        }else if(this.nowlevel==2){
          this.getlevel2()
          this.addorupdate2=0
          this.addsame2visible=true
        }
        //点击编辑事件
        // this.isedit=true
        // this.isbutton=true



      },
      addsamelevel2(){
        this.$refs.addsame2ref.validate(valid=>{
          if(!valid){
            return
          }

        this.addform2.key=this.queryinfo.id
        // 新增同级  下级才 为1   编辑为0
        this.$http.post(`${this.base}/api/carsystem/addorupdatecarsystem/${this.addorupdate2}`,this.addform2).then((res)=>{
          console.log(res.data)
         if(res.data.state==0){
           //编辑
           if(this.addorupdate2==0){

           }else if(this.addorupdate2==1){
             this.parentid=res.data.data
             this.queryinfo.id=res.data.data
           }
           this.caouzo=1

           this.$message.success('操作成功')
           this.gettreeList()
           this.addsame2visible=false
         }else{


         }
        }).catch((error)=>{
          console.log(error)
        })

        })

      },
      edit1(){
    this.$http.get(`${this.base}/api/car/getcarinfo/${this.queryinfo.id}`).then((res)=>{
     console.log(res.data)
      this.addform1=res.data
      //封面图设置
      let pictururl=res.data.coverPicArr
      pictururl.forEach((item)=>{
        let obj=new Object()
        obj.url=this.base2+'/'+item
        this.covericarr.push(obj)
      })


      //详情图设置
      let xqurl=res.data.xqPicArr
      xqurl.forEach((item)=>{
        let obj=new Object()
        obj.url=this.base2+'/'+item
        this.xqicaArr.push(obj)
      })

      let fileurl=res.data.sourceFileArr
      if(fileurl==[]){
        //  如果是空文件返回
        this.filearr=[]
      }else{
        this.addform1.sourceFileArr=res.data.sourceFileArr
        fileurl.forEach((item)=>{
          let obj1=new Object()
          obj1.url=this.base2+'/'+item
          obj1.name=item.split("\\")[1]
          this.filearr.push(obj1)

        })
      }




           }).catch((error)=>{
             console.log(error)
           })
      },
      edit2(){

      },
      addsame2closed(){
        //取消二级函数
      this.addsame2visible=false
      this.$refs.addsame2ref.resetFields()
        // console.log(this.addform2)
      },
      addsame1closed(){
        //取消一级函数
        this.addsame1visible=false
        this.$refs.addsame1ref.resetFields()
        //   内容清空
        this.addform1={
          name:'',
          coverPicArr:[],
          remark:'',
          xqPicArr:[],
          sourceFileArr:[],
          // key:''
        }
        this.filearr=[]
        this.xqicaArr=[]
        this.covericarr=[]
      },
      addsamelevel1(){
        // console.log('点了')
        console.log(this.queryinfo.id)
        this.$refs.addsame1ref.validate(valid=>{
          if(!valid){
            return
          }

          if(this.addorupdate1==1){
            this.addform1.key=''
          }else if(this.addorupdate1==0){
            this.addform1.key=this.queryinfo.id

          }

            //确认添加一级
            this.$http.post(`${this.base}/api/car/addorupdatecar`,this.addform1).then(res=>{
              console.log('新增返回')
              console.log(res.data)
              if(res.data.state==0){
                this.caouzo=1
                this.parentid=res.data.data
                this.queryinfo.id=res.data.data
                this.$message.success('操作成功')

                this.gettreeList()



              }else{

                // this.$message.error(res.data.error)
              }

              this.addsame1visible=false
            }).catch(res=>{
              this.$message.error('操作失败')
            })


        })
      },

      daoru(){

      },
      daochu(){

      },
      daochubg(){

      },
      piliangdelete(){
        this.chosesels=this.$refs.tree.getCheckedKeys()
       if(this.chosesels.length==0){
         return this.$message.warning('请选择要操作的数据')
       }
        this.$confirm('此操作将删除数据,是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
          this.$http.post(`${this.base}/api/car/delcar`,this.chosesels).then(res=>{
            if(res.data.state==0){
              this.caouzo=0
              this.gettreeList()
              this.$message.success('删除数据成功')

            }

          }).catch(res=>{

            this.$message.error('删除数据失败')
          })
        }).catch(res=>{

          this.chosesels=[]
          this.$refs.tree.setCheckedKeys([]);
          // this.$message.warning('已取消启用科目')
        })

      },
      deletecar(){
        //  删除
        this.$confirm('此操作将删除数据,是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
          var deleteArr=[]
          deleteArr.push(this.queryinfo.id)
          this.$http.post(`${this.base}/api/car/delcar`,deleteArr).then(res=>{
            console.log(res.data)
            if(res.data.state==0){
              this.caouzo=0
              this.gettreeList()
              this.$message.success('删除数据成功')

            }

          }).catch(res=>{
            this.$message.error('删除数据失败')
          })
        }).catch(res=>{
          // this.$message.warning('已取消启用科目')
        })
      },
      chongzhi(){
      this.filterText=''
      },
      handleCheckChange(data, checked, indeterminate){
        console.log('选择树')
        console.log(data, checked, indeterminate)
        this.chosesels=this.$refs.tree.getCheckedKeys()
        console.log('现在的')
        console.log(this.chosesels)
        //选中了
        if(checked){

          this.digui(data.children)
          console.log(this.chosesels)
   this.$refs.tree.setCheckedKeys(this.chosesels)
        }


      // var aa=this.$refs.tree.getCheckedNodes()
      //  console.log(aa)


      },
      stopedit(){
        //  停用

        this.$confirm('此操作将停用科目,是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
          this.$http.post(`${this.base}/api/subject/updateState`,{
            id:this.queryinfo.id,
            subjectState:false
          }).then(res=>{
            if(res.data=="Ok"){
              this.treeinfomain()
              this.$message.success('科目已停用')

            }

          }).catch(res=>{
            this.$message.error('科目停用失败')
          })
        }).catch(res=>{
          // this.$message.warning('已取消停用科目')
        })
      }


    }
  }
</script>
<style lang="less" scoped>
  html,body{
    position: relative;
    height: 100%;
  }
  #app{
height: 100%;
  }
  .card_left{
    width:40%;
  height: 100%;
    float: left;
    background: #122D42;
  }
  .cardlefttou{
    width: 100%;
    padding:10px;
    box-sizing: border-box;
    background: rgba(206, 209, 212,.3);
    text-align: center;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .card_right {
    /*border-left: 1px solid rgb(#C0C4CC);*/
    width: 60%;
    float: right;
    background: rgb(243, 247, 250);
    padding: 22px;
     height: 100%;
    overflow: hidden;
    box-sizing: border-box;

  }
  .el-card{
    overflow: hidden;
    height:300px;
  }
  .el-input{
    margin-bottom: 20px;
  }
  .statusinpu{
    width: 40%;
  }

  #menu{
    width: 100px;
    position: absolute;
    background: white;
    text-align: center;
    border-radius: 3px;
    border: 1px solid darkgrey;
    font-size: 12px;
    z-index: 1000;
    >div{
      width: 100%;
      height: 35px;
      line-height: 35px;
      cursor: pointer;
      padding: 0 10px;
      box-sizing: border-box;
      border-bottom: 1px solid darkgrey;

    }
    >div:hover{
      background:rgba(109,168,255,0.5);
    }
  }
  .el-input{
    margin-bottom:0px;
  }
  .filter-tree{
    /*margin-top: 25px;*/
    height: 600px;
    background: #122D42;
    color: #CED1D4;
    padding-bottom: 20px;

  }
  .el-tree{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .addbtn{
    margin-top: 8px;
  }
  .ghff{
    width: 100%;
    height: 100%;
  }
  .smallbao{
    width: 100%;

  }
  .smallbao2{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .closeicon{
    color: rgb(64, 158, 255);
  }
  .bianji{
   margin-left: auto;
    float: right;
   margin-right: 20px;
    width: 30px;
    font-size: 24px;
  }
.level1_head{
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
}
  .level1_had{
    width: 48%;
    height: 100%;
    border-radius: 5px;
    background: white;
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    border:1px solid #EBEEF5;
    box-shadow: 0 1px 1px rgba(0,0,0,0.15);

  }
  .level1_body{
    width: 100%;
    margin-top: 10px;
    height: 600px;
  }
  .level2_body{
   width: 100%;
   margin-top: 10px;
  }
  .xitongimg{
    width: 60px;
    height: 60px;
  margin-left: 20px;

  }
  .vdc{
    color:rgb(150, 150, 150);
    font-size: 16px;
  }
  .vdcd{
    font-weight: 500;
    font-size: 22px;

  }
  .duaninput{
    width: 300px;
  }
.xitogdiv{

  margin-left: 10px;


}
  .xitongimg img{
    width: 100%;
  }
  .body_head1{
    width: 100%;
    height: 50px;
    padding: 12px 12px 12px 20px;
    /*line-height: 50px;*/
    box-sizing: border-box;
    border-bottom: 1px solid #cccccc;
    display: flex;
    align-items: center;
  }
  .guier{
    display: inline-block;
    width: 3px;
    height: 100%;
    background:rgb(64, 158, 255);
  }
.guier2{
  color: rgb(22, 44, 62);
  font-weight: 600;
  font-size: 20px;
  margin-left: 10px;
}
  #main{
    margin-top: 30px;
  }
  .formfirst{
    width: 100%;
    border-bottom: 1px solid #cccccc;
  }
  .diq{
    text-align: center;
  }
  .diapdf{
    width: 100%;
    height: 850px;
  }
</style>

