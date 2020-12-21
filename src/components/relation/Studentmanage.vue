<template>
  <div class="mingh1">
    <el-card>
      <el-row :gutter="21">
        <el-col :span="6">
          <!--  clearable可清空-->
          <span class="smallspan">姓名:</span>
          <el-input placeholder="请输入" v-model="queryInfo.value1"
                    class="singleel_input"
                    size="mini"
                    clearable></el-input>

        </el-col>
        <el-col :span="6">
          <span class="smallspan">班级:</span>
          <el-cascader
            placeholder="请选择"
            v-model="cascadervalue"
            :options="options"
            @change="handleChange"
            size="mini"
            :props="defaultProps"
            class="singleel_input"
          ></el-cascader>
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
        <el-button type="primary" @click="addialogvisible=true"
                   size="mini" style="margin-left: 10px">新增</el-button>

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
          prop="realName"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="studentCode"
          label="学号"
        >
        </el-table-column>


        <el-table-column
          prop="gradeTxt"
          label="班级">
        </el-table-column>

        <el-table-column
          prop="phone"
          label="联系电话"
          width="155px"
        >
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注"
          width="155px"
        >
        </el-table-column>
        <el-table-column
          prop="scoreTxt"
          label="学生评估"
          width="55px"
        >
          <!--          <template slot-scope="scope">-->
          <!--            <span v-if="scope.row.level==''">优</span>-->
          <!--            <span v-if="scope.row.level==''">良</span>-->
          <!--            <span v-if="scope.row.level==''">及格</span>-->
          <!--          </template>-->
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
            <span>|</span>
            <span @click="showpassworddialog(scope.row.userId)">修改密码</span>
            <span>|</span>
            <span @click="removeUserbyid(scope.row.id)">删除</span>

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

    </el-card>

    <!--新增学员-->
    <el-dialog
      title="新增学员"
      :visible.sync="addialogvisible"
      width="40%"
      @close="addialogclose"

    >
      <el-form :model="addform" :rules="addFormRules" ref="addFormRef"
               label-width="70px"
               class="addformclas">
        <el-form-item label="姓名:" prop="realName"  label-width="95px" >
          <el-input v-model="addform.realName" size="mini" placeholder="请输入" class="gh"></el-input>
        </el-form-item>
        <el-form-item label="学号:" prop="studentCode"  label-width="95px" >
          <el-input v-model="addform.studentCode" size="mini" placeholder="请输入" class="gh"></el-input>
        </el-form-item>
        <el-form-item label="班级:" prop="grade"  label-width="95px">
          <el-cascader
            placeholder="请选择"
            v-model="grademodel"
            :options="options"
            @change="handg3"
            size="mini"
            :props="defaultProps"
            class="xueyuan"
          ></el-cascader>

        </el-form-item>
        <el-form-item label="性别:"
                      label-width="95px"
                      prop="sex"
        >
          <select v-model="addform.sex">
            <option disabled value="">请选择</option>
            <option value="0">男</option>
            <option value="1">女</option>
          </select>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone" label-width="95px">
          <el-input v-model="addform.phone" size="mini" class="gh"></el-input>
        </el-form-item>
        <el-form-item label="籍贯:" prop="nativeArr" label-width="95px">
          <el-cascader
            :options="jiguanoption"
            :props="jiguanProps"
            @change="jiguanchange"
            v-model="jiguan"
            clearable
            size="mini">
          </el-cascader>

        </el-form-item>

        <el-form-item label="邮箱:" label-width="95px" prop="email">
          <el-input v-model="addform.email" size="mini" placeholder="请输入" class="gh"></el-input>
        </el-form-item>

        <el-form-item label="备注:" prop="remark" label-width="95px">
          <el-input v-model="addform.remark" placeholder="请输入" size="mini"></el-input>
        </el-form-item>


      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="addialogvisible = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="addUser" size="mini">确 定</el-button>
  </span>
    </el-dialog>



    <!--编辑学员-->
    <el-dialog
      title="编辑学员"
      :visible.sync="editalogvisible"
      width="60%"
      @close="editdialogclosed"
      class="addformclas"
    >
      <el-form  :model="editform1" label-width="70px" :rules="editformrules"
                ref="editformref"
      >
        <el-form-item label="姓名:" prop="realName"  label-width="95px" class="gh">
          <el-input v-model="editform1.realName" size="mini" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="学号:" prop="studentCode"  label-width="95px" class="gh">
          <el-input v-model="editform1.studentCode" size="mini" placeholder="请输入" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="班级:" prop="gradeId"  label-width="95px">
          <el-cascader
            placeholder="请选择"
            v-model="editform1.gradeId"
            :options="options"
            @change="handg4"
            size="mini"
            :props="defaultProps"
          ></el-cascader>

        </el-form-item>
        <el-form-item label="性别:"
                      label-width="95px"
                      prop="sex"
        >
          <select v-model="editform1.sex">
            <option disabled value="">请选择</option>
            <option value="false">男</option>
            <option value="true">女</option>
          </select>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone" label-width="95px">
          <el-input v-model="editform1.phone" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="籍贯:" prop="nativeArr" label-width="95px">
          <el-cascader
            :options="jiguanoption"
            :props="jiguanProps"
            @change="jiguanchange2"
            v-model="editform1.nativeArr"
            clearable
            size="mini">
          </el-cascader>

        </el-form-item>

        <el-form-item label="邮箱:" label-width="95px" prop="email">
          <el-input v-model="editform1.email" size="mini" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="备注:" prop="remark" label-width="95px">
          <el-input v-model="editform1.remark" placeholder="请输入" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editalogvisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>


    <!--修改密码-->
    <el-dialog
      title="修改密码"
      :visible.sync="passworddiavisible"
      width="30%"
      @close="passworddialogclosed"
    >
      <el-form :model="passwordform" label-width="70px" :rules="passwordformrules"
               ref="passwordformref">

        <el-form-item label="新密码" prop="password1" label-width="95px">
          <el-input type="password" v-model="passwordform.password1" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" label-width="95px">
          <el-input v-model="passwordform.password2" type="password" clearable></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="passworddialogclosed">取 消</el-button>
    <el-button type="primary" @click="passwordaction">确 定</el-button>
  </span>
    </el-dialog>








  </div>
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    data(){
      var checkSex=(rule,value,callback)=>{
        if(this.addform.sex==''){
          return callback(new Error('请选择性别'));
        }

        return callback()
      }

      var checkPassword=(rule,value,callback)=>{
        if(value==''){
          return callback(new Error('请再次输入密码'));
        }
        if(this.passwordform.password1!=value){
          return callback(new Error('两次输入密码不一致!'));
        }
        return callback()
      }
      //自定义验证邮箱
      var checkEmail=(rule,value,callback)=>{
        const regEmail=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(!value){
          //邮箱可以为空
          return callback()
        }
        if(regEmail.test(value)){
          return  callback()

        }
        return callback(new Error('请输入合法邮箱'))



      }

      //自定义校验手机号规则
      var checkMobile=(rule,value,callback)=>{
        const regMobile=/^[1][3,4,5,7,8,9][0-9]{9}$/
        // console.log(value)
        if(!value){
          //电话号可以为空
          return callback()
        }else{
          if(regMobile.test(value)){
            return  callback()
          }
          return callback(new Error('请输入正确手机号'))
        }

      }

      return{
        getRowKeys(row) {
          return row.id
        },
        ischange:false,
        subjectProps:{
          label:'lable',
          value:'id',
          //可以多选
          multiple: true
        },
        defaultProps:{
          label:'name',
          value:'id'
        },
        //transfer数据源
        transferData:[],
        checkList:[],
        editform1:{
          studentCode:'',
          realName:'',
          remark:'',
          nativeArr:[],
          phone:'',
          email:'',
          sex:''


        },

        datepicker:'',
        options2:[{
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
          },
          {
            value:'3',
            label: '导出表格'
          }

        ],
        options:[],
        cascadervalue2:[],
        cascadervalue:[],
        passworddiavisible:false,

        sels: [],//选中的值显示
        //  获取用户列表的参数
        queryInfo:{
          //查询参数  可为空
          value1:'',
          value2:'',
          //当前页码值
          pagenum:1,
          //每页显示条数
          pagesize:10
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
        leveloption:[
          {
            value: '0',
            label: '初级'
          },
          {
            value: '1',
            label: '中级'
          },
          {
            value: '2',
            label: '高级'
          }

        ],
        //用户对话狂
        addialogvisible:false,
        editalogvisible:false,

        jobselect2:'',
        sexselect2:'',
        subectteacher2:'',
        datepicker2:'',
        addform:{
          //   //文件的数组
          //   pics:[],
          realName:'',
          // teacherCode:'',
          phone:'',
          // idCode:'',
          sex:"",
          studentCode:'',
          nativeArr:[],
          remark:'',
          email:'',
          gradeId:0




        },
        levelmodel:[],
        editform:{
          id:''
        },
        headerobj:{
          // Authorization:window.sessionStorage.getItem('token')
        },
        passwordform:{
          password1:'',
          password2:''
        },
        userinfo:{

        },
        subectteacher:'',
        passwordformrules:{
          password1:[
            {required:true,message:'请输入修改密码',trigger:'blur'},
            {min:6,max:15,message:'长度在6到15之间',trigger:'blur'},
            // {validator:oncePassword,trigger:'blur'}
          ],
          password2:[
            {required:true,message:'请输入修改密码',trigger:'blur'},
            {validator:checkPassword,trigger: 'blur'}
          ]
        },
        checkList1:[],
        jiguan:'',
        upload:"",
        //添加表单的验证规则
        addFormRules:{
          studentCode:[
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          realName:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 4, message: '长度在 2到 4 个字符', trigger: 'blur' }
          ],
          phone:[
            {validator:checkMobile,trigger:'blur'}
          ],
          sex:[
            //性别选择
            {required:true,validator:checkSex,trigger:'blur'}
          ],
          grade:[
            //  班级选择
          ],
          email:[
            {validator:checkEmail,trigger:'blur'}
          ]

        },
        jiguanoption: [
          {
            areaId: "110000",
            areaName: "北京市",
            disabled: false,
            child: [{ areaId: "110000", areaName: "北京市" }]
          },
          {
            areaId: "120000",
            areaName: "天津市",
            disabled: false,
            child: [{ areaId: "120000", areaName: "天津市" }]
          },
          {
            areaId: "130000",
            areaName: "河北省",
            disabled: false,
            child: [
              { areaId: "130100", areaName: "石家庄市" },
              { areaId: "130200", areaName: "唐山市" },
              { areaId: "130300", areaName: "秦皇岛市" },
              { areaId: "130400", areaName: "邯郸市" },
              { areaId: "130500", areaName: "邢台市" },
              { areaId: "130600", areaName: "保定市" },
              { areaId: "130700", areaName: "张家口市" },
              { areaId: "130800", areaName: "承德市" },
              { areaId: "130900", areaName: "沧州市" },
              { areaId: "131000", areaName: "廊坊市" },
              { areaId: "131100", areaName: "衡水市" }
            ]
          },
          {
            areaId: "140000",
            areaName: "山西省",
            disabled: false,
            child: [
              { areaId: "140100", areaName: "太原市" },
              { areaId: "140200", areaName: "大同市" },
              { areaId: "140300", areaName: "阳泉市" },
              { areaId: "140400", areaName: "长治市" },
              { areaId: "140500", areaName: "晋城市" },
              { areaId: "140600", areaName: "朔州市" },
              { areaId: "140700", areaName: "晋中市" },
              { areaId: "140800", areaName: "运城市" },
              { areaId: "140900", areaName: "忻州市" },
              { areaId: "141000", areaName: "临汾市" },
              { areaId: "141100", areaName: "吕梁市" }
            ]
          },
          {
            areaId: "150000",
            areaName: "内蒙古自治区",
            disabled: false,
            child: [
              { areaId: "150100", areaName: "呼和浩特市" },
              { areaId: "150200", areaName: "包头市" },
              { areaId: "150300", areaName: "乌海市" },
              { areaId: "150400", areaName: "赤峰市" },
              { areaId: "150500", areaName: "通辽市" },
              { areaId: "150600", areaName: "鄂尔多斯市" },
              { areaId: "150700", areaName: "呼伦贝尔市" },
              { areaId: "150800", areaName: "巴彦淖尔市" },
              { areaId: "150900", areaName: "乌兰察布市" },
              { areaId: "152200", areaName: "兴安盟" },
              { areaId: "152500", areaName: "锡林郭勒盟" },
              { areaId: "152900", areaName: "阿拉善盟" }
            ]
          },
          {
            areaId: "210000",
            areaName: "辽宁省",
            disabled: false,
            child: [
              { areaId: "210100", areaName: "沈阳市" },
              { areaId: "210200", areaName: "大连市" },
              { areaId: "210300", areaName: "鞍山市" },
              { areaId: "210400", areaName: "抚顺市" },
              { areaId: "210500", areaName: "本溪市" },
              { areaId: "210600", areaName: "丹东市" },
              { areaId: "210700", areaName: "锦州市" },
              { areaId: "210800", areaName: "营口市" },
              { areaId: "210900", areaName: "阜新市" },
              { areaId: "211000", areaName: "辽阳市" },
              { areaId: "211100", areaName: "盘锦市" },
              { areaId: "211200", areaName: "铁岭市" },
              { areaId: "211300", areaName: "朝阳市" },
              { areaId: "211400", areaName: "葫芦岛市" }
            ]
          },
          {
            areaId: "220000",
            areaName: "吉林省",
            disabled: false,
            child: [
              { areaId: "220100", areaName: "长春市" },
              { areaId: "220200", areaName: "吉林市" },
              { areaId: "220300", areaName: "四平市" },
              { areaId: "220400", areaName: "辽源市" },
              { areaId: "220500", areaName: "通化市" },
              { areaId: "220600", areaName: "白山市" },
              { areaId: "220700", areaName: "松原市" },
              { areaId: "220800", areaName: "白城市" },
              { areaId: "222400", areaName: "延边朝鲜族自治州" }
            ]
          },
          {
            areaId: "230000",
            areaName: "黑龙江省",
            disabled: false,
            child: [
              { areaId: "230100", areaName: "哈尔滨市" },
              { areaId: "230200", areaName: "齐齐哈尔市" },
              { areaId: "230300", areaName: "鸡西市" },
              { areaId: "230400", areaName: "鹤岗市" },
              { areaId: "230500", areaName: "双鸭山市" },
              { areaId: "230600", areaName: "大庆市" },
              { areaId: "230700", areaName: "伊春市" },
              { areaId: "230800", areaName: "佳木斯市" },
              { areaId: "230900", areaName: "七台河市" },
              { areaId: "231000", areaName: "牡丹江市" },
              { areaId: "231100", areaName: "黑河市" },
              { areaId: "231200", areaName: "绥化市" },
              { areaId: "232700", areaName: "大兴安岭地区" }
            ]
          },
          {
            areaId: "310000",
            areaName: "上海市",
            disabled: false,
            child: [{ areaId: "310000", areaName: "上海市" }]
          },
          {
            areaId: "320000",
            areaName: "江苏省",
            disabled: false,
            child: [
              { areaId: "320100", areaName: "南京市" },
              { areaId: "320200", areaName: "无锡市" },
              { areaId: "320300", areaName: "徐州市" },
              { areaId: "320400", areaName: "常州市" },
              { areaId: "320500", areaName: "苏州市" },
              { areaId: "320600", areaName: "南通市" },
              { areaId: "320700", areaName: "连云港市" },
              { areaId: "320800", areaName: "淮安市" },
              { areaId: "320900", areaName: "盐城市" },
              { areaId: "321000", areaName: "扬州市" },
              { areaId: "321100", areaName: "镇江市" },
              { areaId: "321200", areaName: "泰州市" },
              { areaId: "321300", areaName: "宿迁市" }
            ]
          },
          {
            areaId: "330000",
            areaName: "浙江省",
            disabled: false,
            child: [
              { areaId: "330100", areaName: "杭州市" },
              { areaId: "330200", areaName: "宁波市" },
              { areaId: "330300", areaName: "温州市" },
              { areaId: "330400", areaName: "嘉兴市" },
              { areaId: "330500", areaName: "湖州市" },
              { areaId: "330600", areaName: "绍兴市" },
              { areaId: "330700", areaName: "金华市" },
              { areaId: "330800", areaName: "衢州市" },
              { areaId: "330900", areaName: "舟山市" },
              { areaId: "331000", areaName: "台州市" },
              { areaId: "331100", areaName: "丽水市" }
            ]
          },
          {
            areaId: "340000",
            areaName: "安徽省",
            disabled: false,
            child: [
              { areaId: "340100", areaName: "合肥市" },
              { areaId: "340200", areaName: "芜湖市" },
              { areaId: "340300", areaName: "蚌埠市" },
              { areaId: "340400", areaName: "淮南市" },
              { areaId: "340500", areaName: "马鞍山市" },
              { areaId: "340600", areaName: "淮北市" },
              { areaId: "340700", areaName: "铜陵市" },
              { areaId: "340800", areaName: "安庆市" },
              { areaId: "341000", areaName: "黄山市" },
              { areaId: "341100", areaName: "滁州市" },
              { areaId: "341200", areaName: "阜阳市" },
              { areaId: "341300", areaName: "宿州市" },
              { areaId: "341400", areaName: "巢湖市" },
              { areaId: "341500", areaName: "六安市" },
              { areaId: "341600", areaName: "亳州市" },
              { areaId: "341700", areaName: "池州市" },
              { areaId: "341800", areaName: "宣城市" }
            ]
          },
          {
            areaId: "350000",
            areaName: "福建省",
            disabled: false,
            child: [
              { areaId: "350100", areaName: "福州市" },
              { areaId: "350200", areaName: "厦门市" },
              { areaId: "350300", areaName: "莆田市" },
              { areaId: "350400", areaName: "三明市" },
              { areaId: "350500", areaName: "泉州市" },
              { areaId: "350600", areaName: "漳州市" },
              { areaId: "350700", areaName: "南平市" },
              { areaId: "350800", areaName: "龙岩市" },
              { areaId: "350900", areaName: "宁德市" }
            ]
          },
          {
            areaId: "360000",
            areaName: "江西省",
            disabled: false,
            child: [
              { areaId: "360100", areaName: "南昌市" },
              { areaId: "360200", areaName: "景德镇市" },
              { areaId: "360300", areaName: "萍乡市" },
              { areaId: "360400", areaName: "九江市" },
              { areaId: "360500", areaName: "新余市" },
              { areaId: "360600", areaName: "鹰潭市" },
              { areaId: "360700", areaName: "赣州市" },
              { areaId: "360800", areaName: "吉安市" },
              { areaId: "360900", areaName: "宜春市" },
              { areaId: "361000", areaName: "抚州市" },
              { areaId: "361100", areaName: "上饶市" }
            ]
          },
          {
            areaId: "370000",
            areaName: "山东省",
            disabled: false,
            child: [
              { areaId: "370100", areaName: "济南市" },
              { areaId: "370200", areaName: "青岛市" },
              { areaId: "370300", areaName: "淄博市" },
              { areaId: "370400", areaName: "枣庄市" },
              { areaId: "370500", areaName: "东营市" },
              { areaId: "370600", areaName: "烟台市" },
              { areaId: "370700", areaName: "潍坊市" },
              { areaId: "370800", areaName: "济宁市" },
              { areaId: "370900", areaName: "泰安市" },
              { areaId: "371000", areaName: "威海市" },
              { areaId: "371100", areaName: "日照市" },
              { areaId: "371200", areaName: "莱芜市" },
              { areaId: "371300", areaName: "临沂市" },
              { areaId: "371400", areaName: "德州市" },
              { areaId: "371500", areaName: "聊城市" },
              { areaId: "371600", areaName: "滨州市" },
              { areaId: "371700", areaName: "菏泽市" }
            ]
          },
          {
            areaId: "410000",
            areaName: "河南省",
            disabled: false,
            child: [
              { areaId: "410100", areaName: "郑州市" },
              { areaId: "410200", areaName: "开封市" },
              { areaId: "410300", areaName: "洛阳市" },
              { areaId: "410400", areaName: "平顶山市" },
              { areaId: "410500", areaName: "安阳市" },
              { areaId: "410600", areaName: "鹤壁市" },
              { areaId: "410700", areaName: "新乡市" },
              { areaId: "410800", areaName: "焦作市" },
              { areaId: "410900", areaName: "濮阳市" },
              { areaId: "411000", areaName: "许昌市" },
              { areaId: "411100", areaName: "漯河市" },
              { areaId: "411200", areaName: "三门峡市" },
              { areaId: "411300", areaName: "南阳市" },
              { areaId: "411400", areaName: "商丘市" },
              { areaId: "411500", areaName: "信阳市" },
              { areaId: "411600", areaName: "周口市" },
              { areaId: "411700", areaName: "驻马店市" }
            ]
          },
          {
            areaId: "420000",
            areaName: "湖北省",
            disabled: false,
            child: [
              { areaId: "420100", areaName: "武汉市" },
              { areaId: "420200", areaName: "黄石市" },
              { areaId: "420300", areaName: "十堰市" },
              { areaId: "420500", areaName: "宜昌市" },
              { areaId: "420600", areaName: "襄樊市" },
              { areaId: "420700", areaName: "鄂州市" },
              { areaId: "420800", areaName: "荆门市" },
              { areaId: "420900", areaName: "孝感市" },
              { areaId: "421000", areaName: "荆州市" },
              { areaId: "421100", areaName: "黄冈市" },
              { areaId: "421200", areaName: "咸宁市" },
              { areaId: "421300", areaName: "随州市" },
              { areaId: "422800", areaName: "恩施土家族苗族自治州" },
              { areaId: "429000", areaName: "省直辖县级行政单位" }
            ]
          },
          {
            areaId: "430000",
            areaName: "湖南省",
            disabled: false,
            child: [
              { areaId: "430100", areaName: "长沙市" },
              { areaId: "430200", areaName: "株洲市" },
              { areaId: "430300", areaName: "湘潭市" },
              { areaId: "430400", areaName: "衡阳市" },
              { areaId: "430500", areaName: "邵阳市" },
              { areaId: "430600", areaName: "岳阳市" },
              { areaId: "430700", areaName: "常德市" },
              { areaId: "430800", areaName: "张家界市" },
              { areaId: "430900", areaName: "益阳市" },
              { areaId: "431000", areaName: "郴州市" },
              { areaId: "431100", areaName: "永州市" },
              { areaId: "431200", areaName: "怀化市" },
              { areaId: "431300", areaName: "娄底市" },
              { areaId: "433100", areaName: "湘西土家族苗族自治州" }
            ]
          },
          {
            areaId: "440000",
            areaName: "广东省",
            disabled: false,
            child: [
              { areaId: "440100", areaName: "广州市" },
              { areaId: "440200", areaName: "韶关市" },
              { areaId: "440300", areaName: "深圳市" },
              { areaId: "440400", areaName: "珠海市" },
              { areaId: "440500", areaName: "汕头市" },
              { areaId: "440600", areaName: "佛山市" },
              { areaId: "440700", areaName: "江门市" },
              { areaId: "440800", areaName: "湛江市" },
              { areaId: "440900", areaName: "茂名市" },
              { areaId: "441200", areaName: "肇庆市" },
              { areaId: "441300", areaName: "惠州市" },
              { areaId: "441400", areaName: "梅州市" },
              { areaId: "441500", areaName: "汕尾市" },
              { areaId: "441600", areaName: "河源市" },
              { areaId: "441700", areaName: "阳江市" },
              { areaId: "441800", areaName: "清远市" },
              { areaId: "441900", areaName: "东莞市" },
              { areaId: "442000", areaName: "中山市" },
              { areaId: "445100", areaName: "潮州市" },
              { areaId: "445200", areaName: "揭阳市" },
              { areaId: "445300", areaName: "云浮市" }
            ]
          },
          {
            areaId: "450000",
            areaName: "广西壮族自治区",
            disabled: false,
            child: [
              { areaId: "450100", areaName: "南宁市" },
              { areaId: "450200", areaName: "柳州市" },
              { areaId: "450300", areaName: "桂林市" },
              { areaId: "450400", areaName: "梧州市" },
              { areaId: "450500", areaName: "北海市" },
              { areaId: "450600", areaName: "防城港市" },
              { areaId: "450700", areaName: "钦州市" },
              { areaId: "450800", areaName: "贵港市" },
              { areaId: "450900", areaName: "玉林市" },
              { areaId: "451000", areaName: "百色市" },
              { areaId: "451100", areaName: "贺州市" },
              { areaId: "451200", areaName: "河池市" },
              { areaId: "451300", areaName: "来宾市" },
              { areaId: "451400", areaName: "崇左市" }
            ]
          },
          {
            areaId: "460000",
            areaName: "海南省",
            disabled: false,
            child: [
              { areaId: "460100", areaName: "海口市" },
              { areaId: "460200", areaName: "三亚市" },
              { areaId: "469000", areaName: "省直辖县级行政单位" }
            ]
          },
          {
            areaId: "500000",
            areaName: "重庆市",
            disabled: false,
            child: [{ areaId: "500000", areaName: "重庆市" }]
          },
          {
            areaId: "510000",
            areaName: "四川省",
            disabled: false,
            child: [
              { areaId: "510100", areaName: "成都市" },
              { areaId: "510300", areaName: "自贡市" },
              { areaId: "510400", areaName: "攀枝花市" },
              { areaId: "510500", areaName: "泸州市" },
              { areaId: "510600", areaName: "德阳市" },
              { areaId: "510700", areaName: "绵阳市" },
              { areaId: "510800", areaName: "广元市" },
              { areaId: "510900", areaName: "遂宁市" },
              { areaId: "511000", areaName: "内江市" },
              { areaId: "511100", areaName: "乐山市" },
              { areaId: "511300", areaName: "南充市" },
              { areaId: "511400", areaName: "眉山市" },
              { areaId: "511500", areaName: "宜宾市" },
              { areaId: "511600", areaName: "广安市" },
              { areaId: "511700", areaName: "达州市" },
              { areaId: "511800", areaName: "雅安市" },
              { areaId: "511900", areaName: "巴中市" },
              { areaId: "512000", areaName: "资阳市" },
              { areaId: "513200", areaName: "阿坝藏族羌族自治州" },
              { areaId: "513300", areaName: "甘孜藏族自治州" },
              { areaId: "513400", areaName: "凉山彝族自治州" }
            ]
          },
          {
            areaId: "520000",
            areaName: "贵州省",
            disabled: false,
            child: [
              { areaId: "520100", areaName: "贵阳市" },
              { areaId: "520200", areaName: "六盘水市" },
              { areaId: "520300", areaName: "遵义市" },
              { areaId: "520400", areaName: "安顺市" },
              { areaId: "522200", areaName: "铜仁地区" },
              { areaId: "522300", areaName: "黔西南布依族苗族自治州" },
              { areaId: "522400", areaName: "毕节地区" },
              { areaId: "522600", areaName: "黔东南苗族侗族自治州" },
              { areaId: "522700", areaName: "黔南布依族苗族自治州" }
            ]
          },
          {
            areaId: "530000",
            areaName: "云南省",
            disabled: false,
            child: [
              { areaId: "530100", areaName: "昆明市" },
              { areaId: "530300", areaName: "曲靖市" },
              { areaId: "530400", areaName: "玉溪市" },
              { areaId: "530500", areaName: "保山市" },
              { areaId: "530600", areaName: "昭通市" },
              { areaId: "530700", areaName: "丽江市" },
              { areaId: "530800", areaName: "普洱市" },
              { areaId: "530900", areaName: "临沧市" },
              { areaId: "532300", areaName: "楚雄彝族自治州" },
              { areaId: "532500", areaName: "红河哈尼族彝族自治州" },
              { areaId: "532600", areaName: "文山壮族苗族自治州" },
              { areaId: "532800", areaName: "西双版纳傣族自治州" },
              { areaId: "532900", areaName: "大理白族自治州" },
              { areaId: "533100", areaName: "德宏傣族景颇族自治州" },
              { areaId: "533300", areaName: "怒江傈僳族自治州" },
              { areaId: "533400", areaName: "迪庆藏族自治州" }
            ]
          },
          {
            areaId: "540000",
            areaName: "西藏自治区",
            disabled: false,
            child: [
              { areaId: "540100", areaName: "拉萨市" },
              { areaId: "542100", areaName: "昌都地区" },
              { areaId: "542200", areaName: "山南地区" },
              { areaId: "542300", areaName: "日喀则地区" },
              { areaId: "542400", areaName: "那曲地区" },
              { areaId: "542500", areaName: "阿里地区" },
              { areaId: "542600", areaName: "林芝地区" }
            ]
          },
          {
            areaId: "610000",
            areaName: "陕西省",
            disabled: false,
            child: [
              { areaId: "610100", areaName: "西安市" },
              { areaId: "610200", areaName: "铜川市" },
              { areaId: "610300", areaName: "宝鸡市" },
              { areaId: "610400", areaName: "咸阳市" },
              { areaId: "610500", areaName: "渭南市" },
              { areaId: "610600", areaName: "延安市" },
              { areaId: "610700", areaName: "汉中市" },
              { areaId: "610800", areaName: "榆林市" },
              { areaId: "610900", areaName: "安康市" },
              { areaId: "611000", areaName: "商洛市" }
            ]
          },
          {
            areaId: "620000",
            areaName: "甘肃省",
            disabled: false,
            child: [
              { areaId: "620100", areaName: "兰州市" },
              { areaId: "620200", areaName: "嘉峪关市" },
              { areaId: "620300", areaName: "金昌市" },
              { areaId: "620400", areaName: "白银市" },
              { areaId: "620500", areaName: "天水市" },
              { areaId: "620600", areaName: "武威市" },
              { areaId: "620700", areaName: "张掖市" },
              { areaId: "620800", areaName: "平凉市" },
              { areaId: "620900", areaName: "酒泉市" },
              { areaId: "621000", areaName: "庆阳市" },
              { areaId: "621100", areaName: "定西市" },
              { areaId: "621200", areaName: "陇南市" },
              { areaId: "622900", areaName: "临夏回族自治州" },
              { areaId: "623000", areaName: "甘南藏族自治州" }
            ]
          },
          {
            areaId: "630000",
            areaName: "青海省",
            disabled: false,
            child: [
              { areaId: "630100", areaName: "西宁市" },
              { areaId: "632100", areaName: "海东地区" },
              { areaId: "632200", areaName: "海北藏族自治州" },
              { areaId: "632300", areaName: "黄南藏族自治州" },
              { areaId: "632500", areaName: "海南藏族自治州" },
              { areaId: "632600", areaName: "果洛藏族自治州" },
              { areaId: "632700", areaName: "玉树藏族自治州" },
              { areaId: "632800", areaName: "海西蒙古族藏族自治州" }
            ]
          },
          {
            areaId: "640000",
            areaName: "宁夏回族自治区",
            disabled: false,
            child: [
              { areaId: "640100", areaName: "银川市" },
              { areaId: "640200", areaName: "石嘴山市" },
              { areaId: "640300", areaName: "吴忠市" },
              { areaId: "640400", areaName: "固原市" },
              { areaId: "640500", areaName: "中卫市" }
            ]
          },
          {
            areaId: "650000",
            areaName: "新疆维吾尔自治区",
            disabled: false,
            child: [
              { areaId: "650100", areaName: "乌鲁木齐市" },
              { areaId: "650200", areaName: "克拉玛依市" },
              { areaId: "652100", areaName: "吐鲁番地区" },
              { areaId: "652200", areaName: "哈密地区" },
              { areaId: "652300", areaName: "昌吉回族自治州" },
              { areaId: "652700", areaName: "博尔塔拉蒙古自治州" },
              { areaId: "652800", areaName: "巴音郭楞蒙古自治州" },
              { areaId: "652900", areaName: "阿克苏地区" },
              { areaId: "653000", areaName: "克孜勒苏柯尔克孜自治州" },
              { areaId: "653100", areaName: "喀什地区" },
              { areaId: "653200", areaName: "和田地区" },
              { areaId: "654000", areaName: "伊犁哈萨克自治州" },
              { areaId: "654200", areaName: "塔城地区" },
              { areaId: "654300", areaName: "阿勒泰地区" },
              { areaId: "659000", areaName: "自治区直辖县级行政单位" }
            ]
          },
          {
            areaId: "810000",
            areaName: "中国香港",
            disabled: false,
            child: [{ areaId: "810000", areaName: "中国香港" }]
          },
          {
            areaId: "820000",
            areaName: "中国澳门",
            disabled: false,
            child: [{ areaId: "820000", areaName: "中国澳门" }]
          }
        ] ,
        editformrules:{
          realName:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
            //自定义校验规则
            // { validator: checkEmail, trigger: 'blur' }
          ],
          phone:[
            {validator:checkMobile,trigger:'blur'}
          ],
          email:[
            {validator:checkEmail,trigger:'blur'}
          ],
          studentCode:[

          ],
          gradeId:[

          ],
          sex:[

          ],
          remark:[

          ]

        },
        setrolelogvisible:false,
        roleslist:{

        },
        grademodel2:'',
        selectedroleid:'',
        grademodel:'',
        jiguanProps:{
          value:'areaId',
          label:'areaName',
          children:'child'
        },
        jiguan2:'',
        base:''
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
            this.getUserlist()
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

      },
      datepicker:function(val) {
        // console.log(val)
      }

    },
    created() {
      this.base=this.BASE_URL
      //分页查询
      this.getUserlist()
      //  获取所有班级
      this.getClassList()

    },
    methods:{

      handg4(val){
        this.editform1.gradeId=val[0]
      },
      jiguanchange(val){
        //新增的籍贯
        this.addform.nativeArr=val
      },
      jiguanchange2(val){
        //籍贯选择
      },
      handg3(val){
        this.addform.gradeId=val[0]
      },

      handleChange(val){
        console.log('选择变化')
        console.log(val)
        this.queryInfo.value2=val[0]
      },
      handleChange2(val){
        const  choiceval=val[0]
        const warningarr=["删除","启用","停用"]
        //下拉框
        const warningtext=warningarr[val]
        if(choiceval=='0'||choiceval=='1'||choiceval=='2'){
          if(this.sels.length==0){
            this.cascadervalue2=[]
            this.$message.warning(`请选择要${warningtext}的对象`)
            return
          }
          this.$confirm(`将要批量${warningtext}学员,是否继续？`,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(
            res=>{
              if(choiceval=='0'){
                //点击了批量删除
                this.piliangdelete()
                this.cascadervalue2=''
              }else if(choiceval=='1'){
                //点击了批量启动
                this.openstates()
                this.cascadervalue2=''
              }else if(choiceval=='2'){
                //点击了批量停用
                this.closestates()
                this.cascadervalue2=''
              }
              // this.cascadervalue2=''
            }
          ).catch(
            res=>{
              this.sels=[]
              this.clearSelection()
              this.cascadervalue2=''
              // this.$message.warning(`已取消批量${warningtext}`)
            }
          )
        }

        if(choiceval=='3'){
          this.queryInfo.pagenum=1
          this.queryInfo.pagesize=this.total
          this.getUserlist()
          //批量导出
          const that=this
          setTimeout(function() {
            that.daochu()
          },1000)
          this.cascadervalue2=''
        }


      },
      daochu(){
        // 批量导出
        /* generate workbook object from table */
        // let wb = XLSX.utils.table_to_book(document.querySelector(
        //   '.studenttable'));
        // let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        // try {
        //   FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '学员信息表.xlsx');
        // } catch (e)
        // {
        //   if (typeof console !== 'undefined')
        //     console.log(e, wbout)
        // }
        // return wbout
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../vendor/Export2Excel');
          const tHeader = ['姓名','学号','班级','联系电话','学生评估'];            // 对应表格输出的title
          const filterVal = ['realName','studentCode','gradeTxt','phone','remark'];                             // 对应表格输出的数据
          const list = this.userlist;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '学员信息表');                   //对应下载文件的名字
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      subtechge(val){
        this.checkList1=[]
        val.forEach((item)=>{
          this.checkList1.push(item[0])
        })
        console.log('check后')
        console.log(this.checkList1)

      },
      openstates(){
        //批量启用
        this.$http.post(`${this.base}/api/Student/updateStates/true`,this.sels).then(res=>{

          if(res.data=='Ok'){
            this.$message.success('批量启动成功')
            this.getUserlist()
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
        this.$http.post(`${this.base}/api/Student/delStudents/`,this.sels).then(res=>{
          console.log('批量删除返回')
          console.log(res.data)
          if(res.data=='OK'){
            this.$message.success('批量删除成功')
            this.getUserlist()
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
        //批量停用
        this.$http.post(`${this.base}/api/Student/updateStates/false`,this.sels).then(res=>{

          if(res.data=='Ok'){
            this.$message.success('批量停用成功')
            this.getUserlist()
          }else{
            this.$message.error('批量停用失败')
          }
        }).catch(res=>{
          console.log('批量停用失败')
        })
        this.sels=[]
        this.clearSelection()
      },
      getClassList(){
        this.$http.get(`${this.base}/api/Grade/getAllGrade`).then(res=>{
          console.log('获取所有班级')
          console.log(res.data)
          this.options=res.data
        }).catch(res=>{
          console.log("获取所有班级失败")
        })
      },
      chaxun(){
        this.queryInfo.pagenum=1
        this.getUserlist()
      },
      getUserlist(){
        // console.log('我给的')
        // console.log(this.queryInfo)
        this.$http.post(`${this.base}/api/Student/getStudentByPage`,this.queryInfo).then(res=>{
          console.log('获取table信息')
          console.log(res.data)
          this.userlist=res.data.data
          this.total=res.data.total
        }).catch(res=>{
          console.log("获取学生列表失败")
        })

      },
      sexhandlechange(val){
        this.addform.sex=val
      },
      //监听每页？条数据  的事件
      handleSizeChange(val){
        // console.log(val)
        this.queryInfo.pagesize=val
        this.getUserlist()
      },
      //监听页码值改变的事件
      handleCurrentChange(val){
        // console.log(val)
        this.queryInfo.pagenum=val
        this.getUserlist()
      },

      //添加对话框关闭事件
      addialogclose(){
        this.$refs.addFormRef.resetFields()
        this.subectteacher=''
        this.grademodel=''
        this.jiguan=''

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
        //点击确定按钮预校验
        this.$refs.addFormRef.validate(async valid=>{
          console.log(valid)
          if(!valid){
            return
          }
          //添加性别 1/0
          this.addform.sex=Number(this.addform.sex)
          this.$http.post(`${this.base}/api/Student/addStudent`,this.addform).then(res=>{
            //新增返回
            console.log('新增学员返回')
            console.log(res.data)
            if(res.data=="OK"){
              this.$message.success('添加成功')
              this.addialogvisible=false
              this.getUserlist()

            }
          }).catch(res=>{
          })


        })
      },
      showeditdialog(id){
        //编辑信息页面展示
        this.editform1.id=id
        this.$http.get(`${this.base}/api/Student/getStudent/${id}`).then(res=>{
          console.log('获取单个信息')
          console.log(res.data)
          //2020/3/15 0:00:00
          this.editform1=res.data

          this.editalogvisible=true

        }).catch(res=>{

          console.log('获取单个学员信息失败')
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
      },
      editUserInfo(){
        this.$refs.editformref.validate(async valid=>{
          if(!valid){
            return
          }
          this.$http.post(`${this.base}/api/Student/updateInfo`,this.editform1).then(res=>{
            if(res.data=="Ok"){
              this.$message.success('修改成功')
              this.editalogvisible=false
              this.getUserlist()
            }


          }).catch(res=>{
            console.log('修改用户数据失败')
          })




        })

      },
      removeUserbyid(id){
        this.editform.id=id
        //返回值是一个promise
        this.$confirm('此操作将永久删除学员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          //  如果用户确认了删除  返回的是confirm字符串
          //如果用户取消了删除  返回的是cancel字符串
        }).then(() => {
          this.$http.get(`${this.base}/api/Student/delStudent/${id}`).then(
            res=>{
              if(res.data=="OK"){
                this.$message.success('删除成功')
                this.getUserlist()
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
              //重新获取页面
              this.getUserlist()
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
        this.getUserlist()
        this.sels=[]
        this.clearSelection()
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
      handlesuccess(res){

        //  上传成功
        console.log('上传成功')

        console.log(res)
        // const picInfo={pic:res.data.tmp_path}
        // this.addform.pics.push(picInfo)

      },
      handleRemove(file){
        //从数组中移除
        const index=this.addform.pics.findIndex(item=>{
          item.pic== file.response.data.tmp_path
        })
        this.addform.pics.splice(index,1)

      },
      beforeUpload(file){
        const isLt100M = file.size / 1024 / 1024 <100;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过100M!');
        }
        return isLt100M
      },
      handlePreview(){

      },
      handleRe1(file,fileList){
        this.fileTemp = null
      },
    }

  }
</script>
<style lang="less" scoped>
  .ghg{

    float: left !important;
  }
  .actionel{
    margin-top: 20px;

  }
  .cell span{
    color: blue;
    cursor: pointer;
  }
  .singleel_input{
    width:165px !important;
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
    .el-form-item{
      margin-bottom: 12px;
    }

  }
  .mingh1{
    min-width: 800px;
  }
  .gh{
    width: 195px !important;
  }

</style>
