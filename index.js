
const a = ['john-reese', 'harold-finch', 'sameen-shaw'];


const b = a.reduce((pre, item) => {
  pre.push({
    name: item.split('-').join(' ')
  })
  return pre;
}, []);

console.log(b);

