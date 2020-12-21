<template>
<div @click="nullclick">

  <el-card>
    <div class="card_left">
     <el-input placeholder="请输入" v-model="filterText" :disabled="isedit">
       <i slot="suffix" class="el-input__icon el-icon-search"></i>
     </el-input>
      <el-button v-if="nosubject" size="mini" @click="addsamelevel" class="addbtn">
        新增科目
      </el-button>
      <el-tree
        class="filter-tree"
        :data="tree_data"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-contextmenu="youji"
        @node-click="dianji"
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
      <el-form :model="subjectform" :rules="editformrules" ref="editformref">
        <el-form-item label="科目名称:" prop="subjectName" label-width="90px">
          <el-input v-model="subjectform.subjectName" :disabled="!isedit" clearable></el-input>
        </el-form-item>

        <el-form-item label="科目编码:" prop="subjectCode" label-width="90px">
          <el-input v-model="subjectform.subjectCode" :disabled="!isedit" clearable></el-input>
        </el-form-item>
<!--        <el-form-item label="路径:" prop="subjectPath" label-width="90px">-->
<!--          <el-input v-model="subjectform.subjectPath" :disabled="!isedit" clearable></el-input>-->
<!--        </el-form-item>-->

        <el-form-item label="状态:"  label-width="90px" class="statusinpu">
<!--          <el-input disabled>{{subjectform.status}}</el-input>-->
          <span v-if="subjectform.subjectState===true" style="color: green">在用</span>
          <span v-else-if="subjectform.subjectState===false" style="color:red ">停用</span>
        </el-form-item>

        <el-form-item label="说明" prop="remark" label-width="90px">
          <el-input v-model="subjectform.remark" :disabled="!isedit"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :offset="14">
          <el-button v-show="isbutton" type="info" @click="quxiao">取消</el-button>
          <el-button v-show="isbutton" type="primary" @click="saveedit">保存</el-button>
        </el-col>
      </el-row>
    </div>

  </el-card>
<!--新增同级-->
  <el-dialog
    title="新增同级"
    :visible.sync="addsamedialogvisible"
    width="30%"
    @close="addsamedialogclosed"
  >
    <el-form label-width="90px" :model="addinfo"
              ref="addsamelevelref" :rules="addsamerules">
      <el-form-item label="科目名称" prop="subjectName">
        <el-input v-model="addinfo.subjectName"></el-input>
      </el-form-item>

      <el-form-item label="科目编码" prop="subjectCode">
        <el-input v-model="addinfo.subjectCode"></el-input>
      </el-form-item>

<!--      <el-form-item label="路径" prop="subjectPath">-->
<!--      <el-input v-model="addinfo.subjectPath"></el-input>-->
<!--    </el-form-item>-->

      <el-form-item label="说明" prop="remark">
        <el-input v-model="addinfo.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addsamedialogclosed">取 消</el-button>
    <el-button type="primary" @click="addsame">确 定</el-button>
  </span>
  </el-dialog>

