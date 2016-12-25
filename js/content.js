/*
If the click was on a link, send a message to the background page.
The message contains the link's URL.
*/

var Player = {
	$:function(e) {
        return document.querySelector(e)
    },
    $$:function(e) {
        return Array.prototype.slice.apply(document.querySelectorAll(e))
    },


	"name":"",		//歌曲名
	"volume":"",	//音量
	"lrc":"",		//当前歌词
	"lrcList":[],	//歌词元素列表
	"progress":"",	//进度
	"pTotal":"",	//总长度
	"status":"",	//当前状态
	"coverImg":"",	//封面图

	//检查歌曲信息延迟时间
	CHECK_MUSIC_CHANGE_DELAY:500,


    listIconEL: $(".icn.icn-list"),
    volumeIconEl: $(".icn.icn-vol"),
    volumeBarEl: $(".vbg.j-t"),
    volumeEL: $(".m-vol"),
    progressEL: $(".barbg.j-flag"),						//进度条
    likeEl: $(".icn-add.j-flag"),
    contentFrame: $("#g_iframe"),
    coverImgEl:$(".head.j-flag img"),					//封面图
    songNameEl:$(".play .f-thide.name"),				//歌曲名
    artistEl:$(".play .by span a"),						//歌手名

    //初始化
	init:function(){

	},
	update:function(){

	},
	check:function(){

	},
	afterInit:function(){

	},
	getVolume:function(){
		return this.volumeEL.innerText;
	},
	//获取进度 d%
	getProgress:function(){
		return this.progressEL.querySelector(".cur").style.width;
	},
	//获取封面图片，去除图片大小参数
	getCoverImg:function(){
		return this.coverImgEl.src.replace(/\?[\S]*/ig,"");
	},
	//获取歌曲名
	getSongName:function(){
		return this.songNameEl.innerText;
	},
	//获取歌手名
	getArtist:function(){
		return this.artistEl.innerText;
	}
	
}

function notifyExtension(e) {

    var data = {
    	"title":title, 
    	"content":content,
    	"iconUrl":coverImg
    };
    console.info("sendMessage",data);
    browser.runtime.sendMessage({
    	"name":"notify",
    	"data":data,
    	"from":"content",
    	"to":"all"
    });
}


// function domChange(e){
// 	console.info(browser.runtime.sendMessage({"url":"domChange"}));
// }

/*
Add notifyExtension() as a listener to click events.
*/
// window.addEventListener("click", notifyExtension);

// document.addEventListener("change", domChange)