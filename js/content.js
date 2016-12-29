(function(){
    var Player = {

    coverImg: "",
    progress: "",
    songName: "",
    artist: "",
    isPlaying: false,
    time: "",
    lrc: "",
    lrcList: [],
    songList:[],
    isPureMusic:false,

    

    //检查歌曲信息延迟时间
    CHECK_MUSIC_CHANGE_DELAY: 500,


    listIconEL: $(".icn.icn-list"),
    volumeIconEl: $(".icn.icn-vol"),
    volumeBarEl: $(".vbg.j-t"),
    volumeEL: $(".m-vol"),
    progressEL: $(".barbg.j-flag"), //进度条
    likeEl: $(".icn-add.j-flag"),
    contentFrame: $("#g_iframe"),
    coverImgEl: $(".head.j-flag img"), //封面图
    songNameEl: $(".play .f-thide.name"), //歌曲名
    artistEl: $(".play .by span a"), //歌手名

    //发送歌词通知
    sendSongInfo: function(songInfo) {
        browser.runtime.sendMessage({
            "name": "notify",
            "data": songInfo,
            "from": "content",
            "to": "all"
        });
    },
    updateSongInfo: function(songInfo) {
        browser.runtime.sendMessage({
            "name": "updateSongInfo",
            "data": songInfo,
            "from": "content",
            "to": "background"
        });
    },
    //初始化歌曲相关信息
    initSongInfo:function(){
        this.lrc= "",
        this.lrcList= [],
        this.isPureMusic=false
    },
    getSongInfo: function() {
        var songInfo = {};
        songInfo.coverImg = this.getCoverImg();
        songInfo.progress = this.getProgress();
        songInfo.songName = this.getSongName();
        songInfo.artist = this.getArtist();
        songInfo.isPlaying = this.getIsPlaying();
        songInfo.time = this.getTime();
        //sconsole.info(songInfo.time,parseFloat(time2Seconds(songInfo.time)));
        songInfo.lrc = this.getLrc();
        //不用每次查找网页元素
        songInfo.songList = this.songList;
        return songInfo;
    },

    check: function() {
        var songInfo = this.getSongInfo();

        //如果不是纯音乐,5秒后获取歌词列表

        if (this.isPureMusic==false && this.lrcList.length == 0 && parseInt(time2Seconds(songInfo.time))>5) {
            console.info("重新获取歌词列表");
            this.lrcList = this.getLrcList();
            this.songList = this.getSongList();
            console.info(this.lrcList);
        } else {
            if(this.isPureMusic==true){
                this.lrcList = [{"lrc":"纯音乐无歌词","time":0},{"lrc":"纯音乐无歌词","time":5}];
                console.info("纯音乐");
                this.songList = this.getSongList();
            }
            
        }

        //是否有信息更新
        var needUpdate = false;
        //是否换歌
        var songChanged = false;
        //需要更新的信息
        var updateData = {};

        if (songInfo.coverImg != this.coverImg) {
            //console.info(songInfo.coverImg, this.coverImg, songInfo.coverImg != this.coverImg);
            this.coverImg = songInfo.coverImg;
            needUpdate = true;
            songChanged = true;
        }
        if (songInfo.progress != this.progress) {
            //console.info(songInfo.progress, this.progress, songInfo.progress !=this.progress);

            this.progress = songInfo.progress;
            this.time = songInfo.time;
            //console.info(songInfo.progress, this.progress, songInfo.progress !=this.progress);
            //进度条改变，歌词变化时显示歌词
            if (this.lrc != songInfo.lrc) {
                this.lrc = songInfo.lrc;
                needUpdate = true;
                //显示歌词
                this.sendSongInfo(songInfo);
            }
            needUpdate = true;
        }
        if (songInfo.songName != this.songName) {
            //console.info("切歌");
            //console.info(songInfo.songName, this.songName, songInfo.songName != this.songName);
            this.songName = songInfo.songName;
            songChanged = true;
            needUpdate = true;
        }
        if (songInfo.artist != this.artist) {
            console.info(songInfo.artist, this.artist, songInfo.artist != this.artist);
            this.artist = songInfo.artist;
            needUpdate = true;
            songChanged = true;
        }

        if (songInfo.isPlaying != this.isPlaying) {
            this.isPlaying = songInfo.isPlaying;
            needUpdate = true;
        }
        
        if(songChanged==true){
            console.info("初始化歌曲");
            this.initSongInfo();
        }

        if (needUpdate == true) {
            //console.info(needUpdate);
            this.updateSongInfo(songInfo);

        }

    },
    afterInit: function() {

    },
    getLrcList: function() {
        var list = [];
        if(this.isPureMusic)return list;
        if (document.querySelector("#g_playlist") === null) {
            $(".icn.icn-list").click();
            //纯音乐无歌词
            if($(".nocnt.nolyric")!=null)this.isPureMusic = true;
            setTimeout(function() {
                var lrcNodeList = $$(".listlyric.j-flag p.j-flag");
                var t, l;
                for (var i = 0; i < lrcNodeList.length; i = i + 1) {
                    t = lrcNodeList[i].getAttribute("data-time");
                    l = lrcNodeList[i].innerText;
                    list.push({ "time": t, "lrc": l })
                }

            }, 1000);

        } else {
            var lrcNodeList = $$(".listlyric.j-flag p.j-flag");
            var t, l;
            if($(".nocnt.nolyric")!=null)this.isPureMusic = true;
            console.info(this.lrcList);
            for (var i = 0; i < lrcNodeList.length; i = i + 1) {
                t = lrcNodeList[i].getAttribute("data-time");
                l = lrcNodeList[i].innerText;
                list.push({ "time": t, "lrc": l });
            }
        }

        return list;
    },
    getVolume: function() {
        return this.volumeEL.innerText;
    },
    //获取进度 d%
    getProgress: function() {
        return $(".barbg.j-flag").querySelector(".cur").style.width;
    },
    //获取封面图片，去除图片大小参数
    getCoverImg: function() {
        return $(".head.j-flag img").src.replace(/\?[\S]*/ig, "")+"?param=90y90";
    },
    //获取歌曲名
    getSongName: function() {
        return $(".play .f-thide.name").innerText;
    },
    //获取歌手名
    getArtist: function() {
        return $(".play .by span").getAttribute("title");
    },
    //当前是否正在播放
    getIsPlaying: function() {
        return $(".ply.j-flag").className == "ply j-flag pas";
    },
    //获取当前歌词
    getLrc: function() {
        var s = time2Seconds(this.time);
        var lrc = "";
        var flag = false;

        var currentTime = parseFloat(s); //当前时间

        for (var i = 0; i < this.lrcList.length; i = i + 1) {

            if (flag == true && currentTime < parseFloat(this.lrcList[i].time)) {
                lrc = this.lrcList[i].lrc;
                break;
            }
            //歌词开始标志
            if (currentTime > parseFloat(this.lrcList[i].time)) {
                flag = true;
            }

        }
        return lrc;
    },
    //获取播放时间进度
    getTime: function() {
        return $(".j-flag.time em").innerText;
    },

    getSongList:function(){
        var listEl = $$(".listbdc.j-flag li");
        var list = [];
        console.info(null!=listEl,listEl);
        for(var i=0;null!=listEl&&i<listEl.length;i++){
            var el = listEl[i];
            console.info(el.getAttribute("data-id"), 
                el.querySelector(".col-2").innerText, 
                el.querySelector(".col-4 span").getAttribute("title"),
                el.querySelector(".col-5").innerText,
                el.className == "z-sel"
            );
            
            var node = {
                "id":el.getAttribute("data-id"), 
                "name":el.querySelector(".col-2").innerText, 
                "artist":el.querySelector(".col-4 span").getAttribute("title"),
                "time":el.querySelector(".col-5").innerText,
                "sel":el.className == "z-sel"
            };
            list.push(node);
        }
        return list;
    },

    /********************播放控制开始************************/
    //播放
    play: function() {
        if ($(".ply.j-flag").getAttribute("data-action") == "play") $(".ply.j-flag").click();
    },
    //暂停
    pause: function() {
        if ($(".ply.j-flag").getAttribute("data-action") == "pause") $(".ply.j-flag").click();
    },
    //上一首
    pre: function() {
        $(".prv").click();
        console.info("pre");
    },
    //下一首
    next: function() {
        $(".nxt").click();
        console.info("next");
    },
    //改变进度
    changeBar:function(t){
        console.debug("改变进度条",t);
        var progressEL = $(".barbg.j-flag");
        var n = progressEL.clientWidth * t,
            i = progressEL.getBoundingClientRect(),
            s = document.createEvent("MouseEvents");
        //创建一个键盘点击事件
        s.initMouseEvent("mousedown", 
            !0,     //允许事件冒泡
            !0,     //可取消
            window, //当前window对象      
            0,   
            0,      //screenX
            0,      //screenY
            i.left + n,     //clientX
            i.top,          //clientY
            !1,     //controlKey
            !1,     //altKey
            !1,     //shiftKey
            !1,     //metaKey
            0,      //button
            null    //相关点击对象
        ),
        progressEL.dispatchEvent(s);//绑定事件
    },
    /***************************播放控制结束**************************/

    //初始化
    init: function() {
        console.info("初始化播放器");
        this.lrcList = this.getLrcList();

        window.addEventListener("click", function(e) {
            Player.check();
        });

        setInterval(function() {

            //console.info("check");
            Player.check();
        }, 300);


        var myPort=browser.runtime.connect({ name: "port-from-cs" });
        function contentReceiver(m) {
            console.info("content recieve", m);

            if (m.to == "all" || m.to == "content") {

                if (m.name == "getSongInfo" && m.from == "popup") {

                    var songInfo = this.getSongInfo();
                    console.info("返回popup歌曲信息", songInfo);
                    //返回信息
                    browser.runtime.sendMessage({"name": "getSongInfo","data": songInfo,"from": "content","to": "popup"});
                }
            }
        }

        browser.runtime.onMessage.addListener(contentReceiver);

        //接收来自background的消息
        myPort.onMessage.addListener(function(m) {
            console.log("In content script, received message from background script: ");
            console.log(m);
            switch (m.action) {
                case "play":
                    Player.play();
                    break;
                case "pause":
                    Player.pause();
                    break;
                case "pre":
                    Player.pre();
                    break;
                case "next":
                    Player.next();
                    break;
                case "bar":
                    Player.changeBar(m.data);
                    break;
                default:
                    console.info("未知命令");
                    break;
            }
        });
    }
}

Player.init();








})(window);