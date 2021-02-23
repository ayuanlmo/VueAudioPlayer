# VueAudioPlayer
>This is a vue Project
### 构建该项目
```
npm install
```

### 编译运行
```
npm run serve
```

### 打包构建
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### 事件
* ```@noAudio```
    + 当前没有可播放音乐
    + ```return teue```
    
* ```@onPending```
    + 当前正在加载中，暂时无法播放
    + ```return teue```
    
* ```@audioOnOver```
    + 当前音频播放完毕
    + ```return teue```
    
* ```@audioOnLoad```
    + 音频加载完毕，这时候可以调用播放了
    + ```return teue```

* ```@audioOnError```
    + 当前音频加载失败
    + ```return teue```
    
* ```@currentLrcChange```
    + 当前歌词改变
    + ```return String```
    
* ```@thisPercentChange```
    + 当前播放进度改变
    + ```return int```
    
 >PS：组件用到的定时器，会在window对象下注入audioTimer属性，该属性状态由组件管理，请不要修改
### 参数
|  参数名   | 类型  | 说明  | 备注  | 其他
|  ----  | ----  | ----  | ----  | ----  |
| isAutoPlayer  | Boolean | 是否自动播放 | 默认:false
| audioList  | Array | 列表(详情请查看列表说明) | 默认:null
| playType  | String | 播放模式( ordinary普通 -- random随机 ) | 该参数只接受ordinary和random两个值,默认:ordinary | *Storage
| controllerIsShow  | Boolean | 是否显示列表 | 默认:true | *Storage
| ayConfig  | Object | 配置文件 | 详见配置文件 | Storage
>PS:带有 " * Storage " 的参数，会受到localStorage的控制 & 带有 " Storage " 的参数，部分会受到localStorage的控制
##### audioList 参数示例
``` javascript
//该参数为数组类型，如果您是json,请转换后传入。参数必须按照以下格式传入，否则组件无法正常识别

[
    {
        url:'https://ayuanlmo.fi/uploads/audio/test.mp3', // 歌曲资源地址
        pic:'https://ayuanlmo.fi/uploads/audio/test.jpg', // 歌曲专辑封面图
        lrc:'https://ayuanlmo.fi/uploads/audio/test.text', // 歌曲歌词文件
        author:'田馥甄', // 歌曲演唱者
        title:'小幸运' // 歌曲名称
    }
]

//code #end
```
>PS:歌词是以ajax方式加载，请确保您的浏览器支持XMLHttpRequest对象
##### audioList 参数示例
```javascript

const audioList = {

    noLrcInfo : '纯音乐，请欣赏', // 没有歌词文件是否显示的文字
    delayPlay : false, // 是否延迟播放(该参数表示，是否立即播放下一首，如果为false，则取delayDuration)
    delayDuration : 2000, // 延迟播放时间(播放结束n秒后，开始播放下一首，delayPlay为false时无效)

}

//code #end

```
###组件方法
>这里指的是组件内部方法，以下这些可随意调用，其他方法不建议随意调用，假定组件的ref为：'myPlayer'
###### @立即播放第x首
```javascript
/**
    @name toPlay 立即播放第x首
    @param kty {int} 歌曲序号 (不可空)
**/
this.$refs.myPlayer.toPlay(2); // 立即播放第2首
```

###### @获取音频配置文件
```javascript
/**
    @name getAudioConfig 获取当前音频配置文件
    @return {Object} 当前音频配置文件
**/
this.$refs.myPlayer.getAudioConfig(); // 获取音频配置文件
```

###### @上一首&下一首切换
```javascript
/**
    @name audioOnOver 多功能方法 (用于音频播放完毕自动调用 和 上一首、下一首)，外部调用方式建议为：上一首、下一首操作
    @param v {int} 只接受0 和 1,0为上一首，1为下一首 (必传)
**/
this.$refs.myPlayer.audioOnOver(0); // 上一首
this.$refs.myPlayer.audioOnOver(1); // 下一首
```

###### @播放与暂停
```javascript
/**
    @name player 播放与暂停
    @param play {Boolean} (必传，true为播放、false为暂停)
**/
this.$refs.myPlayer.player(true); // 播放
this.$refs.myPlayer.player(false); // 暂停
```
