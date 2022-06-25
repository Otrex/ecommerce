class base {
  // static fname() {
  //   return 'Chimeziri'
  // }
}
class Ben extends base {
  fname() {
    return 'Chimeziri';
  }
  me = () => {
    console.log('Obisike Treasure', this.fname());
  };
}

const f = (fnc) => {
  fnc();
  // x.me()
};

let x = new Ben();

f(x.me);

const { businessAccountGenerator } = require('./test/tools');

console.log(JSON.stringify(businessAccountGenerator()));
