const net = require('net')
const parser = require("./parser.js")
const images = require("images");
const render = require("./render.js")

// net.connect({
//     address:"localhost",
//     port:8088,
//     onread:{
//         buffer:Buffer.alloc(4*1024),
//         callback: function(nread,buf){
//             console.log(buf.toString('utf8',0,nread));
//         }
//     }
// })


// request
/*
POST / HTTP/1.1         //Request line
Host: 127.0.0.1         //headers
Content-Type: application/x-www-form-urlendcoded

field1 = aaa& codez%3D1  //body
*/

class Request{
    /*
        1. 在constructor里面搜集所有信息
            1.1 method 默认值为GET
            1.2 host 
            1.3 port 默认80端口
            1.4 path  默认值是"/""
            1.5 body 默认空对象{}
            1.6 headers 默认空对象{}
            1.7 headers 里面的Content 默认值为application/x-www-form-urlencoded
            1.8【特殊处理:根据Content-Type的类型作出body文字相应的编码】
            1.9 计算Content-Length
        2. 写一个toString()方法，return 一个模板
        3. send()方法，发请求给服务器并返回服务器的结果
        4. 外层创建一个 Request 对象. 用send()方法发送给服务器
    */ 
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host;
        this.path = options.path || "/";
        this.port = options.port || 80;
        this.body = options.body || {};
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(this.headers["Content-Type"]==="application/json"){
            this.bodyText = JSON.stringify(this.body)
        }
        if(this.headers["Content-Type"]==="application/x-www-form-urlencoded"){
            //map成一个字符串，字符串模板,产生类似name=“shine”
           // this.bodyText = Object.keys(this.body).map(key=> `${key} = ${encodeURIComponent(this.body[key])}`).join('&');       
           this.bodyText = Object.keys(this.body).map((key) => {
            return `${key}=${encodeURIComponent(this.body[key])}`;
          })
          .join('&');
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }

    toString(){
        return `${this.method} / HTTP/1.1\r\nHost: 127.0.0.1\r\n${Object.keys(
            this.headers,
          ) .map((key) => `${key}: ${this.headers[key]}`)
            .join('\r\n')}\r\n\r\n${this.bodyText}\r\n\r\n`;
    }
    
    
    send(connection){
        return new Promise((resolve,reject)=>{
            const parser = new ResponseParse;
            if(connection){
                connection.write(this.toString());
            }
            else{
                connection = net.createConnection({
                    host:this.host,
                    port:this.port
                },()=>{
                    connection.write(this.toString());
                })
            }
            connection.on("data",(data)=>{
                parser.receive(data.toString());
               // resolve(data.toString());
            //    console.log(parser.statusLine)
                if(parser.isFinished){
                    resolve(parser.response)
                }
               //console.log(parser.headers);
                connection.end()
            })
            connection.on("error",(error)=>{
                reject(error)
                //console.log("disconnected from server")
                connection.end()
            })
        })      
    }
}

/*

Resonse 的格式：
    HTTP/1.1 200 OK                 //状态行
    Content-Type: text/html
    Date: Mon, 23 Dec 2019 06:46:19 GMT
    Connection: keep-alive
    Transfer-Encoding: chunked       // 上述4行，headers
                                    //空行
        26
        <html><body>Hello World</body></html> 
        
        
        0                                  到0为止

*/ 

class Response{

}

class ResponseParse{
    /*
        负责产生Response 的class，用状态机实现
    */ 
   constructor(){
       this.WATING_STATUS_LINE = 0;
       this.WATING_STATUS_LINE_END = 1;
       this.WATING_HEADER_NAME = 2;
       this.WATING_HEADER_SPACE = 3;       
       this.WATING_HEADER_VALUE = 4;
       this.WATING_HEADER_LINE_END = 5;
       this.WATING_HEADER_BLOCK_END = 6;
       this.WATING_BODY = 7;

       this.current = this.WATING_STATUS_LINE;
       this.statusLine = "";
       this.headers = {};
       this.headerName = "";
       this.headerValue = "";
       this.bodyParser = null;

   }
   
