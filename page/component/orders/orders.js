// page/component/orders/orders.js
Page({
  data:{
    address:{},
    hasAddress: false,
    total:0,
    orders:[
        // {id:1,title:'新鲜芹菜 半斤',image:'/image/s5.png',num:4,price:0.01},
        // {id:2,title:'素米 500g',image:'/image/s6.png',num:1,price:0.03}
      ]
  },

  onReady() {
    this.getTotalPrice();
  },
  
  onShow:function(){
    const self = this;
    var car = wx.getStorageSync("chooseOrder");
    self.setData({
      orders: car
    })
    var checkAddress = wx.getStorageSync("checkAddress");
    if (checkAddress != null && checkAddress != undefined && checkAddress != ""){
      self.setData({
        address: checkAddress,
        hasAddress: true
      })
    }else{
      var address = wx.getStorageSync("address");
      if (address != null && address != undefined && address != "") {
        for (var i in address) {
          if (address[i].status) {
            self.setData({
              address: address[i],
              hasAddress: true
            })
          }
        }
      }
    }
    // var address = wx.getStorageSync("address");
    // if(address != null && address != undefined && address != ""){
    //   for(var i in address){
    //     if(address[i].status){
    //       self.setData({
    //         address: address[i],
    //         hasAddress: true
    //       })
    //     }
    //   }
    // }
    // wx.getStorage({
    //   key:'address',
    //   success(res) {
    //     self.setData({
    //       address: res.data,
    //       hasAddress: true
    //     })
    //   }
    // })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for(let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },

  toPay() {
    var address;
    var url = getApp().globalData.url;
    var accountId = getApp().globalData.accountId;
    var openId = wx.getStorageSync("openId");
    wx.request({
      url: url+'/order',
      method:"post",
      data:{
        "accountId":accountId,
        "openId":openId,
        "addressId":this.data.address.id,
        "orderGoods": this.data.orders,
      },
      success:function(res){
        console.log(res);
        if(res.data.status=="SUCCESS"){

        }else{
          wx.showToast({
            title: '网络错误',
            icon:"none"
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
      }
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '本系统只做演示，支付系统已屏蔽',
    //   text:'center',
    //   complete() {
    //     wx.switchTab({
    //       url: '/page/component/user/user'
    //     })
    //   }
    // })
  }
})