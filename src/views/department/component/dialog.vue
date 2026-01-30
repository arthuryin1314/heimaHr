<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="close">
    <el-form ref="addDeptForm" :model="form" :rules="rules">
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门编码" :label-width="formLabelWidth" prop="code">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="负责人" :label-width="formLabelWidth" prop="managerId">
        <el-select v-model="form.managerId" placeholder="请选择">
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门简介" :label-width="formLabelWidth" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" :rows="3" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="state.isAdd ? add() : edit()">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepartmentList, getManagetList, addNewDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      required: true
    },
    currentId: {
      type: Number,
      default: null
    },
    state: {
      type: Object,
      required: true
    }
  },
  data() {
    const defaultForm = {
      name: '',
      code: '',
      managerId: '',
      managerName: '',
      introduce: '',
      pid: '',
      createTime: '',
      id: ''
    }
    return {
      managerList: [],
      value: '',
      defaultForm,
      form: { ...defaultForm },
      formLabelWidth: '80px',
      rules: {
        name: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              let result = await getDepartmentList()
              if (this.state.isEdit) {
                result = result.filter(item => item.id !== this.currentId)
              }
              if (result.some(item => item.name === value)) {
                callback(new Error('部门名称已存在'))
              } else {
                callback()
              }
            }
          }
        ],
        code: [
          {
            required: true,
            message: '请输入部门编码',
            trigger: 'blur'
          },
          {
            min: 2, max: 10, message: '部门编码的长度为2-10个字符', trigger: 'blur'
          }
        ],
        managerId: [
          {
            required: true,
            message: '请输入负责人姓名',
            trigger: 'change'
          }
        ],
        introduce: [
          {
            required: true,
            message: '请输入部门简介',
            trigger: 'blur'
          },
          {
            min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      if (this.state.isAdd) {
        return '添加子部门'
      } else if (this.state.isEdit) {
        return '编辑部门'
      }
      return ''
    }
  },
  created() {
    this.getMangerList()
  },
  methods: {
    add() {
      this.$refs.addDeptForm.validate(async isOk => {
        if (isOk) {
          const payload = { ...this.form, pid: this.currentId }
          delete payload.id
          delete payload.createTime
          await addNewDepartment(payload)
          this.$message.success('添加成功')
          this.$emit('update')
          this.close()
        }
      })
    },
    edit() {
      this.$refs.addDeptForm.validate(async isOk => {
        if (isOk) {
          const res = await updateDepartment(this.form)
          console.log(res)

          this.$message.success('编辑成功')
          this.$emit('update')
          this.close()
        }
      })
    },
    close() {
      this.$refs.addDeptForm.resetFields()
      this.form = { ...this.defaultForm }
      this.$emit('update:dialogFormVisible', false)
    },
    async getMangerList() {
      this.managerList = await getManagetList()
    },
    async getDepartmentDetail() {
      const detail = await getDepartmentDetail(this.currentId)
      console.log(detail)
      this.form = { ...this.defaultForm, ...detail }
    }
  }
}
</script>

<style></style>
