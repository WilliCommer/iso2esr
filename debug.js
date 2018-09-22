/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const fs                      = require('fs');                      // npm  
const util                    = require('util');                    // npm.util
const utils                   = require('./utils.js');              // own utils
const esr                     = require('./esr-mod');

const testFilePath            = 'test/data/';
const testFileXml1            = testFilePath + 'camt.054-ESR-Test1.xml';
const testFileTxt1_1          = testFilePath + 'camt.054-ESR-Test1-1.txt';


var testIsoJson = '';

testIsoJson = utils.loadXmlFileAsJson(testFileXml1);
var o = esr.parseFromIso(testIsoJson);
var l = o.count();
// console.log('o.count() = ', l);
// console.log('o.count = ', o.count);
// console.log('o = ', o);
// console.log('typeof o.list = ', typeof(o.list));

// console.log(esr.ESR_RecordAsString(o.list[0]));

// console.log(o.toString());

//const betrag = esr.BetragStr;
//console.log('Betrag 1.0  => ', betrag(1.0, 10));
//console.log('Betrag 1.1  => ', betrag(1.1));
//console.log('Betrag 1.23  => ', betrag(1.23));
//console.log('Betrag 100000.0  => ', betrag(100000.23));
//console.log('Betrag ' + o.list[0].Betrag + '  => ', betrag(o.list[0].Betrag));



var s1 = fs.readFileSync(testFileTxt1_1, 'latin1');
var o  = esr.parseFromText(s1);

console.log(o);


function TestParseIntAt() {
  var s = '1234567890ab';
  console.log('TestParseIntAt()');
  console.log('parseIntAt(s,0,1)', esr.parseIntAt(s,0,1));
  console.log('parseIntAt(s,0,2)', esr.parseIntAt(s,0,2));
  console.log('parseIntAt(s,4,6)', esr.parseIntAt(s,4,6));
  console.log('parseIntAt(s,10,12)', esr.parseIntAt(s,10,12));
  console.log('parseIntAt(s,100,200,55)', esr.parseIntAt(s,100,200,55));
  console.log('parseIntAt(s,0,0)', esr.parseIntAt(s,0,0));
  console.log('parseIntAt(s)', esr.parseIntAt(s));
  
}

// TestParseIntAt();