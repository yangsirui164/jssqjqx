<template>
  <div>
    <hard ref="hard"></hard>
    <div class="cl_music_comment">
      <!-- tab 切换-->
      <div class="cl_music_flex">
        <div class="cl_l cl_flex_list">
          <div v-if="login"  class="cl_l tab" v-for="(item,index) in tabList" :key="index"  @click="classCation(index,item.type)" :class="index==tabIndex? 'coloer':''">{{item.title}}</div>
          <div v-if="!login" class="cl_l tab" v-for="(item,index) in tabList" :key="index" v-show="item.type!=99"  @click="classCation(index,item.type)" :class="index==tabIndex? 'coloer':''">{{item.title}}</div>
          <div class="cl_clear"></div>
        </div>
      </div>
      <!-- 音乐 list-->
      <div class="cl_l cl_music_list_l">

        <div class="cl_music_list_l_son">
          <div class="music_list" v-for="(item,index) in listAll" :key="index"  @click="imgIndex(index,item.url,item.istopic),getSonVal(item.id),zIn(index,item.uid),stopZin(index)" :class="index==tabMusic? {'tabMusics':animation}:''">
            <!--点击选中状态-->
            <div class="music_list_i" @click="animationUp(index)" :class="index==tabMusic? 'bf':''">
              <!--点击选中状态添加一个动画-->
              <div class="music_list_y"  @click="animationUp(index)" :class="index==tabMusic? 'bf':''">
                <!--预留波动动画1-->
                <listanimationwave ref="listanimationwave"></listanimationwave>
              </div>
            </div>
            <div class="music_list_son" @click="playbackBtn(item.playback,item.id)">
              <div class="cl_l cl_list1">ID <span class="cl_color1">{{item.id}}</span></div>
              <div class="cl_l cl_list2" :title="item.musicname">歌曲 <span class="cl_color2">{{item.musicname}}</span></div>
              <div class="cl_l cl_list3" :title="item.istopic">描述 <span class="cl_color3">{{item.istopic}}</span></div>
              <!--次播放-->
              <div class="cl_l cl_list4">
                <div class="cl_store_look"></div>
                <span>播放量 <span class="cl_color4" title="只有歌曲播放结束才算听完哦">{{item.clicks}}</span></span>
              </div>
              <!--单曲点击-->
              <div class="cl_l cl_list5">
                <div class="cl_store_click"></div>
                <span>单曲点击率 <span class="cl_color5">{{item.playback}}</span></span>
              </div>

              <!--收藏-->
              <div class="cl_l cl_list6">
                <div v-if="login" class="cl_store_up" @click="coleBtn(item.id)"  :class="item.collection==1  ? 'off':'on'"></div>
                <div v-else class="cl_store_up on" @click="coleBtn(item.id)"></div>
              </div>

              <!--去评论-->
              <div class="cl_l cl_list7" @click="getComment(item.id,item.uid,item.musicname)">
                <div class="cl_color7">去评论</div>
              </div>

            </div>
            <!--播放/暂停/详情-->
            <div class="cl_music_strop cl_flex">
              <div class="cl_music_audio audio_on" @click="clicksBtn(item.clicks,item.id),audioPlay(1,index)"></div>
              <div class="cl_music_audio audio_off" @click="audioPlay(2,index)"></div>
              <div class="cl_music_audio audio_look" @click="audioLook(item.uid)"></div>
            </div>
          </div>
          <!--暂无数据-->
          <div class="cl_music_list_l_no" v-show="listAll.length<=0">
               <span class="cl_comment_no">
                  <div class="cl_comment_no_all">
                    <img class="cl_comment_no_all_img" src="../public/img/nono.png" alt="">
                  </div>
                  <div class="cl_comment_no_t">该类型歌曲暂无上传。</div>
               </span>
          </div>
        </div>
        <!--音频-->
        <audio controls :src="imgs(video)" ref='audio' preload="metadata" @canplay="getDuration" @timeupdate="updateTime"></audio>
        <!--时间-->
        <div class="cl_time">{{time}}</div>
        <!--分页-->
        <div class="cl_paging_all">
          <div class="cl_l cl_page" v-for="(item,index) in indexAll" :key="index"  @click="paging(index+1)">{{index+1}}</div>
          <div class="cl_l cl_page"><input class="cl_page_input"  type="text" v-model="pageVal" placeholder="第几页"></div>
          <div class="cl_l cl_page" @click="pagingBtn()">确定</div>
          <div class="cl_l cl_page">共 <span class="cl_page_color"> {{pageAll}}</span> 条</div>
        </div>
        <!--动画-->
        <listAnimation ref="listAnimation"></listAnimation>
      </div>
      <!--评论区-->
      <div class="cl_r cl_music_list_r">
        <div class="cl_music_list_cent">
          <comment ref="comment"></comment>
        </div>
      </div>
    </div>
    <!--loadimg-->
    <loadimg :show="load"></loadimg>
    <loading></loading>
    <foot></foot>
  </div>
