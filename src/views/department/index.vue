<template>
  <div class="container">
    <div class="app-container">
      <el-tree :data="data" :props="defaultProps" default-expand-all />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Department',
  data() {
    return {
      data: [{
        label: '传智教育',
        children: [{
          label: '总裁办'
        },
        {
          label: '行政部'
        },
        {
          label: '人事部',
          children: [
            { label: '财务核算部' },
            { label: '税务核算部' },
            { label: '薪资管理部' }
          ]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  }
}
</script>
<style>
.app-container{
  padding: 30px 140px;
  font-size: 30px;
}
</style>
