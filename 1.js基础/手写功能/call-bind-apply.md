## call实现
### 第一种
这样是最快捷的,但是这样在输出的时候会发现带有了`tempFn`方法,这是不符合预期的
``` js
const data = { age: 12 }
function pro() {
  console.log('pro', this);
}
Function.prototype.selfCall = function(selfThis, ...args) {
  if (!selfThis) selfThis = window;
  selfThis.tempFn = this;
  const res = selfThis.tempFn(...args);
  delete selfThis.tempFn;
  return res;
}
pro.selfCall(data) // {age: 12, tempFn: ƒ}
```

### 第二种
这种是用到了`eval`函数,实际尽量避免这样用<br>
这里是换了个概念,相当于把函数内的this都给手动转换了一下,思路很巧妙
``` js
const data = { age: 12 }
function pro() {
  console.log('pro', this, arguments);
}
Function.prototype.myCall = function(context) { // 这里的context就是新作用域,在eval中会用到
  const str = this.toString().replace(/this/g, 'context'); // 将方法的this全部替换为context
  const newArguments = arguments.length > 1
    ? Array.from(arguments).slice(1).map((item, index) => `arguments[${index + 1}]`) // 要把第一个参数给排除掉
    : [];
  eval('(' + str + ')(' + newArguments + ')');
}
pro.myCall(data, 1, 2, 'ccc') // {age: 12}  [1, 2, 'ccc']
```

## apply实现
### 第一种
``` js
const data = { age: 12 }
function pro() {
  console.log('pro', this, arguments);
}
Function.prototype.selfApply = function(selfThis, args = []) {
  if (!selfThis) selfThis = window;
  selfThis.tempFn = this;
  const res = selfThis.tempFn(...args);
  delete selfThis.tempFn;
  return res;
}
pro.selfApply(data, [1, 2, 3])
```

### 第二种
``` js
const data = { age: 12 }
function pro() {
  console.log('pro', this, arguments);
}
Function.prototype.myApply = function(context) {
  const str = this.toString().replace(/this/g, 'context');
  const newArguments = arguments.length > 1
    ? arguments[1].map((item, index) => `arguments[1][${index}]`) 
    : [];
  eval('(' + str + ')(' + newArguments + ')');
}
pro.myApply(data, [1, 2, 3])
```

## bind实现
### 第一种
``` js
const data = { age: 12 }
function pro() {
  console.log('pro', this, arguments);
}
Function.prototype.selfCall = function(selfThis, ...args) {
  if (!selfThis) selfThis = window;
  selfThis.tempFn = this;
  const res = selfThis.tempFn(...args);
  delete selfThis.tempFn;
  return res;
}
Function.prototype.selfBind = function(selfThis, ...args) {
  return (...args2) => {
    return this.selfCall(selfThis, ...args, ...args2)
  }
}
const bind = pro.selfBind(data, 1, 2, 3)
bind(4, 5, 6) // {age: 12, tempFn: ƒ}  [1, 2, 3, 4, 5, 6]
```
### 第二种
``` js
Function.prototype.myBind = function(context) { // 这里的context就是新作用域,在eval中会用到
  const str = this.toString().replace(/this/g, 'context'); // 将方法的this全部替换为context
  const newArguments = arguments.length > 1
    ? Array.from(arguments).slice(1).map((item, index) => `arguments[${index + 1}]`) // 要把第一个参数给排除掉
    : [];
  return (...args2) => {
    const newArg2 = newArguments.concat(args2)
    return eval('(' + str + ')(' + newArg2 + ')');
  }
}
const bind = pro.myBind(data, 1, 2, 3)
bind(4, 5, 6) // // {age: 12}  [1, 2, 3, 4, 5, 6]
```




