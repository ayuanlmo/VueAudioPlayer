<template>
  <div class="app" :style="!controllerIsShow ? 'width:72px;' : ''">
    <div :class=" listIsShow ? 'audio-list-show audio-list' : 'audio-list'" :style="!controllerIsShow ? 'display:none;' : '' "  ref="audioList">
      <ul>
        <li @click="audioPlayer(item,index+1)" v-for="(item,index) in audioList" :key="index" :style="thisState === index+1 ? {background: '#e9e9e9'} : '' " class="list-item">
          <span class="list-item-cur" :style="thisState === index +1 ? {background:'#3697fc'} : ''"></span>
          <span class="list-item-index">{{ (index+1)}}</span>
          <span class="list-item-title">{{item.title}}</span>
          <span class="list-item-author">{{item.author}}</span>
        </li>
      </ul>
    </div>
    <div class="a-play">
      <div class="a-play-left" :style="!controllerIsShow ? `background-image: url(${audioConfig.config.pic});height:60px;` : `background-image: url(${audioConfig.config.pic});` ">
        <div class="" :class=" isPlayer ? 'a-l-play-activation' : 'a-l-play' ">
          <audio
              @canplay="audioOnLoad"
              @ended="audioOnOver"
              @timeupdate="audioTimeUpdate"
              :src="audioConfig.config.url"
              ref="myAudio"
              @error="audioOnError"
          >
          </audio>
          <!--缩略图播放按钮-->
          <svg @click="player(true)" v-if="!isPlayer" xmlns="http://www.w3.org/2000/svg" version="1.1"
               viewBox="0 0 16 31">
            <path
                d="M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z"></path>
          </svg>
          <!--暂停-->
          <svg @click="player(false)" v-else xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 17 32">
            <path d="M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z"></path>
          </svg>
        </div>
      </div>
      <div v-show="controllerIsShow" class="a-play-right">
        <div class="a-r-all">
          <p class="a-r-title">
            <span :title="audioConfig.config.title">{{audioConfig.config.title}}</span>
            <!--          <span :title="audioConfig.config.author"> {{audioConfig.config.author}}</span>-->
          </p>
          <div class="a-r-all-all-Lyr">
            <b>
              {{ this.audioConfig.config.noLrc ? this.audioConfig.config.noLrcInfo : audioConfig.thisLrc }}
            </b>
          </div>
          <div class="audio-list-show" @click="listIsShow ? listIsShow = false : listIsShow = true">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 22 32"><path d="M20.8 14.4q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2zM1.6 11.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2zM20.8 20.8q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2z"></path></svg>
          </div>
        </div>
        <div class="a-play-time percent">
          <div class="a-play-percent">
            <!--进度条-->
            <slider @value_change="sliderValueChange" :num="audioConfig.thisPercent"></slider>
          </div>
          <div class="a-play-showTime">
            <span>{{ formatSeconds(audioConfig.thisTime) }}</span>
            <span> / </span>
            <span>{{ formatSeconds(audioConfig.duration) }}</span>
          </div>
          <div class="play-type">
            <!--随机播放-->
            <svg @click="setPlayType('random')" v-show="playType === 'random'" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22.667 4l7 6-7 6 7 6-7 6v-4h-3.653l-3.76-3.76 2.827-2.827 2.587 2.587h2v-8h-2l-12 12h-6v-4h4.347l12-12h3.653v-4zM2.667 8h6l3.76 3.76-2.827 2.827-2.587-2.587h-4.347v-4z"></path></svg>
            <!--列表播放-->
            <svg @click="setPlayType('ordinary')" v-show="playType === 'ordinary'" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M0.622 18.334h19.54v7.55l11.052-9.412-11.052-9.413v7.549h-19.54v3.725z"></path></svg>
          </div>
          <!--播放控制器-->
          <div class="play-controller">
            <!--上一首-->
            <div @click="audioOnOver(1)">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>
            </div>
            <div>
              <!--暂停-->
              <svg @click="player(true)" v-if="!isPlayer" style="width:8px;" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 31"><path d="M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z"></path></svg>
              <!--播放-->
              <svg @click="player(false)" v-else style="width:8px;" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 17 32"><path d="M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z"></path></svg>
            </div>
            <div @click="audioOnOver(0)">
              <!--下一首-->
              <svg style="transform: rotateY(180deg);" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>
            </div>
          </div>

        </div>
      </div>
      <div class="a-play-show" @click=" controllerIsShow ? controllerIsShow = false : controllerIsShow = true ">
        <svg :class="controllerIsShow ? 'a-play-show-left' : ''" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22 16l-10.105-10.6-1.895 1.987 8.211 8.613-8.211 8.612 1.895 1.988 8.211-8.613z"></path></svg>
      </div>
    </div>
    <div ref="aPlayLrc" class="a-play-lrc" v-if="!audioConfig.config.noLrc">
      <!--渲染歌词-->
      <p v-show="lrcItem.c!==''" :style=" audioConfig.thisLrc === lrcItem.c ? 'opacity: 1;' : ''" v-for="(lrcItem) in audioConfig.lrcObj.ms" :key="lrcItem.t"> {{lrcItem.c}}</p>

    </div>
    <div class="a-play-lrc" v-else>
      <p style="opacity: 1;">{{audioConfig.config.noLrcInfo}}</p>
    </div>

    <!--    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>-->
  </div>
