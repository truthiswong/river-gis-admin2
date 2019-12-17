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
  projectMineList
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
      projectMineList().then(res=>{
        var arr = res.data
        console.log(arr);
        
      })
    },
    onChange(value) {
      console.log(this.$route.path);
      this.$store.commit('show','123123123')
      this.$router.push({
        path: this.$route.path,
        query: {
          id: value
        }
      })
     
      console.log(value)
    }
  }
}
</script>