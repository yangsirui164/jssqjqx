<template>
  <div class="mingh1"  @click="nullclick">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>训练区域管理</el-breadcrumb-item>

    </el-breadcrumb>
    <el-card class="bielcard">
      <div class="card_left">
        <el-input placeholder="请输入" v-model="filterText" size="mini">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button v-if="nosubject" size="mini" @click="addsamelevel" class="addbtn">
          新增训练区域分类
        </el-button>
        <el-tree
          class="filter-tree"
          :data="tree_data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="dianji"
          @node-contextmenu="youji"
          ref="tree"
          node-key="id"
          highlight-current
          :current-node-key="parentid"
        >
        </el-tree>
        <div id="menu" v-show="ismenu">
          <div @click="addsamelevel">新增同级</div>
          <div @click="editlevel">编辑</div>
          <div @click="startedit">启用</div>
          <div @click="stopedit">停用</div>
        </div>
      </div>
      <div class="card_right">
      <el-row :gutter="21">
        <el-col :span="8">
          <span class="smallspan">训练区域:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1"
                    class="singleel_input"
                    size="mini"
                    clearable></el-input>

        </el-col>
        <el-col :span="8">
          <span class="smallspan">状态:</span>
          <select v-model="queryInfo.value2" class="sles">
            <option disabled value="">请选择</option>
            <option value="0">停用</option>
            <option value="1">在用</option>
          </select>
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
                   size="mini" style="margin-left: 10px"
        v-if="iserzi">新增</el-button>
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
          prop="name"
          label="训练区域"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        >
        </el-table-column>
        <el-table-column
          prop="info"
          label="设备信息"
        >
          <template slot-scope="scope">
            <span @click="connectsb(scope.row.id)">关联设备</span>
            <span>|</span>
            <span @click="findtable(scope.row.id)">查看</span>
          </template>
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
      </div>
    </el-card>

    <!--新增小区域-->
    <el-dialog
      title="新增/编辑区域"
      :visible.sync="addialogvisible"
      width="30%"
      @close="addialogclose"
    >
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef"
               label-width="70px"
               class="addformclas">

        <el-form-item label="训练区域:" prop="name"  label-width="85px" class="gh">
          <el-input v-model="addform.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark"  label-width="85px" class="gh">
          <el-input v-model="addform.remark" size="mini" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="addialogvisible = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="addArea" size="mini">确 定</el-button>
  </span>
    </el-dialog>





    <el-dialog
      title="关联设备"
      :visible.sync="guanlianlogvisible"
      width="25%"
      @close="guanliandialogclosed"
      class="addformclas"
    >
      <template v-if="ischild">
        <el-tree
          :data="tree_data1"
          :props="Props1"
          default-expand-all
          ref="tree"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaulechecked"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
    <el-button @click="guanlianlogvisible = false">取 消</el-button>
    <el-button type="primary" @click="connectInfo">确 定</el-button>
  </span>
      </template>
      <template v-if="!ischild">
        目前没有可关联的设备
      </template>
    </el-dialog>


    <el-dialog
      title="查看设备"
      :visible.sync="chakanlogvisible"
      width="60%"
      @close="chakandialogclosed"
      class="addformclas"
    >
      <el-table
        border
        stripe
        :data="singleareasb"
        style="width: 100%"
        ref="multipleTable2"
        :row-key="getRowKeys"
        class="studenttable"

      >
        <!--        添加索引-->
        <el-table-column type="index" label="序号"
        >
          <template slot-scope="scope">
            <span>{{scope.$index+(queryInfo1.pagenum-1)*(queryInfo1.pagesize)+1}}</span></template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
        >
        </el-table-column>
        <el-table-column
          prop="roleArrTxt"
          label="角色"
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

        <el-table-column
          prop="remark"
          label="备注"
        >
        </el-table-column>

      </el-table>
      <el-pagination
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="queryInfo1.pagenum"
        :page-sizes="[10,15,20]"
        :page-size="queryInfo1.pagesize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total1">
      </el-pagination>

      <span slot="footer" class="dialog-footer">
<!--    <el-button @click="editalogvisible = false">取 消</el-button>-->
        <!--    <el-button type="primary" @click="editUserInfo">确 定</el-button>-->
  </span>
    </el-dialog>

<!--    新增训练区域同级-->
    <el-dialog
      title="新增训练区域分类"
      :visible.sync="addsamedialogvisible"
      width="30%"
      @close="addsamedialogclosed"
    >
      <el-form label-width="90px" :model="addinfo"
               ref="addsamelevelref" :rules="addsamerules">
        <el-form-item label="训练区域分类:" prop="name"  label-width="125px" class="gh">
          <el-input v-model="addinfo.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark"  label-width="125px" class="gh">
          <el-input v-model="addinfo.remark" size="mini" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addsamedialogclosed">取 消</el-button>
    <el-button type="primary" @click="addsame">确 定</el-button>
  </span>
    </el-dialog>


