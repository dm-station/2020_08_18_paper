
// 横竖屏检测
var landscape = function () {
  var orienterTip = document.createElement('div')
  orienterTip.style.cssText = 'width:100%;height:100%;position:fixed;left:0px;top:0px;z-index:999999999;background:#000 url(./img/tip.png) no-repeat center center;display:none;'
  setTimeout(function () {
    document.body.appendChild(orienterTip)
  }, 200)
  function updateOrientation () {
    setTimeout(function () {
      var myWidth = document.body.clientWidth
      var myHeight = document.body.clientHeight
      if (myWidth > myHeight) {
        orienterTip.style.display = 'block'
      } else {
        orienterTip.style.display = 'none'
      }
    }, 250)
  }
  updateOrientation()
  window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', updateOrientation, false)
}

/* eslint-disable */
  var mousedown = 'mousedown '// 鼠标按下
  var mousemove = 'mousemove '// 鼠标移动
  var mouseup = 'mouseup '// 鼠标抬起
  var mouseout = 'mouseout '// 鼠标移除
  var mouse = 'PC'
if (document.hasOwnProperty('ontouchstart') || 'ontouchstart' in window) {
  mousedown = 'touchstart '// 手指按下
  mousemove = 'touchmove '// 手指移动
  mouseup = 'touchend '// 手指抬起
  mouseout = 'touchcancel '// 手指移除
  mouse = 'YD'
}

function getRequestParams (strname) {
  var url = location.search // 获取url中"?"符后的字串
  var theRequest = new Object()
  if (url.indexOf('?') != -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
    }
  }
  return theRequest[strname]
}

/* eslint-enable */

var video = document.getElementById('video')
document.addEventListener('WeixinJSBridgeReady', function () {
  WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
    console.log('WeixinJSBridge')
    // document.getElementById('video').play()
    // document.getElementById('video').pause()
    WeixinReady()
  })
}, false)

function WeixinReady () {
  if (video) {
    video.audioOut.unlock()
    video.audioOut.volume = 1
  }
}

