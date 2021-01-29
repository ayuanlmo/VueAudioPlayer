# VueAudioPlayer

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

### Event
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
    
### Parameter

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
