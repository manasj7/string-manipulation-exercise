const fs = require("fs");
const _ = require("lodash");

// Variables
let jsonInvoiceData = [];
let jsonSupplierNameData = [];
let splittedInvoiceArray = [];
let supplierNameArray = [];
let splittedSupplierNameArray = [];
let supplierNameArrayWordsSplit = [];
let matchedArray = [];
let uniqueMatchedArray = [];
let jsonLines = {};

const invoiceFile = fs.readFileSync("./invoice.txt").toString();
let splitbyLine = invoiceFile.split(/\r\n/);

// Converting the text to a valid JSON format
for (let i = 0; i < splitbyLine.length; i++) {
  var replaceSingleQuotes = splitbyLine[i].replace(/'/g, '"');
  let result = JSON.parse(replaceSingleQuotes);
  jsonInvoiceData.push(result);
}

// Pushing only 'word' object into splittedInvoiceArray
splittedInvoiceArray = jsonInvoiceData.reduce(
  (a, o) => (o.word && a.push(o.word), a),
  []
);

const supplierNameFile = fs
  .readFileSync("./suppliernames.txt")
  .toString()
  .split("\r\n");

// Extract array of headers and cut it from data
let headers = supplierNameFile.shift().split(",");

//Define Array to store all supplierNames
for (let i = 0; i < supplierNameFile.length; i++) {
  // Split data lines
  let splitData = supplierNameFile[i].split(",");

  for (let i = 0; i < splitData.length; i++)
    jsonLines[headers[i]] = splitData[i];
  // Push new line to json array
  jsonSupplierNameData.push(jsonLines);
  // Push supplierNames to array
  supplierNameArray.push(jsonSupplierNameData[i]["SupplierName"]);
}

// Loop to create arrays containing individual word of the Supplier Name
for (let i = 0; i < supplierNameArray.length; i++) {
  let str = supplierNameArray[i];
  let words = str.split(" ");
  for (let j = 0; j < words.length - 1; j++) {
    words[j] += " ";
  }
  supplierNameArrayWordsSplit.push(words);
}

// Regex that separates every word from supplierNameArray
let regex = /[^\s]+/g;
splittedSupplierNameArray = supplierNameArray.join(" ").match(regex);

// Loop that picks all common words from splittedInvoiceArray and splittedSupplierNameArray
for (var i = 0; i < splittedInvoiceArray.length; i++) {
  for (var j = 0; j < splittedSupplierNameArray.length; j++) {
    if (splittedInvoiceArray[i] === splittedSupplierNameArray[j])
      matchedArray.push(splittedInvoiceArray[i]);
  }
}

// Function to match unique elements from matchedArray
function onlyUniqueElements(value, index, self) {
  return self.indexOf(value) === index;
}
uniqueMatchedArray = matchedArray.filter(onlyUniqueElements);

// Loop that checks supplierNameArrayWordsSplit and uniqueMatchedArray arrays and prints the required supplier name
for (let i = 0; i < supplierNameArrayWordsSplit.length; i++) {
  for (let j = 0; j < uniqueMatchedArray.length; j++) {
    const supplierNameFound = _.includes(
      supplierNameArrayWordsSplit[i],
      uniqueMatchedArray[j]
    );
    if (supplierNameFound) {
      console.log(
        "The supplier name is " +
          supplierNameArrayWordsSplit[i].toString().replace(",", "")
      );
    }
  }
}
