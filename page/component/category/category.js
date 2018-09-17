// var url = getApp().globalData.url();
// var accountId = getApp().globalData.accountId;
const url = getApp().globalData.url;
const accountId = getApp().globalData.accountId;
Page({
    data: {
      category: [],
      detail:[],
      curIndex: 0,
      menu:"",
      menuId:"",
      isScroll: false,
      toView: 'guowei'
    },
    // onReady(){
    //     var self = this;
    //     wx.request({
    //         url:'http://www.gdfengshuo.com/api/wx/cate-detail.txt',
    //         success(res){
    //             self.setData({
    //                 detail : res.data
    //             })
    //         }
    //     });
    // },
    switchTab(e){
      const self = this;
      this.setData({
        isScroll: true
      })
      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      setTimeout(function () {
        self.setData({
          isScroll: false
        })
      },1)
        
    },

    /**
     * 初始化数据
     */
    onLoad:function(){
      var that =this;
      wx.request({
        url: url +'/goodsTypes',
        method:"GET",
        data:{'accountId':accountId},
        success:function(res){
          if(res.data.status=="SUCCESS"){
            that.setData({
              category:res.data.data,
            })
            if (res.data.data != null && res.data.data != undefined && res.data.data.length > 0){
              that.setData({
                'menu': res.data.data[0].name,
                "menuId": res.data.data[0].id,
              })
              wx.request({//请求产品数据
                url: url+'goodses',
                method:"GET",
                data:{"accountId":accountId},
                success:function(res){
                  if(res.data.status=="SUCCESS"){
                    that.setData({
                      detail: res.data.data,
                    })
                  }else{
                    wx.showToast({
                      title: '网络错误',
                      icon: "none"
                    })
                  }
                },
                fail:function(e){
                  wx.showToast({
                    title: '网络错误',
                    icon:"none"
                  })
                }
              })
            }
          }else{
            wx.showToast({
              title: '网络错误',
              icon:"none"
            })
          }
        },
        fail:function(e){
          wx.showToast({
            title: '网络错误',
            icon:"none"
          })
        }
      })
    },
    /**
     * 跳转商品详情
     */
    details(e){
      var id = e.currentTarget.dataset.id;
      var list = this.data.detail;
      for(var i in list){
        if(list[i].id == id){
          wx.setStorageSync("goods", list[i]);
        }
      }
      wx.navigateTo({
        url: '../details/details',
      })
    }
})