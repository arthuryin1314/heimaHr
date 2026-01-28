<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name.charAt(2) }}</span>
          <span>{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/arthuryin1314/heimaHr">
            <el-dropdown-item>Github仓库</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="revisePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="outerVisible" append-to-body>
      <el-form ref="passForm" :model="passForm" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      outerVisible: false,
      passForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在6-16位之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.passForm.newPassword !== value) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            }
          }

        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'password'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    revisePassword() {
      this.outerVisible = true
      // console.log(this.password)
      if (this.password) {
        this.passForm.oldPassword = this.password
      }
    },
    btnOk() {
      this.$refs.passForm.validate(async isOk => {
        if (isOk) {
          await updatePassword({
            oldPassword: this.passForm.oldPassword,
            newPassword: this.passForm.newPassword
          })
          this.$refs.passForm.resetFields()
          this.$message.success('密码修改成功，请重新登录')
          this.btnCancel()
          this.logout()
        }
      })
    },
    btnCancel() {
      this.$refs.passForm.resetFields()
      this.outerVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 4px;
        border-radius: 6px;
        transition: background .2s ease;

        &:hover {
          background: rgba(0, 0, 0, .03);
        }
        .username {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 16px;
          color: #303133;
          border-radius: 50%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 20px;
          background-color: aqua;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 1px 3px rgba(0, 0, 0, .12);
        }

        span {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 20px;
        }

        .el-icon-setting {
          color: #909399;
          font-size: 32px;
          transition: color .2s ease, transform .2s ease;
        }

        &:hover .el-icon-setting {
          color: #409EFF;
          transform: rotate(15deg);
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
