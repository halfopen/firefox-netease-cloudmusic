console.info("设置页面");

function 加载配置() {
    //加载配置
    var 本地是否显示歌词 = browser.storage.local.get('是否显示歌词');
    本地是否显示歌词.then(function(本地配置) {
        console.info("加载配置", 本地配置);
        var 歌词开关元素 = document.getElementById("歌词开关");
        if (本地配置 && 本地配置.是否显示歌词) {
            歌词开关元素.checked = true;
        } else {
            歌词开关元素.checked = false;
        }
    }, function() {
        console.info("加载本地配置失败");
    });
}

function 保存配置() {

    var 歌词开关元素 = document.getElementById("歌词开关");
    var 是否显示歌词 = 歌词开关元素.checked;
    console.info("保存配置", 是否显示歌词);
    browser.storage.local.set({ '是否显示歌词': 是否显示歌词 });
}

document.addEventListener('DOMContentLoaded', 加载配置);
document.querySelector("#歌词开关").addEventListener("change", 保存配置);