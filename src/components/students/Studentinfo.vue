<template>
  <div class="mingh1">
   <el-card>

     <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
       <el-tab-pane label="用户信息" name="first">
         <el-form  :model="editform1" label-width="70px" :rules="editformrules"
                   ref="editformref"
         >
           <el-form-item label="学号:" prop="studentCode"  label-width="95px">
             <el-input v-model="editform1.studentCode" size="mini"
                       class="formhj" disabled></el-input>
           </el-form-item>
           <el-form-item label="姓名:" prop="realName"  label-width="95px">
             <el-input v-model="editform1.realName" size="mini" disabled
             class="formhj"></el-input>
           </el-form-item>
           <el-form-item label="班级:" prop="gradeTxt"  label-width="95px" disabled>
             <el-input v-model="editform1.gradeTxt" size="mini"
                       class="formhj" disabled></el-input>
           </el-form-item>
           <el-form-item label="性别:"
                         label-width="95px"
                         prop="sex"
           >
             <select v-model="editform1.sex"
             @click="dbfunc()">
               <option disabled value="">请选择</option>
               <option value="false">男</option>
               <option value="true">女</option>
             </select>
           </el-form-item>
           <el-form-item label="联系电话:" prop="phone" label-width="95px">
             <el-input v-model="editform1.phone" size="mini"
                       class="formhj"
                       @focus="dbfunc()"
             value="请输入联系电话"></el-input>
           </el-form-item>
           <el-form-item label="籍贯:" prop="nativeArr" label-width="95px">
             <el-cascader
               :options="jiguanoption"
               :props="jiguanProps"
               @change="jiguanchange2"
               v-model="editform1.nativeArr"
               clearable
               class="formhj"
               size="mini"
               @focus="dbfunc()">
             </el-cascader>

           </el-form-item>

           <el-form-item label="邮箱:" label-width="95px" prop="email">
             <el-input v-model="editform1.email" size="mini" placeholder="请输入"
                       class="formhj"
                       @focus="dbfunc()"></el-input>
           </el-form-item>

           <el-row type="flex" justify="end">
             <el-button @click="getStudentInfo(loginid)" size="mini" :disabled="isjinyong">
             取消
             </el-button>
           <el-button @click="savestudentinfo()" type="primary" size="mini" :disabled="isjinyong">
             确定
           </el-button>
           </el-row>
         </el-form>
       </el-tab-pane>
       <el-tab-pane label="修改密码" name="second">
        <el-form :model="editform2" :rules="editformrules2" ref="editformref2">
          <el-form-item label="原密码:" prop="beforepass"  label-width="105px">
            <el-input v-model="editform2.beforepass" size="mini"
                      value="请输入原密码"
                      class="formhj"

           ></el-input>
          </el-form-item>
          <el-form-item label="新密码:" prop="password1"  label-width="105px">
            <el-input v-model="editform2.password1" size="mini"
                      value="请输入新密码"
                      class="formhj"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新密码:" prop="password2"  label-width="105px">
            <el-input v-model="editform2.password2" size="mini"
                      value="请确认新密码"
                      class="formhj"></el-input>
          </el-form-item>
          <el-form-item label="验证码:" prop="yzm"  label-width="105px">
            <el-input v-model="editform2.yzm" size="mini"
                      value="请输入验证码"
                      class="formhj"
                      id="code_input"
            ></el-input>
            <el-row type="flex">
              <div id="v_container" style="width: 100px;height: 30px;"></div>
              <el-button id="my_button" size="mini">点击验证</el-button>
            </el-row>

          </el-form-item>
          <el-row type="flex" justify="end">
            <el-button @click="qingkong()" size="mini">
              取消
            </el-button>

            <el-button @click="xiugaipassword()" type="primary" size="mini">
              确定
            </el-button>
          </el-row>
        </el-form>
       </el-tab-pane>
     </el-tabs>
   </el-card>
  </div>
</template>