   get isFinished(){
       return this.bodyParser && this.bodyParser.isFinished;
   }
   
   
   get response(){
        console.log("*******status line********"+this.statusLine);
       this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
   
       return {
           statusCode: RegExp.$1,
           statusText: RegExp.$2,
           headers: this.headers,
           body: this.bodyParser.content.join('')

       }
   }
   receive(string){
    //    console.log(string)
        for(let i = 0; i<string.length;i++){
            this.receiveChar(string.charAt(i))
        }
   }
   receiveChar(char){
       //等待status line的过程，以\r结束
    /*
    原理：第一行
        每个进来的char如果不是\r就会被追加到变量statusLine上
        如果遇到\r就会产生一个状态变化，不再往statusLine上追加
    */    
      
       if(this.current === this.WATING_STATUS_LINE){ 
           if(char==='\r'){
                this.current = this.WATING_STATUS_LINE_END;
                // console.log("*********TO WATING_STATUS_LINE_END********************")
           }
           else{
            this.statusLine += char;
           }
       }
       else if(this.current === this.WATING_STATUS_LINE_END){
            if(char ==='\n'){ //空行的逻辑，第一行就是空行，直接进去BODY
                    this.current = this.WATING_HEADER_NAME;
                    // console.log("*********TO WATING_HEADER_NAME********************")
            }
            else{
                // console.log(char)
            }
       }
    /* 
       原理：
            遇到：进入下一个状态
            否则追加到headername上
    */       
       else if(this.current ===this.WATING_HEADER_NAME)
       {
        //    console.log(char);
            if(char===':'){
                this.current = this.WATING_HEADER_SPACE;
                // console.log("**********TO WATING_HEADER_SPACE*******************")
            }
            //空行的逻辑，第一行就是空行，直接进去BODY
            else if(char === '\r'){
                this.current = this.WATING_HEADER_BLOCK_END; //目的是吃掉一个回车

                /*需要根据transfer-encoding 判断用哪种方式去处理body*/ 
                if(this.headers["Transfer-Encoding"]==="chunked"){
                    this.bodyParser = new TrunkBodyParser();
                }
                else{
                    this.headerName += char;
                }


                // console.log("*********TO WATING_BODY********************")
            }
            else{
                this.headerName += char;
            }
       }
       else if(this.current === this.WATING_HEADER_SPACE){
           if(char ===' '){
                this.current = this.WATING_HEADER_VALUE;
                // console.log("*********TO WATING_HEADER_VALUE********************")
           }
       }
       else if(this.current === this.WATING_HEADER_VALUE){
           if(char === '\r'){
                this.current = this.WATING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerValue = "";
                this.headerName="";
                // console.log("********TO WATING_HEADER_LINE_END*********************")
           }else{
                this.headerValue +=char;
           }
       }
       //会触发一个循环，可能会有多行,一行行读
       else if(this.current === this.WATING_HEADER_LINE_END){
            if(char ==='\n'){
                this.current = this.WATING_HEADER_NAME;
                // console.log("********TO WATING_HEADER_NAME*********************")
            } 
       }

       else if (this.current === this.WATING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WATING_BODY
            }
       }
       else if(this.current === this.WATING_BODY){
            this.bodyParser.receiveChar(char);
        }   


       
   }

}

class TrunkBodyParser{
    constructor(){
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.READING_TRUNK_SPACR = 3;
        this.READING_TRUNK_SPACR = 4
        this.WAITING_NEW_LINE= 5;
        this.WAITING_NEW_LINE_END = 6;
        this.length = 0;
        this.isFinished = false;
        this.content = []; //选择数组而不选择字符串是因为字符串有的时候做加法运算的性能比较差
        this.current = this.WAITING_LENGTH;

    }
    receiveChar(char){
        /*
            "2"
            "\r"
            "\n"
            "o"
            "k"
            "\r"
            "\n"
            "0"
            "\r"
            "\n"
            "\r"
            "\n"
        */
                // console.log(JSON.stringify(char));
                // console.log(this.current)
       if(this.current === this.WAITING_LENGTH){
            if(char === '\r'){
                //如果读到的长度是0则返回
                if(this.length ===0){
                    //console.log("******Content**********"+ this.content)
                    this.isFinished =true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            }
            else{
                this.length *=  16;
                this.length += parseInt(char,16);
               // console.log("*****length*****" + this.length)
            }
       }
       else if(this.current === this.WAITING_LENGTH_LINE_END){
           if(char === '\n'){
               this.current = this.READING_TRUNK;
           }
       }
       else if(this.current === this.READING_TRUNK){
            if(char==='\r'){
                this.current = this.WAITING_NEW_LINE_END
            }
            else{
                this.content.push(char);
                this.length--;
                if(this.length===0){
                    this.current = this.WAITING_NEW_LINE;
                } 
            }
         
        }  

        else if(this.current === this.WAITING_NEW_LINE) {
            if(char === '\r'){
                this.current = this.WAITING_NEW_LINE_END;
            }
        }
        else if(this.current === this.WAITING_NEW_LINE_END) {
            if(char === '\n'){
                this.current = this.WAITING_LENGTH;
            }
        }

    }
}

//IIFE小技巧用void
void async function(){
    let request = new Request({
        method:"POST",
        host:"127.0.0.1",
        path:"/",
        port:"8088",
        headers:{
            ["X-Foo2"]:"customed"
        },
        body:{
            name:"shine"
        }
    })
    
    let response = await request.send();
    let dom = parser.parseHTML(response.body)
    console.log(JSON.stringify(dom,null,"    "))
    let viewport = images(800,600);
    render(viewport, dom)
    viewport.save("viewport.jpg")

}()



/*
const client = net.createConnection({
    host:"127.0.0.1",
    port:8088},
    ()=>{
        console.log("connet to server!");
        
        let request = new Request({
            method:"POST",
            host:"127.0.0.1",
            path:"/",
            port:"8088",
            headers:{
                ["X-Foo2"]:"customed"
            },
            body:{
                name:"shine"
            }
        })

        console.log(request.toString())
        client.write(request.toString())
        
        // 写法1
        //client.write("POST / HTTP/1.1\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 11\r\n\r\nname=Shine\r\n")
        //写法2
//         client.write(`
// POST / HTTP/1.1\r
// Content-Type: application/x-www-form-urlencoded\r
// Content-Length: 11\r
// \r
// name=Shine`);
     });
    client.on("data",(data)=>{
        console.log(data.toString());
        client.end()
    })
    client.on("error",(error)=>{
        console.log(error)
        console.log("disconnected from server")
    })
*/ 

