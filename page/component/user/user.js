// page/component/new-pages/user/user.js
Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{}
  },
  onLoad(){
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res){
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      },
      fail:function(){
        wx.showToast({
          title: '获取信息失败',
          icon:"none"
        })
      }
    })
  },
  onShow(){
    var self = this;
    var url = getApp().globalData.url;
    var accountid = getApp().globalData.accountId;
    var openId = wx.getStorageSync("openId");
    /**
     * 获取本地缓存 地址信息
     */
    // wx.getStorage({
    //   key: 'address',
    //   success: function(res){
    //     self.setData({
    //       hasAddress: true,
    //       address: res.data
    //     })
    //   }
    // })
    var chooseAddress = wx.getStorageSync("chooseAddress");
    if(chooseAddress == null || chooseAddress == undefined || chooseAddress ==""){
      var address = wx.getStorageSync("address");
      if(address != null && address != null && address != ""){
        for(var i in address){
          if(address[i].status){
            chooseAddress = address[i]
          }
        }
      }
    }
    self.setData({
      hasAddress: true,
      address: chooseAddress
    })
    /**
     * 发起请求获取订单列表信息
     */
    wx.request({
      url: url + '/order',
      method: "GET",
      data:{"accountId": accountid, "openId": openId, "page": '1'},
      success: function (res) {
        if (res.data.status == "SUCCESS") {
          console.log(res);
          self.setData({
            orders:res.data.data
          })
        } else {
          wx.showToast({
            title: "网络错误",
            icon: "",
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "网络错误",
          icon: "",
        })
      }
    })
  },
  /**
   * 发起支付请求
   */
  payOrders(){
    wx.requestPayment({
      timeStamp: 'String1',
      nonceStr: 'String2',
      package: 'String3',
      signType: 'MD5',
      paySign: 'String4',
      success: function(res){
        console.log(res)
      },
      fail: function(res) {
        wx.showModal({
          title:'支付提示',
          content:'<text>',
          showCancel: false
        })
      }
    })
  }
})