$(function () {
  landscape()
  share()
  document.body.addEventListener('touchmove', function (e) {
    e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
  }, {passive: false}) // passive 参数不能省略，用来兼容ios和android

  // 为统一用户交互即muted（静音）自动播放，Android系统下未使用chromium M71版本的webview仍不支持autoplay策略（浏览器市场占比较大）。
  function toggleVolumn () {
    console.log('toggleVolumn')
    // 如果是依据autoplay policy而消音
    if (!video.audioOut.unlocked) {
      // 解除消音
      video.audioOut.unlock()
      // 避免一些隐患手动设置volume
      video.audioOut.volume = 1
    } else {
      // video.volume = video.volume > 0 ? 0 : 1
    }
    document.getElementById('main').removeEventListener('click', toggleVolumn)
  }

  // 渠道检测channel moments-->朋友圈 people-->人民日报 qrcode-->包装扫码
  var channel = getRequestParams('channel')

  // 测试ES6
  // let name = 'wangjiyongbao'
  // $('.hi').html(name)
  // name = '忘记'
  // window.name = name

  var s = document.body.clientWidth / 750
  //   var stageW = document.body.clientWidth / s
  var stageH = document.body.clientHeight / s
  console.log('stageH', stageH)

  var state = 'play1'// play1=播放沙画视频，pause1=视频1暂停，poster=出现视频2封面，play2=播放视频2，swiper=轮播图
  var canvas = document.getElementById('game')
  var canvas2 = document.getElementById('game2')
  var videoName
  var url
  var url2

  if (stageH > 1300) {
    videoName = 'big'
  } else {
    videoName = 'small'
    $('.tvc_bg').attr('src', './img/' + videoName + '/tvc_bg.jpg').css('height', '100%')
    $('.tvc_bottom').attr('src', './img/' + videoName + '/tvc_bottom.png').addClass('tvc_bottoms')
    $('.tvc_btn').attr('src', './img/' + videoName + '/tvc_btn.png').addClass('tvc_btns')
    $('.homeBox').css('top', stageH / 100 + 'rem')
    $('.home_bg').attr('src', './img/' + videoName + '/home_bg.jpg').css('height', '100%')
    $('.home').addClass('homes')
  }
  for (var i = 0; i < 4; i++) {
    $('.swiper-wrapper img').eq(i).attr('src', './img/' + videoName + '/swiper' + (4 - i) + '.png')
  }
  url = 'video/' + videoName + '.ts'
  url2 = 'video/tvc_' + videoName + '.ts'

  var id = 1// 轮播图id
  var tm1 = setInterval(() => {
    id++
    if (id > 3) {
      id = 1
    }
    $('.scissors').attr('src', './img/scissors' + id + '.png')
  }, 230)
  $('#p2').removeClass('none')
  var num = 0// 进度条
  var tm = setInterval(() => {
    num += 5
    if (num >= 100) {
      num = 100
      clearInterval(tm)
      clearInterval(tm1)
      setTimeout(function () {
        video.play()
        state = 'pause1'

        $('#p1').addClass('none')
      }, 1000)
    }
    $('.progress').html(num)
    // console.log('num', num)
  }, 50 * 5)

  // 视频
  var tms = setInterval(function () {
    // console.log('currentTime', video.currentTime, video.volume)
    if (video.currentTime > 0.1 && num < 100) {
      clearInterval(tms)
      video.pause()
    }
  }, 50)

  video = new JSMpeg.Player(url, {canvas: canvas,
    loop: false,
    autoplay: true, // 是否立即开始播放
    // chunkSize: 1024 * 1024,//一次加载的块大小（以字节为单位）。默认值1024*1024（1mb）
    onEnded: videoEnd
  })

  document.getElementById('main').addEventListener('click', toggleVolumn)

  var player// 结束页视频

  function videoEnd () {
    $('#p3').removeClass('none')
    $('#p2').addClass('none')
    video.pause()
    // setTimeout(function () {
    state = 'poster'// 长图页允许第二次滑动
    // }, 600)
    if (!player) {
      console.log('creatPlayer')
      player = new JSMpeg.Player(url2, {canvas: canvas2, loop: false, autoplay: false, onEnded: playerEnd})
    }
  }

  function playerEnd () {
    close()
    console.log('player.currentTime', player.currentTime)
  }

  // 视频2
  var interval2 = setInterval(function () {
    if (!player) return
    // console.log('player.currentTime', player.currentTime)
    if (player && player.currentTime > 6) {
      $('.close').removeClass('none')
    } else {
      $('.close').addClass('none')
    }
  }, 100)

  var isPage = true
  var startX, startY, moveEndX, moveEndY

  $('body').on(mousedown, touchStart)
  function touchStart (e) {
    if (!isPage) return
    $('body').on(mousemove, touchMove)
    $('body').on(mouseup, touchEnd)
    startX = e.originalEvent.changedTouches[0].pageX
    startY = e.originalEvent.changedTouches[0].pageY
  }

  function touchMove (e) {
    // let moveX = e.originalEvent.changedTouches[0].pageX
    // let moveY = e.originalEvent.changedTouches[0].pageY
    // console.log('move', moveX, moveY)
  }

  function touchEnd (e) {
    $('body').off(mousemove, touchMove)
    $('body').off(mouseup, touchEnd)
    moveEndX = e.originalEvent.changedTouches[0].pageX
    moveEndY = e.originalEvent.changedTouches[0].pageY
    let X = moveEndX - startX
    let Y = moveEndY - startY
    let offset = 50

    // console.log(mouseup, startX, startY, moveEndX, moveEndY, X, Y, state)

    if (X < -offset && state === 'swiper') { // 左滑
      showPage('left')
    } else if (X > offset && state === 'swiper') { // 右滑
      showPage('right')
    } else if (Y > offset) { // 下滑
      showPage('down')
    } else if (Y < -offset) { // 上滑
      // showPage('up')
      solide()
    }
    // if (X < -offset) { // 左滑
    //   showPage('left')
    // } else if (X > offset) { // 右滑
    //   showPage('right')
    // } else if (Y > offset) { // 下滑
    //   showPage('down')
    // } else if (Y < -offset) { // 上滑
    //   // showPage('up')
    //   solide()
    // } else { // 单击
    //   showPage('单击')
    // }
  }

  function showPage (type) {
    // console.log('type', type)
    if (state === 'swiper' && type === 'down') { // 轮播图页面
      state = 'poster'
      $('#p3').animate({
        // 'transform': 'translate3d(0, 0, 0)'
        'top': '0rem'
      })
    } else if (state === 'poster' && type === 'down') { // 返回视频页
      state = 'pause1'
      video.play()
      $('#p3').addClass('none')
      $('#p2').removeClass('none')
    }
  }

  function solide () {
    // console.log('solide', state)
    if (state === 'pause1') { // 视频1暂停，允许第一次滑动
      console.log('第一次滑动')
      video.currentTime = 0.1
      videoEnd()
      BHDmp('track', '1')
    } else if (state === 'poster') { // 出现视频2封面，允许第二次滑动
      state = 'swiper'
      console.log('第二次滑动')
      var _y = stageH > 1300 ? 15 : stageH / 100
      $('#p3').animate({
        'top': '-' + _y + 'rem'
      })
      BHDmp('track', '2')
    }
  }

  $('.tvc_btn').on(mouseup, function () {
    player.currentTime = 0.1
    player.play()
    if (!player.audioOut.unlocked) {
      // 解除消音
      player.audioOut.unlock()
      // 避免一些隐患手动设置volume
      player.audioOut.volume = 1
    }
    state = 'play2'
    // 视频播放按钮
    BHDmp('track', '3')
    $('#p4').removeClass('none')
  })
  $('.close').on(mouseup, close)

  function close () {
    state = 'poster'
    BHDmp('track', '7')
    $('#p4').addClass('none')
    player.pause()
  }

  $('.home').on(mouseup, function () {
    var jump = ''
    BHDmp('track', '4')
    // window.location.replace('http://www.baidu.com')
    switch (channel) {
      case 'moments':
        jump = 'https://pro.m.jd.com/mall/active/2e5u1xgpsTkBgzVpcEVDS3XiER7W/index.html?babelChannel=ttt1'
        console.log('朋友圈')
        break
      case 'people':
        jump = 'https://pro.m.jd.com/mall/active/2e5u1xgpsTkBgzVpcEVDS3XiER7W/index.html?babelChannel=ttt3'
        console.log('人民日报')
        break
      default:
        console.log('包装扫码')
        jump = 'https://v2.javamall.cn/telunsu/himilk/product/index.html?actvCome=guli'
        break
    }
    setTimeout(() => {
      window.location.href = jump
    }, 450)
  })

  var swiper = new Swiper('.swiper-container', {
    autoplay: false, // 可选选项，自动滑动
    // direction: 'vertical',
    // slidesPerView: 'auto',
    loop: false,
    observer: true, // 修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, // 修改swiper的父元素时，自动初始化swiper
    on: {
      touchEnd: function (swiper, event) {
        // console.log('touchEnd', swiper, event, 'activeIndex:', swiper.activeIndex)
      },
      slideChangeTransitionStart: function () {
        // console.log(this.activeIndex)// 切换结束时，告诉我现在是第几个slide
      }
    }
  })
  window.swiper = swiper
})

