<template>
  <div class="container">
    <div class="page-header">
      <div class="page-title">角色管理</div>
      <el-button type="primary" @click="addRole">添加角色</el-button>
    </div>
    <div class="table-card">
      <el-table :data="tableData" style="width: 100%" fit>
        <el-table-column label="角色" min-width="200" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- 修复1：绑定输入框值 + 包裹所有非编辑状态的元素 -->
            <template v-if="scope.row.isEdit">
              <el-input v-model="scope.row.rowEdit.name" placeholder="请输入角色名称" />
            </template>
            <template v-else>
              <i class="el-icon-user-solid" />
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </template></el-table-column>
        <el-table-column label="启用" min-width="140" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch
              v-if="scope.row.isEdit"
              v-model="scope.row.rowEdit.state"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
            <span v-else style="margin-left: 10px">{{ scope.row.state === 1 ? '已启用' : '已禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="260" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit"
              v-model="scope.row.rowEdit.description"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
            <span v-else style="margin-left: 10px">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="240" header-align="center" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <el-button type="primary" @click="btnEditOk(scope.row)">保存</el-button>
              <el-button type="danger" @click="scope.row.isEdit=false">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="primary">分配权限</el-button>
              <el-button size="mini" type="info" class="btn-edit-gap" @click="btnEdit(scope.row)">编辑</el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="del(scope.row.id)"
              >
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </template>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageParams.total"
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          @current-change="handlePageChange"
        />
      </div>
      <el-dialog title="新增角色" :visible.sync="isAddShow" custom-class="role-dialog" width="520px">
        <el-form ref="addForm" :model="addForm" label-width="90px" class="role-dialog-form" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="addForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="启用" class="switch-row">
            <el-switch
              v-model="addForm.state"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="addForm.description" type="textarea" :rows="3" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer role-dialog-footer">
          <el-button type="primary" @click="btnOk">确 定</el-button>
          <el-button @click="close">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, delRole } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      tableData: [],
      pageParams: {
        pagesize: 5,
        total: 0,
        page: 1
      },
      isAddShow: false,
      addForm: {
        name: '',
        state: 1,
        description: ''

      },
      rules: {
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '角色描述不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const res = await getRoleList(this.pageParams)
      // console.log(res)
      this.tableData = res.rows
      this.pageParams.total = res.total
      this.tableData.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'rowEdit', {
          name: item.name,
          description: item.description,
          state: item.state
        })
      })
    },
    handlePageChange(page) {
      this.pageParams.page = page
      this.getRoleList({
        page: this.pageParams.page,
        pagesize: this.pageParams.pagesize
      })
    },
    addRole() {
      this.isAddShow = true
    },
    btnOk() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          // 提交表单
          await addRole(this.addForm)
          this.getRoleList()
          this.close()
          // console.log(res)
          this.$message.success('添加成功')
        }
      })
    },
    close() {
      this.$refs.addForm.resetFields()
      this.isAddShow = false
    },
    btnEdit(row) {
      // console.log('编辑', row)
      row.isEdit = true
      row.rowEdit.name = row.name
      row.rowEdit.description = row.description
      row.rowEdit.state = row.state
    },
    async btnEditOk(row) {
      if (row.rowEdit.name && row.rowEdit.description) {
        console.log(row)
        await updateRole({
          ...row.rowEdit,
          id: row.id
        })
        Object.assign(row, {
          name: row.rowEdit.name,
          description: row.rowEdit.description,
          state: row.rowEdit.state,
          isEdit: false
        })
        this.$message.success('更新成功')
      } else {
        this.$message.error('角色名称或描述不能为空')
      }
    },
    async del(id) {
      // console.log('删除', id)
      await delRole(id)
      if (this.tableData.length === 1 && this.pageParams.page > 1) {
        this.pageParams.page--
      }
      this.getRoleList()
      this.$message.success('删除成功')
    }
  }
}
</script>

<style scoped>
.container {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(16, 24, 40, 0.06);
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.2px;
}

.table-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(16, 24, 40, 0.06);
  padding: 8px 12px 16px;
}

.switch-row {
  margin-top: 10px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 4px 0;
}

.btn-edit-gap {
  margin-right: 8px;
}

::v-deep .role-dialog .el-dialog__header {
  padding: 16px 20px 0;
}

::v-deep .role-dialog .el-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

::v-deep .role-dialog .el-dialog__body {
  padding: 16px 20px 4px;
}

.role-dialog-form {
  display: grid;
  gap: 8px;
}

::v-deep .role-dialog .el-form-item {
  margin-bottom: 0;
}

::v-deep .role-dialog .el-form-item__label {
  color: #606266;
}

.switch-row ::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
  min-height: 32px;
}

::v-deep .role-dialog .el-textarea__inner,
::v-deep .role-dialog .el-input__inner {
  border-radius: 6px;
}

.role-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 4px 20px 16px;
}

::v-deep .el-table {
  border-radius: 8px;
}

::v-deep .el-table th {
  background: #f5f7ff;
  color: #303133;
  font-weight: 600;
}

::v-deep .el-table td {
  color: #606266;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
