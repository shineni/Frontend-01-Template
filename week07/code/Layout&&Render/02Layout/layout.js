function getStyle(element){
    if(!element.style){
        element.style = {};
        for(let prop in element.computedStyle){
            var p = element.computedStyle.value;
            element.style[prop] = element.computedStyle[prop].value;

            if(element.style[prop].toString().match(/px$/)){
                element.style[prop] = parseInt(element.style[prop])
            }
            if(element.style[prop].toString().match(/^[0-9\.]+$/)){
                element.style[prop] = parseInt(element.style[prop])
            }
        }
        return element.style
    }


}

function layout(element){
    //没有style的过滤掉，有style的进行预处理
    if(!element.computedStyle){
        return ;
    }

    var elementStyle = getStyle(element);

    if(element.display !=="flex"){
        return
    }

    var items = element.children.filter(e=>e.type ==="element");

    items.sort(function(a,b){
        return (a.order || 0) - (b.order || 0)
    })

    var style = elementStyle;

    ["width","height"].forEach(size=>{
        if(style[size]==="auto"|| style[size]===''){
            style[size] = null;
        }
    })


    //设置默认值
    if(!style.flexDirection || style.flexDirection === "auto"){
        style.flexDirection = "row";
    }
    if(!style.alignItems || style.alignItems === "auto"){
        style.flexDirection = "stretch";
    }
    if(!style.justifyContent || style.justifyContent === "auto"){
        style.flexDirection = "flex-start";
    }
    if(!style.flexWrap || style.flexWrap === "auto"){
        style.flexDirection = "nowrap";
    }
    if(!style.alignContent || style.alignContent === "auto"){
        style.alignContent = "stretch";
    }
    // mainSize: width && height  mainStart: left &&right
    var mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;
        if(style.flexDirection ==="row"){
            mainSize = "width";
            mainStart = "left";
            mainEnd = "right";
            mainSize = +1;
            mainBase = 0;

            crossSize = "height";
            crossStart = "top";
            crossEnd = "bottom"
        }
        if(style.flexDirection ==="row-reverse"){
            mainSize = "width";
            mainStart = "right";
            mainEnd = "left";
            mainSize = -1;
            mainBase = style.width;

            crossSize = "height";
            crossStart = "top";
            crossEnd = "bottom"
        }
        if(style.flexDirection ==="column"){
            mainSize = "height";
            mainStart = "top";
            mainEnd = "bottom";
            mainSize = +1;
            mainBase = 0;

            crossSize = "width";
            crossStart = "left";
            crossEnd = "right"
        }
        if(style.flexDirection ==="column-reverse"){
            mainSize = "height";
            mainStart = "bottom";
            mainEnd = "top";
            mainSize = -1;
            mainBase = style.height;

            crossSize = "width";
            crossStart = "left";
            crossEnd = "right"
        }
        if(style.flexDirection ==="wrap-reverse"){
            var tmp = crossStart;
            crossStart = crossEnd;
            crossEnd = tmp;
            crossSign = -1;
        }else{
            crossBase = 0;
            crossSign = 1;
        }
        var isAutoMainSize = false;
        if(!style[mainSize]){
            elementStyle[mainSize] = 0;
            for(var i = 0; i<items.length;i++){
                var item = item[i];
                if(itemStyle[mainSize]!==null||itemStyle[mainSize]!==(void 0)){
                    elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
                }
            }
            isAutoMainSize = true;
        }

        var flexLine = [];
        var flexLines = [flexLine];

        var mainSpace = elementStyle[mainSize];
        var crossSpace = 0;
        for(var i = 0; i<items.length;i++){
            var item = items[i];
            var itemStyle = getStyle(item);

            if(itemStyle[mainSize] === null){
                itemStyle[mainSize] = 0
            }

            if(itemStyle.flex){
                flexLine.push(item)
            }
            else if(style.flexWrap === "nowrap" && isAutoMainSize){
                mainSpace -= itemStyle[mainSize];
                if(itemStyle[crossSize] !== null && itemStyle[crossSize] !==(void 0)){
                    crossSpace = Math.max(crossSpace, itemStyle[crossSize])
                }
                flexLine.push(item)
            }else{
                if(itemStyle[mainSize]>style[mainSize]){
                    itemStyle[mainSize]=style[mainSize]
                }
                if(mainSpace < itemStyle[mainSize]){
                    flexLine.mainSpace = mainSpace;
                    flexLine.crossSpace = crossSpace;

                    flexLine = [];

                    flexLine.push(item);
                    flexLines.push(flexLine);

                    mainSpace = style[mainSize];
                    crossSpace = 0;

                }
                else{
                    flexLine.push(item)
                }

                if(itemStyle[crossSize]!==null && itemStyle[crossSize]!==(void 0)){
                    crossSpace = Math.max(crossSpace,itemStyle[crossSize]);
                }
                mainSpace -= itemStyle[mainSize]
            }
        }

        flexLine.mainSpace = mainSpace;
        console.log(items)
}



module.exports = layout;