<template>
  <a-modal
    title="图片展示"
    :width="980"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :centered="true"
    :mask="false"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <div class="content">
        <tui-image-editor ref="tuiImageEditor" :options="options"></tui-image-editor>
        <!-- <tui-image-editor :include-ui="useDefaultUI" :options="options"></tui-image-editor> -->
      </div>
      <a-divider orientation="left"></a-divider>
      <a-row style="width:100%; margin-top:10px;" type="flex" justify="space-around">
        <a-col :span="3">
          <a-button block>
            原图
            <a-switch size="small" defaultChecked />
          </a-button>
        </a-col>
        <a-col :span="3">
          <a-button block>保存</a-button>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
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

export default {
  props: {
    msg: {
      isShow: {
        type: Boolean,
        default: false
      }
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,

      useDefaultUI: true,
      options: {
        loadImage: {
          path: require('../../../assets/loginBg.jpg'),
          name: ''
        },
        locale: {
          crop: '裁剪',
          Delete: '删除',
          'Delete-all': '全删'
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        includeUI: {
          menu: ['crop', 'shape', 'draw', 'text'],
          theme: blackTheme
        }
      },
      imageUrl: require('../../../assets/loginBg.jpg')
    }
  },
  components: {
    'tui-image-editor': ImageEditor
  },
  computed: {},
  mounted() {
    // var locale_ru_RU = {
    //   // override default English locale to your custom
    //   Crop: '裁剪',
    //   'Delete-all': '全删'
    //   // etc...
    // }

    // var instance = new ImageEditor(document.querySelector('#tui-image-editor'), {
    //   includeUI: {
    //     loadImage: {
    //       path: '../../../assets/loginBg.jpg',
    //       name: 'SampleImage'
    //     },
    //     locale: locale_ru_RU,
    //     theme: blackTheme, // or whiteTheme
    //     initMenu: 'filter',
    //     menuBarPosition: 'bottom'
    //   },
    //   cssMaxWidth: 700,
    //   cssMaxHeight: 500,
    //   selectionStyle: {
    //     cornerSize: 20,
    //     rotatingPointOffset: 70
    //   }
    // })
    // this.$refs.tuiImageEditor.invoke('startDrawingMode', 'FREE_DRAWING', {
    //   width: 10,
    //   color: 'rgba(255, 0, 0, 0.5)'
    // })
    // var instance = new ImageEditor(document.querySelector('#tui-image-editor'), {
    //   includeUI: {
    //     loadImage: {
    //       path: '../../../assets/loginBg.jpg',
    //       name: 'SampleImage'
    //     },
    //     theme: blackTheme, // or whiteTheme
    //     menu: ['shape', 'filter'],
    //     initMenu: 'filter',
    //     uiSize: {
    //       width: '1000px',
    //       height: '700px'
    //     },
    //     menuBarPosition: 'bottom'
    //   },
    //   cssMaxWidth: 700,
    //   cssMaxHeight: 500,
    //   selectionStyle: {
    //     cornerSize: 20,
    //     rotatingPointOffset: 70
    //   }
    // })
  },
  methods: {
    // 裁剪
    clipImage() {},
    // 上一步
    lastStep() {},
    init() {
      // var canvas = document.getElementById('canvasId')
      // var context = canvas.getContext('2d')
      // //加载图片
      // var image = new Image()
      // image.src = require('../../../assets/loginBg.jpg')
      // image.onload = function() {
      //   context.beginPath()
      //   //画裁剪区域，此处以圆为例
      //   // context.arc(50, 50, 50, 0, 2 * Math.PI)
      //   // context.clip() //次方法下面的部分为待剪切区域，上面的部分为剪切区域
      //   context.drawImage(image, 0, 0, canvas.width, canvas.height)
      // }
      // let image = document.getElementById('image')
      // var cropper = new Cropper(image, {
      //   aspectRatio: 16 / 9,
      //   viewMode: 1,
      //   crop: function(e) {
      //     console.log(e.detail.x)
      //     console.log(e.detail.y)
      //     console.log(e.detail.width)
      //     console.log(e.detail.height)
      //     console.log(e.detail.rotate)
      //     console.log(e.detail.scaleX)
      //     console.log(e.detail.scaleY)
      //   }
      // })
    },
    // 显示弹窗
    showVisible() {
      this.visible = true
      // new ImageEditor(document.querySelector('#tui-image-editor'), {
      //   includeUI: {
      //     loadImage: {
      //       path: require('../../../assets/loginBg.jpg'),
      //       name: 'SampleImage'
      //     },
      //     menu: ['shape', 'filter'],
      //     initMenu: 'filter',
      //     uiSize: {
      //       width: '1000px',
      //       height: '700px'
      //     },
      //     menuBarPosition: 'bottom'
      //   }
      // })
    },
    // 关闭弹窗
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 450px;
  position: relative;
  #canvasId {
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
