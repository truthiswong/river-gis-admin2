<template>
  <a-cascader
    style="display:inline-block;"
    placeholder="项目选择"
    :options="options"
    @change="onChange"
    v-model="defautOption"
    changeOnSelect
  />
</template>
<script>
import { projectMinesTructure } from '@/api/login'
export default {
  data() {
    return {
      list: [],
      options: [],
      defautOption: [] || this.$store.defautProject
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      projectMinesTructure().then(res => {
        var arr = res.data
        arr.forEach(v => {
          if (v.children == null) {
            v.children = []
          }
          v.value = v.id
          v.label = v.name
          v.code = '1'
          v.children.forEach(a => {
            if (a.children == null) {
              a.children = []
            }
            a.value = a.id
            a.label = a.name
            a.code = '2'
          })
        })
        this.options = arr
        if (this.$store.state.defautProject.length > 0) {
          this.defautOption = this.$store.state.defautProject
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].children.length > 0) {
              this.defautOption.push(arr[i].id)
              this.defautOption.push(arr[i].children[0].id)
              break
            }
          }
        }
      })
    },
    onChange(value) {
      if (value.length > 1) {
        let id = ''
        if (value[1] == this.$route.query.id) {
          id = value[1] + '1'
        } else {
          id = value[1]
        }
        this.$store.commit('show', value[1])
        this.$store.commit('SET_DEFAUT_PROJECT', value)
        this.$router.push({
          path: this.$route.path,
          query: {
            id: id
          }
        })
      } else {
        this.list = []
        this.$message.warning('请至少选择到项目')
      }
    }
  }
}
</script>