var SongInfo = {
    coverImg :"",
    progress :"",
    songName :"",
    artist :"",
    isPlaying:false,
    time:"",
    lrc:""
}

var notificationId = "id1";
var clearId = "id1";
var ntfNum=0;
var lrcArr = [];
var lastCover="";

function updateSongInfo(data){
    console.info("update background");
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
    console.info(SongInfo);
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

    console.info(lrcArr);
    var lrcString = "";
    for(var i=0;i<lrcArr.length;i++){
        lrcString +=lrcArr[i]+"\n";
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
    console.log(title, content,iconUrl);

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
    console.info("background received a message",m);
    if(m.to == "background" || m.to=="all"){
        if(m.name=="notify"){
            console.info("notify");
            notify(m.data);
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
        }
    }
}
//与popup通信
browser.runtime.onMessage.addListener(backgroundReceiver);
//与content.js通信
browser.runtime.onConnect.addListener(connected);


