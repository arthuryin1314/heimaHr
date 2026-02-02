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
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
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
              <span>{{ row.formOfEmployment==1?'正式':'非正式' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作">
            <template>
              <el-button type="text" size="small">
                查看
              </el-button>
              <el-button type="text" size="small">
                角色
              </el-button>
              <el-button type="text" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="changePage($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getDepartmentList } from '@/api/department'
import { getEmployeeList } from '@/api/employee'
import { transListToTreeData } from '@/utils/index'
export default {
  name: 'Employee',
  data() {
    return {
      data: [],
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
      ]
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
