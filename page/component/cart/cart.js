// page/component/new-pages/cart/cart.js
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    obj:{
        name:"hello"
    }
  },
  onShow() {
    var car = wx.getStorageSync("car");
    var goods = {};
    var key = "selected";
    for(var i in car){
      goods = car[i];
      goods[key] = true;
    }
    // console.log(car);
    this.setData({
      hasList: true,
      // carts:[
      //   {id:1,title:'新鲜芹菜 半斤',image:'/image/s5.png',num:4,price:0.01,selected:true},
      //   {id:2,title:'素米 500g',image:'/image/s6.png',num:1,price:0.03,selected:true}
      // ]
      carts:car,
    });
    this.getTotalPrice();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index,1);
    this.setData({
      carts: carts
    });
    if(!carts.length){
      this.setData({
        hasList: false
      });
    }else{
      this.getTotalPrice();
      wx.setStorageSync("car", carts);
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    wx.setStorageSync("car", carts);
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].num;
    if(num <= 1){
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    wx.setStorageSync("car", carts);
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

/**
 * 生成订单
 */
  order: function(){
    console.log("1111");
    var car = this.data.carts;
    var order = [];
    for(var i in car){
      if(car[i].selected){
        order.push(car[i]);
      }
    }
    if(order.length == 0){
      wx.showToast({
        title: '没有选择商品',
        icon:"none"
      })
      return false;
    }
    wx.setStorageSync("chooseOrder", order);
    wx.navigateTo({
      url: '/page/component/orders/orders',
    })
  },

  onLoad:function(){
    var app = getApp();
    var appid = app.globalData.appId;
    var secret = app.globalData.secret;
    var url = getApp().globalData.url;
    wx.login({
      success: function (res) {
        //console.log('登录code：' + res);
        if (res.errMsg == "login:ok") {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&granttype=authorization_code&js_code=' + res.code,
            header: { 'content-type': 'application/json' },
            success: function (res) {//获取openid
              //console.log(res) //获取openid
              wx.setStorageSync("openId", res.data.openid);
              wx.request({
                url: url + '/init',
                header: { 'Content-Type': 'application/json' },
                method: 'GET',
                data: { 'openId': res.data.openid, 'sessionId': res.data.session_key, },
                success: function (data) {
                  if (data.data.status == "SUCCESS") {
                    wx.setStorageSync("address", data.data.data);
                  } else {
                    wx.showToast({
                      title: '网络错误',
                    })
                    return;
                  }
                  var address = data.data.data;
                  var checkAddress;
                  if (address != null && address != undefined && address.length > 0) {
                    for (var i in address) {
                      if (address[i].status) {
                        checkAddress = address[i];
                      }
                    }
                  }
                  wx.setStorageSync("checkAddress", checkAddress);
                },
                fail: function (res) {
                  wx.showToast({
                    title: '网络错误',
                  })
                }
              })
            }
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络错误，请稍候再试',
          icon: "none",
        })
      }
    })
    /**获取地址信息 */
    var accountId = getApp().globalData.accountId;
    var openId = wx.getStorageSync("openId")
    wx.request({
      url: url + '/address',
      method: "get",
      data: { "accountId": accountId, "openId": openId },
      success: function (res) {
        if(res.data.status=="SUCCESS"){
          var address = res.data.data;
          wx.setStorageSync("address", address);
        }else{
          wx.showToast({
            title: '网络错误',
            icon:"none",
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络错误，地址加载失败',
          icon: "none",
        })
      }
    })
  }
})