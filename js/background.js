var SongInfo = {
    coverImg :"",
    progress :"",
    songName :"",
    artist :"",
    isPlaying:false
}



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
    console.info(SongInfo);
}


var notificationId = "lrcNotification";

function notify(data) {
    browser.notifications.clear(notificationId);
    var title,
        content,
        iconUrl;
    title = data.songName;
    content = data.artist;
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
    console.info(notification);
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
browser.runtime.onMessage.addListener(backgroundReceiver);






browser.runtime.onConnect.addListener(connected);


