<template>
  <div class="mingh1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>

    </el-breadcrumb>
    <el-card>

      <el-row :gutter="20">
        <el-col :span="9">
          <span class="smallspan">角色名称:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1" class="widinput"
          size="mini">
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="chaxun" size="mini">查询</el-button>
          <el-button type="info" @click="resetrole" size="mini">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="actionel">
          <el-button type="primary" @click="addialogvisible=true"
          size="mini">新增</el-button>
          <el-button type="info" @click="removeroles()" :disabled="this.sels.length === 0"
          size="mini">批量删除</el-button>
<!--          <el-button @click="showepowerdialog()">授权</el-button>-->
        </el-col>
      </el-row>

<!--      table部分-->
      <el-table :data="rollList" border stripe
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys"
       ref="buyerTable"
      >
        <el-table-column type="selection"  reserve-selection></el-table-column>
      <el-table-column type="index" label="序号">
        <template slot-scope="scope"><span>{{scope.$index+(queryInfo.pagenum-1)*queryInfo.pagesize+1}}</span></template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" ></el-table-column>
        <el-table-column label="角色编号" prop="roleCode"></el-table-column>
        <el-table-column label="创建时间" prop="registerDate" width="170px"></el-table-column>
        <el-table-column label="备注" prop="remark" width="190px"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <span @click="showepowerdialog(scope.row.id)">授权</span>
            <span>|</span>
            <span @click="showeditdialog(scope.row.id)">编辑</span>
            <span>|</span>
            <span @click="removeUserbyid(scope.row.id)">删除</span>

          </template>
        </el-table-column>
      </el-table>
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

<!--  新增角色对话框-->
    <el-dialog
      title="新增角色"
      :visible.sync="addialogvisible"
      width="30%"
      @close="addialogclose"
    >
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addform.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色编码" prop="roleCode" label-width="90px">
          <el-input v-model="addform.roleCode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
     <el-button @click="addialogvisible = false">取 消</el-button>
     <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
<!--编辑对话框-->
    <el-dialog
      title="编辑角色"
      :visible.sync="editalogvisible"
      width="30%"
      @close="editdialogclosed"
    >
      <el-form  :model="editform1" label-width="70px" :rules="editformrules"
                ref="editformref">
        <el-form-item label="角色名称">
          <el-input v-model="editform1.roleName"></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="editform1.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editalogvisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="角色授权选择"
      :visible.sync="setpowervisible"
      width="60%"
      @close="setroledialog"
    >
