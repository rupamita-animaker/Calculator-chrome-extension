/*global chrome*/
import React, { useEffect } from 'react';

function Screen({
    value,
    evaluate,
    setValue,
    setEvaluate,
    handleInputChange
}) {
    useEffect(() => {
        if(evaluate) {
            const operators = {
                '+' : {
                    precedence: 1
                },
                '-' : {
                    precedence: 1
                },
                '*' : {
                    precedence: 2
                },
                '/' : {
                    precedence: 2
                },
                '%' : {
                    precedence: 3
                }
            };
            // set up infix 
            let lastItem = '0';
            let infix = [];
            console.log('value: ' + value);
            for(let i=0; i<value.length; i++) {
                let item = value[i];
                let nextItem;
                if(i<value.length-1) {
                nextItem = value[i+1];
                }
                else {
                nextItem = '=';
                }
                console.log('lastItem: ' + lastItem);
                console.log('item: ' + item);
                console.log('nextItem: ' + nextItem);
                if(!(item in operators)) {
                    if(/*(Number(lastItem)==0 || lastItem in operators) &&*/ (item=='(' || item==')')) {
                        // if you get ( or ) add as single item to infix
                        lastItem = item;
                        infix.push(item);
                    }
                    else if((lastItem in operators || (Number(lastItem)==0 && lastItem!='0.') || lastItem=='(' || lastItem==')') && item!='.') {
                        // if item is a digit and last item was either of operators, 0, ( or )
                        lastItem = item;
                        //console.log('check: ' + nextItem in ['(', ')', '=']);
                        if((['(', ')', '='].includes(nextItem)) || (nextItem in operators)) {
                            // single digit number found
                            console.log('pushing: ' + item);
                            infix.push(item);
                        }
                    }
                    else if(lastItem=='0' && item=='.') {
                        lastItem = lastItem + item;
                    }
                    else{
                        lastItem = lastItem + item; // add in digit or period and build number
                        if((['(', ')', '='].includes(nextItem)) || (nextItem in operators)) {
                            // when number ends, add to infix
                            infix.push(lastItem);
                        }
                    }
                }
                else {
                    lastItem = item;
                    infix.push(item);
                }
                console.log('infix: ' + infix);
            }
            // infix to postfix
            let temp = [];
            let postf = [];
            lastItem = 0;
            console.log('infix is: ' + infix);
            for(let i=0; i<infix.length; i++) {
                let item = infix[i];
                let nextItem = (i<infix.length-1) ? infix[i+1] : '';
                console.log('inf item: ' + item);
                console.log('postf: ' + postf);
                console.log('temp: ' + temp);
                if(!(item in operators)) {
                    if(item!=')' && item!='(') {
                        postf.push(Number(item));
                    }
                    else if(item=='(') {
                        temp.push(item);
                    }
                    else if(item==')') {
                        while(temp[temp.length-1]!='(') {
                            console.log('temp[temp.length-1]: ' + temp[temp.length-1]);
                            postf.push(temp.pop());
                        }
                        temp.pop();
                    }
                }
                else {
                    if((lastItem=='0' || lastItem=='(') && (item=='+' || item=='-') && (!(nextItem in operators) && !(['(', ')', ''].includes(nextItem)))) {
                        postf.push(Number(item+nextItem));
                        i = i + 1;
                    }
                    else if(temp.length==0 || temp[temp.length-1]=='(') {
                        temp.push(item);
                    }
                    else {
                        while(temp.length>0 && (temp[temp.length-1]!='(') && (operators[temp[temp.length-1]].precedence >= operators[item].precedence)) {
                            postf.push(temp.pop());
                        }
                        temp.push(item);
                    }
                }
                lastItem = item;
            }
            while(temp.length>0) {
                postf.push(temp.pop());
            }
            console.log('postf: ' + postf);

            chrome.runtime.sendMessage({
                operation: "evaluation",
                postfix: postf,
                operators: operators
              }, (response) => {setValue(response.result)});

            /*evaluate postfix */
            /*
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
                            operators[item].action(a,b);
                            temp.push(result);
                        }
                    }
                    else {
                        let a = temp.pop();
                        operators[item].action(a);
                        temp.push(result);
                    }
                }
            });
            if(temp.length>0) {
                setValue(temp.pop());
            }*/
            setEvaluate(false);
        }
    }, [evaluate]);

    return (
        <div className="screen">
            <form>
                <input id='input-expr' value={value} onChange={(event) => {
                handleInputChange(event.target.value);
                }}></input>
            </form>
        </div>
    );
}

export default Screen;