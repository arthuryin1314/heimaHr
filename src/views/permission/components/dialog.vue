<template>
  <el-dialog title="新增权限" :visible="dialogFormVisible" @close="handleClose">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="权限名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限标识" :label-width="formLabelWidth">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限描述" :label-width="formLabelWidth">
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否启用" :label-width="formLabelWidth">
        <el-switch
          v-model="form.enVisible"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item></el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="btnOk">确 定</el-button>
    </div>
  </el-dialog></template>

<script>
import { addPermission, updatePermission } from '@/api/permission'
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    rules: {
      type: Object,
      required: true
    },
    formLabelWidth: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogFormVisible', false)
      //   this.$refs.form.resetFields()
      this.$emit('resetForm')
    },
    btnOk() {
      this.$refs.form.validate(async isok => {
        if (isok) {
          const payload = {
            ...this.form,
            enVisible: this.form.enVisible ? 1 : 0
          }
          if (this.form.id) {
            await updatePermission(payload)
            this.$emit('addPermission')
            this.handleClose()
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          } else {
            await addPermission(payload)
            this.$emit('addPermission')
            this.handleClose()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
        } else {
          this.$message({
            message: '请完善表单信息',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
