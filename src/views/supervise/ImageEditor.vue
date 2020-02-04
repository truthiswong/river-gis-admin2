<template>
  <div id="wrapper">
    <div class="content">
      <div v-show="originalImageClicked" class="original_image">
        <img :src="imageOriginalUrl" alt />
      </div>
      <tui-image-editor v-show="!originalImageClicked" ref="tuiImageEditor" :options="options"></tui-image-editor>
    </div>
    <a-row class="image_footer" type="flex" justify="space-around">
      <a-col :span="3">
        <a-button @click="goBack" block>取消</a-button>
      </a-col>
      <a-col :span="3">
        <a-button @click="imageDelete" block>删除</a-button>
      </a-col>
      <a-col :span="3">
        <a-button block>
          原图
          <a-switch v-model="originalImageClicked" size="small" defaultChecked />
        </a-button>
      </a-col>
      <a-col :span="3">
        <a-button @click="imageSave" block>保存</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { phoneMediaEdit, dataDetails, phoneMediaRemove } from '@/api/login'

import 'tui-code-snippet'
import 'fabric'
import 'tui-image-editor'
// To use the basic UI, the svg files for the icons is required.
import 'tui-image-editor/dist/svg/icon-a.svg'
import 'tui-image-editor/dist/svg/icon-b.svg'
import 'tui-image-editor/dist/svg/icon-c.svg'
import 'tui-image-editor/dist/svg/icon-d.svg'

import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
const icona = require('tui-image-editor/dist/svg/icon-a.svg')
const iconb = require('tui-image-editor/dist/svg/icon-b.svg')
const iconc = require('tui-image-editor/dist/svg/icon-c.svg')
const icond = require('tui-image-editor/dist/svg/icon-d.svg')
//const bg = require('tui-image-editor/examples/img/bg.png')
var blackTheme = {
  // black or white
  // main icons
  'menu.normalIcon.path': icond,
  'menu.activeIcon.path': iconb,
  'menu.disabledIcon.path': icona,
  'menu.hoverIcon.path': iconc,
  'submenu.normalIcon.path': icond,
  'submenu.activeIcon.path': iconb
}

// import { ImageEditor } from '@toast-ui/vue-image-editor'
// var ImageEditor = require('tui-image-editor')
var locale_ru_RU = {
  // override default English locale to your custom
  // etc...
}

import ImageEditor from '@toast-ui/vue-image-editor/src/ImageEditor.vue'

import Vue from 'vue'
// token
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'ImageEditor',
  props: {
    msg: {
      id: '',
      defaultTime: '',
      url: ''
    }
  },
  data() {
    return {
      originalImageClicked: false,
      options: {
        loadImage: {
          path: require('../../assets/img/peopleIcon.png'),
          name: ''
        },
        locale: {
          crop: '裁剪',
          Delete: '删除',
          'Delete-all': '全删'
        },
        cssMaxWidth: 900,
        cssMaxHeight: 500,
        includeUI: {
          menu: ['crop', 'shape', 'draw', 'text'],
          theme: blackTheme
        }
      },
      imageUrl: require('../../assets/img/peopleIcon.png'),
      imageOriginalUrl: ''
    }
  },
  components: {
    'tui-image-editor': ImageEditor
  },
  computed: {},

  mounted() {
    dataDetails(this.msg.id).then(res => {
      this.imageOriginalUrl = res.data.media
    })
    this.imageUrl = this.msg.url
    let actions = this.$refs.tuiImageEditor.invoke('getActions')
    if (this.imageUrl && actions) {
      actions.main.initLoadImage(this.imageUrl, 'My sample image')
      this.$refs.tuiImageEditor.invoke('ui.activeMenuEvent')
    }
  },
  methods: {
    // 保存
    imageSave() {
      let base64Str = this.$refs.tuiImageEditor.invoke('toDataURL')
      let data = {
        id: this.msg.id,
        imgSuffix: 'png',
        base64image: base64Str
      }
      phoneMediaEdit(data)
        .then(res => {
          this.$message.success('编辑成功')
          this.$emit('saveImage')
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    base64UrlToBlob(urlData, type) {
      /*将base64转换成可用formdata提交的文件,urlData base64的url,type 0图片 1视频 */
      var bytes = window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: type == 0 ? 'image/png' : 'image/mp4' })
    },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 关闭弹窗
    goBack() {
      this.$emit('exitImage')
    },
    // 删除照片
    imageDelete() {
      phoneMediaRemove(this.msg.id)
        .then(res => {
          this.$message.success('删除成功')
          this.$emit('saveImage')
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    }
  }
}
</script>
<style lang="less" scoped>
#wrapper {
  position: absolute;
  top: 0;
  z-index: 1001;
  height: calc(100vh - 64px);
  width: 100vw;
  background: #1e1e1e;
  overflow: auto;
  .content {
    position: relative;
    height: calc(100% - 50px);
    width: 100%;
    .original_image {
      position: absolute;
      width: 500px;
      height: 500px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .image_footer {
    width: 100%;
    height: 40px;
    margin-top: 10px;
  }
}
</style>

