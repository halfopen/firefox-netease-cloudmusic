(function() {

    var sendCommand = function(e) {
        //console.info(e.target.getAttribute("data-action"));
        var command = e.target.getAttribute("data-action");
        browser.runtime.sendMessage({
            "name": command,
            "data": "",
            "from": "popup",
            "to": "background"
        });
    };


    //点击 显示/隐藏 列表
    $(".bg.open").onclick = function() {
        if ($("#list").className == "list") {
            $("#list").className = "list z-close";
        } else {
            $("#list").className = "list";
        }

    };
    //播放
    $("#play").onclick = sendCommand;
    //暂停
    $("#pause").onclick = sendCommand;
    //上一首
    $("#prev").onclick = sendCommand;
    //下一首
    $("#next").onclick = sendCommand;


    function update(data) {
        //console.info("update",data);

        if (data.coverImg !== undefined) {
            $("#cover").src = data.coverImg;
        }

        if (data.progress !== undefined) {
            $(".played.j-flag").style.width = data.progress;
        }

        if (data.songName !== undefined) {
            $("#title").innerText = data.songName;
        }

        if (data.artist !== undefined) {
            //SongInfo.artist = data.artist;
        }

        if (data.time !== undefined) {
            $("#time").innerText = data.time;
        }

        if (data.isPlaying !== undefined) {
            if (isClick === false) {
                if (data.isPlaying === true) {
                    $("#play").className = "bg mid play f-hide";
                    $("#pause").className = "bg mid pause";
                } else {
                    $("#pause").className = "bg mid pause f-hide";
                    $("#play").className = "bg mid play";
                }
            }
        }
    }

    function init() {
        console.info("popup初始化");
        var page = browser.extension.getBackgroundPage();
        var songInfo = page.SongInfo;
        //更新界面
        update(songInfo);
    }

    function check() {
        var page = browser.extension.getBackgroundPage();
        var songInfo = page.SongInfo;
        update(songInfo);
    }

    setInterval(function() {

        //console.info("check");
        check();
    }, 50);

    init();
})();