<script>
  export default{
    data(){
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
      var checkbfPassword=async (rule,value,callback)=>{
       const truepass= await this.$http.get('')
        if(truepass==this.editform2.beforepass){
          return callback()
        }else{
          return callback(new Error('原密码错误!'))
        }
      }

      var checkPassword=(rule,value,callback)=>{
        if(value==''){
          return callback(new Error('请再次输入密码'));
        }
        if(this.editform2.password1!=value){
          return callback(new Error('两次输入密码不一致!'));
        }
        return callback()
      }
      return{
        activeName: 'first',
        editform2:{

        },
        editform1:{
          studentCode:'',
          realName:'',
          nativeArr:[],
          phone:'',
          email:'',
          sex:'',
          gradeTxt:'',
          userId:''

        },
        passwordform:{
          password1:'',
          password2:''
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
        options:[],
        defaultProps:{
          label:'name',
          value:'id'
        },
        istuxingyanzheng:false,
        jiguanProps:{
          value:'areaId',
          label:'areaName',
          children:'child'
        },
        isjinyong:true,
        editformrules2:{
          beforepass:[
            {required:true,message:'请输入原密码',trigger:'blur'}
            // {validator:checkbfPassword,trigger:'blur'}
          ],
          password1:[
            {required:true,message:'请输入新密码',trigger:'blur'},
            {validator:checkPassword,trigger: 'blur'}

          ],
          password2:[
            {required:true,message:'请确认新密码',trigger:'blur'},
            {validator:checkPassword,trigger: 'blur'}
          ],
          yzm:[
            {required:true,message:'请填写验证码',trigger:'blur'}
          ]
        },
        editformrules:{
          phone:[
            {validator:checkMobile,trigger:'blur'}
          ],
          email:[
            {validator:checkEmail,trigger:'blur'}
          ],
          studentCode:[

          ],
          gradeTxt:[

          ],
          sex:[

          ],


        },
        loginid:'',
        base:''
      }
    },
    watch:{
      activeName:function(val) {
        if(val!='first'){
       this.isjinyong=true
        }
        if(val=='first'){
          this.getStudentInfo(this.loginid)
        }else if(val=='second'){
          this.istuxingyanzheng=false
          this.$refs.editformref.resetFields()

        }
      }
    },
    created() {
      this.base=this.BASE_URL
    },
    mounted() {
      const that=this
      this.loginid=window.sessionStorage.getItem('loginid')
      this.getClassList()
      this.getStudentInfo(this.loginid)
      !(function(window, document) {
        var size = 5;//设置验证码长度
        function GVerify(options) { //创建一个图形验证码对象，接收options对象为参数
          this.options = { //默认options参数值
            id: "", //容器Id
            canvasId: "verifyCanvas", //canvas的ID
            width: "100", //默认canvas宽度
            height: "30", //默认canvas高度
            type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
            code: "",
          }
          if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
            for(var i in options) { //根据传入的参数，修改默认参数值
              this.options[i] = options[i];
            }
          }else{
            this.options.id = options;
          }

          this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
          this.options.letterArr = getAllLetter();

          this._init();
          this.refresh();
        }

        GVerify.prototype = {
          /**版本号**/
          version: '1.0.0',

          /**初始化方法**/
          _init: function() {
            var con = document.getElementById(this.options.id);
            var canvas = document.createElement("canvas");
            this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "100";
            this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "30";
            canvas.id = this.options.canvasId;
            canvas.width = this.options.width;
            canvas.height = this.options.height;
            canvas.style.cursor = "pointer";
            canvas.innerHTML = "您的浏览器版本不支持canvas";
            con.appendChild(canvas);
            var parent = this;
            canvas.onclick = function(){
              parent.refresh();
            }
          },

          /**生成验证码**/
          refresh: function() {
            this.options.code = "";
            var canvas = document.getElementById(this.options.canvasId);
            if(canvas.getContext) {
              var ctx = canvas.getContext('2d');
            }else{
              return;
            }

            ctx.textBaseline = "middle";

            ctx.fillStyle = randomColor(180, 240);
            ctx.fillRect(0, 0, this.options.width, this.options.height);

            if(this.options.type == "blend") { //判断验证码类型
              var txtArr = this.options.numArr.concat(this.options.letterArr);
            } else if(this.options.type == "number") {
              var txtArr = this.options.numArr;
            } else {
              var txtArr = this.options.letterArr;
            }

            for(var i = 1; i <=size; i++) {
              var txt = txtArr[randomNum(0, txtArr.length)];
              this.options.code += txt;
              ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei'; //随机生成字体大小
              ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
              ctx.shadowOffsetX = randomNum(-3, 3);
              ctx.shadowOffsetY = randomNum(-3, 3);
              ctx.shadowBlur = randomNum(-3, 3);
              ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
              var x = this.options.width / (size+1) * i;
              var y = this.options.height / 2;
              var deg = randomNum(-30, 30);
              /**设置旋转角度和坐标原点**/
              ctx.translate(x, y);
              ctx.rotate(deg * Math.PI / 180);
              ctx.fillText(txt, 0, 0);
              /**恢复旋转角度和坐标原点**/
              ctx.rotate(-deg * Math.PI / 180);
              ctx.translate(-x, -y);
            }
            /**绘制干扰线**/
            for(var i = 0; i < 4; i++) {
              ctx.strokeStyle = randomColor(40, 180);
              ctx.beginPath();
              ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
              ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
              ctx.stroke();
            }
            /**绘制干扰点**/
            for(var i = 0; i < this.options.width/4; i++) {
              ctx.fillStyle = randomColor(0, 255);
              ctx.beginPath();
              ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
              ctx.fill();
            }
          },

          /**验证验证码**/
          validate: function(code){
            var code = code.toLowerCase();
            var v_code = this.options.code.toLowerCase();
            if(code == v_code){
              return true;
            }else{
              this.refresh();
              return false;
            }
          }
        }
        /**生成字母数组**/
        function getAllLetter() {
          var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
          return letterStr.split(",");
        }
        /**生成一个随机数**/
        function randomNum(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        }
        /**生成一个随机色**/
        function randomColor(min, max) {
          var r = randomNum(min, max);
          var g = randomNum(min, max);
          var b = randomNum(min, max);
          return "rgb(" + r + "," + g + "," + b + ")";
        }
        window.GVerify = GVerify;
      })(window, document);
      var verifyCode = new GVerify("v_container");
      document.getElementById("my_button").onclick = function(){
        var res = verifyCode.validate(document.getElementById("code_input").value);
        if(res){
          that.$message.success('验证码正确')
          that.istuxingyanzheng=true

        }else{
          console.log(that)
          that.istuxingyanzheng=false
          that.$message.error('验证码错误')


        }
      }
    },
    methods:{
      dbfunc(){
      console.log('双击了')
       this.isjinyong=false
      },
      handleClick(tab,event){
        // console.log(tab)
      },

    jiguanchange2(val){
        //籍贯选择
      },
     qingkong(){
       this.istuxingyanzheng=false
      this.$refs.editformref2.resetFields()
      },
      xiugaipassword(){
        //  确定修改密码
        this.$refs.editformref2.validate(async valid=>{
          if(!valid){
            this.$message.error('请检查格式!')
            return
          }
          if(this.istuxingyanzheng==false){
            this.$message.error('验证码验证失败!')
            return
          }
          this.$http.post(`${this.base}/api/User/updatePassword1`,{
            userId:this.loginid,
            oldPassword:this.editform2.beforepass,
            newPassword:this.editform2.password2
          }).then(res=>{
            if(res.data=="Ok"){
              this.$message.success('修改密码成功')
            }else{
              this.$message.warning(res.data)
            }
          }).catch(res=>{
            console.log('获取数据失败')
          })

        })
      },
    getClassList(){
      this.$http.get(`${this.base}/api/Grade/getAllGrade`).then(res=>{
        console.log('获取所有班级')
        console.log(res.data)
        // this.options=res.data
      }).catch(res=>{
        console.log("获取所有班级失败")
      })
    },
    getStudentInfo(id){
      this.$http.get(`${this.base}/api/Student/getStudentByUserId/${id}`).then(res=>{
        console.log('获取单个信息')
        console.log(res.data)
        //2020/3/15 0:00:00
        this.editform1=res.data

      }).catch(res=>{

        console.log('获取单个学员信息失败')
      })
    },
    savestudentinfo(){
      this.editform1.id=this.loginid
        //确认修改信息
      this.$http.post(`${this.base}/api/user/updateinfo`,this.editform1).then(res=>{
         console.log('编辑返回')
          console.log(res.data)
        if(res.data=='Ok'){
         this.$message.success('编辑成功')
             this.isjinyong=true
            this.istuxingyanzheng=false
            this.editform2={
              beforepass:'',
              password1:'',
              password2:'',
              yzm:''
            }
        }else{
          this.$message.warning('编辑失败')
          this.isjinyong=true
          this.istuxingyanzheng=false
        }
      })
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
  .surebutton{
    margin:20px auto;

  }
  .formhj{
    width: 190px;

  }
  .el-form-item{
    margin-bottom: 12px;

  }
  #my_button{
    margin-left: 10px;
  }
  /*#v_container{*/
  /*  display: inline-block;*/
  /*  !*float: right;*!*/
  /*}*/
</style>

