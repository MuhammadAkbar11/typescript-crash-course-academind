// const names: Array<string> = []; // ["Baev", "Jieun", 23];
// // names[0].split(" ");

// const promise: Promise<string> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("This is Done");
//   }, 2000);
// });

// promise.then(data => console.log(data));

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}
const mergedObj = merge(
  { name: "baev", skills: ["ReactJS", "Nodejs"] },
  { age: 500 }
);
console.log(mergedObj);

console.log("==============");

interface Lengthty {
  length: number;
}

function countAndDescribe<T extends Lengthty>(element: T): [T, string] {
  let descTxt = "Got no value.";

  if (element.length === 1) {
    descTxt = `Got 1 Element`;
  } else if (element.length > 1) {
    descTxt = `Got ${element.length} elements`;
  }
  return [element, descTxt];
}

console.log(countAndDescribe(["Sports", "Reading"]));

console.log("==============");

function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return `Value ${obj[key]}`;
}

extractAndConvert({ name: "baev" }, "name");
