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
            console.info("showList");
            var page = browser.extension.getBackgroundPage();
            var SongInfo = page.SongInfo;
            var song={};
            console.info(SongInfo.songList);
            $("#list-box").innerHTML="";
            console.info("showList",SongInfo.songList);
            for(var i=0;i<SongInfo.songList.length;i++){
                song = SongInfo.songList[i];
                var liClassname = "f-cb odd";
                if(i%2==0)liClassname="f-cb even";
                if(song.sel==true)liClassname +=" z-sel";
                var liHtml = '<li class="'+liClassname+'" data-id="'+song.id+'" data-action="playByIndex" data-index="0" style="width: 396px;">'+
                            '<div class="cur"></div>'+
                            '<div class="index">'+(i+1)+'</div>'+
                            '<div class="name f-thide" title="'+song.name+'" style="width: 250.2px;">'+song.name+' - '+song.artist+'</div>'+
                            '<div class="by f-thide" style="width: 53.8px;">'+song.time+'</div>'+
                        '</li>';
                
                $("#list-box").innerHTML+=liHtml;
            }
            console.info("showList",$("#list ul").innerHTML);
            $("#list").className = "list";

            $$("#list li").forEach(function(value,key){
                //console.info(value,key);
                value.onclick  = function(e){
                
                    

                    browser.runtime.sendMessage({
                        "name": "selectSongInList",
                        "data": this.getAttribute("data-id"),
                        "from": "popup",
                        "to": "background"
                    });

                    $$("#list li").forEach(function(value,key){
                        value.className = value.className.replace("z-sel","");
                    });
                    this.className +=" z-sel";
                }
            })
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

    $("#bar").onclick = function(e){
        var progress = e.offsetX/e.currentTarget.clientWidth;
        browser.runtime.sendMessage({
            "name": "bar",
            "data": progress,
            "from": "popup",
            "to": "background"
        });
    };

    //点击歌词开关
    $("#lrc-switch").onclick = function(e){
        console.info(this.checked);
        browser.runtime.sendMessage({
            "name":"toggleLrcShow",
            "data":this.checked,
            "from":"popup",
            "to":"background"
        })
    }


    //更新界面元素
    function updatePopupUI(data) {
        //console.info("update",data);
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
        console.info(SongInfo);
        updatePopupUI(SongInfo);

        setInterval(function() {
            check();
        }, 300);
    }

    function check() {
        var page = browser.extension.getBackgroundPage();
        var SongInfo = page.SongInfo;
        updatePopupUI(SongInfo);
    }

    initPopup();
})();