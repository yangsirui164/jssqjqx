<template>
  <div @click="nullclick">
    <el-card class="bigelcard">
      <div class="card_left">
        <el-input placeholder="请输入" v-model="filterText">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-tree
          default-expand-all
          class="filter-tree"
          :data="tree_data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="dianji"
          ref="tree"
          node-key="id"
          highlight-current
          :current-node-key="parentid"

        >
        </el-tree>
      </div>
      <div class="card_right">
        <el-row>
          <el-col class="header" :span="9">
            <span class="smallspan">单项编码:</span>
            <el-input placeholder="请输入" v-model="queryinfo.value2" clearable></el-input>
          </el-col>
          <el-col class="header" :span="9">
            <span class="smallspan">单项名称：</span>
            <el-input placeholder="请输入" v-model="queryinfo.value3" clearable></el-input>
          </el-col>
          <el-col  :span="6">
            <el-button type="primary" @click="chaxun" size="mini">查询</el-button>
            <el-button @click="resetquery" size="mini">重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="ghh">
            <el-button type="primary"  @click="showadddialog" size="mini" v-if="isadd">
              <i class="el-icon-plus el-icon--left" ></i>
              新增</el-button>
            <el-button type="primary" size="mini" :disabled="isedit" @click="editlevel">
              <i class="el-icon-edit el-icon--left"></i>
              编辑</el-button>
            <div class="block">
              <el-cascader
                placeholder="快速操作"
                v-model="cascadervalue"
                :options="options"
                @change="handleChange"
                size="mini"
                :disabled="iskuaisu"></el-cascader>
            </div>
          </el-col>
        </el-row>
        <!--  表格-->
        <el-table
          border
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-key="getRowKeys"
          ref="buyerTable"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="selection"
                           :reserve-selection="true"
          ></el-table-column>


          <el-table-column
            prop="singelCode"
            label="单项编码"
          >
          </el-table-column>
          <el-table-column
            prop="singelName"
            label="单项名称"
          >
          </el-table-column>
          <el-table-column
            prop="userName"
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="创建时间" width="180">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="单项说明">
          </el-table-column>
          <el-table-column
            prop="singelState"
            label="状态">
            <template slot-scope="scope">
                <span v-if="scope.row.singelState==true">
                  <span style="width: 8px;height: 8px;border-radius: 4px;
                  background: green;display: inline-block;margin-right: 3px">
                  </span>
                  <span>在用</span>
                </span>
              <span v-else="scope.row.singelState==false">
                  <span style="width: 8px;height: 8px;border-radius: 8px;
                  background: red;display: inline-block;margin-right: 3px">

                  </span>停用</span>
            </template>
          </el-table-column>
          <el-table-column width="190px"
                           label="操作">
            <template slot-scope="scope">
              <span @click="showzidanxiang(scope.row.id)"
                    v-show="scope.row.isFather">添加子单项</span>
            </template>
          </el-table-column>

        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[10,15,20]"
          :page-size="queryinfo.pagesize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>





      </div>

    </el-card>
    <!--新增课程-->
    <el-dialog
      title="新增单项"
      :visible.sync="addialogvisible"
      width="30%"
      @close="addsamedialogclosed"
    >
      <el-form :model="addinfo"
               ref="addsamelevelref" :rules="addsamerules">
        <el-form-item label="单项编码" prop="singelCode" label-width="110px">
          <el-input v-model="addinfo.singelCode"></el-input>
        </el-form-item>
        <el-form-item label="单项名称" prop="singelName" label-width="110px">
          <el-input v-model="addinfo.singelName"></el-input>
        </el-form-item>
        <el-form-item label="单项说明" prop="remark" label-width="110px">
          <el-input v-model="addinfo.remark"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addsamedialogclosed">取 消</el-button>
    <el-button type="primary" @click="addsame">确 定</el-button>
  </span>
    </el-dialog>



    <!--编辑信息-->
    <el-dialog
      title="编辑单项"
      :visible.sync="editalogvisible"
      width="30%"
      @close="editdialogclosed"
    >
      <el-form  :model="editform1" label-width="70px" :rules="editformrules"
                ref="editformref">
        <el-form-item label="单项编码" prop="singelCode" label-width="110px">
          <el-input v-model="editform1.singelCode"></el-input>
        </el-form-item>

        <el-form-item label="单项名称" prop="singelName" label-width="110px">
          <el-input v-model="editform1.singelName"></el-input>
        </el-form-item>

        <el-form-item label="单项说明" prop="remark" label-width="110px">
          <el-input v-model="editform1.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogclosed">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>
