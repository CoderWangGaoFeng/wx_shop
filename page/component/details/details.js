Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:1,
    totalNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var goods = wx.getStorageSync("goods");
    var id = goods.id;
    var flag = false;
    var totalNum = 0;
    var car = wx.getStorageSync("car");
    if (car != null && car != undefined && car != "") {
      for (var i in car) {
        var chooseId = car[i].id;
        if (id == chooseId) {
          this.setData({
            goods: car[i],
            num: car[i].num
          })
          flag = true;
        }
        totalNum += car[i].num;
      }
    }
    if (totalNum > 0) {
      this.setData({
        totalNum: totalNum,
        hasCarts: true,
      })
    }
    if (!flag) {
      this.setData({
        goods: goods,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 增加数量
   */
  addCount() {
    let num = this.data.num;
    num++;
    var key = 'goods.num';
    this.setData({
      num: num,
      [key]: num,
    })
  },

  /**
   * 减少数量
   */
  muilCount() {
    let num = this.data.num;
    if (num > 1) {
      num--;
      var key = 'goods.num';
      this.setData({
        num: num,
        [key]: num,
      })
    }
  },

  /**
   * 加入购物车
   */
  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
    setTimeout(function () {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function () {
        self.setData({
          scaleCart: false,
          hasCarts: true,
          totalNum: num + total
        })
      }, 200)
    }, 300)
    var car = wx.getStorageSync("car");
    var goods = this.data.goods;
    var flag = false;
    if (car != null && car != undefined && car != "") {
      for (var i in car) {
        if (goods.id == car[i].id) {
          car[i] = goods;
          flag = true;
        }
      }
      if (!flag) {
        car.push(goods);
      }
    } else {
      car = [];
      car.push(this.data.goods);
    }
    wx.setStorageSync("car", car);
  },
})