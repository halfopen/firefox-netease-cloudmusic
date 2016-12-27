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


    function 更新界面(data) {
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
            //播放器信息.artist = data.artist;
        }

        if (data.time !== undefined) {
            $("#time").innerText = data.time;
        }

        if (data.isPlaying !== undefined) {
            if (data.isPlaying === true) {
                $("#play").className = "bg mid play f-hide";
                $("#pause").className = "bg mid pause";
            } else {
                $("#pause").className = "bg mid pause f-hide";
                $("#play").className = "bg mid play";
            }
        }
    }

    function 初始化弹出框() {
        console.info("popup初始化");
        var 后台页面 = browser.extension.getBackgroundPage();
        var 播放器信息 = 后台页面.播放器信息;

        更新界面(播放器信息);
    }

    function 检查更新() {
        var 后台页面 = browser.extension.getBackgroundPage();
        var 播放器信息 = 后台页面.播放器信息;
        更新界面(播放器信息);
    }

    setInterval(function() {

        检查更新();
    }, 50);

    初始化弹出框();
})();