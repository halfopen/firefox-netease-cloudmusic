(function() {

    var 发送命令 = function(e) {
        //console.info(e.target.getAttribute("data-action"));
        var 命令 = e.target.getAttribute("data-action");
        browser.runtime.sendMessage({
            "name": 命令,
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
    $("#play").onclick = 发送命令;
    //暂停
    $("#pause").onclick = 发送命令;
    //上一首
    $("#prev").onclick = 发送命令;
    //下一首
    $("#next").onclick = 发送命令;


    function updatePopupUI(data) {
        console.info("update",data);
        if(data==undefined)return;
        if (data.coverImg !== undefined && data.coverImg.length>0) {
            $("#cover").src = data.coverImg;
        }

        if (data.progress != undefined) {
            $(".played.j-flag").style.width = data.progress;
        }

        if (data.songName != undefined && data.songName.length>0) {
            $("#title").innerText = data.songName;
        }

        if (data.artist != undefined && data.artist.length>0) {

        }

        if (data.time !== undefined && data.time.length>0) {
            $("#time").innerText = data.time;
        }

        if (data.isPlaying !== undefined) {
            if (data.isPlaying == true) {
                $("#play").className = "bg mid play f-hide";
                $("#pause").className = "bg mid pause";
            } else {
                $("#pause").className = "bg mid pause f-hide";
                $("#play").className = "bg mid play";
            }
        }

        if(data.showLrc == true){
            $("#lrc-switch").checked = true;
        }else{
            $("#lrc-switch").checked = false;
        }
    }

    function initPopup() {
        console.info("popup初始化");
        var page = browser.extension.getBackgroundPage();
        var SongInfo = page.SongInfo;

        updatePopupUI(SongInfo);
    }

    function check() {
        var page = browser.extension.getBackgroundPage();
        var SongInfo = page.SongInfo;
        updatePopupUI(SongInfo);
    }

    setInterval(function() {

        check();
    }, 50);

    initPopup();
})();