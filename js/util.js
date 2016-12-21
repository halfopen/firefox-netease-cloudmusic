! function(e) {
    e.$ = function(e) {
            return document.querySelector(e)
        },
        e.$$ = function(e) {
            return Array.prototype.slice.apply(document.querySelectorAll(e))
        }
}(window),
function(e) {
    e.Events = {
        INIT_PLAYER: "INIT",
        SONG_CHANGE: "SONG_CHANGE",
        TIME_CHANGE: "TIME_CHANGE",
        SONG_PROGRESS: "SONG_PROGRESS",
        SONG_PAUSE: "PAUSE",
        STATE_CHANGE: "STATE_CHANGE",
        VOLUME_CHANGE: "VOLUME_CHANGE",
        GO_PAGE: "GO_PAGE",
        PLAY: "PLAY",
        NEXT: "NEXT",
        PREV: "PREV",
        RESET_PLAYER: "RESET",
        PLAY_TYPE_CHANGE: "PLAY_TYPE_CHANGE",
        CLICK_SONG_LIST_ITEM: "CLICK_SONG_LIST_ITEM",
        REQUEST_SONG_LIST: "REQUEST_SONG_LIST",
        RESPONSE_SONG_LIST: "RESPONSE_SONG_LIST",
        BIT_RATE_CHANGE: "BIT_RATE_CHANGE",
        REQUEST_SONG_LRC: "REQUEST_SONG_LRC",
        RESPONSE_SONG_LRC: "RESPONSE_SONG_LRC",
        ADD_TO_LIKE: "ADD_TO_LIKE",
        ADD_LIKE_START: "ADD_LIKE_START",
        ADD_LIKE_FINISH: "ADD_LIKE_FINISH",
        GET_SONG_TIME: "GET_SONG_TIME",
        RESPONSE_SONG_TIME: "RESPONSE_SONG_TIME"
    }
}(window),
function(e) {
    e.Util = {
        generateUUID: function() {
            var e = (new Date).getTime(),
                t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                    var n = (e + 16 * Math.random()) % 16 | 0;
                    return e = Math.floor(e / 16),
                        ("x" == t ? n : 7 & n | 8).toString(16)
                });
            return t
        },
        trim: function(e) {
            return e.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ")
        },
        getElementText: function(e) {
            var t = document.createElement("div");
            return t.innerHTML = e,
                t.innerText
        },
        getElementWrap: function(e) {
            var t = document.createElement("div");
            return t.innerHTML = e,
                t
        },
        getProgressInSeconds: function(e) {
            var t = e,
                n = parseInt(t[0]),
                r = parseInt(t[1]);
            return 60 * n + r
        },
        observeDOM: function() {
            var t = e.MutationObserver || e.WebKitMutationObserver,
                n = e.addEventListener;
            return function(e, r) {
                if (t) {
                    var i = new t(function(e, t) {
                        (e[0].addedNodes.length || e[0].removedNodes.length) && r()
                    });
                    i.observe(e, {
                        childList: !0,
                        subtree: !1
                    })
                } else
                    n && (e.addEventListener("DOMNodeInserted", r, !1),
                        e.addEventListener("DOMNodeRemoved", r, !1))
            }
        }(),
        injectScript: function(e, t) {
            var n = document.getElementsByTagName(t)[0],
                r = document.createElement("script");
            r.setAttribute("type", "text/javascript"),
                r.setAttribute("src", e),
                n.appendChild(r)
        },
        now: Date.now || function() {
            return (new Date).getTime()
        },
        debounce: function(e, t, n) {
            var r, i, o, E, _, u = this,
                c = function() {
                    var a = u.now() - E;
                    t > a && a > 0 ? r = setTimeout(c, t - a) : (r = null,
                        n || (_ = e.apply(o, i),
                            r || (o = i = null)))
                };
            return function() {
                o = this,
                    i = arguments,
                    E = u.now();
                var a = n && !r;
                return r || (r = setTimeout(c, t)),
                    a && (_ = e.apply(o, i),
                        o = i = null),
                    _
            }
        },
        noop: function() {}
    }
}(window),
function(e) {
    e.Config = {
        music_163_url: "http://music.163.com/",
        music_163_player_id: "#g_player",
        music_163_player_list_id: "#g_playlist",
        music_163_add_like_success_msg: "收藏成功",
        options: {
            notificationTimeout: 3e3,
            bitRate: 96,
            desktopLrc: "show"
        }
    }
}(window),
function(e) {
    function t() {}
    t.prototype = {
            init: function() {
                this.bindEvent(),
                    this.afterInit && this.afterInit(this, arguments)
            },
            extend: function(e) {
                var n = function() {},
                    r = null;
                n.prototype = Object.create(t.prototype),
                    r = new n;
                for (var i in e)
                    e.hasOwnProperty(i) && (r[i] = e[i]);
                return r
            },
            bindEvent: function() {
                var e = this,
                    t = null,
                    n = null;
                if (e.events)
                    for (var r in e.events)
                        ! function(r) {
                            e.events.hasOwnProperty(r) && (n = r.split(" "),
                                t = Array.prototype.slice.apply(document.querySelectorAll(n[1])),
                                t.forEach(function(t) {
                                    t.addEventListener(n[0], function(t) {
                                        e[e.events[r]].call(e, t)
                                    })
                                }))
                        }(r)
            }
        },
        e.Base = new t
}(window);