function share () {
  var _title = '做有颜值的实粒派' // 分享标题
  var _desc = '和特仑苏谷粒牛奶一起传承剪刻纸非遗艺术，倾享谷粒时刻' // 分享的描述
  var _link = window.location.href // 分享的连接
  var _imgUrl = 'https://telunsu2020guli.mengniu.com.cn/share/share.jpg' // 分享的图片
  var url = encodeURIComponent(window.location.href.split('#')[0])
  url = url.replace('http%3A%2F%2F', '')
  $.ajax({
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    url: '//api.slb.moneplus.cn/jssdk/real_list.php?url=' + url,
    success: function (result) {
      // console.log(JSON.stringify(data));
      wx.config({
        debug: false,
        appId: result.appId,
        timestamp: result.timestamp,
        nonceStr: result.nonceStr,
        signature: result.signature,
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData'
        ]
      })
      wx.ready(function () {
        // 在这里调用 API
        // 2. 分享接口
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.updateAppMessageShareData({
          title: _title,
          desc: _desc,
          link: _link,
          imgUrl: _imgUrl,
          trigger: function (res) {
            //  alert('用户点击发送给朋友');
          },
          success: function (res) {
            BHDmp('track', '5')
            //  alert('已分享');
          },
          cancel: function (res) {
            //  alert('已取消');
          },
          fail: function (res) {
            //  alert(JSON.stringify(res));
          }
        })
        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.updateTimelineShareData({
          title: '一起做有颜值的实粒派',
          link: _link,
          imgUrl: _imgUrl,
          trigger: function (res) {
            //   alert('用户点击分享到朋友圈');
          },
          success: function (res) {
            BHDmp('track', '6')
            // alert('已分享');
          },
          cancel: function (res) {
            //  alert('已取消');
          },
          fail: function (res) {
            //   alert(JSON.stringify(res));
          }
        })
      }) // end of wx.ready
    }
  })
}
