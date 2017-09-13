 onGetElement = (contentViewClass,contentkindClass,sildViewClass,sildkindClass,id) =>{
    //contentViewClass 内容视口的类名  contentkindClass 内容里面每个类的的类名   sildViewClass  title的视口类名  sildkindClass title每个类的类名  id 要选中的titlE改变状态的 id
    //
    //
    //思路：1.先获取内容里面每个类的内容高度，把每个类的内容对应的titleid 还有距离视口的最小距离和最大距离写个对象并push进 scollArry数组中
    //2.获取每个title内容距离title 视口的最小距离和最大距离写个对象，然后push到sildScoll数组中
    //3.监听内容视口的滚动距离，每次滚动就去循环scollArry 数组 去判断滚动的距离大小落在哪个内容区间内，就把对应元素内的titleid 改变状态
    //内容滚动 title 滚动  获取title 视口的高度 取得title 可滚动的最大值 定义两个参数 sildMin（大小等于视口的一半） 和 sildMax （等于最大滚动距离-视口的一半） 当内容块滚动的时候，判断 选中的title 对应在sildScoll 数组中的对象区间，然后设置title视口的滚动高度为 title 对象区间最小值（sildScoll[i].min）- sildMin
    // 还要判断当区间最小值小于等于sildMin 设置视口的滚动距离为0
    // 当选中的title 最大值 大于 sildMax  设置 title 滚动距离为title 可滚动最大高度
    /**
      *
      *
      *有需要自己改编，大部分用原生方法编写小部分使用es6或者可以留言讨论
      * 
      */
    var Element = document.getElementsByClassName(contentViewClass),
        foodtypeListH = document.getElementsByClassName(contentkindClass)[0],
        sildElement = document.getElementsByClassName(sildViewClass),
        sideListH = document.getElementsByClassName(sildkindClass)[0],
        scollArry = [],
        sildMin = sideListH.offsetHeight / 2,
        sildMax = sideListH.scrollHeight - sideListH.offsetHeight /2,
        sildScoll = [];
    //获取菜品高度
    for (var i = 0; i < Element.length; i++) {
      if(i == 0){
        scollArry.push({
          min: 0,
          max: Element[i].offsetHeight,
          id:Element[i].getAttribute(id)
        })
      }else{
        scollArry.push({
          min: scollArry[i-1].max,
          max: scollArry[i-1].max + Element[i].offsetHeight,
          id:Element[i].getAttribute(id)
        })
      }
    };
    //获取小类高度
    for (var i = 0; i < sildElement.length; i++) {
       if(i == 0){
          sildScoll.push({
            min: 0,
            max: sildElement[i].offsetHeight,
          })
        }else{
          sildScoll.push({
            min: sildScoll[i-1].max,
            max: sildScoll[i-1].max + sildElement[i].offsetHeight,
          })
        }
    };

    //监听滚动
    foodtypeListH.onscroll = (function(){
      var num  = scollArry[0].min;

      for (var i = 0; i < scollArry.length; i++) {
        if(scollArry[i].min <= foodtypeListH.scrollTop && foodtypeListH.scrollTop < scollArry[i].max){
          num = scollArry[i].id
          if(sildScoll[i].min > sildMin && sildScoll[i].max < sildMax){
            sideListH.scrollTop = sildScoll[i].min - sildMin;
          }
          if(sildScoll[i].min < sildMin) {
            sideListH.scrollTop = 0;
          }
          if(sildScoll[i].max > sildMax ){
             sideListH.scrollTop = sideListH.scrollHeight
          }
        }
      };

      this.props.tabChange(num);//这个是调取action 来改变store 上选中title 的值
    }).bind(this)

  }