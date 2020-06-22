<template>
  <a-modal
    :visible="visible"
    :footer="null"
    :width="510"
    @cancel="cmtHandle"
    :maskClosable="false"
    class="cmModal custom_modal"
  >
    <template slot="closeIcon">
      <a-icon type="close-circle" />
    </template>
    <template slot="title">
      <div>外勤反馈</div>
      <!-- <span style="background-color:#EBF5FF;border:1px solid #e8e8e8;border-radius: 50%;padding:8px 10px;">张</span> -->
    </template>
    <div style="font-size:14px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;color:rgba(82,90,111,1);margin-bottom:10px">经度：{{lng}},纬度：{{lat}}</div>
    <div  v-for="item in list" :key="item.id" style="margin-bottom:10px">
      <div style="display:flex;">
        <img src="../img/head.png" alt="" style="width:30px;height:30px">
        <div class="nameTime">
          <span style="width: 50px;padding: 0px;margin: 0px;color: rgb(0, 0, 0);">{{item.creator.name}}</span>
          <span style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(188,190,199,1);">{{item.date}}</span>
        </div>
      </div>
      <!-- <div style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(188,190,199,1);line-height:26px;">{{item.date}}</div> -->
      <div style="display:flex;margin-left:32px">
        <!-- <div style="font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(82,90,111,1);line-height:26px;width:70px">{{item.creator.name}}</div> -->
        <div style="">
            <div style="font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(82,90,111,1);line-height:26px;margin-bottom:10px">内容：{{item.remark}}</div>
            <div style="width:393px">
              <viewer >
                <img :src="item.media" alt style="height:200px" v-show="item.mediaType=='image'"/>
              </viewer>
              <a-button @click="audioBut(item.media)" v-show="item.mediaType=='audio'">播放</a-button>
            </div>
        </div>
      </div>
      <!-- <div class="header">{{item.remark}}</div>
      <div class="player">
        <img :src="item.media" alt style="width:100%" v-show="item.mediaType.code=='image'"/>
        <a-button @click="audioBut(item.media)" v-show="item.mediaType.code!='image'">播放</a-button>
      </div> -->
    </div>
  </a-modal>
</template>
<script>
import { dataManual } from '@/api/login'
import BenzAMRRecorder from 'benz-amr-recorder'
export default {
  name: '',
  data() {
    return {
      lng:'',
      lat:'',
      visible: false,
      audioSHow:false,
      playerOptions: {
        height: '360',
        autoplay: false,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            // mp4
            src: 'http://vjs.zencdn.net/v/oceans.mp4'
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ],
        poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg'
      },
      list: []
    }
  },
  mounted() {
    setTimeout(() => {
      console.log('dynamic change options', this.player)
      // this.player.muted(false)
    }, 5000)
  },
  computed: {
    player() {
      // return this.$refs.videoPlayer.player
    }
  },
  methods: {
    audioBut(item){
      var amr = new BenzAMRRecorder();
      amr.initWithUrl(item).then(function() {
        // amr.isPlaying() 返回音频的播放状态 是否正在播放 返回boolean类型
        console.log(amr.isPlaying())
        if(amr.isPlaying()){
          amr.stop();
        } else {
          amr.play();
        }
      });
    },
    show(index, picker) {
      this.lng = index.target.options.coordinate.lng
      this.lat = index.target.options.coordinate.lat
      var data = {
        projectId: this.$store.state.id,
        coordinate: index.target.options.coordinate.lng + ',' + index.target.options.coordinate.lat,
        radius: '0.05',
        // year: '2019',
        // month: '11',
        // day: '28'
        year: picker[0],
        month: picker[1],
        day: picker[2]
      }
      dataManual(data).then(res => {
        let arr = res.data.data
        console.log(arr);
        
        arr.forEach(v => {
          // v.creator ={
          //   code: "9",
          //   mobile: "18861125267",
          //   name: "邵超"
          // }
          if (v.mediaType) {
            v.mediaType = v.mediaType.code
          }else{
            v.mediaType = ''
          }
        });  
        this.list = arr
        // if (arr.length>0) {
        //   arr.forEach(v => {
            
        //   });  
        // }
      })

      this.visible = true
    },
    cmtHandle() {
      this.list = []
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.cmModal .ant-modal-content .ant-modal-body {
  padding: 10px;
}
.header {
  margin-bottom: 15px;
}
.player {
  width: 100%;
  height: 100%;
}
.video-player {
  width: 100%;
}
.nowdate {
  text-align: right;
}
.nameTime{
  margin-left:12px;
  height: 43px;
  width: 200px;
  font-size: 12px;
  display: flex;
  // position: relative;
}
</style>
