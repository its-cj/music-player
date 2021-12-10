const Router = require("koa-router")
const router = Router()
const request = require('request');
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'scj990726',
    database: 'musicInfo'
});
conn.connect();

const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
const fs = require("fs")

var log = require('log4node')
// 系统配置
const config = {
    // 请求地址
    hostUrl: "wss://rtasr.xfyun.cn/v1/ws",
    //在控制台-我的应用-实时语音转写获取
    appid: "4d81c5f9",
    //在控制台-我的应用-实时语音转写获取
    apiKey: "e2494840f05b255699a1efb39497807a",
    // file: "./test_1.pcm",//请填写您的音频文件路径
    highWaterMark: 1280
}


const head = {  //设置请求头
    "Cookie": 'GA1.2.1217262868.1636940744; _gid=GA1.2.822822965.1636940744; _gat=1; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1636940744,1637023524,1637023549,1637023553; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1637023553; kw_token=3REKQ0SW4D',
    'csrf': '3REKQ0SW4D'
}
router.get("/", async (ctx) => {
    ctx.body = "主界面"
})
router.get("/get_rankinglist", async (ctx) => {
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/bang/bang/bangMenu?httpsStatus=1&reqId=c53758e0-468b-11ec-bd67-f75dcb4c241f',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicList = body;
                resolve(dict)
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_rankmusic", async (ctx) => {
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/bang/index/bangList?httpsStatus=1&reqId=41a19730-4680-11ec-97da-0b5b679cd11b',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicList = body;
                resolve(dict)
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_banglist", async (ctx) => {
    let bangid = ctx.request.query.bangid
    let pn = ctx.request.query.pn || 1
    let rn = ctx.request.query.rn || 30
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=' + bangid + '&pn=' + pn + '&rn=' + rn + '&httpsStatus=1&reqId=21defb70-468c-11ec-ac7f-0fbad84af7fa',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicList = body;
                resolve(JSON.stringify(dict))
            }
        })
    })
    ctx.body = await pro
})
router.get("/hot_search", async (ctx) => {
    ctx.body = await new Promise(function (resolve, reject) {
        let url = "http://www.kuwo.cn/api/www/search/searchKey?httpsStatus=1&reqId=83b7e430-575b-11ec-9037-c1edc17c24c9&key"
        request({
            url: url, headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                'Cookie': '_ga=GA1.2.992617754.1637407796; h5Uuid=97fbabf31fbf46f4a2104b3f62d86e-11; _gid=GA1.2.2091958353.1638881057; _gat=1; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1638624360,1638624384,1638881057,1638881085; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1638881085; kw_token=I1DWRIGCRLN',
                'csrf': 'I1DWRIGCRLN',
                'Referer': '[{"key":"Referer","value":"http://www.kuwo.cn/search/list?key=%E5%91%A8%E6%9D%B0%E4%BC%A6","description":"","type":"text","enabled":true}]'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //输出返回的内容
                resolve(body)
            }
        });
    })
})
router.get("/music_list", async (ctx) => {
    ctx.body = await new Promise(function (resolve, reject) {
        let k_w = ctx.request.query.key_word
        let pn = ctx.request.query.pn || 1
        k_w = encodeURIComponent(k_w)
        let url = "https://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=" + k_w + "&pn=" + pn + "&rn=30&httpsStatus=1&reqId=875df480-feec-11ea-8d36-0df12d83631a"
        request({
            url: url, headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                'Cookie': '_ga=GA1.2.1617498609.1590546594; _gid=GA1.2.1209608045.1607588309; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1607588309,1607657192,1607733198,1607735840; _gat=1; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1607752799; kw_token=87ZVZMQEK4F',
                'csrf': '87ZVZMQEK4F',
                'Referer': 'https://www.kuwo.cn/search/list?key=zhoujielun'
            }
        }, function (error, response, body) {
            console.log(error)
            if (!error && response.statusCode == 200) {
                //输出返回的内容
                resolve(body)
            }
        });
    })
})
router.get("/like_luck", (ctx) => {
    let dict = [{
        name: '花海',
        artist: '周杰伦',
        id: 440615,
        hasmv: 1,
        pic: 'https://img3.kuwo.cn/star/albumcover/500/72/44/3648126291.jpg',
        myThink: '超过78%的人播放',
        is_show: 'specail',
        songTimeMinutes: '04:24'
    },
    {
        name: '独家记忆',
        artist: '陈小春',
        id: 381027,
        hasmv: 1,
        pic: 'https://img2.kuwo.cn/star/albumcover/500/47/8/4198334693.jpg',
        myThink: '有关于你绝口不提',
        is_show: 'nomal',
        songTimeMinutes: '05:07'
    },
    {
        name: '永不失联的爱',
        artist: '周兴哲',
        id: 37428520,
        hasmv: 1,
        pic: 'https://img4.kuwo.cn/star/albumcover/500/15/26/1749830753.jpg',
        songTimeMinutes: '04:19'
    }]
    ctx.body = dict
})
router.get("/mv_recommend", async (ctx) => {
    let pid = ctx.request.query.pid
    let pn = ctx.request.query.pn || 1
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/music/mvList?pid=' + pid + '&pn=' + pn + '&rn=10&httpsStatus=1&reqId=13dd8df0-468e-11ec-b4b6-03f45076227c',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_swiper", async (ctx) => {
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/banner/index/bannerList?httpsStatus=1&reqId=41a0faf0-4680-11ec-97da-0b5b679cd11b',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_mvpath", async (ctx) => {
    let mid = ctx.request.query.mid
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/v1/www/music/playUrl?mid=' + mid + '&type=mv&httpsStatus=1&reqId=b00da610-46a7-11ec-a4fd-3b81190e24fe',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_rotation", async (ctx) => {
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/banner/index/bannerList?httpsStatus=1&reqId=41a0faf0-4680-11ec-97da-0b5b679cd11b',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_index", async (ctx) => {
    let dict = {};
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=1&rn=6&httpsStatus=1&reqId=21defb70-468c-11ec-ac7f-0fbad84af7fa',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.hotMusic = body;
                request({
                    url: 'http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=17&pn=1&rn=6&httpsStatus=1&reqId=21defb70-468c-11ec-ac7f-0fbad84af7fa',
                    headers: head
                }, function (error, response, body) {
                    if (error) {
                        reject(error)
                    } else {
                        dict.newMusic = body;
                        request({
                            url: 'http://www.kuwo.cn/api/www/banner/index/bannerList?httpsStatus=1&reqId=41a0faf0-4680-11ec-97da-0b5b679cd11b',
                            headers: head
                        }, function (error, response, body) {
                            if (error) {
                                reject(error)
                            } else {
                                dict.swiperList = body;
                                resolve(JSON.stringify(dict))
                            }
                        })
                    }
                })
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_index2", async (ctx) => {
    let dict = {};
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/rcm/index/playlist?loginUid=0&httpsStatus=1&reqId=41a12200-4680-11ec-97da-0b5b679cd11b',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                // 判断是不是 <html>  ?
                dict.recommendMusic = JSON.parse(body).data.list;
                request({
                    url: 'http://www.kuwo.cn/api/www/bang/index/bangList?httpsStatus=1&reqId=41a19730-4680-11ec-97da-0b5b679cd11b',
                    headers: head
                }, function (error, response, body) {
                    if (error) {
                        reject(error)
                    } else {
                        let data = JSON.parse(body)
                        dict.rankMusic = data.data
                        resolve(JSON.stringify(dict))
                    }
                })
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_music", async (ctx) => {
    let rid = ctx.request.query.rid
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://antiserver.kuwo.cn/anti.s?format=mp3&rid=' + rid + '&type=convert_url',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicPath = body;
                resolve(JSON.stringify(dict))
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_musiclist", async (ctx) => {
    let pid = ctx.request.query.pid
    let pn = ctx.request.query.pn || 1
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/playlist/playListInfo?pid=' + pid + '&pn=' + pn + '&rn=30&httpsStatus=1&reqId=c039f060-4685-11ec-97da-0b5b679cd11b',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicList = body;
                resolve(JSON.stringify(dict))
            }
        })
    })
    ctx.body = await pro
})
router.get("/music_cover", async (ctx) => {
    let bangId = ctx.request.query.bangId
    let pn = ctx.request.query.pn || 1
    let rn = ctx.request.query.rn || 10
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/classify/playlist/getTagPlayList?pn=' + pn + '&rn=' + rn + '&id=' + bangId + '&httpsStatus=1&reqId=fb9b2c70-4688-11ec-bd67-f75dcb4c241f',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicList = body;
                resolve(dict)
            }
        })
    })
    ctx.body = await pro
})
router.get("/songsheet_all", async (ctx) => {
    let isNew = ctx.request.query.isNew
    let pn = ctx.request.query.pn || 1
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/playlist/getTagList?httpsStatus=1&reqId=1081c781-4688-11ec-bd67-f75dcb4c241f',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicList = body;
                resolve(dict)
            }
        })
    })
    ctx.body = await pro
})
router.get("/songsheet_newold", async (ctx) => {
    let isNew = ctx.request.query.isNew
    let pn = ctx.request.query.pn || 1
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/classify/playlist/getRcmPlayList?pn=' + pn + '&rn=21&order=' + isNew + '&httpsStatus=1&reqId=a0ad7970-4689-11ec-bd67-f75dcb4c241f',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicList = body;
                resolve(dict)
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_rankmusiclist", async (ctx) => {
    let bangId = ctx.request.query.bangId
    let pn = ctx.request.query.pn || 1
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=' + bangId + '&pn=' + pn + '&rn=30&httpsStatus=1&reqId=21defb70-468c-11ec-ac7f-0fbad84af7fa',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                dict.musicList = body;
                resolve(dict)
            }
        })
    })
    ctx.body = await pro
})
router.get("/get_music_lyric", async (ctx) => {
    let rid = ctx.request.query.rid
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        request({
            url: "http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=" + rid + "&httpsStatus=1&reqId=3f78c160-e233-11eb-ae61-1344a4936263",
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                // console.log(body)
                dict.musicList = JSON.parse(body).data;
                resolve(dict)
            }
        })
    })
    ctx.body = await pro
})
router.get("/wx_login", async (ctx) => {
    let code = ctx.request.query.code
    let pro = new Promise((resolve, reject) => {
        request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx197be9c1ea1f6e0e&secret=807f8f1e102d4e63f026bc3f4ed605f9&js_code=' + code + '&grant_type=authorization_code',
            headers: head
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
    ctx.body = await pro
})
router.get('/add_user', async (ctx, next) => {
    let name = ctx.request.query.name;
    let img = ctx.request.query.img;
    let nickname = ctx.request.query.nickname;
    let a = new Promise(function (succ, err) {
        conn.query('select * from user where name=\'' + name + '\';', function (error, results, fields) {
            if (error) {
                err(error)
            } else {
                if (results.length < 1) {
                    conn.query('insert into user (name,img,nickname) values (\'' + name + '\',\'' + img + '\',\'' + nickname + '\');', function (error, results, fields) {
                        if (error) {
                            err(error)
                        } else {
                            succ("注册成功")
                        }
                    });
                } else {
                    succ("你已经注册过了")
                }
            }
        });
    })
    ctx.body = await a
});
router.get('/about_music', async (ctx, next) => {
    let name = ctx.request.query.name;
    let dict = {}
    let a = new Promise(function (succ, err) {
        conn.query('select * from userMusicList where userId=\'' + name + '\';', function (error, results, fields) {
            if (error) {
                err(error)
            } else {
                dict.userMusicList = results
                conn.query('select * from userEnjoyList where userId=\'' + name + '\';', function (error, results, fields) {
                    if (error) {
                        err(error)
                    } else {
                        dict.userEnjoyList = results
                        conn.query('select * from collectionSongSheet where userId=\'' + name + '\';', function (error, results, fields) {
                            if (error) {
                                err(error)
                            } else {
                                dict.collectionSongSheet = results
                                conn.query('select * from selfmakeSongSheet where userId=\'' + name + '\';', function (error, results, fields) {
                                    if (error) {
                                        err(error)
                                    } else {
                                        let data = results
                                        dict.selfmakeSongSheet = data
                                        for (let i = 0; i < data.length; i++) {
                                            let id = data[i].id
                                            conn.query('select * from selfSongMes where aboutId=\'' + id + '\';', function (error, results, fields) {
                                                if (error) {
                                                    reject(error)
                                                } else {
                                                    dict.selfmakeSongSheet[i].num = results.length
                                                    if (i == data.length - 1) {
                                                        succ(dict)
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    })
    ctx.body = await a
});
router.get("/add_collection", async (ctx) => {
    let name = ctx.request.query.name
    let id = ctx.request.query.id
    let songSheetMes = ctx.request.query.songSheetMes
    let pro = new Promise((resolve, reject) => {
        conn.query('select * from collectionSongSheet where userId=\'' + name + '\' and musicId=' + id + ';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                if (results.length < 1) {
                    conn.query('insert into collectionSongSheet (userId,musicId,songSheetMes) values (\'' + name + '\',\'' + id + '\',\'' + songSheetMes + '\');', function (error, results, fields) {
                        if (error) {
                            reject(error)
                        } else {
                            resolve('添加成功')
                        }
                    });
                } else {
                    resolve('已添加过了')
                }
            }
        })
    })
    ctx.body = await pro
})
router.get("/add_selfcollection", async (ctx) => {
    let name = ctx.request.query.name
    let title = ctx.request.query.title
    let pro = new Promise((resolve, reject) => {
        conn.query('select * from selfmakeSongSheet where userId=\'' + name + '\' and title=\'' + title + '\';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                if (results.length < 1) {
                    conn.query('insert into selfmakeSongSheet (userId,title) values (\'' + name + '\',\'' + title + '\');', function (error, results, fields) {
                        if (error) {
                            reject(error)
                        } else {
                            resolve('添加成功')
                        }
                    });
                } else {
                    resolve('已有此歌单')
                }
            }
        })
    })
    ctx.body = await pro
})
router.get("/add_cumulativemusic", async (ctx) => {
    let name = ctx.request.query.name
    let musicMes = ctx.request.query.musicMes
    let musicId = ctx.request.query.musicId
    let pro = new Promise((resolve, reject) => {
        conn.query('DELETE FROM userMusicList WHERE musicId=\'' + musicId + '\' and userId=\'' + name + '\';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                conn.query('insert into userMusicList (userId,musicMes,musicId) values (\'' + name + '\',\'' + musicMes + '\',\'' + musicId + '\');', function (error, results, fields) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve('添加成功')
                    }
                });
            }
        })
    })
    ctx.body = await pro
})
router.get("/add_userEnjoyList", async (ctx) => {
    let name = ctx.request.query.name
    let musicId = ctx.request.query.musicId
    let musicMes = ctx.request.query.musicMes
    let pro = new Promise((resolve, reject) => {
        conn.query('select * from userEnjoyList where userId=\'' + name + '\' and musicId=\'' + musicId + '\';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                if (results.length < 1) {
                    conn.query('insert into userEnjoyList (userId,musicId,musicMes) values (\'' + name + '\',\'' + musicId + '\',\'' + musicMes + '\');', function (error, results, fields) {
                        if (error) {
                            reject(error)
                        } else {
                            resolve('添加成功')
                        }
                    });
                } else {
                    resolve('已有此歌曲')
                }
            }
        })
    })
    ctx.body = await pro
})
router.get("/select_userEnjoyList", async (ctx) => {
    let name = ctx.request.query.name
    let pro = new Promise((resolve, reject) => {
        conn.query('select * from userEnjoyList where userId=\'' + name + '\';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                let musicList = {}
                let arr = []
                for (let i = 0; i < results.length; i++) {
                    arr.push(JSON.parse(results[i].musicMes))
                }
                musicList.musicList = arr
                resolve(musicList)
            }
        })
    })
    ctx.body = await pro
})
router.get("/select_userMusicList", async (ctx) => {
    let name = ctx.request.query.name
    let pro = new Promise((resolve, reject) => {
        conn.query('select * from userMusicList where userId=\'' + name + '\';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                let musicList = {}
                let arr = []
                for (let i = 0; i < results.length; i++) {
                    arr.push(JSON.parse(results[i].musicMes))
                }
                musicList.musicList = arr
                resolve(musicList)
            }
        })
    })
    ctx.body = await pro
})
router.get("/select_selfmakeSongSheet", async (ctx) => {
    let name = ctx.request.query.name
    let title = ctx.request.query.title
    let pro = new Promise((resolve, reject) => {
        conn.query('select * from selfmakeSongSheet where userId=\'' + name + '\' and title=\'' + title + '\';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                let id = results[0].id
                conn.query('select * from selfSongMes where aboutId=\'' + id + '\';', function (error, results, fields) {
                    if (error) {
                        reject(error)
                    } else {
                        let musicList = {}
                        let arr = []
                        for (let i = 0; i < results.length; i++) {
                            arr.push(JSON.parse(results[i].songMes))
                        }
                        musicList.musicList = arr
                        resolve(musicList)
                    }
                })
            }
        })
    })
    ctx.body = await pro
})
router.get("/about_selfmakeSongSheet", async (ctx) => {
    console.log("9999")
    let name = ctx.request.query.name
    let dict = {}
    let pro = new Promise((resolve, reject) => {
        conn.query('select * from selfmakeSongSheet where userId=\'' + name + '\';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                let data = results
                dict.selfmakeSongSheet = data
                for (let i = 0; i < data.length; i++) {
                    let id = data[i].id
                    conn.query('select * from selfSongMes where aboutId=\'' + id + '\';', function (error, results, fields) {
                        if (error) {
                            reject(error)
                        } else {
                            dict.selfmakeSongSheet[i].musicList = results
                            if (i == data.length - 1) {
                                resolve(dict)
                            }
                        }
                    })
                }
            }
        })
    })
    ctx.body = await pro
})
router.get("/add_selfMusicMes", async (ctx) => {
    let songMes = ctx.request.query.songMes
    let aboutId = ctx.request.query.aboutId
    let musicId = ctx.request.query.musicId
    let pro = new Promise((resolve, reject) => {
        conn.query('select * from selfSongMes where aboutId=\'' + aboutId + '\' and musicId=\'' + musicId + '\';', function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                if (results.length < 1) {
                    conn.query('insert into selfSongMes (aboutId,musicId,songMes) values (\'' + aboutId + '\',\'' + musicId + '\',\'' + songMes + '\');', function (error, results, fields) {
                        if (error) {
                            reject(error)
                        } else {
                            resolve('添加成功')
                        }
                    });
                } else {
                    resolve('已有此歌曲')
                }
            }
        })
    })
    ctx.body = await pro
})
// 文件上传路由
router.post("/upload", async (ctx) => {
    var client_data = ctx.request.files;
    let file_name = client_data.scj.name;
    // 获取当前时间戳
    let ts = parseInt(new Date().getTime() / 1000)
    let wssUrl = config.hostUrl + "?appid=" + config.appid + "&ts=" + ts + "&signa=" + getSigna(ts)

    let pro = new Promise((resolve, reject) => {
        let ws = new WebSocket(wssUrl)
        var user_name = new Date().getTime()
        let name_arr = file_name.split(".");
        let file_type = name_arr[name_arr.length - 1];
        let r_s = fs.createReadStream(client_data.scj.path);
        let w_s = fs.createWriteStream("./static/voice/" + user_name + "." + file_type);
        r_s.pipe(w_s);
        let rtasrResult = []

        w_s.on("close", function () {
            let nameVoice = user_name + "." + file_type
            let str = ""
            ws.on('message', (data, err) => {
                if (err) {
                    log.info(`err:${err}`)
                    return
                }
                let res = JSON.parse(data)
                switch (res.action) {
                    case 'error':
                        log.info(`error code:${res.code} desc:${res.desc}`)
                        break
                    // 连接建立
                    case 'started':
                        // 开始读取文件进行传输
                        var readerStream = fs.createReadStream('./static/voice/' + nameVoice, {
                            highWaterMark: config.highWaterMark
                        });
                        readerStream.on('data', function (chunk) {
                            ws.send(chunk)
                        });
                        readerStream.on('end', function () {
                            // 最终帧发送结束
                            ws.send("{\"end\": true}")
                        });
                        break
                    case 'result':
                        // ... do something
                        let data = JSON.parse(res.data)
                        rtasrResult[data.seg_id] = data
                        // 把转写结果解析为句子
                        if (data.cn.st.type == 0) {
                            rtasrResult.forEach(i => {
                                // let str = "实时转写"
                                // str += (i.cn.st.type == 0) ? "【最终】识别结果：" : "【中间】识别结果："
                                // let str = ''
                                i.cn.st.rt.forEach(j => {
                                    j.ws.forEach(k => {
                                        k.cw.forEach(l => {
                                            str += l.w
                                        })
                                    })
                                })
                            })
                        }
                        break
                }
            })
            // 资源释放
            ws.on('close', () => {
                fs.unlinkSync('./static/voice/' + nameVoice)
                resolve(str)
            })
            // 建连错误
            ws.on('error', (err) => {
                log.error("websocket connect err: " + err)
            })
        })
    })
    // 鉴权签名
    function getSigna(ts) {
        let md5 = CryptoJS.MD5(config.appid + ts).toString()
        let sha1 = CryptoJS.HmacSHA1(md5, config.apiKey)
        let base64 = CryptoJS.enc.Base64.stringify(sha1)
        return encodeURIComponent(base64)
    }
    ctx.body = await pro
})


module.exports = router