//1. 实现简单选择器
//2. 实现复杂选择器
function match(selector, element) {
    const startStauts = 0;
    const typeSelectorStatus = 1;
    const idSelectorStatus =2;
    const classSelectorStaus = 3;
    const parentSelectorStatus = 4;
    const botherSelectorStatus = 5;
    var currentStatus;
    for(let i =0; i<selector.length;i++){
        dealwithSelector(selector[i])
    }
    /*
    todo: to deal with all the selecor with same type 
    */
}
function dealwithSelector(Selectorchar){
    const selectorArr;
    var selector;
    var typeselectors=[];
    var idSelectors=[];
    var classSelectors=[];
    var parentSelectors=[];
    var botherSelectors=[];

    if(currentStatus==startStauts&&Selectorchar.match(/[a-zA-Z1-9]/)){
        typeselector+=Selectorchar
        currentStatus = typeSelectorStatus
    }
    if(currentStatus==typeSelectorStatus){
        if(Selectorchar.match(/[a-zA-Z1-9]/)){
            typeselector+=Selectorchar
        }
        else if(Selectorchar.match(/./)){
             typeselectors.push(typeselector);
             typeSelector="";
             currentStatus = classSelectorStaus            
        }
        else if(Selectorchar.match(/#/)){
            typeselectors.push(typeselector);
            typeSelector="";
            currentStatus = idSelectorStatus            
       }
       else if(Selectorchar.match(/[ ]{1}/)){
        typeselectors.push(typeselector);
        typeSelector="";
        currentStatus = parentSelectorStatus            
        }
        else if(Selectorchar.match(/[~+]/)){
            typeselectors.push(typeselector);
            typeSelector="";
            currentStatus = botherSelectorStatus            
       }
    }
    if(currentStatus==idSelectorStatus){
        if(Selectorchar.match(/[a-zA-Z1-9]/)){
            typeselector+=Selectorchar
        }
        else if(Selectorchar.match(/./)){
            idSelectors.push(typeselector);
            typeSelector="";
            currentStatus = classSelectorStaus            
       }
       else if(Selectorchar.match(/#/)){
            idSelectors.push(typeselector);
           typeSelector="";
           currentStatus = idSelectorStatus            
      }
      else if(Selectorchar.match(/[ ]{1}/)){
        idSelectors.push(typeselector);
       typeSelector="";
       currentStatus = parentSelectorStatus            
       }
       else if(Selectorchar.match(/[~+]/)){
        idSelectors.push(typeselector);
           typeSelector="";
           currentStatus = botherSelectorStatus            
      }
    }
    if(currentStatus==classSelectorStaus){
        if(Selectorchar.match(/[a-zA-Z1-9]/)){
            typeselector+=Selectorchar
        }
        else if(Selectorchar.match(/./)){
            classSelectors.push(typeselector);
            typeSelector="";
            currentStatus = classSelectorStaus            
       }
       else if(Selectorchar.match(/#/)){
            classSelectors.push(typeselector);
           typeSelector="";
           currentStatus = idSelectorStatus            
      }
      else if(Selectorchar.match(/[ ]{1}/)){
        classSelectors.push(typeselector);
       typeSelector="";
       currentStatus = parentSelectorStatus            
       }
       else if(Selectorchar.match(/[~+]/)){
        classSelectors.push(typeselector);
           typeSelector="";
           currentStatus = botherSelectorStatus            
      }
    }
    if(currentStatus==botherSelectorStatus){
        if(Selectorchar.match(/[a-zA-Z1-9]/)){
            typeselector+=Selectorchar
        }
        else if(Selectorchar.match(/./)){
            botherSelectors.push(typeselector);
            typeSelector="";
            currentStatus = classSelectorStaus            
       }
       else if(Selectorchar.match(/#/)){
        botherSelectors.push(typeselector);
           typeSelector="";
           currentStatus = idSelectorStatus            
      }
      else if(Selectorchar.match(/[ ]{1}/)){
        botherSelectors.push(typeselector);
       typeSelector="";
       currentStatus = parentSelectorStatus            
       }
       else if(Selectorchar.match(/[~+]/)){
            botherSelectors.push(typeselector);
           typeSelector="";
           currentStatus = botherSelectorStatus            
      }
    }
    if(currentStatus==parentSelectorStatus){
        if(Selectorchar.match(/[a-zA-Z1-9]/)){
            typeselector+=Selectorchar
        }
        else if(Selectorchar.match(/./)){
            parentSelectors.push(typeselector);
            typeSelector="";
            currentStatus = classSelectorStaus            
       }
       else if(Selectorchar.match(/#/)){
        parentSelectors.push(typeselector);
           typeSelector="";
           currentStatus = idSelectorStatus            
      }
      else if(Selectorchar.match(/[ ]{1}/)){
        parentSelectors.push(typeselector);
       typeSelector="";
       currentStatus = parentSelectorStatus            
       }
       else if(Selectorchar.match(/[~+]/)){
        parentSelectors.push(typeselector);
           typeSelector="";
           currentStatus = botherSelectorStatus            
      }
    }


}


match("div #id.class", document.getElementById("id"));
