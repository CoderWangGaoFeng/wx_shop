// page/component/new-pages/user/address/address.js
Page({
  data:{
    add: "none",
    address:{
      name:'',
      phone:'',
      detail:'',
      status:false,
    },
    hasAddress:false,
  },
  onLoad(option){
    // var self = this;
    // wx.getStorage({
    //   key: 'address',
    //   success: function(res){
    //     self.setData({
    //       address : res.data
    //     })
    //   }
    // })
    var that = this;
    var url = getApp().globalData.url;
    var accountId = getApp().globalData.accountId;
    var openId = wx.getStorageSync("openId")
    var address = wx.getStorageSync("address");
    that.setData({
      status:option.status,
    })
    if(address != null && address != undefined && address != "" && address.length > 0 ){
      that.setData({
        address:address,
        hasAddress: true,
      })
    }
  },
  formSubmit(e){
    const value = e.detail.value;
    if (value.name && value.phone && value.detail){
      wx.setStorage({
        key: 'address',
        data: value,
        success(){
          wx.navigateBack();
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  },

  /**
   * 显示隐藏增加新地址的form
   */
  showForm: function(){
    var add = this.data.add;
    if(add == "none"){
      this.setData({
        add:"block"
      })
    }else{
      this.setData({
        add: "none"
      })
    }
  },
  /**
   * 新增地址
   */
  submitAddress: function (e) {
    var url = getApp().globalData.url;
    var openId = wx.getStorageSync("openId");
    var accountId = getApp().globalData.accountId;
    var that = this;
    var name = e.detail.value.name.trim();
    var address = e.detail.value.detail.trim();
    var phone = e.detail.value.phone.trim();
    if (name == "" || name == undefined || name == null ||
      address == "" || address == undefined || address == null ||
      phone == "" || phone == undefined || phone == null ) {
      wx.showToast({
        title: '请将内容填写完整',
        icon: "none",
      })
      return;
    }
    // console.log(e);
    wx.request({
      url: url + '/address',
      method: "POST",
      data: {
        'name': name,
        'address': address,
        'phone': phone,
        'openId': openId,
        "accountId":accountId
      },
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.data.status == "SUCCESS") {
          that.setData({
            'address': res.data.data,
          })
          wx.setStorageSync("address", res.data.data);
          console.log(res.data.data);
          that.setData({
            address: res.data.data, 
            hasAddress:true,
          })
          // wx.setStorageSync("address", res.data.data);
          // that.cancelAddress();
        } else {
          wx.showToast({
            title: '网络错误',
            icon: "none",
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络错误',
          icon: "none",
        })
      },
    })
  },
  chooseAddress: function (e) {
    var index = e.currentTarget.dataset.index;
    var address = this.data.address;
    wx.setStorageSync("checkAddress", address[index]);
    if(this.data.status=="true"){
      wx.redirectTo({
        url: '../orders/orders',
      })
    }
  },
})