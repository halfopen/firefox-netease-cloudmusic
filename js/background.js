var SongInfo = {
    coverImg :"",
    progress :"",
    songName :"",
    artist :"",
    isPlaying:false,
    time:"",
    lrc:"",
    songList:[]
};
var notificationId = "id1";
var clearId = "id1";
var ntfNum=0;
var lrcArr = [];
var lastCover="";

function 加载配置() {
    console.info("background 加载配置");
    //加载配置
    var 本地是否显示歌词 = browser.storage.local.get('是否显示歌词');
    本地是否显示歌词.then(function(本地配置) {
        console.info("加载配置", 本地配置);
        if (本地配置 && 本地配置.是否显示歌词) {
            SongInfo.showLrc = true;
        } else {
            SongInfo.showLrc = false;
        }
    }, function() {
        console.info("加载本地配置失败");
        SongInfo.showLrc = true;
    });

}

function 保存配置(data){
    //console.info("保存配置", data.是否显示歌词);
    browser.storage.local.set({ '是否显示歌词': data.是否显示歌词 });
}

function updateSongInfo(data){
    //console.info("update background");
    if(data.coverImg!=undefined){
        SongInfo.coverImg = data.coverImg;
    }

    if(data.progress!=undefined){
        SongInfo.progress = data.progress;
    }

    if(data.songName!=undefined){
        SongInfo.songName = data.songName;
    }

    if(data.artist!=undefined){
        SongInfo.artist = data.artist;
    }

    if(data.isPlaying!=undefined){
        SongInfo.isPlaying = data.isPlaying;
    }

    if(data.time!=undefined){
        SongInfo.time = data.time;
    }

    if(data.lrc!=undefined){
        SongInfo.lrc = data.lrc;
    }
    if(data.songList!=undefined){
        SongInfo.songList = data.songList;
    }
    //console.info(SongInfo);
}

function toggleLrcShow(data){
    console.info("toggleLrcShow",data);
    SongInfo.showLrc = data;
    保存配置({"是否显示歌词":data});
    if(data ==false){
        browser.notifications.clear(notificationId);
    }
}



function notify(data) {
    // if(ntfNum==0){  //只创建不清除
    //     ntfNum=1;
    // }else if(ntfNum==1){    //只创建不清除
    //     ntfNum=2;
    // }else if(ntfNum==2){              //清除一个
    //     browser.notifications.clear(notificationId);        
    // };

    
    //换歌里清空之前的歌词
    if(lastCover!=data.coverImg){
        lrcArr = [];
        lastCover = data.coverImg;
    }

    //最多三条歌词记录
    if(lrcArr.length>=3){
        lrcArr.shift();
        lrcArr.push(data.lrc);
    }else if(lrcArr.length<3){
        lrcArr.push(data.lrc);
    }

    //console.info(lrcArr);
    var lrcString = "";
    for(var i=0;i<lrcArr.length;i++){
        if(lrcArr[i].length>0)lrcString +=" · "+lrcArr[i]+"\n";
    }
    
    var title,
        content,
        iconUrl;
    title = data.songName+" - "+data.artist;
    content = lrcString;
    if(data.coverImg){
        iconUrl = data.coverImg;
    }else{
        iconUrl =browser.extension.getURL("./imgs/default_music_pic_163.jpg");
    }
    //console.log("notify",title, content,iconUrl);

    /*
        Firefox
            Currently Firefox only supports "basic" here.
            Only 'type', 'iconUrl', 'title', and 'message' are supported.
    */



    var notification = browser.notifications.create(notificationId, {
        "type": "basic",
        "iconUrl": iconUrl,
        "title": title,
        "message": content
    });
    lastLrc = lrcString;

    // if(notificationId=="id1"){
    //     notificationId="id2";
    // }else{
    //     notificationId="id1";
    // }
}

var portFromCS;

function connected(p) {
  portFromCS = p;

  portFromCS.onMessage.addListener(function(m) {
    console.log("In background script, received message from content script")
    console.log(m);
  });
}

function backgroundReceiver(m){
    if(m.name!="updateSongInfo")console.info("background received a message",m);
    if(m.to == "background" || m.to=="all"){
        if(m.name=="notify"){
            console.info("notify");
            if(SongInfo.showLrc==true)notify(m.data);
        }else if(m.name=="updateSongInfo"){
            updateSongInfo(m.data);
        }else if(m.name=="play"){
            portFromCS.postMessage({"action":"play"});
        }else if(m.name=="pause"){
            portFromCS.postMessage({"action":"pause"});
        }else if(m.name == "pre"){
            portFromCS.postMessage({"action":"pre"});
        }else if(m.name == "next"){
            portFromCS.postMessage({"action":"next"});
        }else if(m.name == "bar"){
            portFromCS.postMessage({"action":"bar","data":m.data});
        }else if(m.name == "selectSongInList"){
            portFromCS.postMessage({"action":"selectSongInList", "data":m.data});
        }else if(m.name == "toggleLrcShow"){
            toggleLrcShow(m.data);
        }
    }
}

加载配置();

//与popup通信
browser.runtime.onMessage.addListener(backgroundReceiver);
//与content.js通信
browser.runtime.onConnect.addListener(connected);