<!--编辑训练区域分类-->
    <el-dialog
      title="编辑训练区域分类"
      :visible.sync="editsamedialogvisible"
      width="30%"
      @close="editsamedialogclosed"
    >

      <el-form label-width="90px" :model="editinfo"
               ref="editsamelevelref" :rules="editsamerules">
        <el-form-item label="训练区域分类:" prop="name"  label-width="125px" class="gh">
          <el-input v-model="editinfo.name" size="mini"></el-input>
        </el-form-item>

        <el-form-item label="状态:" prop="state1"  label-width="125px" class="gh">
            <span :style="{'color':(editinfo.state1=='启用'?'green':'red')}">{{editinfo.state1}}</span>

        </el-form-item>

        <el-form-item label="备注:" prop="remark"  label-width="125px" class="gh">
          <el-input v-model="editinfo.remark" size="mini" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="editsamedialogclosed">取 消</el-button>
    <el-button type="primary" @click="editsame">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import XLSX from 'xlsx'
  import FileSaver from 'file-saver'


  export default {
    data(){
      return{
        getRowKeys(row) {
          return row.id
        },
        ismenu:false,
        addsamedialogvisible:false,
        defaultProps:{
          children:'children',
          label:'lable'
        },
        filterText:'',
        addinfo:{
          name:'',
          remark:''
        },
        editinfo:{
          state1:false,
          name:'',
          remark:''
        },
        iserzi:true,
        editsamedialogvisible:false,
        parentid:0,
        isedit:false,
        tree_data:[],
        findtableid:0,
        singleareasb:[],
        ischild:true,
        nosubject:true,
        queryInfo1:{
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:10
        },
        options2:[
          {
            value: '0',
            label: '批量启动'
          },
          {
            value: '1',
            label: '批量停用'
          }
        ],
        options:[],
        areavalue:[],
        cascadervalue2:[],
        cascadervalue:[],
        sels: [],//选中的值显示
        //  获取用户列表的参数
        queryInfo:{
          //查询参数  可为空
          value1:'',
          value2:'',
          value3:'0',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:10
        },
        chakanlogvisible:false,
        queryInfo2:{
          username:'',
          name:''
        },
        userlist:[],
        total:0,
        addsamerules:{
          name:[
            { required: true, message: '请输入训练区域', trigger: 'blur' }
          ]
        },
        editsamerules:{
          name:[
            { required: true, message: '请输入训练区域', trigger: 'blur' }
          ]
        },
        //用户对话狂
        addialogvisible:false,
        editalogvisible:false,
        tree_data1:[],
        addform:{
          name:'',
          remark:"",
          classId:''
        },
        editform:{
          id:''
        },
        queryinfo:{
          id:'0'
        },
        //添加表单的验证规则
        addFormRules:{
          name:[
            { required: true, message: '请输入训练区域', trigger: 'blur' }
          ],
          remark:[

          ]


        },
        total1:0,
        areaarr:[],
        defaulechecked:[],
        guanlianlogvisible:false,
        Props1:{
          children:'children',
          label:'lable'
        },
        setrolelogvisible:false,
        selectedroleid:'',
        shouquanid:'',
        editid:''
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
      "queryInfo.value3":function(val){
          // console.log('.........')
          // console.log(val)
        if(val==0){
           this.iserzi=false
        }else{
          this.iserzi=true
        }
      },
      filterText(val){
        this.$refs.tree.filter(val);
      },
      // 监听两个input值为空时  重新获取列表
      bothvalue:{
        handler:function(newval) {
          console.log("both有变化",newval)
          if(newval.value1==""&&newval.value2==""){
            this.getAreaByPage()
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
      }
    },
    created() {
      //获取所有一级区域
      this.getoneList()
      //分页查询
      this.getAreaByPage()


    },
    methods:{
      stopedit(){
        //  停用
        this.$confirm('此操作将停用训练区域,是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
          this.$http.post(`api/AreaClass/updateState/${this.queryinfo.id}/false`).then(res=>{
            if(res.data=="Ok"){
              this.$message.success('训练区域已停用')
            }

          }).catch(res=>{
            console.log('停用训练区域失败')
          })
        }).catch(res=>{
        })
      },
      startedit(){
        //  启用
        this.$confirm('此操作将启用训练区域,是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
          this.$http.post(`api/AreaClass/updateState/${this.queryinfo.id}/true`).then(res=>{
            if(res.data=="Ok"){
              this.$message.success('训练区域启用成功')

            }

          }).catch(res=>{
          console.log('训练区域启用失败')
          })
        }).catch(res=>{
        })
      },
      editlevel(){
        this.editsamedialogvisible=true
        this.$http.get(`api/AreaClass/getAreaClass/${this.queryinfo.id}`).then(res=>{
          //  console.log('获取单个区域分类信息')
          // console.log(res.data)
          this.editinfo=res.data
          if(res.data.state){
            this.editinfo.state1="启用"
          }else{
            this.editinfo.state1="停用"
          }
        }).catch(res=>{
          console.log('获取单个区域信息失败')
        })


      },
      youji(event,object,value,element){
        this.queryinfo.id=object.id
        if(value.level==2){
          this.ismenu=true
          let menu=document.getElementById("menu")
          menu.style.left=event.clientX+35+"px"
          menu.style.top=event.clientY-65+"px"
        }

      },
      filterNode(value,data){
        if (!value) return true;
        return data.lable.indexOf(value) !== -1;
      },
      dianji(object,value,element){
        if(value.level==1){
          this.queryInfo.value3=0
        }
        if(value.level==2){
          this.queryInfo.value3=value.data.id
        }
        this.getAreaByPage()


      },
      editsame(){
           this.editinfo.id=this.queryinfo.id.toString()
        //确认编辑同级
        this.$http.post('api/AreaClass/addAndUpdateArea',this.editinfo).then(res=>{
          // console.log('新增返回')
          // console.log(res.data)
          if(res.data=='OK'){
            this.$message.success('编辑训练区域成功')
            this.getoneList()
          }else{
            this.$message.error('编辑训练区域失败')
          }
          this.editsamedialogvisible=false
        }).catch(res=>{
          console.log('编辑同级失败')
        })
      },
      addsame(){
        //确认添加同级函数
        this.$http.post('api/AreaClass/addAndUpdateArea',this.addinfo).then(res=>{
          console.log('新增返回')
          console.log(res.data)
          if(typeof (res.data)=='number'){
            this.parentid=res.data
            this.getoneList()
            this.queryInfo.value3=res.data
            this.getAreaByPage()
            this.$message.success('添加同级成功')
          }else{
            this.$message.error(res.data)
          }
          this.addsamedialogvisible=false
        }).catch(res=>{
          console.log('添加同级失败')
        })
      },
      addsamedialogclosed(){
        //  取消新增同级函数
        this.addsamedialogvisible=false
        this.$refs.addsamelevelref.resetFields()
        //   内容清空
        this.addinfo={
            name:'',
          remark:''
        }
      },
      addsamelevel(){
        //  新增同级函数
        this.addsamedialogvisible=true

      },
      getoneList(){
        this.$http.get('api/AreaClass/getAllAreaClass').then(res=>{
              // console.log('获取一级返回')
              // console.log(res.data)

          if(res.data[0].children.length==0){
            //没有科目
            this.nosubject=true
          }else{
            this.nosubject=false
            this.tree_data=res.data
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.parentid)
            })

          }

        }).catch(res=>{
          console.log('获取区域分类失败')
        })

      },
      findtable(id){
        this.findtableid=id
        this.chakanlogvisible=true
        this.queryInfo1.value1=id
        this.$http.post('api/Equipment/getEquipmentByPage1',this.queryInfo1).then(res=>{
          // console.log('获取小table信息')
          // console.log(res.data)
          this.singleareasb=res.data.data
          this.total1=res.data.total
        }).catch(res=>{
          console.log("获取小表格失败")
        })
      },
      connectInfo(){
        const keys=this.$refs.tree.getCheckedKeys()
        // console.log('选中的keys')
        // console.log(keys)
        this.$http.post(`api/TrainArea/updateAreaEquipment/${this.shouquanid}`,keys).then(res=>{
          // console.log('关联设备返回')
          // console.log(res.data)
          if(res.data=='Ok'){
            this.$message.success('关联设备成功')
            this.getAreaByPage()
            this.guanlianlogvisible=false
          }else{
            console.log('关联设备失败')
            this.guanlianlogvisible=false
          }
        })
      },
      connectsb(id){
        this.shouquanid=id
        //关联设备
        this.$http.get(`api/TrainArea/getAllEquipmentByArea/${id}`).then(res=>{
          // console.log('获取关联设备eri返回')
          // console.log(res.data)
          if(res.data[0].children.length==0){
            this.ischild=false
          }else{
            this.ischild=true
            res.data[0].children.forEach((item,index)=>{
              if(item.isChecked==true){
                this.defaulechecked.push(item.id)
              }
            })
            this.tree_data1=res.data
          }

          this.guanlianlogvisible=true
        }).catch(res=>{

        })

      },
      handleChange(val){
        // console.log('选择变化')
        // console.log(val)
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
          this.$confirm(`将要批量${warningtext},是否继续？`,'提示',{
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
            }
          )

        }
        this.cascadervalue2=[]
      },
      openstates(){
        //批量启用
        this.$http.post('api/TrainArea/updateStates/true',this.sels).then(res=>{
          if(res.data=='Ok'){
            this.$message.success('批量启动成功')
            this.getAreaByPage()
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
      closestates(){
        //批量停用
        this.$http.post('api/TrainArea/updateStates/false',this.sels).then(res=>{

          if(res.data=='Ok'){
            this.$message.success('批量停用成功')
            this.getAreaByPage()
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
        this.getAreaByPage()
      },
      getAreaByPage(){
        this.$http.post('api/TrainArea/getTrainAreaByPage',this.queryInfo).then(res=>{
          // console.log('获取table信息')
          // console.log(res.data)
          this.userlist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取区域列表失败")
        })

      },
      //监听每页？条数据  的事件
      handleSizeChange(val){
        this.queryInfo.pagesize=val
        this.getAreaByPage()
      },
      handleSizeChange2(val){
        this.queryInfo1.pagesize=val
        this.findtable(this.findtableid)
      },

      //监听页码值改变的事件
      handleCurrentChange(val){
        // console.log(val)
        this.queryInfo.pagenum=val
        this.getAreaByPage()
      },
      handleCurrentChange2(val){
        this.queryInfo1.pagenum=val
        this.findtable(this.findtableid)
      },
      async userstatuschanged(changgestate){
        //修改后传递数据   用put请求
        const {data:res}=await this.$http.put(`users/${changgestate.id}/state/${changgestate.mg_state}`)
        if(res.meta.status!==200){
          changgestate.mg_state=!changgestate.mg_state
          return this.$message.error('更新用户状态失败')
        }

      },
      //添加对话框关闭事件
      addialogclose(){
        this.$refs.addFormRef.resetFields()
      },
      chakandialogclosed(){
        this.findtableid=0
        this.queryInfo1={
          pagenum:1,
          pagesize:10
        }
      },
      guanliandialogclosed(){
        this.defaulechecked=[]
      },
      addArea(){
        //点击确定按钮预校验
        this.$refs.addFormRef.validate(async valid=>{
          console.log(valid)
          if(!valid){
            return
          }
          if(this.isedit){
            this.addform.id=this.editid
          }else {
            this.addform.id=0
          }
          this.addform.classId=this.queryInfo.value3
          this.$http.post('api/TrainArea/addAndUpdateArea',this.addform).then(res=>{
            //return
            //新增返回
            // console.log('新增返回')
            // console.log(res.data)
            if(res.data=="OK"){
              this.$message.success('设置区域成功')
              this.addialogvisible=false
              this.getAreaByPage()

            }else{
              this.$message.error(res.data)
            }
          }).catch(res=>{
          })




        })
      },
      showeditdialog(id){
        this.isedit=true
        //编辑信息页面展示
        this.editid=id
        this.$http.get(`api/TrainArea/getTrainArea/${id}`).then(res=>{
          // console.log('获取单个信息')
          // console.log(res.data)
          //赋值文件数组
          this.addform.name=res.data.name
          this.addform.remark=res.data.remark
          this.addialogvisible=true

        }).catch(res=>{

          console.log('获取单个信息失败')
        })

      },
      editdialogclosed(){
        this.$refs.editformref.resetFields()

      },
      editsamedialogclosed(){
       this.editsamedialogvisible=false
        this.$refs.editsamelevelref.resetFields()

      },
      resetquery(){
        //重置按钮事件
        this.queryInfo.value1=''
        this.queryInfo.value2=''
        this.areavalue=''
        this.getAreaByPage()
        this.clearSelection()
        this.queryInfo.pagenum=1
      },
      nullclick(){
        //  点击空白menu不显示
        this.ismenu=false
      },
      handleSelectionChange(val){
        // console.log(val)
        let id=val.map(function(item) {
          return item.id
        })
        this.sels=id
      },
      xinzeng(){
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
  }
  .mingh1{
    min-width: 800px;
  }
  .gh{
    margin-bottom: 25px !important;
  }
  .sles{
    width: 70px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #c3c7da;
    font-size: 12px;
    outline: none;
  }
  .el-cascader-menu__wrap{
    height: 200px !important;
  }
  .bielcard{
    height: 100%;
    padding-bottom: 50px;
  }
  .card_left{
    width: 15%;
    padding:0px 10px;
    float: left;
    border-right: 1px solid rgb(#EAEDF1);
  }
  .card_right {
    width: 80%;
    float: left;
    margin-left: 20px;
    >.el-form{
      width: 70% !important;
    }
  }
  .addbtn{
    margin-top: 20px;
  }
  .filter-tree{
    margin-top: 25px;
    /*height: 240px;*/
  }

  #menu{
    width: 85px;
    position: absolute;
    background: white;
    text-align: center;
    border-radius: 3px;
z-index: 100;
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
</style>
