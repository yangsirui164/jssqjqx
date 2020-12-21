<template>
  <div @click="nullclick">

    <el-card>
      <div class="card_left">
        <el-input placeholder="请输入" v-model="filterText">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
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
          <div @click="addsamelevel" v-if="youjilevel!=1">新增同级</div>
          <div @click="addnextlevel">新增下级</div>
          <div @click="editlevel" v-if="youjilevel!=1">编辑</div>
          <div @click="deletelevel" v-if="isshanchu">删除</div>
        </div>

      </div>
      <div class="card_right">
        <el-row>
          <el-col class="header" :span="9">
            <span class="smallspan">应用程序名称：</span>
            <el-input placeholder="请输入" v-model="queryInfo.value1" clearable
                      size="mini"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="chaxun" size="mini">查询</el-button>
            <el-button @click="resetquery" size="mini">重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="ghh">
            <el-button type="primary"  @click="showadddialog" size="mini" v-if="isadd">
              <i class="el-icon-plus el-icon--left" ></i>
              新增</el-button>
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
        >
          <el-table-column type="selection"
                           :reserve-selection="true"
          ></el-table-column>


          <el-table-column
            prop="appName"
            label="应用程序名称"
          >
          </el-table-column>
          <el-table-column
            prop="appUrl"
            label="路径"
          >
          </el-table-column>
          <el-table-column
            prop="exeUrl"
            label="应用路径"
          >
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态">
            <template slot-scope="scope">
                <span v-if="scope.row.state==true">
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
          <el-table-column
            prop="remark"
            label="说明">
          </el-table-column>

          <el-table-column width="190px"
                           label="操作">
              <template slot-scope="scope">
                <span @click="showdetaildialog(scope.row)">查看</span>
                <span>|</span>
                <span @click="showeditdialog(scope.row)">编辑</span>
                <span>|</span>
                <span @click="removeappbyid(scope.row.id)">删除</span>

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


      </div>

    </el-card>
    <!--新增同级/或下级-->
    <el-dialog
      :title="diatile"
      :visible.sync="addsamedialogvisible"
      width="30%"
      @close="addsamedialogclosed"
    >
      <el-form label-width="90px" :model="addinfo"
               ref="addsamelevelref" :rules="addsamerules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addinfo.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addsamedialogclosed">取 消</el-button>
    <el-button type="primary" @click="addsame">确 定</el-button>
  </span>
    </el-dialog>




<!--新增 /查看 / 编辑   应用软件-->
    <el-dialog
      :title="apptitle"
      :visible.sync="addialogvisible"
      width="40%"
      @close="addclosed"
    >
      <el-form :model="addappinfo"
               ref="addsamele" :rules="addapprules">
        <el-form-item label="应用程序名称" prop="appName" label-width="110px">
          <el-input v-model="addappinfo.appName" :disabled="isdis"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="appUrl" label-width="110px">
          <el-input v-model="addappinfo.appUrl" :disabled="isdis"></el-input>
        </el-form-item>
        <el-form-item label="应用路径" prop="exeUrl" label-width="110px">
          <el-input v-model="addappinfo.exeUrl" :disabled="isdis"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state"  label-width="110px" v-if="addoredit==0">
          <el-select v-model="addappinfo.state" placeholder="请选择" :disabled="isdis"
          @change="forceup">
            <el-option
              v-for="item in optionsstate"
              :key="String(item.value)"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="说明" prop="remark" label-width="110px">
          <el-input v-model="addappinfo.remark"  :disabled="isdis"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer" v-if="!isdis">
    <el-button @click="addclosed">取 消</el-button>
    <el-button type="primary" @click="addapp">确 定</el-button>
  </span>
    </el-dialog>




  </div>
