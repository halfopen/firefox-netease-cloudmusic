function receiver(m){
    console.info("received a message",m);

    if(m.name=="notify"){
        console.info("notify");
        notify(m.data);
    }
}


var notificationId = "lrcNotification";

function notify(data) {

    //var clearing = browser.notifications.clear(notificationId);

    console.log("background script received message", data);
    var title,
        content,
        iconUrl;
    title = data.title;
    content = data.content;
    if(data.iconUrl){
        iconUrl = data.iconUrl;
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

browser.runtime.onMessage.addListener(receiver);