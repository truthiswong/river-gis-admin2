<template>
  <a-cascader
    style="display:inline-block;"
    placeholder="项目选择"
    :options="options"
    @change="onChange"
    changeOnSelect
  /> 
</template>
<script>
import {
  projectMinesTructure
} from '@/api/login'
export default {
  data() {
    return {
      options: [
        {
          value: '上海',
          label: '上海',
          children: [
            {
              value: '浦东新区',
              label: '浦东新区'
            },
            {
              value: '闵行区',
              label: '闵行区'
            },
            {
              value: '徐汇区',
              label: '徐汇区'
            }
          ]
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.getList()
    // this.$store.commit('show','5555')
  },
  methods: {
    getList(){
      projectMinesTructure().then(res=>{
        var arr = res.data
        arr.forEach(v => {
          if (v.children == null) {
            v.children =[]
          }
          v.value =v.id
          v.label = v.name
          v.code ='1'
          v.children.forEach(a => {
            if (a.children == null) {
              a.children =[]
            }
            a.value =a.id
            a.label = a.name
            a.code ='2'
          })
        })
        console.log(arr);
        
        this.options = arr
      })
    },
    onChange(value) {
      if (value.length>1) {
        // console.log(value)
        // console.log(this.$route.path);
        this.$store.commit('show',value[1])
        this.$router.push({
          path: this.$route.path,
          query: {
            id: value[1]
          }
        })
      }
      
     
      
    }
  }
}
</script>