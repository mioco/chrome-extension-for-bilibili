function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function add2(x) {
  var a = await resolveAfter2Seconds(20);
  var b = await resolveAfter2Seconds(30);
  return x + a + b;
}

add2(10).then(v => {
  console.log(v);  // prints 60 after 4 seconds.
});

function getData (v) {
  return new Promise(resolve => {
    console.log(v)
  })    
}

async function test(){
  let arr = [1,2,3];
  let newArr = await arr.map(async (num, index) => {
    setTimeout(() => getData(num), index * 1000);
  });
}

test().then(() => {
  console.log('done')
})

let obj = {
  first: 'ab'
}