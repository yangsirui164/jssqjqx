<template>
  <div>
    <el-date-picker
      size="mini"
      v-model="entryTime"
      type="date"
      placeholder="选择日期"
      value-format="yyyy-MM-dd"
    >
    </el-date-picker>
  </div>
</template>
<script>
export default{
   data(){
     return{
       entryTime:"2020-3-15"
     }
   }
}
</script>
<style>

</style>
<!--<template>-->
<!--  <div>-->
<!--    &lt;!&ndash;    需要手动绑定请求头&ndash;&gt;-->
<!--    &lt;!&ndash;    action 标识图片要上传到的api地址  http://192.168.1.15:8002+上传路径&ndash;&gt;-->
<!--    <el-upload-->
<!--      action="https://jsonplaceholder.typicode.com/posts/"-->
<!--      :on-preview="handlePreview"-->
<!--      :on-remove="handleRemove"-->
<!--      list-type="text"-->
<!--      :headers="headerobj"-->
<!--      :on-success="handlesuccess">-->
<!--      <el-button size="small" type="primary">点击上传</el-button>-->
<!--      <div slot="tip" class="el-upload__tip">（1）支持多文件上传,扩展名:.rar.zip.doc.docx.pdf.jpg...</div>-->
<!--      <div slot="tip" class="el-upload__tip">（2）单文件不能超过100M</div>-->
<!--    </el-upload>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--  export default{-->
<!--    data(){-->
<!--      return{-->
<!--        headerobj:{-->
<!--          Authorization:window.sessionStorage.getItem('token')-->
<!--        },-->
<!--        pics:[]-->
<!--      }-->
<!--    },-->
<!--    methods:{-->
<!--      handlePreview(){-->
<!--        //处理预览事件-->
<!--        console.log('预览了')-->
<!--      },-->
<!--      handleRemove(file){-->
<!--        //  去除文件事件-->
<!--        //  获取将要去除的图片的临时路径-->
<!--        const filePath=file.response.data.tmp_path-->
<!--        const index1=this.pics.findIndex((item)=>{-->
<!--          item.pic==filePath-->
<!--        })-->
<!--        this.pics.splice(index1,1)-->
<!--      },-->
<!--      handlesuccess(res){-->
<!--        // {data:{tmp_path:'',url:''},meta:}-->
<!--        //  上传成功后-->
<!--        //拼接图片信息数组-->
<!--        const picinfo={pic:res.data.temp_path}-->
<!--        this.pics.push(picinfo)-->


<!--      }-->

<!--    }-->
<!--  }-->
<!--</script>-->
<!--<style scoped lang="less"></style>-->