<!--      <div class="diazog">-->

        <el-tree
        :data="tree_data"
        :props="defaultProps"
       default-expand-all
       ref="tree"
       node-key="id"
       show-checkbox
      :default-checked-keys="defaulechecked"
    >
         </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setpowervisible = false">取 消</el-button>
    <el-button type="primary" @click="saveuserpower">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default{
data(){
  return{
    defaulechecked:[],
    defaultProps:{
      children:'children',
      label:'lable'

    },
    editform1:{
      roleName:'',
      remark:''
    },
    iszha:false,
    editformrules:{
      roleName:[

      ],
      remark:[

      ]
    },
    checkedarr:[],
    defaultkeys1:[],
    defaultkeys2:[],
    tree_data:[],
    tree_data2:[],
    editalogvisible:false,
    sels:[],
    addFormRules:{
      roleName:[
        {required:true,message:'请输入角色名',trigger:'blur'}
      ],
      roleCode:[
        {required:true,message:'请输入角色编码',trigger:'blur'},
        {min:3,max:9,message:'长度在3到9之间',trigger:'blur'}

      ]
    },
    rolelist:[],
    total:0,
    addform:{

    },
    addialogvisible:false,
    queryInfo:{
      value1:'',
      //当前页码值
      pagenum:1,
      //每页显示条数
      pagesize:10
    },
    editform:{
      id:''
    },
    queryrole:'',
    rollList:[],
    setRightDialogVisible:false,
    rightsist:[],
    //树形控件属性绑定
    treeProps:{
      label:'authName',
      children:'children'
    },
    //默认选中的节点id
    defkeys:[],
    //即将分配权限的角色id
    roId:'',
    setpowervisible:false,
    transferData:[],
    shouquanid:'',
    transferarr:[],
    value4:[],
    data11: [{
      label: '一级 1',
      children: [{
        label: '二级 1-1',
        haha:'丽丽',
        children: [{
          label: '三级 1-1-1'
        }]
      }]
    }, {
      label: '一级 2',
      children: [{
        label: '二级 2-1',
        children: [{
          label: '三级 2-1-1'
        }]
      }, {
        label: '二级 2-2',
        children: [{
          label: '三级 2-2-1'
        }]
      }]
    }, {
      label: '一级 3',
      children: [{
        label: '二级 3-1',
        children: [{
          label: '三级 3-1-1'
        }]
      }, {
        label: '二级 3-2',
        children: [{
          label: '三级 3-2-1'
        }]
      }]
    }],

  }
},

  created() {
  this.getRoleList()
    const arr=[1,1,1,1]
  },
  watch:{
    "queryInfo.value1":function(newval){
      if(newval.length==0){
        this.getRoleList()
      }
    }
  },
  methods:{

    hanChtransfer(value, direction, movedKeys){
      console.log('穿梭change')
      console.log(value)
      this.transferarr=value
    },
    setroledialog(){
      this.defaulechecked=[]
      this.selectedroleid=""
      this.userinfo={

      }
    },

    disabledfn(data, node){
      console.log('.........')
      console.log(data)
      console.log(node)
      if(this.iszha&&data.father==1){
           return true
      }else{
        return false
      }

    },
    saveuserpower(){
      const keys=this.$refs.tree.getCheckedKeys()
      console.log('现在的keys')
      console.log(keys)
      this.$http.post(`api/Role/updatePermission/${this.shouquanid}`,keys).then(res=>{

        console.log('更新授权返回')
        console.log(res.data)
        if(res.data=='Ok'){
          this.$message.success('角色授权成功')
          this.getRoleList()
          this.setpowervisible=false
        }else{
          this.$message.error('角色授权失败')
          this.setpowervisible=false
        }
      })
    },
    editUserInfo(){
    //确定编辑
     this.$http.post('api/Role/updateInfo',{
       id:this.editform.id,
       roleName:this.editform1.roleName,
       remark:this.editform1.remark
     }).then(res=>{
       if(res.data=="Ok"){
         this.$message.success('修改成功')
         this.editalogvisible=false
         this.getRoleList()
       }
     }).catch(res=>{
   this.$message.error('编辑角色信息失败')
     })
    },
    handleSelectionChange(arrobj){
    //选择框change事件
    //   console.log("change了")
    //   console.log(arrobj)
      let id=arrobj.map((item)=>{
        return item.id
      })
      this.sels=id
    },
    editdialogclosed(){
    //  编辑对框框关闭
      this.$refs.editformref.resetFields()
    },
    showepowerdialog(id){
      this.shouquanid=id
      this.transferData=[]
      this.value4=[]
      // this.defaulechecked=[]
      //  显示授权页面
      this.$http.get(`api/Permission/getAllMenuByRole/${id}`).then(res=>{
        console.log('授权返回')
        console.log(res.data)
        const childata=res.data.children
        this.tree_data=childata
        this.getleafkeys(res.data,this.defaulechecked)
        console.log('现在被选中的')
        console.log(this.defaulechecked)
      }).catch(res=>{

      })
      this.setpowervisible=true



    },

    getRowKeys(row) {
      return row.id
    },
    showeditdialog(id){
      this.editform.id=id
    //  角色编辑
      this.$http.get(`api/Role/getRole/${id}`).then(res=>{
        this.editform1=res.data
        this.editalogvisible=true
      }).catch(res=>{
        console.log('获取原数据失败')

      })
    },
    removeUserbyid(id){
    //  删除角色
      this.editform.id=id
      this.$confirm('此操作将永久删除角色,是否继续?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(()=>{
      this.$http.get(`api/Role/delRole/${id}`).then(res=>{
       if(res.data=="Ok"){
         this.$message.success('删除数据成功')
         this.getRoleList()
       }
      }).catch(res=>{
        console.log('删除数据失败')
      })
      }).catch(res=>{
      console.log('取消删除数据')
      })

    },
    handleSizeChange(val){
      this.queryInfo.pagesize=val
      this.getRoleList()
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum=val
      this.getRoleList()
    },
    addUser(){
    //  确认新加
      this.$http.post('api/Role/addRole',this.addform).then(res=>{
        console.log("添加返回")
        console.log(res)
        if(res.data=="OK"){
          this.$message.success('添加角色成功')
          this.addialogvisible=false
          this.getRoleList()
        }
      }).catch(res=>{
        this.$message.error('添加角色失败')
      })
    },
    addialogclose(){
    //新增对话框关闭
      this.$refs.addFormRef.resetFields()


    },
    removeroles(){
    //  批量删除角色
    this.$confirm('将要批量删除角色，是否继续？','提示',{
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning'
    }).then(()=>{
     this.$http.post('api/Role/delRoles',this.sels).then(res=>{
       if(res.data=="Ok"){
        this.$message.success('批量删除成功')
         this.sels=[]
         this.getRoleList()
       }
     }).catch(res=>{
      this.$message.error('批量删除失败')
     })
    }).catch(res=>{
      console.log('取消批量删除')
    })
    },
    chaxun(){
      this.queryInfo.pagenum=1
    this.getRoleList()
    },
    getRoleList(){
      this.$http.post('api/Role/getRoleByPage',this.queryInfo).then(res=>{

       console.log(res)
        this.rollList=res.data.data
        this.total=res.data.total
      }).catch(res=>{
        console.log("获取失败")
      })


    },
    async removeRightByid(row,rigthid){
    //  删除对应权限
      const confirmReault=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(confirmReault!='confirm') return this.$message.info('取消了删除')

     const {data:res}=await this.$http.delete(`roles/${row.id}/rights/${rigthid}`)
      if(res.meta.status!==200){
        return this.$message.error('删除权限失败')

      }
      //调用函数 页面会重新渲染 所以表合上了
      // this.getRoleList()
    //  直接更新数据
      row.children=res.data
    },
  //  递归函数获取所有三级节点id,保存到数组中
    getleafkeys(node,arr){
    //  判断是否为三级节点
      if(node.children==null){
        if(node.isChecked==true){
           return arr.push(node.id)
        }
      }else{
        node.children.forEach(item=>{
          this.getleafkeys(item,arr)
        })
      }



    },
    setRightcosed(){
    //  监听对话框关闭
      this.defkeys=[]
    },
    clearSelection(){
      //  取消所有的选择
      this.$refs.buyerTable.clearSelection()
    },
    resetrole(){
    //  重置按钮事件
      this.queryInfo.value1=''
      this.queryInfo.pagenum=1
      this.getRoleList()
      this.sels=[]
      this.clearSelection()
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
  .widinput{
    width: 175px;
  }
.actionel{
  margin-top: 20px;

}
  .el-form-item__label{
    float:left
  }
.cell span{
  color: blue;
  cursor: pointer;
}
.el-checkbox__label{
  font-size: 12px !important;
}
  .diazuo{
   float: left;
    width: 42%;
  }
  .diayou{
    float: right;
    width: 42%;
  }
  .diazog{
    overflow: hidden;
  }
  .mingh1{
    min-width: 800px;
  }
</style>
