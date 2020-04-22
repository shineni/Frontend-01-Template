# 第二周
### 1.编程语言的通识
** 本节你需要知道什么？**
1. 如何定义一个语言
2. 如何去描述一种语言

![结构图.PNG](.\imgs\第二周\结构图.PNG)

#### 1.1 语言按语法分类
- 非形式语言（中文，英文）
- 形式语言(乔姆斯基谱系)（层级）
    - 0型 无限制文法
    - 1型 上下文相关文法（对引擎限制强，不太友好）
    - 2型 上下文无关文法（一个词放在任何位置都一样）
    - 3型 正则文法（能用正则表达式解释的文法，对表达能力要求比较高，限制表达能力）
        - 只允许左递归

【注意】
现在大多数语言文法都分为：词法 + 语法
- 词法通过正则进行粗略处理，将语言变成单个的词，正则表达式的扫描过程叫做词法分析
- 再将词变成输入流进行语法分析，根据产生式建立语法树，裁剪不需要的，形成抽象语法树的过程叫做语法分析

#### 1.2 产生式

![产生式BNF.PNG](.\imgs\第二周\产生式BNF.PNG)
基础结构：类似JS的字符串，单个词如*
复合结构：如乘法表达式
终结符：类似字符串
【小练习】
1.规定一门语法，只能用a和b两种字符表示,可以任意的顺序
2.编写带括号的四则运算产生式

#### 1.3 产生式通过产生式理解乔姆斯基谱系

![乔姆斯基谱系.PNG](.\imgs\第二周\乔姆斯基谱系.PNG)

//十进制整数正则表达式
`<DecimalNumber> = /"0"|[1-9][0-9]]*/`

    【关于JS】
    词法定义--------双冒号：：
    语法定义---------单冒号：
    终结符 ---------加粗来实现
    Scripts 和Module是顶层的结构
    JS关键部分在Grammer Summary

get 是I型，上下文相关

#### 1.4 图灵完备性
- 图灵完备性
    - 命令式-图灵机
        - goto
        - if 和while
    - 声明式 ——lambda
        递归

#### 1.5 动态与静态
- 动态
    - 在用户的设备/在线服务器上
    - 产品实际运行时
    - Runtime
- 静态
    - 在程序员的设备商
    - 产品开发是
    - Compiletime
    - 类型系统
        - 动态类型系统与静态类型系统
        - 强类型（无隐式转换的类型）与弱类型 （有隐式转换的类型）
            - String + Number
            - String == Boolean
        - 复合类型
            - 结构体（对象是一种特殊的结构体）
            - 函数签名
        - 子类型
            - 逆变
            - 协变（同向）

【相关参考】
- 终结符： 最终在代码中出现的字符（ https://zh.wikipedia.org/wiki/ 終結符與非終結符）
- 产生式： 在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句
- 静态和动态语言： https://www.cnblogs.com/raind/p/8551791.html
- 协变与逆变： https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html
- Yacc 与 Lex 快速入门： https://www.ibm.com/developerworks/cn/linux/sdk/lex/index.html
- 关于元编程： https://www.zhihu.com/question/23856985

### 2.JavaScript
### 2.1课前准备
ASCII字符128个
Unicode Blocks 字符集，把所有国家的字符都包含在里面了（2个视角）
- Block
	- 0-128 ASCII兼容部分
	- CJK 中日韩三国语言
	- BMP 基本字符平面，兼容性特别好，四位以内的
		`"厉害".codePointAt(0).toString(36)`
        如果必须要中文，那用中文的编码来实现用\u+编码 实现
	-
- Categories
Unicode的官方网站：
https://www.fileformat.info/info/unicode/

重要 回车  和SPACE


![Unicode.PNG](.\imgs\第二周\Unicode.PNG)
### 2.2顶级输入元素
- whiteSpace
    - Tab
    - VT 纵向制表符
    - FF  000A
    - SP   U+0020
    - NBSP U+00A0 重点在处理排版 Java Script &nbsp; 此时Java Script 不会分开，一定会在一行
    - WNBSP
    - USP
- LineTerminator
    - LF 只建议使用这个
    - CR
    - LS（超出Unicode的范围，不建议使用）
    - PS（超出Unicode的范围，不建议使用）

- Comment
    单行注释 //
    多行注释 /* 开头 */结尾
- Token JavaScript中一切有用的东西都是token，包括验证的令牌
	- 用于代码结构
		- Punctuator 符号 （）= <>
		- Keywords
	- 有效信息
        - IdentifierName 标识符
            变量名部分 不能包含关键字
            属性名部分 可以和关键字重合
         - Identifier (ASCII范围内只有字母)
            语法：必须以字母(UniCodeIDStart)，下划线，$开头(下划线和$是JS的特殊规定)
         - Keywords
		 - Future reserved Keywords:num 保留字
		- Literal 直接量 

       - Number
           - IEEE754 Double Float(内存布局)
               - Sign(1)
               - Exponent(11)
               - Fraction(54)
           - 语法
               - DecimalLiteral 十进制
                   - 12.1E10可以科学计数法
                   - 小数点前后都可以省略
               - BinaryIntegerLiteral二进制0B
               - OctalIntegerLiteral 八进制0O
               - HexIntegerLiteral 十进制0X
               	- 判断是不是相等： Math.abs(0.1+0.2-0.3)<= Number.EPSILON
       - Null
       - Boolean
       - Object
       - String
           - Character
           - Code Point
           - Encoding
               - ASCII
               - Unicode（UTF）  JavaSctip默认是UTF编码，超出部分就用两个字符编码
               - UCS U+0000 -U+FFFF 超出Unicode的一部分
               - GB(ASCII兼容)
               - GB 2312
               - GBK（GB13000）
               - GB18030
               - ISO-8859 一堆欧洲国家的标准
               - BIG5 台湾那边，只有繁体中文

97 .toString(2) 为什么要加一个空格，因为97.是一个合法的数据

    语法(707页)
    1. ""
        "\x10"两位
        "\u"四位
        "\\"
    2. ''
    3.``模板字符串
        拆成两部分`` 和“${}"
        ` I said : "${
        a
        }" `

```
var a;
a
/a/g   //除法 1/g 能插除号的地方就插除号，不能插除号的地方就插正则表达式
```
【作业1】写一个正则，匹配所有的Number 167页number不支持负数
【作业2】通过查阅资料写一个UTF8的Encoding的函数
【作业3】写一个正则表达式，匹配所有的字符串直接量，单引号和双引号