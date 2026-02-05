<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="params.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="search"
        />
        <el-tree
          ref="tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          node-key="id"
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployeeData">excel导出</el-button>
        </el-row>
        <el-table :data="tableData" style="width: 100%" :default-sort="{ prop: 'timeOfEntry', order: 'descending' }">
          <el-table-column prop="staffPhoto" label="头像" width="100">
            <template slot-scope="{ row }">
              <img :src="row.staffPhoto" alt="" style="width: 32px; height: 32px; border-radius: 50%;">
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" width="180" />
          <el-table-column prop="mobile" label="手机" :formatter="formatter" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template slot-scope="{ row }">
              <span>{{ row.formOfEmployment == 1 ? '正式' : '非正式' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="table-actions">
                <el-button type="text" size="small" @click="$router.push(`/employee/detail/${scope.row.id}`)">
                  查看
                </el-button>
                <el-button type="text" size="small" @click="assignRoles(scope.row.id)">
                  角色
                </el-button>
                <el-popconfirm
                  confirm-button-text="好的"
                  cancel-button-text="不用了"
                  icon="el-icon-info"
                  icon-color="red"
                  title="这是一段内容确定删除吗？"
                  @onConfirm="btnDel(scope.row)"
                >
                  <el-button slot="reference" type="text" size="small">
                    删除
                  </el-button>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible.sync="showRoleDialog" title="分配角色">
          <!-- 弹层内容 -->
          <!-- checkbox -->
          <el-checkbox-group v-model="roleIds">
            <!-- 放置n个的checkbox  要执行checkbox的存储值 item.id-->
            <el-checkbox
              v-for="item in roleList"
              :key="item.id"
              :label="item.id"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="btnRoleOK">确 定</el-button>
            <el-button @click="showRoleDialog = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="changePage($event)"
        />
      </div>
    </div>
    <importExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
  </div>
</template>

<script>
import importExcel from './components/dialog.vue'
import { saveAs } from 'file-saver'
import { debounce } from 'lodash'
import { getDepartmentList } from '@/api/department'
import { getEmployeeList, exportEmployeeData, delEmployee, assignRoles, getEmployeeDetail, assignRole } from '@/api/employee'
import { transListToTreeData } from '@/utils/index'
export default {
  name: 'Employee',
  components: {
    importExcel
  },
  data() {
    return {
      data: [],
      roleList: [],
      roleIds: [],
      showRoleDialog: false,
      currentUserId: null,
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      total: 0,
      params: {
        departmentId: '',
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      tableData: [
      ],
      showExcelDialog: false
    }
  },
  created() {
    this.getDepartmentList()
    this.debouncedSearch = debounce(() => {
      this.params.page = 1
      this.getEmployeeList()
    }, 500)
  },
  methods: {
    async getDepartmentList() {
      this.data = transListToTreeData(await getDepartmentList(), 0)
      // console.log(this.data[0])
      this.params.departmentId = this.data[0].id
      // console.log(this.params.departmentId)
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.params.departmentId)
      })
      this.getEmployeeList()
    },
    selectNode(node) {
      // console.log(node)
      this.params.departmentId = node.id
      this.getEmployeeList()
    },
    formatter(row, column, cellValue) {
      return cellValue
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.params)
      this.tableData = rows
      this.total = total
    },
    changePage(page) {
      // console.log(page)
      this.params.page = page
      this.getEmployeeList()
    },
    search() {
      // console.log(this.params.keyword)
      this.debouncedSearch()
    },
    async exportEmployeeData() {
      const res = await exportEmployeeData()
      // console.log(res)
      saveAs(res, '员工信息.xlsx')
    },
    async btnDel(row) {
      // console.log(row)
      await delEmployee(row.id)
      if (this.data.length === 1 && this.queryParams.page > 1) this.params.page--
      this.getEmployeeList()
    },
    async assignRoles(id) {
      console.log(id)
      this.currentUserId = id
      this.showRoleDialog = true
      this.roleList = await assignRoles()
      // console.log(this.roleList)
      const detail = await getEmployeeDetail(id)
      this.roleIds = detail.roleIds
    },
    async  btnRoleOK() {
      await assignRole({
        id: this.currentUserId,
        roleIds: this.roleIds
      })
      this.$message.success('分配用户角色成功')
      this.showRoleDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;

  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .opeate-tools {
      margin: 10px;
    }

    .table-actions {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      min-height: 24px;
    }

    .pagination {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
