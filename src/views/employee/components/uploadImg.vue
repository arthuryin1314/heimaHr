<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadRequest"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: this.value
    }
  },
  watch: {
    value(newVal) {
      this.imageUrl = newVal
    }
  },
  methods: {
    uploadRequest(params) {
      console.log(params.file)
      const secretId = process.env.VUE_APP_COS_SECRET_ID
      const secretKey = process.env.VUE_APP_COS_SECRET_KEY
      const bucket = process.env.VUE_APP_COS_BUCKET
      const region = process.env.VUE_APP_COS_REGION

      if (!secretId || !secretKey || !bucket || !region) {
        this.$message.error('未配置 COS 环境变量')
        return
      }

      const cos = new COS({
        SecretId: secretId,
        SecretKey: secretKey
      })
      cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: params.file.name,
        StorageClass: 'STANDARD',
        Body: params.file
      }, (err, data) => {
        if (err) {
          this.$message.error('上传失败：' + (err.message || '未知错误'))
          return
        }

        // 2. 再判断成功（此时 data 一定存在）
        if (data && data.statusCode === 200 && data.Location) {
          // 注意你少了个冒号：https://
          const url = 'https://' + data.Location
          this.imageUrl = url
          this.$emit('input', url)
        } else {
          this.$message.error('上传失败（返回异常）')
        }
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG、PNG、GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
