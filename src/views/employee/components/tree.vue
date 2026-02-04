<template>
  <el-cascader
    :options="options"
    :props="props"
    @change="changeId"
  />
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      options: [],
      props: {
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      const options = transListToTreeData(await getDepartmentList(), 0)
      //   console.log(options)
      this.options = options
    },
    changeId(list) {
    //   console.log(value)
    //   this.$emit('input', list[-1])
      if (list.length > 0) {
        this.$emit('input', list[list.length - 1])
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>

<style>

</style>
