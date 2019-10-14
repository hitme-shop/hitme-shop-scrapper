
function doSomething() {
   return new Promise((res, rej) => {
      setTimeout(() => {
         console.log('in Dosomething')
         res("B")
      }, 4000);
   })
}
async function init() {
   console.log("A");
   let b

   b = await doSomething()

   // doSomething().then( ( res ) => {
   //    b = res
   // }).catch( err => {
   //    console.log(err);
   // })

   console.log(b);
   console.log('C');
}

init()