import uCharts from './uCharts.js';
var _self;
var canvaColumn = null;
var canvaLineA = null;
var canvaCandle = null;
Component({
  data: {
    cWidth: '',
    cHeight: '',
  },
  properties: {
    id: { // 属性名
      type: String,
      value: ''
    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      _self=this;
      this.cWidth = wx.getSystemInfoSync().windowWidth;
      this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
      this.getServerData();
      console.log(this.id)
    },
  },
  methods: {
    getServerData: function() {
      wx.request({
        url: 'https://www.ucharts.cn/data.json',
        data: {
        },
        success: function (res) {
          console.log(res.data.data)
          let Column = { categories: [], series: [] };
          Column.categories = res.data.data.ColumnB.categories;
          Column.series = res.data.data.ColumnB.series;
          _self.showColumn("canvasColumn", Column);
        },
        fail: () => {
          console.log("请点击右上角【详情】，启用不校验合法域名");
        },
      });
    },
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
    }
  }
})