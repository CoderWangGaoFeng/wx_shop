App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  },
  globalData:{
    accountId:"1",
    url:"http://127.0.0.1/",
    appId: 'wxc6b2f5ff6ca680bc',//小程序官网获取
    secret: 'e73ac5c456e321b0f622261005319e49',//小程序官网获取
  },
})
