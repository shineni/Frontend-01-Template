## 第四周(结构化)
![OC.PNG](.\imgs\第五周\OC.PNG)
OC： Objective-C 是一种通用、高级、面向对象的编程语言。它扩展了标准的 ANSI C 编程语言，将 Smalltalk 式的消息传递机制加入到 ANSI C 中。当前主要支持的编译器有 GCC 和 Clang（采用 LLVM 作为后端）。
Promise相关： **【代码参考：\code\week03\statement.html】**

###4.1 JS执行粒度

![JS执行粒度.PNG](.\imgs\第四周\JS执行粒度.PNG)

**Realm**——它里面有一套完整的JS内置对象


**函数调用**

![函数调用分析图.PNG](.\imgs\第五周\函数调用分析图.PNG)
- Exectution Context执行上下文
	- ECMAScript Code Excution
    	- code evaluation state
    	- Function
    	- Script or Module
    	- Realm
    	- LexicalEnvironment
    	- VariableEnvironment
    - Generator Executin Contexts
		- code evaluation state
    	- Function
    	- Script or Module
    	- Realm
    	- LexicalEnvironment
    	- VariableEnvironment
    	- Generator

![ExecutionContext.PNG](.\imgs\第五周\ExecutionContext.PNG)
**LexicalEnvironment 和 VariableEnvironment**
![词法和变量环境.PNG](.\imgs\第五周\词法和变量环境.PNG)
**组成LexicalEnvironment 和 VariableEnvironment的结构**

![EnvironmentRecords.PNG](.\imgs\第五周\EnvironmentRecords.PNG)
**如何产生LexicalEnvironment里面的内容-----【该机制就是JS中Closure闭包的原理】**

![Closure.PNG](.\imgs\第五周\Closure.PNG)


## 第五周
###1. 浏览器
#### 1.1浏览器执行过程
![浏览器.PNG](.\imgs\第五周\浏览器.PNG)
#### 1.2 ISO-OSI七层网络模型

![网络模型.PNG](.\imgs\第五周\网络模型.PNG)

