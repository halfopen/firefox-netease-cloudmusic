/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
var notificationId = "lrcNotification";

function notify(message) {

    var clearing = browser.notifications.clear(notificationId);

    console.log("background script received message", message);
    var title = "";
    var content = "内容\n<b>内容</b>";
    console.log(title, content);

    /*
        Firefox
            Currently Firefox only supports "basic" here.
            Only 'type', 'iconUrl', 'title', and 'message' are supported.
    */
    var notification = browser.notifications.create(notificationId, {
        "type": "basic",
        //"iconUrl": browser.extension.getURL("./icons/main.jpg"),
        "title": title,
        "message": content
    });
    console.info(notification);
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);