To use run:

```shell script
node ./node_modules/nudetest my-test.js
```
where my-test.js could be like this:

```javascript
const test = require('./index');
const assert = require('assert')

test('Sample test one', () => {
  assert.equal(2*2, 4);
});

test('Sample test two', () => {
  assert.equal(2*2, 5);
});

test('Async test three', async () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      rej('Network error occured');
    }, 500);
  });
});
```

The lib supports synccode & promises.