</template>

<script>
  import hard from "../components/hard";
  import foot from "../components/foot";
  import comment from "../components/comment";
  import listAnimation from "../components/listanimation";
  import listanimationwave from "../components/listanimationwave";
  import loading from '../components/loading'
  export default {
    name: "list",
    components: {
      hard,
      foot,
      comment,
      listAnimation,
      listanimationwave,
      loading
    },
    data(){
      return {
        animation:false, // 控制动画
        tabIndex:0,      // 导航切换
        tabMusic:0,      // 下标状态
        listAll:[],      // 列表
        video:"",        // 音频
        page:1,          // 分页
        indexAll:"" ,    // 总页数
        pageAll:"",      // 一共数据
        pageVal:"" ,     // 选择第几页
        time:"" ,        // 歌曲时间
        login: window.localStorage.getItem('key'), // 获取登入状态
        tabList:[
          {id:0,type:0,title:"全部"},
          {id:1,type:99,title:"我的收藏"},
          {id:2,type:1,title:"劲爆"},
          {id:3,type:2,title:"清闲"},
          {id:4,type:3,title:"悲伤"},
          {id:5,type:4,title:"电子"},
          {id:6,type:5,title:"DJ夜店"},
          {id:7,type:6,title:"蹦迪"},
          {id:8,type:7,title:"爵士乐"},
          {id:9,type:8,title:"心灵疗伤"},
          {id:10,type:9,title:"摇滚说唱"},
          {id:11,type:10,title:"安静"},
          {id:12,type:11,title:"说唱"},
        ],
        load:true,            // loding
        timeAll:"",           // 音频长度（时间）
        sonCommentData:{},    // 父级公共数据
        zIndex:"" ,           // 默认取第一个
        uid:"",               // uid
        zIns:"",              // 判断 tab 切换监听判断
        timer:"",             // 时间定时器 全局的
        stopzIns:"",          // 判断点击 list列表 获取下标  动画停止

      }

    },
    mounted() {
      var that =this;
      that.list();
      that.audio = that.$refs.audio;
      that.audio.controls = false;
      document.title="www.i1i3.com"
    },
    methods:{
      //点击获取 list 下标 添加动画
      animationUp:function(t){
        var that = this;
        that.tabMusic=t;
      },
      //处理 播放下标 （点击list的）
      zIn:function(z,uid){
        // console.log(z,"获取tab list，下标");
        var that =this;
        that.zIns = z;
        that.$refs.listAnimation.listAll(uid);  // 给子集传过去uid
      },
      //点击处理停止list 下标 不鞥用其他方法只能自己单独在写一个方法；
      stopZin:function(t){
        var that =this;
        if(that.stopzIns!=t){
          console.log("不等 hover 里的 下标")
          clearInterval(that.timer);
          that.$refs.listAnimation.$data.animation=false; //停止动画转盘
          that.$refs.listAnimation.$data.animationwave=false; //停止动画 音符
          that.animation =false;//选中背景颜色变化动画
        }else {
          console.log("等于 hover 里的 下标")
        }
      },
      //获取音频长度总时间 //此时可以获取到duration
      getDuration() {
        var that =this;
        that.timeAll=that.audio.duration;
        console.log(that.audio.duration);
      },
      //获取音频属性，获取audio当前播放时间 预留
      updateTime(e) {
        // console.log(e.target.currentTime)
      },

      //自定义 点击播放
      audioPlay:function(Play,index){
        var that =this;
        that.stopzIns=index;
        that.audio = that.$refs.audio;
        // that.timeAll =Number(parseInt(that.audio.duration));
        clearInterval(that.timer);
        that.timer =setInterval(function () {
          that.timeAll--;
          data(that.timeAll);
          function data(time) {
            var m = 0, s = 0, ms = '00', ss = '00';
            time = Math.floor(time % 3600);
            m = Math.floor(time / 60);
            s = Math.floor(time % 60);
            ss = s < 10 ? '0' + s : s + '';
            ms = m < 10 ? '0' + m : m + '';
            var ts =ms + ":" + ss;
            that.time=ts;
          }
          if(that.time=="00:00"){
            clearInterval(that.timer);
            that.$refs.listAnimation.$data.animation=false; //停止动画转盘
            that.$refs.listAnimation.$data.animationwave=false; //停止动画 音符
            that.animation =false;//选中背景颜色变化动画
            document.title="欢迎来到i1i3.com网"
          }
        },1000);


        if(Play==1){
          console.log(index,"获取播放里的播放下标");
          //判断 下标是否等于点击下标 如果等于继续播放，如果不等于停止
          if(that.zIns != index){
            console.log("list 不等于播放下标清理定时器");
            that.$refs.listAnimation.$data.animation=false; //停止动画转盘
            that.$refs.listAnimation.$data.animationwave=false; //停止动画 音符
            that.animation =false;//选中背景颜色变化动画
            clearInterval(that.timer);
          }else {
            console.log("等于的时候播放");
            that.audio.play();   //播放
            that.$refs.listAnimation.$data.animation=true;  //开始动画转盘
            that.$refs.listAnimation.$data.animationwave=true; //停止动画 音符
            that.animation =true;//选中背景颜色变化动画

            // //获取音频 缓存加载
            // var getmusicbuff = setInterval(function(){
            //     if(that.audio.buffered.length!=0){
            //         console.log(that.audio.buffered.end(0));
            //         if(that.audio.buffered.end(0)>=(that.timeAll/2)){
            //             clearInterval(getmusicbuff);
            //             console.log("加载缓存")
            //         }else {
            //             console.log("加载中")
            //         }
            //     }else {
            //         console.log("piupiupiu")
            //     }
            // },1000)
          }
        }else {
          that.audio.pause();  //暂停
          clearInterval(this.timer);
          that.$refs.listAnimation.$data.animation=false; //停止动画 转盘
          that.$refs.listAnimation.$data.animationwave=false; //停止动画 音符
          that.animation =false; //选中背景颜色变化动画
        }
      },

      //获取 分页下标
      paging:function (t) {
        var that =this;
        that.page=t;
        that.list()
      },
      // 处理 img 服务器 本地 路径
      imgs:function(img){
        var that=this;
        var url =window.location.host.length;
        // console.log(url,"list")
        if(url==12){
          return 'http://www.i1i3.com/api/' +  that.video
        }else {
          return 'http://localhost:3000/' +  that.video
        }
      },
      //music 地址
      imgIndex:function(index,music,istopic){
        var that = this;
        that.tabMusic=index;
        that.video =  music;
        document.title=istopic
        // that.list()
      },
      //点击复选框查寻 分页
      pagingBtn:function(){
        var that =this;
        if(that.pageVal<=that.indexAll){
          that.page=that.pageVal;
          that.list();
        }else{
          that.$popup("没有那么多页数哦",1500);
          that.pageVal='';
        }
      },
      //分类 tab
      classCation:function (id,type) {
        var  that =this;
        that.tabIndex=id;
        that.tabType=type;
        that.list()
      },
      //默认列表
      list:function () {
        var that =this;
        this.$axios.get('api/listAll/list', {
          params:{
            page:that.page,
            type:that.tabType,
            uid:that.login
          }
        },{}).then((response) => {
          if(response.status==''){
            that.load=true;
          }else{
            that.load=false;
            that.listAll =response.data.msg;            // 总数据
            that.indexAll =response.data.pageCounts;    // 分页
            that.pageAll =response.data.pageAll;        // 分页
            that.zIndex=response.data.msg[0].id;        // 取第一个
            that.$refs.comment.commentId(that.zIndex);  // 往子组件传 默认第一个  music id
          }

        })
      },
      //播放量
      clicksBtn:function (click,id) {
        var that =this;
        //播放量判断
        //判断歌曲听完  播放量 加 1
        //暂时不需要 直接点击播放就可以 加1
        //用户量大量 可以打开

        that.audio = that.$refs.audio;
        that.audio.duration;
        that.timeMusicAll =Number(parseInt(that.audio.duration));
        // that.timeMusicAll =that.timeAll;
        this.stop =setInterval(function () {
          that.timeMusicAll --;
          if(that.timeMusicAll==10){
            clearInterval(that.stop);
            console.log(click,id);
            click ++;
            that.$axios.get('api/listAll/clicks', {
              params:{
                clicks:click,
                id:id
              }
            },{}).then((response) => {
              // that.list()
            })
          }
        },1000);
      },
      //单曲点击率
      playbackBtn:function (click,id) {
        var that =this;
        click ++;
        this.$axios.get('api/listAll/playback', {
          params:{
            playback:click,
            id:id
          }
        },{}).then((response) => {
          // that.list()
        })
      },
      //收藏
      coleBtn:function (id) {
        var that =this;
        if(that.login){
          this.$axios.get('api/listAll/newCollection', {
            params:{
              uid:that.login, // 用户id
              zTai:1,         // 状态
              id:id           // 歌曲id
            }
          },{}).then((response) => {
            that.$popup(response.data.msg.title);
            that.list()
          })
        }else {
          that.$popup("请登入进行收藏");
        }
      },
      //评论 模块
      getComment:function (id,uid,musicname) {
        var that =this;
        if(that.login){
          that.$refs.comment.$data.isShow=true;
          var arr =[];
          arr.push(id);          // id
          arr.push(uid);         // uid
          arr.push(musicname);   // 歌曲名字
          // console.log(arr);
          that.sonCommentData=arr;
          that.$refs.comment.commentAll(that.sonCommentData);
        }else {
          that.$popup("请登入进行评论");
        }
      },
      // 获取默认第一 muisc id 值 跟点击列表 music id  给子集传过去
      getSonVal:function (id) {
        var that =this;
        that.zIndex=id;
        that.$refs.comment.commentId(that.zIndex);
      },
      // 详情模块
      audioLook:function (uid) {
        var that =this;
        that.uid =uid;
        that.$store.commit('countIndex',uid);
        setTimeout(function () {
          that.$router.replace('/about')
          // that.$router.push({ path: '/about', query: { uId: that.uid }})
        },200)
      }

    }
  }
