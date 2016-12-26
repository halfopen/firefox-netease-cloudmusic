


var Player = {

   	coverImg :"",
   	progress :"",
   	songName :"",
   	artist :"",
   	isPlaying:false,
   	time:"",
   	lrc:"",
   	lrcList:[],

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
		this.lrcList = this.getLrcList();
		
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
		songInfo.time = this.getTime();
		//sconsole.info(songInfo.time,parseFloat(time2Seconds(songInfo.time)));
		songInfo.lrc = this.getLrc();
		return songInfo;
	},

	check:function(){
		var songInfo=this.getSongInfo();
		if(this.lrcList.length==0){
			console.info("重新获取歌词列表");
			this.lrcList = this.getLrcList();
			console.info(this.lrcList);
		}else{
			//console.info(this.lrcList);
		}
		var needUpdate = false;
		
		if(songInfo.coverImg!=this.coverImg){
			console.info(songInfo.coverImg, this.coverImg, songInfo.coverImg !=this.coverImg);
			this.coverImg = songInfo.coverImg;
			this.lrcList = [];
			this.lrc="";
			needUpdate = true;
		}
		if(songInfo.progress!=this.progress){
			//console.info(songInfo.progress, this.progress, songInfo.progress !=this.progress);
			//console.info("lrc",this.lrcList);
			//console.info("lrc:",this.getLrc());
			this.progress = songInfo.progress;
			//this.updateSongInfo(songInfo);
			this.time = songInfo.time;


			if(this.lrc!=songInfo.lrc){
				this.lrc = songInfo.lrc;
				needUpdate = true;
				//显示歌词
				this.sendSongInfo(songInfo);
			}
			//needUpdate = true;
		}
		if(songInfo.songName !=this.songName){
			console.info("切歌");
			console.info(songInfo.songName, this.songName, songInfo.songName !=this.songName);
			this.songName = songInfo.songName;
			this.lrcList = [];
			this.lrc="";
			needUpdate = true;
		}
		if(songInfo.artist !=this.artist){
			console.info(songInfo.artist, this.artist, songInfo.artist !=this.artist);
			this.artist = songInfo.artist;
			this.lrcList = [];
			this.lrc="";
			needUpdate = true;
		}

		if(songInfo.isPlaying !=this.isPlaying){
			this.isPlaying = songInfo.isPlaying;
			this.lrcList = [];
			this.lrc="";
			needUpdate = true;
		}
		
		if(needUpdate==true){
			//console.info(needUpdate);
			this.updateSongInfo(songInfo);
			
		}
	},
	afterInit:function(){

	},
	getLrcList:function(){
		var list = [];
		if(document.querySelector("#g_playlist")==null){
			$(".icn.icn-list").click();
			setTimeout(function(){
				var lrcNodeList = $$(".listlyric.j-flag p.j-flag");
				var t,l;
				
				for(var i=0;i<lrcNodeList.length;i=i+1){
					t = lrcNodeList[i].getAttribute("data-time");
					l = lrcNodeList[i].innerText;
					list.push({"time":t,"lrc":l})
				}
				$(".icn.icn-list").click();
				
			},2000);
			
		}else{
			var lrcNodeList = $$(".listlyric.j-flag p.j-flag");
			var t,l;
			setTimeout
			console.info(this.lrcList);
			for(var i=0;i<lrcNodeList.length;i=i+1){
				t = lrcNodeList[i].getAttribute("data-time");
				l = lrcNodeList[i].innerText;
				list.push({"time":t,"lrc":l})
			}
		}

		return list;
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
	//获取当前歌词
	getLrc:function(){
		var s = time2Seconds(this.time);
		var lrc="";
		var flag = false;

		var currentTime = parseFloat(s);//当前时间

		for(var i=0;i<this.lrcList.length;i=i+1){

			if(flag==true && currentTime<parseFloat(this.lrcList[i].time)){
				lrc = this.lrcList[i].lrc;
				break;
			}
			//歌词开始标志
			if(currentTime>parseFloat(this.lrcList[i].time)){
				flag = true;
			}
		
		}
		return lrc;
	},
	//获取播放时间进度
	getTime:function(){
		return $(".j-flag.time em").innerText;
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
