/* 
 * usage of iso2esr
 * 
 */

const fs                      = require('fs');                      // npm  file system
const esr                     = require('./index.js');              // iso2esr module
//const esr                     = require('iso2esr');              // iso2esr module

const testFilePath            = 'test/data/';
const testFileXml1            = testFilePath + 'camt.054-ESR-Test1.xml';
const testFileTxt1_1          = testFilePath + 'camt.054-ESR-Test1-1.txt';
const testFileTxt2            = testFilePath + 'result.txt';

var iso, esr_list, txt;

// load ISO20022 as JSON
console.log('load ISO20022 as JSON');
iso = esr.loadXmlFileAsJson(testFileXml1);
console.log('iso:', iso);

// create ESR_List from iso
console.log('create ESR_List from iso');
esr_list = esr.parseFromIso(iso);
console.log('esr_list.count():', esr_list.count());
console.log('esr_list.Totalbetrag:', esr_list.Totalbetrag);
console.log('esr_list.ValutaDatum:', esr_list.ValutaDatum);

// convert to text
txt = esr_list.toString();
console.log('txt:', txt);

console.log('save to file:', testFileTxt2);
fs.writeFileSync(testFileTxt2, txt, 'latin1');



