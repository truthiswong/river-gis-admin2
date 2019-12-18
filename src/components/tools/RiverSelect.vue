<template>
  <a-cascader
    style="display:inline-block;"
    placeholder="项目选择"
    :options="options"
    @change="onChange"
    v-model="list"
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
      list:[],
      options: [

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
      }else{
        this.list =[]
        this.$message.warning('请至少选择到项目');
      }
    }
  }
}
</script>