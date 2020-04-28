import uCharts from './uCharts.js';
var _self;
Component({
  data: {
    cWidth: '',
    cHeight: '',
    canvas: true
  },
  lifetimes: {
    attached() {
      this.setData({
        id: this.id
      })
      _self=this;
      this.cWidth = wx.getSystemInfoSync().windowWidth;
      this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    }
  },
  methods: {
    showColumn(chartData) {
      let canvas = new uCharts({
        $this: _self,
        canvasId: this.id,
        type: chartData.type,
        categories: chartData.categories,
        series: chartData.series,
        width: _self.cWidth ,
        height: _self.cHeight ,
        fontSize: 13,
        background: '#FFFFFF',
        pixelRatio: 1,
        animation: true,
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          //disabled:true
        },
        dataLabel: true,
        extra: chartData.extra
      });
      _self.canvas = canvas
    },
    touchColumn(e) {
      this.canvas.showToolTip(e, {
        format: function (item, category) {
          if (typeof item.data === 'object') {
            return category + ' ' + item.name + ':' + item.data.value
          } else {
            return category + ' ' + item.name + ':' + item.data
          }
        }
      });
    },
  }
})