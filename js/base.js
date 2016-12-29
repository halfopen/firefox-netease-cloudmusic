var $ = function(e) {
    return document.querySelector(e)
};
var $$ = function(e){
	return document.querySelectorAll(e);
};
var time2Seconds=function(str){
	var tempStr = str.replace(/(\d{2}):(\d{2})/,function(s1,s2,s3){
	  return parseInt(s2)*60+parseInt(s3)+"";
	});
	return tempStr;
}