import {encoded, translations} from './data.js'

console.log("Let's rock")
console.log(encoded, translations)

const decode = () => {
  const decoded = encoded.map((item) => {
    const decodedItem = {};
    for (let [key, value] of Object.entries(item)) {
      if (key === 'groupId' || key === 'service' || key === 'formatSize' || key === 'ca') {
        decodedItem[key] = value;
      } else if (translations.hasOwnProperty(value)) {
        decodedItem[key] = translations[value];
      } else {
        decodedItem[key] = value;
      }
    }
    return decodedItem;
  })
  return decoded;
}

const decoded = decode();

console.log(decoded);

const getUniqId = () => {
  const array = [];
  encoded.forEach((item) => {
    for (let [key, value] of Object.entries(item)) {
      if (key === 'groupId' || key === 'service' || key === 'formatSize' || key === 'ca') {
        continue;
      } else if (value) {
        array.push(value);
      }
    }
  })
  return array;
}

const uniqArray = Array.from(new Set(getUniqId())).sort((a, b) => a - b);

console.log(uniqArray);
