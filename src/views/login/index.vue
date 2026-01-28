<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <el-form ref="form" :model="ruleForm" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="ruleForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="isChecked">
            <el-checkbox v-model="ruleForm.isChecked">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="loginCheck">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        password: '1234567',
        mobile: '13800000003',
        isChecked: false
      },
      rules: {
        password: [
          {
            trigger: 'blur',
            required: true,
            message: '请输入密码'
          },
          {
            min: 6,
            max: 20,
            message: '密码长度在6-20个字符之间',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            trigger: 'blur',
            required: true,
            message: '请输入手机号'
          },
          {
            trigger: 'blur',
            pattern: /^1\d{10}$/,
            message: '请输入11位手机号'
          }
        ],
        isChecked: [
          {
            trigger: 'change',
            type: 'boolean',
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请同意用户平台使用协议'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    async loginCheck() {
      this.$refs.form.validate(async isOk => {
        if (!isOk) return
        try {
          await this.$store.dispatch('user/login', {
            mobile: this.ruleForm.mobile,
            password: this.ruleForm.password
          })
          this.$message.success('登录成功')
          this.$router.push({ path: '/' })
        } catch (err) {
          // 错误提示由响应拦截器统一弹出
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>