</template>

<script>
import slider from './Slider'
export default {
  name: "VueAudioPlayer",
  components:{slider},
  props: {
    //是否自动播放
    isAutoPlayer:{
      type:Boolean,
      default:false,
    },
    //列表
    audioList:{
      type:Array,
      default: null
    },
    //播放模式
    playType:{
      type:String,
      default:'ordinary'
    },
    //是否显示控制器
    controllerIsShow:{
      type:Boolean,
      default:false
    },
    //配置文件
    ayConfig:{
      type:Object,
      default:null
    }
  },
  data() {
    return {
      listIsShow:true,//列表是否显示
      //audioList:[],
      isPlayer: false,//是否播放
      isOnLoad:false,//是否加载完毕
      thisState:1,//当前选中状态
      //isAutoPlayer:false,//是否自动播放
      audioConfig: {
        duration: 0,//总时间
        currentTime: 0,//当前时间
        thisPercent: 0,//当前进度
        thisTime: 0,//当前播放时间
        lrc: '',//歌词文件
        thisLrc:'',//当前歌词
        listMaxSort:0,//列表总长度
        lrcObj: {
          ti: "", //歌曲名
          ar: "", //演唱者
          al: "", //专辑名
          by: "", //歌词制作人
          offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
          ms: [] //歌词数组{t:时间,c:歌词}
        },
        config:{
          noLrc:true,//歌词是否存在
          noLrcInfo : '纯音乐，请欣赏',//没有歌词的时候展示
        }
      },
      //playType:'ordinary',//播放模式--ordinary普通||random随机
      //controllerIsShow:true,//显示控制器
    }
  },
  methods: {
    //点击列表播放
    audioPlayer(data,i,state = false){
      if(state === false && this.thisState === i){
        return
      }
      //控制滚动
      this.thisState < i ? this.$refs.audioList.scrollTop += 33 : this.$refs.audioList.scrollTop -= 33;
      this.thisState = i;
      this.audioConfig.thisTime = 0;
      this.audioConfig.config = data;//绑定数据
      if(this.audioConfig.config.lrc !== ''){
        this.getLyricTxt(this.audioConfig.config.lrc);//请求歌词
      }
      setTimeout(()=>{
        this.openTimer(true)
        this.isPlayer = true;
        this.player(true)//调用播放
      },500);
    },
    //设置播放模式
    setPlayType(v){
      v === 'ordinary' ? this.playType = 'random' : this.playType = 'ordinary'
    },
    //推动进度条
    sliderValueChange(event){
      this.audioConfig.thisPercent = event * 100;
      const time = (event / 100 * this.audioConfig.duration) * 100;
      this.$refs.myAudio.currentTime  = time;
      this.audioConfig.thisTime = time;
      this.formatSeconds(this.audioConfig.thisTime);
      this.isPlayer ? this.$refs.myAudio.play() : this.$refs.myAudio.pause();
    },
    //获取一个随机数
    getRandomNumber(min,max){
      const c = max - min + 1;
      return Math.floor(Math.random() * c + min);
    },
    //开始播放 & 暂停
    player(play) {
      if(this.audioList.length === 0){
        return this.$emit('noAudio',true);//发送事件(无音乐，用于父组件接管状态)
      }
      if(!this.isOnLoad){
        return this.$emit('onPending',true);//发送事件(音频等待中，暂时无法播放，用于父组件接管状态)
      }
      this.isPlayer = play;
      if(play){
        this.openTimer(false);
        this.$refs.myAudio.play();
      }else{
        this.openTimer(true);
        this.$refs.myAudio.pause();
      }
    },
    //打开定时器
    openTimer(clearTimer){
      if(clearTimer){
        return clearInterval(window.audioTimer);
      }
      window.audioTimer = setInterval(() => {
        this.audioConfig.thisTime === this.audioConfig.duration ? clearInterval(window.audioTimer) : this.audioConfig.thisTime++;
        if(this.audioConfig.config.lrc !== ''){
          this.getLyric(this.audioConfig.thisTime);
        }else{
          this.audioConfig.config.noLrc = true;
          this.audioConfig.config.noLrcInfo = '纯音乐，请欣赏';
        }
      }, 1000);
    },
    //播放完毕
    audioOnOver(v) {
      //v为1的时候，被上一首按钮调用，为0被下一首按钮调用

      //audio自身会调用这个方法，上一首、下一首也会调用这个
      this.audioConfig.thisPercent = 0;
      this.$emit('audioOnOver',true);//发送事件(播放完毕，用于父组件接管状态)
      console.log('播放完毕...');
      if(this.playType === 'ordinary'){
        if(this.thisState < this.audioConfig.listMaxSort){
          if(v === 1){
            //如果是在第一首就点击上一首按钮，则播放最后一首
            if( this.thisState === 1){
              this.thisState = this.audioList.length;
              //滚动到最后一首
              setTimeout(()=>{
                this.$refs.audioList.scrollTop = this.$refs.audioList.scrollHeight;
              },100);
            }else{
              this.thisState -= 1;
            }
          }else{
            this.thisState += 1;
          }
        }else{
          this.thisState -= 1;
        }
        this.audioConfig.config = this.audioList[ this.thisState-1 ];
      }else{
        this.thisState = this.getRandomNumber(0 , this.audioList.length) + 1;
        this.audioConfig.config = this.audioList[ this.thisState - 1 ];
      }
      this.audioPlayer(this.audioConfig.config , this.thisState,true);
    },
    //加载完毕
    audioOnLoad() {
      this.$emit('audioOnLoad',true);//发送事件(音频加载完毕，用于父组件接管状态)
      this.isOnLoad = true;//加载完毕，此时isOnLoad为true，当前可播放
      this.audioConfig.duration = parseInt(this.$refs.myAudio.duration);//设置总时间
      // this.audioConfig.thisPercent = 100;
    },
    //获取当前时间对应的歌词
    getLyric(timer){
      if(this.audioConfig.config.noLrc){
        return;
      }
      for(let i = 0; i<this.audioConfig.lrcObj.ms.length;i++){
        if(timer === this.audioConfig.lrcObj.ms[i].t){
          if(this.audioConfig.lrcObj.ms[i].c !== '') {
            this.audioConfig.thisLrc = this.audioConfig.lrcObj.ms[i].c;
            this.$emit('currentLrcChange',this.audioConfig.lrcObj.ms[i].c)
            break;
          }
        }
      }
    },
    //音频加载失败
    audioOnError(){
      this.$emit('audioOnError',true);//发送事件(音频加载失败，用于父组件接管状态)
      this.isPlayer = false;//未播放
    },
    //时间更新
    audioTimeUpdate() {
      //获取时间比例
      const percent = this.audioConfig.currentTime / this.audioConfig.duration;
      this.audioConfig.currentTime = parseInt(this.$refs.myAudio.currentTime);
      //实时计算出当前播放进度
      this.audioConfig.thisPercent = parseInt(((percent * 100).toFixed(2))) + 1;
      console.log('时间',this.audioConfig.thisPercent);
      this.$emit('thisPercentChange',this.audioConfig.thisPercent);
    },
    //时间转换 00:00
    formatSeconds(value) {
      const result = parseInt(value);
      //如果=0,直接返回：00:00
      if (result === 0) {
        return '00:00'
      }
      //如果小于10，则返回4位数：00:01
      if (result < 10) {
        return `00:0${result}`;
      }
      //如果小于59,计算不出前面的00，返回：00:59
      if (result < 59 || result === 59) {
        return '00:' + result
      }
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
      let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
      let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
      let res = '';
      if (h !== '00') res += `${h}:`;
      if (m !== '00') res += `${m}:`;
      res += `${s}`;
      return res;
    },
    //获取歌词
    getLyricTxt(url) {
      this.audioConfig.lrcObj.ti = '';
      this.audioConfig.lrcObj.al = '';
      this.audioConfig.lrcObj.by = '';
      this.audioConfig.lrcObj.offset = 0;
      this.audioConfig.lrcObj.ms = [];

      const xhr = new XMLHttpRequest();
      xhr.open('get', encodeURI(url));
      //xhr.setRequestHeader("Content-Type", "text/html");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this.audioConfig.lrc = xhr.responseText;
          const lrcs = this.audioConfig.lrc.split('\n');
          lrcs.forEach((item, i) => {
            lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, "");
            const t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));
            const s = t.split(":");
            if (isNaN(parseInt(s[0]))) {
              for (let i in this.audioConfig.lrcObj) {
                if (i !== "ms" && i === s[0].toLowerCase()) {
                  this.audioConfig.lrcObj[i] = s[1];
                }
              }
            } else {
              const arr = lrcs[i].match(/\[(\d+:.+?)\]/g);
              let start = 0;
              for (let k in arr) {
                start += arr[k].length; //计算歌词位置
              }
              const content = lrcs[i].substring(start);
              for (let k in arr) {
                const t = arr[k].substring(1, arr[k].length - 1);
                const s = t.split(":");
                this.audioConfig.lrcObj.ms.push({//对象{t:时间,c:歌词}加入ms数组
                  t: parseInt( (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3)),
                  c: content
                });
              }
            }
          })
          this.audioConfig.lrcObj.ms.sort(function (a, b) {//排序
            return a.t - b.t;
          });
          console.log(this.audioConfig.lrcObj)

          // for (let i in this.audioConfig.lrcObj) { //查看解析结果
          //   console.log(i, ":", this.audioConfig.lrcObj[i]);
          // }
        }
      }
      xhr.send();
    }
  },
  created() {
    window.audioTimer = null;//创建定时器

    //模拟请求一个歌词 list
    const xhr = new XMLHttpRequest();
    xhr.open('GET','https://upcdn.ayuanlmo.online/audio/audioList.json');
    const _this = this;
    xhr.onload = function(res){
      _this.audioList = JSON.parse(res.currentTarget.response)
      _this.audioConfig.listMaxSort = _this.audioList.length;//设置列表长度
      _this.audioConfig.config = _this.audioList[1];//置第一首
      _this.thisState = 2;//到第二首
      _this.getLyricTxt(_this.audioConfig.config.lrc);//请求歌词
    }
    xhr.send();
    //模拟 end## ...
  },
  mounted() {
    //获取 & 解析歌词
    //this.getLyricTxt(this.audioData.testLrc);

  },
  watch:{
    //监听控制器时候显示
    // controllerIsShow(){
    //   this.listIsShow = false;//隐藏掉列表
    // },
    'audioConfig.thisLrc':{
      deep:true,
      handler:function(){
        setTimeout(()=>{
          this.$refs.aPlayLrc.scrollTop +=20;
        },100);
      }
    }
    //audioConfig.thisLrc
  }
}
</script>

