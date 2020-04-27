import uCharts from './uCharts.js';
var _self;
var canvaColumn = null;
Component({
  data: {
    cWidth: '',
    cHeight: '',
  },
  lifetimes: {
    attached() {
      _self=this;
      this.cWidth = wx.getSystemInfoSync().windowWidth;
      this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    }
  },
  methods: {
    showColumn(canvasId, chartData) {
      canvaColumn = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'column',
        legend: true,
        fontSize: 11,
        background: '#FFFFFF',
        pixelRatio: 1,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          //disabled:true
        },
        dataLabel: true,
        width: _self.cWidth ,
        height: _self.cHeight ,
        extra: {
          column: {
            type: 'group',
            width: _self.cWidth * 0.45 / chartData.categories.length
          }
        }
      });

    },
    touchColumn(e) {
      canvaColumn.showToolTip(e, {
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