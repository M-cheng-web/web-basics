var value = 1;

function foo() {
    console.log(this, this.value);
}

function bar() {
    var value = 2;
    foo.call(this)
}

bar()