<style lang="scss" scoped>
.app {
  transition: all .4s;
  width: 425px;
  height: auto;
  background: #ffffff;
  border-radius: 4px;
  .audio-list{
    transition: all 0.4s ease 0s;
    width: 100%;
    z-index: 5;
    overflow-y: auto;
    border-bottom: 1px solid #e9e9e9;
    max-height: 231px;
    border-radius:4px;
    //max-height: 330px;
    .list-item{
      cursor: pointer;
      width:100%;
      height:32px;
      line-height:32px;
      list-style: none;
      border-top: 1px solid #e9e9e9;
      font-size: 12px;
      overflow:hidden;
      & span{
        color:#646363;
      }
      .list-item-cur{
        width:3px;
        height:22px;
        display: inline-block;
        margin-left:5px;
        margin-top: 5px;
        float:left;
      }
      .list-item-index{
        margin:0px 18px 0px 12px;
      }
      .list-item-author{
        float: right;
        padding-right: 8px;
      }
      &:hover{
        background: #e9e9e9;
      }
    }

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color:#ffffff;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
    }
    &::-webkit-scrollbar-thumb {
      background-color:#409EFF;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
    }

  }
  .audio-list-show{
    max-height: 0px;
  }

  .a-play{
    display:flex;
    .a-play-left {
      position: relative;
      width: 70px;
      background-size: cover;
      background-color: #409EFF;

      img {
        width: 100%;
        height: 100%;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      .a-l-play {
        width: 25px;
        height: 25px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -15px;
        margin-left: -15px;
        border: 2px solid #ffffff;
        border-radius: 50%;

        svg {
          width: 100%;
          height: 100%;
          margin-left: 2px;
        }
      }
      //激活效果
      .a-l-play-activation{
        width: 20px;
        height: 20px;
        position: absolute;

        top: 75%;
        left: 75%;
        margin-top: -15px;
        margin-left: -15px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        svg{
          width: 20px;
          height: 20px;
          margin-left: 0px;
          position: relative;
        }
      }
    }

    .a-play-right {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .a-r-all {
        width: 100%;
        height: auto;
        margin-top: 20px;
        padding-left: 15px;
        font-weight: 700;
        color: #666;
        display: flex;
        .a-r-all-all-Lyr{
          width: 45%;
          height: 21px;
          line-height: 21px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          position: relative;
          b{
            font-size:10px;
            margin-left: 10px;
          }
        }
        .audio-list-show{
          width: 12px;
          height: 12px;
          position: relative;
          right: -5px;
          top: 2px;
        }
        .a-r-title{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 45%;
        }
      }

      .percent {
        display: flex;
      }

      .a-play-showTime {
        font-size: 10px;
        color: #666;
        height: 22px;
        line-height: 25px;
        margin-left: 10px;
      }
      .play-type{
        width: 10px;
        height: 10px;
        position: relative;
        top: 2px;
        left: 5px;
      }
      .play-controller{
        position: relative;
        display: flex;
        width: 45px;
        left: 14px;
        top: 4px;
        svg {
          width: 15px;
          margin-right:4px;
        }
      }

      //进度条
      .a-play-time {
        .a-play-percent {
          width: 53%;
          height: 5px;
          background: #cdcdcd;
          border-radius: 10px;
          margin-top: 10px;
          position: relative;
          display: flex;
          cursor: pointer;
          margin-left: 15px;
        }

        .a-play-percent-time {
          height: 5px;
          background: #91c7ff;
          border-radius: 10px;
        }
      }
    }
    .a-play-show{
      width:18px;
      background:#e1e1e1;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      svg{
        position: relative;
        top:40%;
      }
      .a-play-show-left{
        transform: rotateY(180deg);
      }
    }
  }

  .a-play-lrc{
    color: #666565;
    width: 100%;
    z-index: -1;
    text-align: center;
    height: 45px;
    position: fixed;
    bottom: 0;
    //background: #ffffff;
    right: 0;
    overflow-y: hidden;
    overflow: hidden;
    font-weight: 700;
    font-size: 12px;
    p{
      height:20px;
      line-height:20px;
      opacity: .5;
    }
  }
}

svg {
cursor: pointer;
}
</style>