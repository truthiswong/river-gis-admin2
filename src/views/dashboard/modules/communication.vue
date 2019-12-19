<template>
     <a-modal :visible="visible" :footer="null" @cancel="cmtHandle" :width="400" class="cmModal">
        <template slot="title">
            <div>外勤反馈</div>
            <!-- <span style="background-color:#EBF5FF;border:1px solid #e8e8e8;border-radius: 50%;padding:8px 10px;">张</span> -->
        </template>
        <div style="margin-top:20px;border-top:1px solid #e8e8e8;" v-for="item in list" :key="item.id">
            <div class="header">
                <a-row>
                    <a-col :span="8">
                        <span style="background-color:#EBF5FF;border:1px solid #e8e8e8;border-radius: 50%;padding:8px 10px;">{{item.creator.name}}</span>
                    </a-col>
                    <a-col :span="16" class="nowdate">
                        <div>{{item.date}}</div>
                    </a-col>
                </a-row>
            </div>
            <div class="header">{{item.remark}}</div>
            <div class="player">
                <!-- <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :options="item.playerOptions" :playsinline="true"></video-player> -->
                <img :src="item.media" alt="" style="width:100%">
                <audio :src="item.media" controls="controls"></audio>
            </div>
        </div>
        <!-- <div style="margin-top:20px;border-top:1px solid #e8e8e8;">
            <div class="header">
                <a-row>
                    <a-col :span="8">
                        <span style="background-color:#EBF5FF;border:1px solid #e8e8e8;border-radius: 50%;padding:8px 10px;">张</span>
                    </a-col>
                    <a-col :span="16" class="nowdate">
                        <div>2019-9-9 15:00</div>
                    </a-col>
                </a-row>
            </div>
            <div class="audio">
                <audio src="https://www.w3school.com.cn/i/horse.ogg" controls="controls"></audio>
            </div>
        </div>  -->
    </a-modal>
</template>
<script>
import { dataManual} from '@/api/login'
export default {
    name:'',
    data(){
        return{
            visible:false,
            playerOptions: {
                height: '360',
                autoplay:false,
                muted: true,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: "video/mp4",
                    // mp4
                    src: "http://vjs.zencdn.net/v/oceans.mp4",
                    // webm
                    // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                }],
                poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg",
            },
            list:[]
        }
    },
     mounted(){
        setTimeout(() => {
            console.log('dynamic change options', this.player)
            // this.player.muted(false)
        },5000)
    },
    computed:{
        player(){
            // return this.$refs.videoPlayer.player
        }
    },
    methods:{
        show(index,picker){
            var data = {
                projectId: this.$store.state.id,
                coordinate:index.target.options.coordinate.lng+','+index.target.options.coordinate.lat,
                radius:'0.05',
                // year: '2019',
                // month: '11',
                // day: '28'
                year: picker[0],
                month: picker[1],
                day: picker[2]
            }            
            dataManual(data).then(res=>{
                let arr = res.data.data
                // arr.forEach(v => {
                //     v.media = 
                // });
                this.list = arr
            })
            
            
            this.visible = true;
        },
        cmtHandle(){
            this.list = []
            this.visible = false;
        }
    }
}
</script>
<style lang="less" scoped>
    .cmModal .ant-modal-content .ant-modal-body{
        padding: 10px;
    }
    .header{
        margin-bottom: 15px;
    }
    .player{
      width: 100%;
      height: 100%;  
    }
    .video-player{
        width: 100%;
    }  
    .nowdate{
        text-align:right;
    }
</style>
