! function(e) {
    var n = Base.extend({
        //事件
        events: {
            "click .play-next": "playNext",
            "click .play-prev": "playPrev",
            "click .play-replay": "replay",
            "click .play": "playOrPause",
            "click .progress": "changeTime",
            "click .volume-bar": "changeVolume",
            "click .play-type": "changeContentPlayType",
            "click .play-list": "toggleSongList",
            "click .clickable": "goPage",
            "click .one-player-song-list": "handleSongList",
            "click .play-like": "addToLike"
        },
        MUSIC_163_LINK: "http://music.163.com/ ",
        SONG_LIST_HEIGHT: "300px",
        //界面元素
        songNameEL: $(".song-name"),
        songImageEl: $(".song-pic"),
        singerNameEl: $(".singer-name"),
        playEL: $(".one-player-play-bar .play"),
        loadedEL: $(".progress-loaded"),
        bitRateEl: $("#bit-rate"),
        playedEL: $(".progress-played"),
        likeEl: $(".play-like"),
        playType: $(".play-type"),
        timeEL: $(".play-time"),
        volumeEl: $(".current-volume"),
        songListEl: $(".one-player-song-list"),
        songLrcEl: $(".one-player-lrc"),
        songLrcWrapEl: $(".one-player-lrc-wrap"),
        songListLoadingEl: $("#loading-song-list"),
        addLikeLoadingEl: $(".add-like-loading"),
        lrcCheckEl: $("#lrc-check"),

        playerInit: !1,
        currentPageID: "",
        songInfo: null,
        backgroundPage: null,
        activeLrcEl: null,
        playing: !1,
        currentLrc: null,
        afterInit: function() {
            this.backgroundPage = this.getBackgroundPage(),
                this.refreshSongInfo(),
                this.initPlayer(),
                this.fillBitRate(),
                this.getSongLrc(),
                this.listenExtensionMessage(),
                this.initLrcCheck()
        },
        initPlayer: function() {
            this.fillPlayerDOM()
        },
        initLrcCheck: function() {
            var e = this;
            new Switch(this.lrcCheckEl, {
                checked: e.backgroundPage.isShowDesktopLrc(),
                onSwitchColor: "#F15648",
                size: "small",
                showText: !0,
                onText: "词",
                offText: "词",
                onChange: function(n) {
                    e.backgroundPage.setOptions({
                        desktopLrc: n ? "show" : "hide"
                    })
                }
            })
        },
        listenExtensionMessage: function() {
            var e = this;
            chrome.extension.onMessage.addListener(function(n) {
                switch (e.refreshSongInfo(),
                    n) {
                    case Events.INIT_PLAYER:
                        e.initPlayer();
                        break;
                    case Events.SONG_CHANGE:
                        e.changeSong();
                        break;
                    case Events.SONG_PROGRESS:
                        e.changeProgress(),
                            e.changeLrcPosition();
                        break;
                    case Events.SONG_PAUSE:
                        e.changePlayState();
                        break;
                    case Events.PLAY_TYPE_CHANGE:
                        e.changePlayType();
                        break;
                    case Events.RESET_PLAYER:
                        e.resetPlayer();
                        break;
                    case Events.RESPONSE_SONG_LIST:
                        e.fillSongList();
                        break;
                    case Events.BIT_RATE_CHANGE:
                        e.fillBitRate();
                        break;
                    case Events.RESPONSE_SONG_LRC:
                        e.fillSongLrc(),
                            e.changeLrcPosition();
                        break;
                    case Events.ADD_LIKE_START:
                        e.showAddLikeLoading();
                        break;
                    case Events.ADD_LIKE_FINISH:
                        e.hideAddLikeLoading();
                        break;
                    case Events.RESPONSE_SONG_TIME:
                        e.fillTime()
                }
            })
        },
        changeSong: function() {
            this.fillPlayerDOM(),
                this.selectSongInSongList()
        },
        selectSongInSongList: function() {
            var e = null;
            this.isSongListOpen() && (e = this.songListEl.querySelector('li[data-id="' + this.songInfo.song_id + '"]'),
                e && !e.classList.contains("z-sel") && e.click())
        },
        getSongLrc: function() {
            this.backgroundPage.getSongLrc()
        },
        changeLrcPosition: function() {
            var e = Util.getProgressInSeconds(this.backgroundPage.songTime.split("/")[0].split(":")),
                n = null;
            this.songLrcWrapEl.querySelector(".z-sel") ? (n = this.songLrcWrapEl.querySelector(".z-sel"),
                    n.classList.remove("z-sel")) : n = this.songLrcWrapEl.querySelector('[data-time^="' + e + '."]'),
                n && (this.currentLrc && this.currentLrc.classList.remove("active"),
                    this.songLrcWrapEl.style.transform = "translate(0,-" + n.offsetTop + "px)",
                    n.classList.add("active"), !n == this.currentLrc && this.backgroundPage.showLrcNotification(n.innerHTML),
                    this.currentLrc = n)
        },
        changeProgress: function() {
            this.fillProgressDOM()
        },
        changeVolume: function(e) {
            e.currentTarget.querySelector(".current-volume").style.width = e.offsetX + "px",
                this.backgroundPage.changeVolume(e.offsetX / e.currentTarget.clientWidth)
        },
        changePlayType: function() {
            var e = this.playType.querySelector("i");
            e.className = "",
                e.classList.add("icon-" + this.songInfo.play_type)
        },
        changePlayState: function() {
            if (this.songInfo.playing != this.playing) {
                var e = this.songInfo.playing ? "icon-pause" : "icon-play",
                    n = this.songInfo.playing ? "icon-play" : "icon-pause";
                this.playEL.classList.remove(n),
                    this.playEL.classList.add(e),
                    this.playing = this.songInfo.playing
            }
        },
        toggleSongList: function() {
            if (this.checkInit()) {
                var e = this.isSongListOpen();
                this.songListEl.style.height = e ? 0 : this.SONG_LIST_HEIGHT,
                    e || this.backgroundPage.requestSongList()
            }
        },
        checkInit: function() {
            return this.getBackgroundPage().playerInit
        },
        getSongInfo: function() {
            return this.getBackgroundPage().songInfo
        },
        getBackgroundPage: function() {
            return chrome.extension.getBackgroundPage().Background
        },
        refreshSongInfo: function() {
            this.songInfo = this.getSongInfo(),
                this.songTime = this.getBackgroundPage().songTime
        },
        hideAddLikeLoading: function() {
            this.addLikeLoadingEl.style.display = "none"
        },
        showAddLikeLoading: function() {
            this.addLikeLoadingEl.style.display = "block"
        },
        resetPlayer: function() {
            this.fillPlayerDOM()
        },
        replay: function() {
            this.backgroundPage.changeTime(0)
        },
        changeTime: function(e) {
            this.backgroundPage.changeTime(e.offsetX / e.currentTarget.clientWidth)
        },
        addToLike: function() {
            this.backgroundPage.addToLike()
        },
        handleSongList: function(e) {
            var n = e.target,
                t = null,
                i = e.target.closest("li");
            e.preventDefault(),
                this.isInSongList(n) ? (t = Array.prototype.slice.apply(document.getElementsByClassName("f-cb")[0].querySelectorAll("li")),
                    t.forEach(function(e) {
                        e.classList.contains("z-sel") && e.classList.remove("z-sel")
                    }),
                    i.classList.add("z-sel"),
                    this.scrollToCurrentSong(),
                    this.backgroundPage.clickSongListItem(i.getAttribute("data-id"))) : n.classList.contains("f-tdu") && this.backgroundPage.goPage(n.getAttribute("href"))
        },
        isSongListOpen: function() {
            return 0 != this.songListEl.clientHeight
        },
        isInSongList: function(e) {
            return document.getElementsByClassName("f-cb")[0] && document.getElementsByClassName("f-cb")[0].contains(e)
        },
        scrollToCurrentSong: function() {
            var e = this.songListEl.querySelector(".z-sel");
            e && (e.offsetTop < this.songListEl.scrollTop || e.offsetTop >= this.songListEl.scrollTop + this.songListEl.clientHeight - e.clientHeight) && (this.songListEl.scrollTop = e.offsetTop)
        },
        fillBitRate: function() {
            this.bitRateEl.innerHTML = this.backgroundPage.options.bitRate + "K"
        },
        fillProgressDOM: function() {
            this.fillLoaded(),
                this.fillPlayed(),
                this.fillVolume(),
                this.changePlayState()
        },
        fillPlayerDOM: function() {
            this.fillSongName(),
                this.fillSongImage(),
                this.fillSingerName(),
                this.fillLoaded(),
                this.fillPlayed(),
                this.fillVolume(),
                this.changePlayType(),
                this.changePlayState()
        },
        fillSongList: function() {
            this.songListEl.innerHTML = this.backgroundPage.songList,
                this.scrollToCurrentSong()
        },
        fillSongLrc: function() {
            this.songLrcWrapEl.innerHTML = this.backgroundPage.songLrc.innerHTML
        },
        fillSongName: function() {
            this.songNameEL.innerHTML = this.songInfo.song_name,
                $(".song-name").setAttribute("data-src", "/song?id=" + this.songInfo.song_id)
        },
        fillSongImage: function() {
            $(".song-pic").setAttribute("data-src", "/song?id=" + this.songInfo.song_id),
                this.songImageEl.querySelector("img").src = this.songInfo.song_img
        },
        fillSingerName: function() {
            this.singerNameEl.innerHTML = this.songInfo.singer_name,
                this.songInfo.singer_id > 0 && $(".singer-name").setAttribute("data-src", "/artist?id=" + this.songInfo.singer_id)
        },
        fillPlayed: function() {
            this.playedEL.style.width = this.songInfo.played
        },
        fillLoaded: function() {
            this.loadedEL.style.width = this.songInfo.loaded
        },
        fillTime: function() {
            this.timeEL.innerText = this.backgroundPage.songTime
        },
        fillVolume: function() {
            $(".current-volume").style.width = this.songInfo.volume
        },
        showSongLike: function() {
            this.likeEl.classList.add("like")
        },
        playNext: function() {
            this.backgroundPage.playNext()
        },
        playPrev: function() {
            this.backgroundPage.playPrev()
        },
        playOrPause: function() {
            this.backgroundPage.playOrPause()
        },
        changeContentPlayType: function() {
            this.backgroundPage.changeContentPlayType()
        },
        goPage: function(e) {
            this.backgroundPage.goPage(e.currentTarget.getAttribute("data-src"))
        }
    });
    n.init()
}(window);