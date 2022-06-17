/*global chrome*/
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if(request.operation==='evaluation') {
        let postf = request.postfix;
        const operators = {
            '+' : {
              expression: 'a+b',
              action: (a, b) => {return a+b}
            },
            '-' : {
              expression: 'a-b',
              action: (a, b) => {return a-b}
            },
            '*' : {
              expression: 'a*b',
              action: (a, b) => {return a*b}
            },
            '/' : {
              expression: 'a/b',
              action: (a, b) => {return a/b}
            },
            '%' : {
              expression: 'a/100',
              action: (a) => {return a/100}
            }
          };
        let temp = [];
        let result = 0;

        postf.forEach((item) => {
            if(!(item in operators)) {
                temp.push(item);
            }
            else {
                if(item!='%') {
                    let b = temp.pop();
                    if((item=='-' || item=='+') && temp.length==0) {
                        temp.push(Number(item+b));
                    }
                    else {
                        let a = temp.pop();
                        temp.push(operators[item].action(a,b));
                    }
                }
                else {
                    let a = temp.pop();
                    temp.push(operators[item].action(a));
                }
            }
        });
        if(temp.length>0) {
            result = (temp.pop());
        }
        response({result: result,
                    postf: postf});
    }
    /*
    switch(request.operation) {
        case "add": response({result: request.a + request.b});
                    break;
        case "sub": response({result: request.a - request.b});
                    break;
        case "mul": response({result: request.a * request.b});
                    break;
        case "div": response({result: request.a / request.b});
                    break;
        case "perct": response({result: request.a / 100});
                    break;
        default: break;
    }*/
});