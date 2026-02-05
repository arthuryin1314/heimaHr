<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary" @click="openAddRoot">添加权限</el-button>
      <el-table default-expand-all :data="list" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" size="mini" type="text" @click="add(row)">添加</el-button>
            <el-button size="mini" type="text" @click="edit(row)">编辑</el-button>
            <el-button size="mini" type="text" @click="deletePermission(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialog
      :dialog-form-visible.sync="dialogFormVisible"
      :form="form"
      :rules="rules"
      :form-label-width="formLabelWidth"
      @addPermission="addPermission"
      @resetForm="resetForm"
    />
  </div>
</template>
<script>
import Dialog from './components/dialog.vue'
import { getPermissionList, delPermission, getDetail } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  components: {
    Dialog
  },
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      form: {
        name: '',
        code: '',
        description: '',
        enVisible: false,
        pid: 0,
        type: 1
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          {
            trigger: 'blur', validator: (rule, value, callback) => {
              const exists = this.list.some(item => item.name === value)
              if (exists) {
                callback(new Error('权限名称已存在'))
              } else {
                callback()
              }
            }
          }
        ],
        code: [
          { required: true, message: '请输入权限标识', trigger: 'blur' },
          {
            trigger: 'blur', validator: (rule, value, callback) => {
              const exists = this.list.some(item => item.code === value)
              if (exists) {
                callback(new Error('权限标识已存在'))
              } else {
                callback()
              }
            }
          }
        ], description: [
          { required: true, message: '请输入权限描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), 0) // 将列表数据转化成树形结构
    },
    async addPermission() {
      this.getPermissionList()
    },
    resetForm() {
      this.form = {
        name: '',
        code: '',
        description: '',
        enVisible: false,
        pid: 0,
        type: 1
      }
    },
    openAddRoot() {
      this.resetForm()
      this.dialogFormVisible = true
    },
    async add(row) {
      this.resetForm()
      this.dialogFormVisible = true
      this.form.pid = row.id
      this.form.type = 2
    },
    async edit(row) {
      this.dialogFormVisible = true
      const detail = await getDetail(row)
      this.form = {
        ...detail,
        enVisible: detail.enVisible === 1
      }
    },
    async deletePermission(row) {
      await delPermission(row)
      this.getPermissionList()
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>
