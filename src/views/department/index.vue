<template>
  <div class="container">
    <div class="app-container">
      <el-tree
        class="dept-tree"
        :data="data"
        :props="treeProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span class="node-name">
            <span class="node-label">{{ node.label }}</span>
          </span>
          <span class="node-meta">
            <span class="node-role">{{ data.managerName }}</span>
            <el-dropdown @command="handleCommand($event,data.id)">
              <span class="el-dropdown-link node-action">
                编辑<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </div>
    <DialogForm :dialog-form-visible.sync="dialogFormVisible" :current-id="currentId" @update="getDepartmentData" />
  </div>
</template>
<script>
import { getDepartmentList } from '@/api/department'
import { transListToTreeData } from '@/utils/index.js'
import DialogForm from './component/dialog.vue'
export default {
  name: 'Department',
  components: { DialogForm },
  data() {
    const data = []

    return {
      data: JSON.parse(JSON.stringify(data)),
      treeProps: {
        label: 'name',
        children: 'children'
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getDepartmentData()
  },
  methods: {
    async getDepartmentData() {
      const res = await getDepartmentList()
      // console.log(res)
      this.data = transListToTreeData(res, 0)
      console.log(this.data)
    },
    handleCommand(command, id) {
      if (command === 'add') {
        this.dialogFormVisible = true
        this.currentId = id
        // console.log(command, id)
      }
    }
  }
}
</script>
<style>
.app-container {
  padding: 24px 32px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(16, 24, 40, 0.06);
}

.custom-tree-node {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-radius: 6px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.custom-tree-node:hover {
  background: #f5f7ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.12);
}

.node-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-label {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.node-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #606266;
  font-size: 13px;
}

.node-role {
  color: #409eff;
  background: rgba(64, 158, 255, 0.08);
  padding: 2px 8px;
  border-radius: 999px;
}

.node-action {
  cursor: pointer;
  color: #606266;
  font-size: 13px;
  padding: 4px 6px;
  border-radius: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.node-action:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.08);
}

.el-tree-node__content {
  height: auto;
  padding: 0 !important;
}

.el-tree-node__content>.el-tree-node__expand-icon {
  margin-left: 8px;
}

.dept-tree {
  border-radius: 8px;
}

.dept-tree .el-tree-node__content {
  margin: 4px 0;
}

@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }

  .custom-tree-node {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .node-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
