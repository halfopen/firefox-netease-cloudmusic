


var Player = {

   	coverImg :"",
   	progress :"",
   	songName :"",
   	artist :"",
   	isPlaying:false,

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
		console.info("初始化播放器");
	},
	sendSongInfo:function(songInfo){
	    browser.runtime.sendMessage({
	    	"name":"notify",
	    	"data":songInfo,
	    	"from":"content",
	    	"to":"all"
	    });
	},
	updateSongInfo:function(songInfo){
		browser.runtime.sendMessage({
			"name":"updateSongInfo",
			"data":songInfo,
			"from":"content",
			"to":"background"
		});
	},
	getSongInfo:function(){
		var songInfo={};
		songInfo.coverImg = this.getCoverImg();
		songInfo.progress = this.getProgress();
		songInfo.songName = this.getSongName();
		songInfo.artist = this.getArtist();
		songInfo.isPlaying = this.getIsPlaying();
		return songInfo;
	},

	check:function(){
		var songInfo=this.getSongInfo();

		var needUpdate = false;
		
		if(songInfo.coverImg!=this.coverImg){
			console.info(songInfo.coverImg, this.coverImg, songInfo.coverImg !=this.coverImg);
			this.coverImg = songInfo.coverImg;
			needUpdate = true;
		}
		if(songInfo.progress!=this.progress){
			console.info(songInfo.progress, this.progress, songInfo.progress !=this.progress);
			this.progress = songInfo.progress;
			this.updateSongInfo(songInfo);
			//needUpdate = true;
		}
		if(songInfo.songName !=this.songName){
			console.info(songInfo.songName, this.songName, songInfo.songName !=this.songName);
			this.songName = songInfo.songName;
			needUpdate = true;
		}
		if(songInfo.artist !=this.artist){
			console.info(songInfo.artist, this.artist, songInfo.artist !=this.artist);
			this.artist = songInfo.artist;
			needUpdate = true;
		}

		if(songInfo.isPlaying !=this.isPlaying){
			this.isPlaying = songInfo.isPlaying;
			needUpdate = true;
		}
		
		if(needUpdate==true){
			//console.info(needUpdate);
			this.updateSongInfo(songInfo);
			this.sendSongInfo(songInfo);
		}
	},
	afterInit:function(){

	},
	getVolume:function(){
		return this.volumeEL.innerText;
	},
	//获取进度 d%
	getProgress:function(){
		return $(".barbg.j-flag").querySelector(".cur").style.width;
	},
	//获取封面图片，去除图片大小参数
	getCoverImg:function(){
		return $(".head.j-flag img").src.replace(/\?[\S]*/ig,"");
	},
	//获取歌曲名
	getSongName:function(){
		return $(".play .f-thide.name").innerText;
	},
	//获取歌手名
	getArtist:function(){
		return $(".play .by span").getAttribute("title");
	},
	//当前是否正在播放
	getIsPlaying:function(){
		return $(".ply.j-flag").className == "ply j-flag pas";	
	},
	getLrc:function(){
		return "暂无歌词";
	},
	play:function(){
		if($(".ply.j-flag").getAttribute("data-action") == "play")$(".ply.j-flag").click();
	},
	pause:function(){
		if($(".ply.j-flag").getAttribute("data-action") == "pause")$(".ply.j-flag").click();
	},
	pre:function(){
		$(".prv").click();
		console.info("pre");
	},
	next:function(){
		$(".nxt").click();
		console.info("next");
	}
	
}

Player.init();


window.addEventListener("click",function(e){
	Player.check();
});

setInterval(function(){

	//console.info("check");
	Player.check();
},50);


function contentReceiver(m){
	console.info("content recieve",m);

	if(m.to == "all" || m.to=="content"){
		
		if(m.name == "getSongInfo" && m.from=="popup"){

			var songInfo=this.getSongInfo();
			console.info("返回popup歌曲信息",songInfo);
			//返回信息
			browser.runtime.sendMessage({
		    	"name":"getSongInfo",
		    	"data":songInfo,
		    	"from":"content",
		    	"to":"popup"
	    	});
		}
	}
}

browser.runtime.onMessage.addListener(contentReceiver);


var myPort = browser.runtime.connect({name:"port-from-cs"});
myPort.postMessage({greeting: "hello from content script"});

//接收来自background的消息
myPort.onMessage.addListener(function(m) {
  console.log("In content script, received message from background script: ");
  console.log(m);
  if(m.action=="play"){
  	Player.play();
  }else if(m.action=="pause"){
  	Player.pause();
  }else if(m.action=="pre"){
  	Player.pre();
  }else if(m.action=="next"){
  	Player.next();
  }
});


myPort.postMessage({greeting: "they clicked the page!"});
