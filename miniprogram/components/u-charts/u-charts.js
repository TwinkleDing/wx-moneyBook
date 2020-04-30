import uCharts from './uCharts.js';
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
      this.cWidth = wx.getSystemInfoSync().windowWidth;
      this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    }
  },
  methods: {
    showColumn(chartData) {
      this.canvas = new uCharts({
        $this: this,
        canvasId: this.id,
        type: chartData.type,
        categories: chartData.categories,
        series: chartData.series,
        width: this.cWidth ,
        height: this.cHeight ,
        fontSize: 13,
        background: '#FFFFFF',
        pixelRatio: 1,
        animation: false,
        enableScroll: chartData.categories && chartData.categories.length > 8 ? true : false,
        xAxis: {
          disableGrid: true,
          itemCount: 8,
          scrollShow: true,
          labelCount: chartData.categories && chartData.categories.length > 8 ? 4 : false,
        },
        yAxis: {
          //disabled:true
        },
        extra: chartData.extra
      });
    },
    touchColumn(e) {
      this.canvas.scrollStart(e);
      this.canvas.showToolTip(e, {
        format: function (item, category) {
          if (typeof item.data === 'object') {
            return `${category ? category : ''}${item.name}：${item.data}`
          } else {
            return `${category ? category : ''}${item.name}：${item.data}`
          }
        }
      });
    },
    moveCandle(e) {
      this.canvas.scroll(e);
    },
    touchEndCandle(e) {
      this.canvas.scrollEnd(e);
      //下面是toolTip事件，如果滚动后不需要显示，可不填写
      this.canvas.showToolTip(e, {
        format: function (item, category) {
          return `${category ? category : ''}${item.name}：${item.data}`
        }
      });
    },
  }
})