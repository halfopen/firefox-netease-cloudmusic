(function(){

	var isClick = false;

	var play = function(){
		isClick = true;
		$("#play").className = "bg mid play f-hide";
		$("#pause").className = "bg mid pause";
		browser.runtime.sendMessage({
	    	"name":"play",
	    	"data":"",
	    	"from":"popup",
	    	"to":"background"
		});

		
		setTimeout(function(){
			isClick = false;
		},1000);
		
	};

	var pause = function(){
		isClick = true;
		$("#pause").className = "bg mid pause f-hide";
		$("#play").className = "bg mid play";
		browser.runtime.sendMessage({
	    	"name":"pause",
	    	"data":"",
	    	"from":"popup",
	    	"to":"background"
		});
		setTimeout(function(){
			isClick = false;
		},1000);
	};

	var pre = function(){

		browser.runtime.sendMessage({
	    	"name":"pre",
	    	"data":"",
	    	"from":"popup",
	    	"to":"background"
		});

	};

	var next = function(){
		browser.runtime.sendMessage({
	    	"name":"next",
	    	"data":"",
	    	"from":"popup",
	    	"to":"background"
		});
	};
	

	//点击 显示/隐藏 列表
	$(".bg.open").onclick = function(){
		if($("#list").className == "list"){
			$("#list").className = "list z-close";
		}else{
			$("#list").className = "list";
		}
		
	};
	//播放
	$("#play").onclick = play;
	//暂停
	$("#pause").onclick = pause;

	//上一首
	$("#prev").onclick = pre;

	$("#next").onclick = next;



	function update(data){
		//console.info("update",data);

	    if(data.coverImg!=undefined){
	        $("#cover").src = data.coverImg;
	    }

	    if(data.progress!=undefined){
	        $(".played.j-flag").style.width = data.progress;
	    }

	    if(data.songName!=undefined){
	        $("#title").innerText = data.songName;
	    }

	    if(data.artist!=undefined){
	        //SongInfo.artist = data.artist;
	    }

	    if(data.isPlaying!=undefined){
	    	if(isClick==false){
		    	if(data.isPlaying==true){
		    		$("#play").className = "bg mid play f-hide";
					$("#pause").className = "bg mid pause";
		    	}else{
		    		$("#pause").className = "bg mid pause f-hide";
					$("#play").className = "bg mid play";
		    	}
	    	}
	    }
	}

	function init(){
		console.info("popup初始化");
		var page = browser.extension.getBackgroundPage();
		var songInfo = page.SongInfo;

		update(songInfo);
	}

	// function popupReceiver(m){
		
	// 	if(m.to == "all" || m.to=="popup"){
	// 		console.info("popup recieve",m);
	// 		if(m.name=="update"){
	// 			update(m.data);
	// 		}
	// 	}
	// }
	
	function check(){
		var page = browser.extension.getBackgroundPage();
		var songInfo = page.SongInfo;
		update(songInfo);
	}

	setInterval(function(){

		//console.info("check");
		check();
	},50);

	init();

	// browser.runtime.onMessage.addListener(popupReceiver);
})();