</script>

<style scoped>
  .music_list_i{
    width: 100%;
    height: 36px;
    z-index: -1;
    position: absolute;
  }
  .music_list_i.bf{
    background: #00f3ff;
  }
  .music_list_y{
    display: none;
  }
  .music_list_y.bf{
    display: block;
  }


  .tabMusics{
    background: #89cee4;
    animation: tabMusics 3s linear 0s infinite alternate;
  }

  @keyframes tabMusics {
    0% {
      background:#f90000;
      color: #fff;
    }
    20% {
      background: #3de862;
      color: #fff;
    }
    40% {
      background:#e8e542;
      color: #fff;
    }
    60% {
      background: #e816e2;
      color: #fff;
    }
    80% {
      background: #39e812;
      color: #fff;
    }
    80% {
      background: #1d13e8;
      color: #fff;
    }
  }







  .cl_color1{
    color: #f90000;
  }
  .cl_color2{
    color: #0ade2f;
  }
  .cl_color3{
    color: #ff00c6;
  }
  .cl_color4{
    color: #0e3cea;
  }
  .cl_color5{
    color: #6e0eea;
  }
  .cl_music_comment{
    width: 970px;
    margin: 50px auto 30px;
  }
  .music_list:first-of-type{
    margin-top: 50px;
  }
  .music_list{
    width: 100%;
    height: 36px;
    margin: 3px auto 2px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    line-height: 36px;
    font-size: 12px;
    color: #354b73;
    cursor: pointer;
    position: relative;
    transition: background 1.5s ease;
  }
  .music_list:hover{
    transition: background .5s ease;
    background: rgba(115, 239, 200,1);
  }
  .music_list_son{
    width: 100%;
    height: 36px;
  }
  .music_id{
    color: #DA4948;
    padding-left: 12px;
  }
  .cl_list1{
    width: 50px;
    margin-left: 12px;
  }
  .cl_list2{
    width: 100px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .cl_list3{
    width: 100px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .cl_list4{
    width: 90px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .cl_list5{
    width: 120px;
  }
  .cl_list6{
  }
  .cl_list7{
    /*width: 50px;*/
  }
  .cl_color7{
    color: #980511;
    padding-left: 12px;
    box-sizing: border-box;
  }
  .cl_page{
    min-width: 16px;
    padding: 0 6px;
    height: 20px;
    border: 1px solid #87b98d;
    text-align: center;
    line-height: 20px;
    font-size: 10px;
    margin: 1px;
    box-sizing: border-box;
    border-radius: 2px;
  }
  .cl_paging_all{
    min-width: 40px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,0%);
    cursor: pointer;
    margin-top: 40px;
  }
  .cl_page_input{
    width: 36px;
    height: 14px;
    line-height: 14px;
    border: none;
    font-size: 10px;
    background: #f1f1f1;
  }
  .cl_page_color{
    color: #a766d6;
  }
  .cl_store_up{
    width: 16px;
    height: 16px;
    float: left;
    margin-top: 9px;
    cursor: pointer;
  }
  .off{
    width: 16px;
    height: 16px;
    background: url("../public/img/off.png") no-repeat;
    background-size: 100% 100%;
  }
  .on{
    width: 16px;
    height: 16px;
    background: url("../public/img/on.png") no-repeat;
    background-size: 100% 100%;
  }

  .cl_store_look{
    width: 16px;
    height: 16px;
    float: left;
    margin-top: 9px;
    margin-right: 4px;
    background: url("../public/img/look.png") no-repeat;
    background-size: 100% 100%;
  }
  .cl_store_click{
    width: 16px;
    height: 16px;
    float: left;
    margin-top: 9px;
    margin-right: 4px;
    background: url("../public/img/click.png") no-repeat;
    background-size: 100% 100%;
  }

  .cl_music_strop{
    width: 100px;
    height: 28px;
    background: rgba(89, 125, 117, 0.8);
    position: absolute;
    right: 3px;
    top: 50%;
    border: 1px solid #352b27;
    border-radius: 4px;
    -webkit-transform: translate(0%,-50%);
    transform: translate(0%,-50%);
    opacity: 0.03;
    transition: opacity 2s ease;
  }
  .music_list:hover .cl_music_strop{
    opacity: 1;
    transition: opacity 4s ease;
  }
  .audio_on{
    width: 16px;
    background: url("../public/img/play.png") no-repeat;
    background-size: 60%;
    background-position-x: 6px;
    background-position-y: 2px;
  }
  .audio_off{
    width: 16px;
    background: url("../public/img/no.png") no-repeat;
    background-size: 60%;
    background-position-x: 6px;
    background-position-y: 2px;
  }

  .audio_look{
    width: 16px;
    background: url("../public/img/lookplay.png") no-repeat;
    background-size: 60%;
    background-position-x: 6px;
    background-position-y: 2px;
  }

  .cl_music_audio{
    flex: 50%;
    text-align: center;
    line-height: 30px;
  }
  .cl_time{
    text-align: center;
  }
  .cl_music_flex{
    width: 100%;
    height: 30px;
    margin: 50px auto 20px;
  }
  .tab{
    min-width: 38px;
    height: 30px;
    padding: 0 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #736d6d;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    cursor: pointer;
    color: #2f1c27;
    margin: 1px;
  }
  .tab.coloer{
    background: #511b75;
    color: #efffff;
  }
  .tab:hover{
    background: #e2f5ee;
    border: 1px solid #999;
  }


  .cl_music_list_l{
    width: 650px;
    min-height: 500px;
    position: relative;
  }
  .cl_music_list_l_son{
    width: 650px;
    min-height: 400px;
  }
  .cl_music_list_l_no{
    width: 650px;
    min-height: 407px;
    border: 1px solid #dbdbdb;
    margin-top: 50px;
    border-radius: 4px;
  }
  .cl_comment_no_all{
    width: 123px;
    height: 132px;
    margin: 130px auto 20px;
  }
  .cl_comment_no_all_img{
    width: 100%;
  }
  .cl_comment_no_t{
    margin: 0 auto;
    text-align: center;
    color: #1b1b79;
  }


  .cl_music_list_r{
    width: 305px;
  }
  .cl_music_list_cent{
    width: 100%;
    margin-top: 50px;
    border-radius: 4px;
    height: 406px;
    border: 1px solid #dbdbdb;
  }

</style>