</template>
<script>
  export default{
    data(){

      return{
        getRowKeys(row){
          return row.id
        },
        base:'',
        isadd:false,
        optionsstate:[
          {
            value: 1,
            label: '在用'
          },{
            value:0,
            label: '停用'
          }
        ],
        options:[{
          value: '0',
          label: '批量删除'
        },
          {
            value: '1',
            label: '批量启动'
          },
          {
            value: '2',
            label: '批量停用'
          }

        ],
        base2:'',
        addoredit:0,
        addinfo:{
          name:'',
          //表示是添加同级还是下级
          torx:0,
          id:0
        },
        dianjilevel:0,
        youjilevel:0,
        addsamedialogvisible:false,
        diatile:'',
        queryInfo:{
          classId:0,
          value1:'',
          pagenum:1,
          pagesize:10,
          id:''
        },
        addappinfo:{
          appName:'',
          appUrl:'',
          state:1,
          remark:'',
          classId:'',
          exeUrl:''
        },
        chakanvisible:false,
        youjiname:'',
        ismenu:false,
        subjectform:{
        },
        xinzeng:false,
        addsamerules:{
          name:[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 9, message: '长度在 2 到 9 个字符', trigger: 'blur' }
          ]
        },

        addapprules:{
          appName:[
            { required: true, message: '请输入应用程序名称', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
          ],
          appUrl:[
            { required: true, message: '请输入路径', trigger: 'blur' }
          ],

          exeUrl:[
            { required: true, message: '请输入路径', trigger: 'blur' }
          ],



        },
        isdis:false,
        apptitle:'',
        addialogvisible:false,
        total:0,
        tableData:[],
        cascadervalue:[],
        sels:[],
        iskuaisu:true,
        isshanchu:true,
        parentid:'',

        filterText:'',
        defaultProps:{
          children:'children',
          label:'label'
        },
        tree_data:[],
      }
    },
    created() {
      this.base=window.global.BASE_URL
      this.getfenleiList()
      this.getappinfo()

    },

    watch:{
      filterText(val){
        this.$refs.tree.filter(val);
      },
      dianjilevel(val){
        if(val==1){
        //  全部
          this.isadd=false
        }else{
          this.isadd=true
        }
      },
      "sels":function(newval) {
        // console.log('监控')

        if(newval.length==0){
          this.iskuaisu=true
        }else{
          this.iskuaisu=false
        }
      },

    },
    methods:{
      chakandialogclosed(){

      },
      addapp(){
        this.$refs.addsamele.validate((res)=>{
          if(!res){
            return
          }



      //  添加程序
        if(this.addoredit==1){
          this.addappinfo.state=1
          this.addappinfo.classId=this.queryInfo.classId
          this.$http.post(`${this.base}/api/app/addApp`,this.addappinfo).then((res)=>{
            console.log('添加应用程序返回')
            console.log(res.data)
            if(res.data.state==0){
              this.$message.success('添加成功')
              this.getappinfo()
            }else{
              this.$message.error('添加失败')
            }

            this.addialogvisible=false
          }).catch(res=>{
            console.log(res)
            this.$message.error('添加失败')
          })
        }else if(this.addoredit==0){
          this.addappinfo.classId=1
        //    编辑程序
          this.addappinfo.id=this.queryInfo.id
          this.$http.post(`${this.base}/api/app/updateApp`,this.addappinfo).then((res)=>{
            console.log('编辑应用程序返回')
            console.log(res.data)
            if(res.data.state==0){
              this.$message.success('编辑成功')
              this.getappinfo()
            }else{
              this.$message.error('编辑失败')
            }

            this.addialogvisible=false
          }).catch(res=>{
            console.log(res)
            this.$message.error('编辑失败')
          })
        }
        })
      },
      handg3(){

      },
      deletelevel(){
        this.$confirm('将要删除此分类,是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res)=>{
          this.$http.post(`${this.base}/api/app/delAppClass`,this.addinfo).then(res=>{
            console.log('删除返回')
            console.log(res.data)
            if(res.data.state==0){
              this.$message.success('删除成功')
              this.getfenleiList()
            }else{
              // console.log(res.data.error)
              this.$message.error('删除失败,'+res.data.error)
            }

            this.addsamedialogvisible=false
          }).catch(res=>{
            this.$message.error('删除失败')
          })

        }).catch((res)=>{

        })

      },
      handleSizeChange(val){
        this.queryInfo.pagesize=val
        this.getappinfo()
      },
      //监听页码值改变的事件
      handleCurrentChange(val){
        // console.log(val)
        this.queryInfo.pagenum=val
        this.getappinfo()
      },
      handleSelectionChange(val){

        this.sels=val.map(function(item) {
          return item.id
        })

      },
      showadddialog(){
        //新增
        this.addoredit=1
        this.isdis=false
        this.apptitle='新增应用程序'
        this.addialogvisible=true
        this.addappinfo={
          appName:'',
          appUrl:'',
          remark:'',
          state:1,
          exeUrl:''

        }

      },
      handleChange(val){
        const warningarr=["删除","启用","停用"]

        //下拉框
        const warningtext=warningarr[val]
        this.$confirm(`将要批量${warningtext}应用程序,是否继续？`,'提示',{
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
      openstates(){
          //批量启用
          this.$http.post(`${this.base}/api/app/updateAppState/true`,this.sels).then(res=>{
            console.log(res.data)
            if(res.data.state==0){
              this.$message.success('批量启动成功')
              this.getappinfo()
            }else{
              this.$message.error('批量启动失败')
            }
          }).catch(res=>{
            console.log('批量失败')
          })
          this.sels=[]
          this.clearSelection()

      },
      piliangdelete(){
        //  点击了批量删除
        this.$http.post(`${this.base}/api/app/delApp/`,this.sels).then(res=>{
          console.log('批量删除返回')
          console.log(res.data)
          if(res.data.state==0){
            this.$message.success('批量删除成功')
            this.getappinfo()
          }else{
            this.$message.error('批量删除失败')
          }
        }).catch(res=>{
          console.log('批量删除失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      closestates(){
        this.$http.post(`${this.base}/api/app/updateAppState/false`,this.sels).then(res=>{
          console.log(res.data)
          if(res.data.state==0){
            this.$message.success('批量停用成功')
            this.getappinfo()
          }else{
            this.$message.error('批量停用失败')
          }
        }).catch(res=>{
          console.log('批量失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      chaxun(){
        this.queryInfo.pagenum=1
        this.getappinfo()
      },
      clearSelection(){
        //  取消所有的选择
        this.$refs.buyerTable.clearSelection()
      },
      resetquery(){
        //重置

        this.queryInfo.value1=''
        this.getappinfo()
        this.queryInfo.pagenum=1
        this.sels=[]
        this.clearSelection()
      },
      // digui(obj){
      //   if(obj.children!=null){
      //     obj.children.forEach((item,index)=>{
      //
      //       if(String(index).length==1){
      //
      //         item.label="[0"+(index+1)+"]"+item.label
      //       }else{
      //         item.label="["+(index+1)+"]"+item.label
      //       }
      //         this.digui(item)
      //
      //     })
      //   }
      //
      // },
      getfenleiList(){
        this.$http.get(`${this.base}/api/app/getappclasslst`).then(res=>{
          console.log('返回分类列表')
          console.log(res.data)
            if(!this.xinzeng){
              this.parentid=0
            }



            this.tree_data=res.data


            this.$nextTick(function() {
              var that=this
              setTimeout(function() {
                that.$refs.tree.setCurrentKey(that.parentid)
                that.xinzeng=false
              },3000)

            })




        }).catch(res=>{
          console.log('获取分类失败')
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
              this.getfenleiList()
            }



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
        return data.label.indexOf(value) !== -1;
      },
      dianji(object,value,element){
        this.dianjilevel=value.level
        // if(value.level==1){
        //   return
        // }
        this.queryInfo.classId=value.data.id
        this.getappinfo()
      },
      getappinfo(){
        // //查询表信息
        this.$http.post(`${this.base}/api/app/getAppByPage`,this.queryInfo)
          .then(res=>{
            console.log('获取到table信息')
            console.log(res.data)
            this.tableData=res.data.data
            this.total=res.data.total
          }).catch(res=>{
          console.log('获取table信息失败')
        })
      },
      removeappbyid(id){
        //返回值是一个promise
        this.$confirm('此操作将删除应用程序, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(`${this.base}/api/app/delApp/${id}`).then(
            res=>{
              console.log(res.data)
              if(res.data.state==0){
                this.$message.success('删除成功')
                this.getappinfo()
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
      forceup(){
        this.$forceUpdate()
      },
      showeditdialog(scoperow){
        console.log('编辑返回')
        console.log(scoperow)
        //编辑
        this.addoredit=0
       this.isdis=false
        this.queryInfo.id=scoperow.id
        this.addappinfo.appName=scoperow.appName
        this.addappinfo.appUrl=scoperow.appUrl
        this.addappinfo.remark=scoperow.remark
        this.addappinfo.exeUrl=scoperow.exeUrl
        if(scoperow.state==true){
          this.addappinfo.state=1
        }else{
          this.addappinfo.state=0
        }

        this.addialogvisible=true

        this.apptitle='编辑应用程序'
      },
      showdetaildialog(scoperow){
        console.log('信息')
        console.log(scoperow)
        this.addoredit=0
        this.addappinfo.appName=scoperow.appName
        this.addappinfo.appUrl=scoperow.appUrl
        this.addappinfo.remark=scoperow.remark
        this.addappinfo.exeUrl=scoperow.exeUrl
        if(scoperow.state==true){
          this.addappinfo.state=1
        }else{
          this.addappinfo.state=0
        }


        this.addialogvisible=true

        this.apptitle='查看应用程序'
        this.isdis=true




      },

      youji(event,object,value,element){
          console.log('右击了')
        console.log(object)
        this.addinfo.id=object.id
        this.youjiname=object.label

        // 判断有无删除功能
        if(object.children==null){
          this.isshanchu=true
        }else{
          this.isshanchu=false
        }


        this.youjilevel=value.level


        this.queryInfo.classId=object.id
        this.getappinfo()

        this.ismenu=true
        let menu=document.getElementById("menu")

        if(this.youjilevel==1){
        //  右击一级菜单
          menu.style.left=event.clientX+10+"px"
          menu.style.top=event.clientY-20+"px"
        }else{
          menu.style.left=event.clientX+35+"px"
          menu.style.top=event.clientY-65+"px"

        }











      },
      addsamelevel(){
        //  新增同级函数
        this.addinfo.torx=1
        this.diatile='新增同级'
        this.addsamedialogvisible=true
      },
      addnextlevel(){
        this.addinfo.torx=0
        this.diatile='新增下级'
        this.addsamedialogvisible=true
      },
      editlevel(){
        //点击编辑事件

        this.addinfo.torx=2
        this.diatile='编辑名称'
        this.addinfo.name=this.youjiname
        this.addsamedialogvisible=true

      },
      addsamedialogclosed(){
        //  取消新增同级函数
        this.addsamedialogvisible=false
        this.$refs.addsamelevelref.resetFields()
        //   内容清空
        this.addinfo={
          name:'',
          torx:0,
          id:0
        }
      },
      addclosed(){
        this.addialogvisible=false
        this.$refs.addsamele.resetFields()
        this.addappinfo={
          appName:'',
          appUrl:'',
          remark:'',
          exeUrl:''
        }
      },

      addsame(){
        this.$refs.addsamelevelref.validate(valid=>{
          if(!valid){
            return
          }
          if(this.addinfo.torx==0){
          //  新增下级
            this.$http.post(`${this.base}/api/app/addLowAppClass`,this.addinfo).then(res=>{
              console.log('新增返回')
              console.log(res.data)
              if(res.data.state==0){
                this.$message.success('添加成功')
                this.getfenleiList()
              }else{
                console.log(res.data.error)
                this.$message.error('添加失败')
              }

              this.addsamedialogvisible=false
            }).catch(res=>{
              this.$message.error('添加失败')
            })
          }else if(this.addinfo.torx==1){
          //  新增同级
            this.$http.post(`${this.base}/api/app/addPeerAppClass`,this.addinfo).then(res=>{
              console.log('新增返回')
              console.log(res.data)
              if(res.data.state==0){
                this.$message.success('添加成功')
                this.getfenleiList()
              }else{
                console.log(res.data.error)
                this.$message.error('添加失败')
              }
              //   this.xinzeng=true
              //   this.parentid=res.data




              this.addsamedialogvisible=false
            }).catch(res=>{
              this.$message.error('添加失败')
            })



          }else if(this.addinfo.torx==2){
          //  编辑名称
            this.$http.post(`${this.base}/api/app/updateName`,this.addinfo).then(res=>{
              console.log('新增返回')
              console.log(res.data)
              if(res.data.state==0){
                this.$message.success('添加成功')
                this.getfenleiList()
              }else{
                console.log(res.data.error)
                this.$message.error('添加失败')
              }

              this.addsamedialogvisible=false
            }).catch(res=>{
              this.$message.error('添加失败')
            })
          }else if(this.addinfo.torx==1){
            //  新增同级
            this.$http.post(`${this.base}/api/app/addPeerAppClass`,this.addinfo).then(res=>{
              console.log('新增返回')
              console.log(res.data)
              if(res.data.state==0){
                this.$message.success('添加成功')
                this.getfenleiList()
              }else{
                console.log(res.data.error)
                this.$message.error('添加失败')
              }
              //   this.xinzeng=true
              //   this.parentid=res.data




              this.addsamedialogvisible=false
            }).catch(res=>{
              this.$message.error('添加失败')
            })
          }



        })
      },
      quxiao(){
        this.$refs.editformref.resetFields()
        this.getappinfo()
      },
      startedit(){
        //  启用
        this.$confirm('此操作将启用科目,是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
          this.$http.post(`${this.base}/api/subject/updateState`,{
            id:this.queryInfo.classId,
            subjectState:true
          }).then(res=>{
            if(res.data=="Ok"){
              this.getappinfo()
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
            id:this.queryInfo.classId,
            subjectState:false
          }).then(res=>{
            if(res.data=="Ok"){
              this.getappinfo()
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
    width: 30%;
    padding:0px 10px;
    float: left;
    border-right: 1px solid rgb(#EAEDF1);
  }
  .card_right {
    /*border-left: 1px solid rgb(#C0C4CC);*/
    width: 65%;
    float: right;
    >.el-form{
      width: 70% !important;
    }
  }
  .el-card{
    overflow: hidden;
    /*height: 750px;*/
  padding-bottom: 30px;
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
    height: 400px;
  }
  .el-tree{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .addbtn{
    margin-top: 20px;
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
  .cell span{
    color: blue;
    cursor: pointer;
  }


</style>
