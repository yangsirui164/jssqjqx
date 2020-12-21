<!--<template>-->
<!--<div>-->
<!--  <el-transfer v-model="value" :data="data"></el-transfer>-->
<!--</div>-->

<!--</template>-->
<!--<script>-->
<!--  export default {-->
<!--    data(){-->
<!--      return{-->
<!--       value:[],-->
<!--        data:[],-->
<!--        obj:[{name:'张三',code:115567,rolepower:true},{name:'李四',code:67576,rolepower:true}-->
<!--        ,{name:'王柳',code:876,rolepower: false}]-->
<!--      }-->
<!--    },-->
<!--    methods:{-->
<!--     getshuju(){-->

<!--       this.obj.forEach((item)=>{-->
<!--           console.log('有朕')-->
<!--           this.data.push({-->
<!--             key:item.code,-->
<!--             label:item.name-->

<!--           })-->

<!--           this.value=[67576,115567]-->


<!--       })-->

<!--    }-->
<!--    },-->
<!--    created() {-->
<!--    this.getshuju()-->
<!--    }-->

<!--  }-->


<!--</script>-->

<!--<template></template>-->
<!--<script>-->
<!--  export default{-->
<!--    data(){-->
<!--      return{-->
<!--        timer1:null-->
<!--      }-->
<!--    },-->
<!--    mounted() {-->

<!--      this.timer1=setInterval(function() {-->
<!--        console.log('timer1')-->
<!--      })-->
<!--      this.timer1=setInterval(function() {-->
<!--        console.log('timer2')-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--</script>-->
<!--<template>-->
<!--  <div>-->
<!--    <el-cascader-->
<!--      :options="options"-->
<!--      :props="props"-->
<!--      clearable-->
<!--    size="mini"></el-cascader>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--  export default {-->
<!--    data(){-->
<!--      return{-->
<!--        props: { multiple: true },-->
<!--        options: [{-->
<!--          value: 1,-->
<!--          label: '东南',-->
<!--          children: [{-->
<!--            value: 2,-->
<!--            label: '上海',-->
<!--            children: [-->
<!--              { value: 3, label: '普陀' },-->
<!--              { value: 4, label: '黄埔' },-->
<!--              { value: 5, label: '徐汇' }-->
<!--            ]-->
<!--          }, {-->
<!--            value: 7,-->
<!--            label: '江苏',-->
<!--            children: [-->
<!--              { value: 8, label: '南京' },-->
<!--              { value: 9, label: '苏州' },-->
<!--              { value: 10, label: '无锡' }-->
<!--            ]-->
<!--          }, {-->
<!--            value: 12,-->
<!--            label: '浙江',-->
<!--            children: [-->
<!--              { value: 13, label: '杭州' },-->
<!--              { value: 14, label: '宁波' },-->
<!--              { value: 15, label: '嘉兴' }-->
<!--            ]-->
<!--          }]-->
<!--        }, {-->
<!--          value: 17,-->
<!--          label: '西北',-->
<!--          children: [{-->
<!--            value: 18,-->
<!--            label: '陕西',-->
<!--            children: [-->
<!--              { value: 19, label: '西安' },-->
<!--              { value: 20, label: '延安' }-->
<!--            ]-->
<!--          }, {-->
<!--            value: 21,-->
<!--            label: '新疆维吾尔族自治区',-->
<!--            children: [-->
<!--              { value: 22, label: '乌鲁木齐' },-->
<!--              { value: 23, label: '克拉玛依' }-->
<!--            ]-->
<!--          }]-->
<!--        }]-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->
<!--<style>-->

<!--</style>-->
<!--<template>-->
<!--  <div>-->
<!--    <a-transfer-->
<!--      :data-source="mockData"-->
<!--      :target-keys="targetKeys"-->
<!--      :show-search="true"-->
<!--      :titles="['Source', 'Target']"-->
<!--      :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"-->
<!--      :show-select-all="false"-->
<!--      @change="onChange"-->
<!--    >-->
<!--      <template-->
<!--        slot="children"-->
<!--        slot-scope="{-->
<!--          props: { direction, filteredItems, selectedKeys },-->
<!--          on: { itemSelectAll, itemSelect },-->
<!--        }"-->
<!--      >-->
<!--        <a-table-->
<!--          :row-selection="-->
<!--            getRowSelection({ selectedKeys, itemSelectAll, itemSelect })-->
<!--          "-->
<!--          :columns="direction === 'left' ? leftColumns : rightColumns"-->
<!--          :data-source="filteredItems"-->
<!--          size="small"-->
<!--          :custom-row="-->
<!--            ({key}) => ({-->
<!--              on: {-->
<!--                click: () => {-->
<!--                  itemSelect(key, !selectedKeys.includes(key));-->
<!--                },-->
<!--              },-->
<!--            })-->
<!--          "-->
<!--        />-->
<!--      </template>-->
<!--    </a-transfer>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
  // import difference from 'lodash/difference';
  // const mockData = [];
  // for (let i = 0; i < 20; i++) {
  //   mockData.push({
  //     key: i.toString(),
  //     title: `content${i + 1}`,
  //     description: `description of content${i + 1}`
  //
  //   });
  // }
  //
  // const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);
  //
  // const leftTableColumns = [
  //   {
  //     dataIndex: 'title',
  //     title: 'Name',
  //   },
  //   {
  //     dataIndex: 'description',
  //     title: 'Description',
  //   },
  // ];
  // const rightTableColumns = [
  //   {
  //     dataIndex: 'title',
  //     title: 'Name',
  //   },
  //   {
  //     dataIndex: 'description',
  //     title: 'Description',
  //   }
  // ];

<!--  export default {-->
<!--    data() {-->
<!--      return {-->
<!--        defaultProps:{-->
<!--          children:'children',-->
<!--          label:'lable',-->
<!--          // disabled:this.disabledfn-->
<!--        },-->
<!--      tree_data : [{-->
<!--          id: 1,-->
<!--          label: '一级 1',-->
<!--          disabled:false,-->
<!--           children: [{-->
<!--            id: 4,-->
<!--            label: '二级 1-1',-->
<!--             disabled:false,-->
<!--          }]-->
<!--        }, {-->
<!--          id: 2,-->
<!--          label: '一级 2',-->
<!--        disabled:false,-->
<!--          children: [{-->
<!--            id: 5,-->
<!--            label: '二级 2-1',-->
<!--            disabled:false,-->
<!--          }, {-->
<!--            id: 6,-->
<!--            label: '二级 2-2',-->
<!--            disabled:false,-->
<!--          }]-->
<!--        }],-->
<!--        mockData,-->
<!--        targetKeys: originTargetKeys,-->
<!--        leftColumns: leftTableColumns,-->
<!--        rightColumns: rightTableColumns,-->
<!--      };-->
<!--    },-->
<!--    created() {-->
<!--    },-->
<!--    methods: {-->
<!--      onChange(nextTargetKeys) {-->
<!--        this.targetKeys = nextTargetKeys;-->
<!--      },-->


<!--      handlecheckchange(){-->
<!--        this.tree_data[0].disabled=true-->



<!--      },-->

<!--      getRowSelection({selectedKeys, itemSelectAll, itemSelect }) {-->
<!--        return {-->
<!--          onSelectAll(selected, selectedRows) {-->
<!--            const treeSelectedKeys = selectedRows-->
<!--              .map(({ key }) => key);-->
<!--            const diffKeys = selected-->
<!--              ? difference(treeSelectedKeys, selectedKeys)-->
<!--              : difference(selectedKeys, treeSelectedKeys);-->
<!--            itemSelectAll(diffKeys, selected);-->
<!--          },-->
<!--          onSelect({ key }, selected) {-->
<!--            itemSelect(key, selected);-->
<!--          },-->
<!--          selectedRowKeys: selectedKeys,-->
<!--        };-->
<!--      },-->
<!--    },-->
<!--  };-->
<!--</script>-->
<template>
  <div>
    <a-tree
      checkable
      :tree-data="treeData"
      @check="onCheck"
      :disabled="true"
    >
      <span slot="title0010" style="color: #1890ff">sss</span>
    </a-tree>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        treeData:[
          {
            title: 'parent 1',
            key: '0-0',
            children: [
              {
                title: 'parent 1-0',
                key: '0-0-0'

              },
              {
                title: 'parent 1-1',
                key: '0-0-1'
              },
            ],
          },
        ],
        // replaceFields: {
        //   children: 'child',
        //   title: 'name',
        // },

      }
    },
    methods:{
      onCheck(checkedKeys, info) {
        console.log(this.treeData)
        // this.treeData[0].children[0].disabled=true
        // this.treeData[0].children[0].disableCheckbox=true
        // console.log('onCheck', checkedKeys, info);
      },
    }
  }
</script>


