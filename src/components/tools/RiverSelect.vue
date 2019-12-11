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
    // this.$store.commit('show','5555')
  },
  methods: {
    onChange(value) {
      // this.$store.commit('show',value)
      console.log(value)
    }
  }
}
</script>