<script>
  export default{
    data(){
      return{
        xzyijiid:'',
        iskuaisu:true,
        editform1:{
          courseId:'',
          singelCode:'',
          singelName:'',
          remark:''
        },
        xinzengarea:'',
        isadd:false,
        editalogvisible:false,
        sels:[],
        getRowKeys(row){
          return row.id
        },
        getRowKeys1(row){
          return row.id
        },
        singleform:{},
        tableData:[],
        //取消  保存按钮
        isbutton:false,
        addinfo:{
          courseId:'',
          singelCode:'',
          singelName:'',
          remark:''
        },
        addialogvisible:false,
        menuonclickinfo:{

        },
        queryinfo:{
          value1:0,
          value2:'',
          value3:'',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:10
        },
        ismenu:false,
        singleform:{
          status:1,
          subname:'啊哈哈哈',
          number:'1111',
          urls:'bdjkb',
          infor:'1'

        },
        total:0,
        addsamerules:{
          singelCode:[
            { required: true, message: '请输入单项编码', trigger: 'blur' },
            // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          singelName:[
            { required: true, message: '请输入单项名称', trigger: 'blur' },
            // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        },
        editformrules:{
          singelCode:[
            { required: true, message: '请输入单项编码', trigger: 'blur' },
            // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          singelName:[
            { required: true, message: '请输入单项名称', trigger: 'blur' },
            // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        },
        isedit:true,
        filterText:'',
        defaultProps:{
          children:'children',
          label:'lable'
        },
        parentid:'',
        tree_data:[],
        loginnanme:'',
        cascadervalue:[],
        options:[
        //   {
        //   value: '0',
        //   label: '批量删除'
        // },
          {
            value: '1',
            label: '批量启动'
          },
          {
            value: '2',
            label: '批量停用'
          }

        ],
        base:''
      }
    },
    watch:{
      filterText(val){
        this.$refs.tree.filter(val);
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
      "addinfo.courseId":function(newval){
        this.clearSelection()
        this.sels=[]
        if(newval==0){
          this.isadd=false
        }else{
          this.isadd=true
        }
      },
      bothclear:{
        handler:function(newval) {
          if(newval.value2==''&&newval.value3==''){
            this.getsubjectinfo()
          }
        },
        deep:true
      }

    },
    computed:{
      bothclear(){
        const {value2,value3}=this.queryinfo
        return{
          value2,
          value3
        }
      }
    },
    created(){
      this.base=this.BASE_URL
      const struserid=window.sessionStorage.getItem('loginid')
      this.addinfo.createUser=Number(struserid)
      this.getsubjectList()
      this.getsubjectinfo()
      this.$nextTick(function() {
        var that=this
        setTimeout(function() {
          that.$refs.tree.setCurrentKey(that.parentid)
        },1000)

      })
    },
    methods:{
      tableRowClassName({row, rowIndex}) {
        if (row.isFather) {
          return 'success-row';
        } else {
          return '';
        }

      },
      showadddialog(){
        this.xinzengarea='fu'
        this.addialogvisible=true
      },
      showzidanxiang(rowid){
       this.xinzengarea='zi'
        //设置新增子单项的一级id
        this.xzyijiid=rowid
        this.addialogvisible=true
      },
      piliangdelete(){
        //  点击了批量删除
        this.$http.post(`${this.base}/api/Singel/delSingels`,this.sels).then(res=>{
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
      editdialogclosed(){
        this.$refs.editformref.resetFields()
        this.editalogvisible=false

      },
      handleSelectionChange(val){

        this.sels=val.map(function(item) {
          return item.id
        })

      },
      resetquery(){
        //重置
        this.queryinfo.value2=''
        this.queryinfo.value3=''
        this.queryinfo.pagenum=1
        this.getsubjectinfo()
        this.sels=[]
        this.clearSelection()

      },
      handleChange(val){
        const warningarr=["删除","启用","停用"]

        //下拉框
        const warningtext=warningarr[val]
        this.$confirm(`将要批量${warningtext}单项,是否继续？`,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          res=>{
            if(val=='0'){
              //点击了批量删除
              this.piliangdelete()
            }else if(val=='1'){
              //点击了批量启动

              this.openstates()
            }else if(val=='2'){
              //点击了批量停用
              this.closestates()
            }
            this.cascadervalue=''
          }
        ).catch(
          res=>{
            this.sels=[]
            this.clearSelection()
            this.cascadervalue=''
            this.$message.warning(`已取消批量${warningtext}`)
          }
        )
      },
      editUserInfo(){
        this.$http.post(`${this.base}/api/Singel/updateInfo`,this.editform1).then(
          res=>{
            console.log('更新返回')
            console.log(res.data)
            if(res.data=="Ok"){
              this.$message.success('更新课程信息成功')
              this.editalogvisible=false
              this.getsubjectinfo()
              this.clearSelection()
              this.sels=[]
            }else{
              this.$message.error('更新课程信息失败')
            }
          }
        ).catch(res=>{
          console.log('更新失败')
        })
      },
      handleCurrentChange(val){
        this.queryinfo.pagenum=val
        this.getsubjectinfo()
      },
      handleSizeChange(val){
        this.queryinfo.pagesize=val
        this.getsubjectinfo()
      },
      openstates(){
        //批量启用
        this.$http.post(`${this.base}/api/Singel/updateStates/true`,this.sels).then(res=>{
          console.log('批量启动返回')
          console.log(res.data)
          if(res.data=='Ok'){
            this.$message.success('批量启动成功')
            this.getsubjectinfo()
          }else{
            this.$message.error('批量启动失败')
          }
        }).catch(res=>{
          // this.$message.error('批量删除失败')
          console.log('批量失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      closestates(){
        //批量停用
        this.$http.post(`${this.base}/api/Singel/updateStates/false`,this.sels).then(res=>{

          if(res.data=='Ok'){
            this.$message.success('批量停用成功')
            this.getsubjectinfo()
          }else{
            this.$message.error('批量停用失败')
          }
        }).catch(res=>{
          console.log('批量停用失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      nullclick(){
        //  点击空白menu不显示
        this.ismenu=false

      },
      filterNode(value,data){
        if (!value) return true;
        return data.lable.indexOf(value) !== -1;
      },
      dianji(object,value,element){
        if(value.level==1){
          console.log('点击一级')
          this.isadd=false
          this.queryinfo.value1=0
          this.addinfo.courseId=0
          this.getsubjectinfo()

        }
        if(value.level==2){
          console.log('点击2级')
        this.isadd=false
        }
        if(value.level==3){
          this.isadd=true
         console.log('点击三级')
          this.queryinfo.value1=value.data.id
          this.addinfo.courseId=value.data.id
          this.getsubjectinfo()

        }



      },
      chaxun(){
      this.queryinfo.pagenum=1
      this.getsubjectinfo()
      },
      getsubjectinfo(){
        //查询表信息
        console.log(this.queryinfo)
        this.$http.post(`${this.base}/api/Singel/getSingelByPage`,this.queryinfo)
          .then(res=>{
            console.log('获取到table信息')
            console.log(res.data)
            this.tableData=res.data.data
            this.total=res.data.total
          }).catch(res=>{
          console.log('获取单项信息失败')
        })
      },
      addsamelevel(){
        //  新增同级函数
        this.addsamedialogvisible=true
      },
      editlevel(){
        //点击编辑事件
        this.editalogvisible=true
        // console.log('编辑获取')
        // console.log(this.sels[0])
        //获取编辑信息的id
        this.editform1.courseId=this.sels[0]
        this.$http.get(`${this.base}/api/Singel/getSingel/${this.sels[0]}`).then(res=>{

          console.log('获取单项信息')
          console.log(res.data)
          this.editform1=res.data
        }).catch(res=>{
          console.log('编辑获取失败')
        })

      },
      clearSelection(){
        //  取消所有的选择
        this.$refs.buyerTable.clearSelection()
      },
      addsamedialogclosed(){
        //  取消新增同级函数
        this.xinzengarea=''
        this.addialogvisible=false
        this.$refs.addsamelevelref.resetFields()

      },
      addsame(){
        //确认添加课程
        this.$refs.addsamelevelref.validate(valid=>{
          if(!valid){
            return
          }
          //添加的是1级单项还是2级单项
          if(this.xinzengarea=='fu'){

            this.$http.post(`${this.base}/api/Singel/addSingel`,this.addinfo).then(res=>{
              console.log('新增返回')
              console.log(res.data)
              if(res.data=="OK"){
                this.$message.success('添加单项成功')
                this.getsubjectinfo()
                this.addialogvisible=false

              }else{
                this.$message.error('添加单项失败')
              }

            }).catch(res=>{
              console.log('添加单项失败')
              console.log(res)
            })
          }else if(this.xinzengarea=='zi'){
            this.addinfo.courseId=0
           this.$http.post(`${this.base}/api/Singel/addSingelSon/${this.xzyijiid}`,this.addinfo).then(res=>{
             if(res.data=='OK'){
               this.getsubjectinfo()
              this.$message.success('添加子单项成功')
               this.addialogvisible=false
             }
           }).catch(res=>{
             console.log('添加子单项失败')
           })
          }

        })

      },
      quxiao(){
        //  取消返回原来数据形式
        // 获取原数据函数

      },
      startedit(){
      },
      stopedit(){
      },
      getsubjectList(){
        this.$http.get(`${this.base}/api/Course/getCourseLstByState`).then(res=>{
          console.log('返回列表')
          console.log(res.data)
          this.parentid=res.data[0].id
          res.data[0].children.forEach((item,index)=>{
            item.lable="【"+item.code+"】"+item.lable
          })
          this.tree_data=res.data

        }).catch(res=>{
          console.log('获取课程列表失败')
        })
      }


    }
  }
</script>
<style lang="less" scoped>
  html,body{
    position: relative;
  }
  .card_left{
    width: 20%;
    padding:0px 10px;
    float: left;
    border-right:1px solid rgb(#EAEDF1);
  }
  .card_right {
    width: 75%;
    float: left;
    margin-left: 20px;
    >.el-form{
      width: 70% !important;
    }
  }
  .el-card{
    overflow: hidden;
    height: 400px;
  }

  .statusinpu{
    width: 40%;
  }
  .el-form-item{
    /*margin-bottom: 8px !important;*/
  }
  #menu{
    width: 85px;
    position: absolute;
    background: white;
    text-align: center;
    border-radius: 3px;

    border: 1px solid darkgrey;

    font-size: 12px;
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
  .header{
    >.el-input{
      width:175px;
    }
  }
  .ghh{
    margin-top: 20px;
  }
  .block{
    display: inline-block;
  }
  .el-tree{
    overflow-x: hidden;
    overflow-y: scroll;
    margin-top: 25px;
    height: 240px;
  }
  .smalfon{
    font-size: 14px;
  }
  .el-input__inner{
    height: 30px;
    line-height:  30px;
  }
  .bigelcard{
    height: 100%;
    padding-bottom: 50px;
  }

  .cell span{
    color: blue;
    cursor: pointer;
  }
</style>