</div>
</template>
<script>
export default{
  data(){
    return{
      //取消  保存按钮
      isbutton:false,
      addinfo:{
        subjectName:'',
        subjectCode:'',
        subjectPath:'',
        remark:''
      },
      nosubject:true,
      addsamedialogvisible:false,
      menuonclickinfo:{

      },
      queryinfo:{
        id:''
      },
      ismenu:false,
      subjectform:{
        subjectPath:''
      },
      xinzeng:false,
      addsamerules:{
        subjectName:[
          { required: true, message: '请输入科目名称', trigger: 'blur' },
          { min: 2, max: 9, message: '长度在 2 到 9 个字符', trigger: 'blur' }
        ],
        subjectCode:[
          { required: true, message: '请输入科目编码', trigger: 'blur' },
          { min: 2, max: 9, message: '长度在 2 到 9 个字符', trigger: 'blur' }
        ],
        // subjectPath:[
        //   { required: true, message: '请输入路径', trigger: 'blur' }
        // ]
      },
      editformrules:{
        subjectName:[
          { required: true, message: '请输入科目名称', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        subjectCode:[
          { required: true, message: '请输入科目编码', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        subjectPath:[
          { required: true, message: '请输入路径', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ]



      },
      parentid:'',
      isedit:false,
      filterText:'',
      defaultProps:{
        children:'children',
        label:'lable'
      },
      tree_data:[],
      base:''

    }
  },
  created() {
    this.base=this.BASE_URL
    this.getsubjectList()
    this.getsubjectinfo()
  },

  watch:{
    filterText(val){
      this.$refs.tree.filter(val);
    }

  },
  methods:{
    getsubjectList(){
      this.$http.get(`${this.base}/api/Subject/getAllSubject`).then(res=>{
        console.log('返回科目列表')
        console.log(res.data)
        if(res.data[0].children.length==0){
        //没有科目
          this.nosubject=true
        }else{
          this.nosubject=false
          if(!this.xinzeng){
            this.parentid=res.data[0].children[0].id
          }
          res.data[0].children.forEach((item,index)=>{
            item.lable="【"+item.code+"】"+item.lable
          })
          this.tree_data=res.data
          this.$nextTick(function() {
            var that=this
            setTimeout(function() {
              that.$refs.tree.setCurrentKey(that.parentid)
              that.xinzeng=false
            },3000)

          })
        }



      }).catch(res=>{
        console.log('获取科目失败')
      })
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
          this.getsubjectList()
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
      if(this.isedit){
        this.$message.warning('您已进入编辑状态')
        return
      }
      if(value.level==1){
        return
      }
      this.queryinfo.id=value.data.id
      this.getsubjectinfo()
    },
    getsubjectinfo(){
       //查询科目信息函数
       this.$http.get(`${this.base}/api/Subject/getSubject/${this.queryinfo.id}`).then(res=>{
         console.log('返回单个')
         console.log(res.data)
         this.subjectform=res.data
       })
    },
    youji(event,object,value,element){

      if(this.isedit){
        this.$message.warning('您已进入编辑状态')
        return

      }
      this.queryinfo.id=object.id
      this.getsubjectinfo()

      //右击节点时
      // console.log(event.clientX)
      // console.log(event.clientY)

      if(value.level==2){
        this.ismenu=true
       let menu=document.getElementById("menu")
        menu.style.left=event.clientX+35+"px"
        menu.style.top=event.clientY-65+"px"

      // 当前点击数据信息赋值
        this.menuonclickinfo.id=value.id
      }






    },
    addsamelevel(){
    //  新增同级函数
      this.addsamedialogvisible=true
      // this.addinfo.id=this.queryinfo.id
    },
    editlevel(){
      //点击编辑事件
      this.isedit=true
      this.isbutton=true
      this.subjectform.id=this.queryinfo.id


    },
    addsamedialogclosed(){
    //  取消新增同级函数
      this.addsamedialogvisible=false
      this.$refs.addsamelevelref.resetFields()
    //   内容清空
      this.addinfo={
        subjectName:'',
        subjectCode:'',
        subjectPath:'',
        remark:''
      }
    },
    addsame(){
      this.$refs.addsamelevelref.validate(valid=>{
        if(!valid){
          return
        }
    //确认添加同级函数
      this.$http.post(`${this.base}/api/Subject/addSubject`,this.addinfo).then(res=>{
        console.log('新增返回')
        console.log(res.data)
        if(typeof (res.data)=='number'){
          this.xinzeng=true
          this.parentid=res.data
          this.$message.success('添加同级成功')
            this.getsubjectList()
            this.queryinfo.id=res.data
          this.getsubjectinfo()

        }else{
          // this.$message.error('添加同级失败')
        }
        // if(res.data=='OK'){
        //   this.$message.success('添加同级成功')
        //   this.getsubjectList()
        //   // this.subjectform=res.data
        // }else{
        //   this.$message.error('添加同级失败')
        // }
        this.addsamedialogvisible=false
      }).catch(res=>{
        this.$message.error('添加同级失败')
      })
      })
    },
    quxiao(){
    //  取消返回原来数据形式
    // 获取原数据函数
      this.isedit=false
      this.isbutton=false
      this.$refs.editformref.resetFields()
      this.getsubjectinfo()
    },
    startedit(){
    //  启用
      this.$confirm('此操作将启用科目,是否继续?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res=>{
        this.$http.post(`${this.base}/api/subject/updateState`,{
          id:this.queryinfo.id,
          subjectState:true
        }).then(res=>{
          if(res.data=="Ok"){
            this.getsubjectinfo()
            this.$message.success('科目启动成功')

          }

        }).catch(res=>{
      this.$message.error('科目启动失败')
        })
      }).catch(res=>{
        // this.$message.warning('已取消启用科目')
      })
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
            this.getsubjectinfo()
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
  }
.card_left{
  width: 20%;
  padding:0px 10px;
  float: left;
  border-right: 1px solid rgb(#EAEDF1);
}
  .card_right {
    /*border-left: 1px solid rgb(#C0C4CC);*/
    width: 75%;
    float: right;
  >.el-form{
    width: 70% !important;
  }
  }
  .el-card{
    overflow: hidden;
    height: 400px;

  }
  .el-input{
    margin-bottom: 20px;
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
  .filter-tree{
    margin-top: 25px;
    height: 240px;
  }
  .el-tree{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .addbtn{
    margin-top: 20px;
  }

</style>
