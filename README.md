## 丁丁记账本
基于云开发的记账小程序  
主要运用了云开发的数据库，把每条信息进行存取  
构建npm先需要init，然后工具构建npm可使用  
再次使用的使用先install，再构建即可  
父onload传子异步获取不到，用getApp()就可以了，设置全局的参数;组件的ready这个生命周期里面  
但是还是有问题。传值异步是有问题，this.selectComponent('.chart').showColumn("canvasColumn", Column);用这个触发子组件方法  
小程序一次db的where20条数据