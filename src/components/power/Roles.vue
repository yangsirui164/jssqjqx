<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>

    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

<!--      角色列表-->
      <el-table :data="rollList" border stripe >
<!--        展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item,index) in scope.row.children" :key="item.id"
            :class="['bdbottom',index===0?'bdtop':'','vcenter']">
<!--              一级权限-->
              <el-col :span="5">
<!--                二级权限-->
                <el-tag closable @close="removeRightByid(scope.row,item.id)"> {{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
               </el-col>
              <el-col :span="19">
                <el-row  class="[index1===0?'bdtop':'','vcenter']"
                        v-for="(item1,index1) in item.children" :key="item1.id" >
                   <el-col :span="9">
                     <el-tag type="success" closable @close="removeRightByid(scope.row,item1.id)">
                     {{item1.authName}}
                     </el-tag>
                     <i class="el-icon-caret-right"></i>
                   </el-col>

                  <el-col :span="15">
                  <el-tag v-for="(item3,index) in item1.children"
                          :key="item3.id"
                          closable @close="removeRightByid(scope.row,item3.id)">
                    {{item3.authName}}
                  </el-tag>
                  </el-col>
                </el-row>
              </el-col>



              <el-col :span="19">

              </el-col>
            </el-row>
<!--            <pre>{{scope.row}}</pre>-->

          </template>
        </el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-deletd" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showsetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

<!-- 分配权限 -->
    <el-dialog @close="setRightcosed"

      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"

    >
<!--      树形控件-->
      <el-tree :data="rightsist" :props="treeProps"  show-checkbox
      node-key="id"  default-expand-all  :default-checked-keys="defkeys"
               ref="treeref"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default{
data(){
  return{
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
    roId:''

  }
},
  created() {
  this.getRoleList()
  },
  methods:{
    async getRoleList(){
  const {data:res}=await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('用户获取失败')
      }
      this.rollList=res.data
      // console.log("这里呢"+this.rollList)
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
    async showsetRightDialog(row){
   this.roId=row.id
      console.log(this.roId)
      // console.log(row)
      const {data:res}=await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        return this.$message.error('获取权限数据失败')

      }
      this.rightsist=res.data
      this.getleafkeys(row,this.defkeys)
      this.setRightDialogVisible=true

    },
  //  递归函数获取所有三级节点id,保存到数组中
    getleafkeys(node,arr){
    //  判断是否为三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>{
        this.getleafkeys(item,arr)
      })


    },
    setRightcosed(){
    //  监听对话框关闭
      this.defkeys=[]
    },
    async allotRights(){

    //  点击确定，为角色分配权限
      const keys=[
        this.$refs.treeref.getCheckedKeys(),
        this.$refs.treeref.getHalfCheckedKeys()

      ]

     const idstr=keys.join(',')
     const {data:res}=await this.$http.post(`roles/${this.roId}/rights`,{rids:idstr})
      if(res.meta.status!==200){
        return this.$message.error('添加权限失败')

      }
      this.$message.success( '添加权限成功')
      this.getRoleList()
      this.setRightDialogVisible=false


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
</style>
