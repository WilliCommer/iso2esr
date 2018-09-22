/* 
 * test module iso2esr
 * 
 */


/*
 * import
 */
const expect                  = require('chai').expect;
const fs                      = require('fs');                      // npm  
const toString                = require('lodash/toString');
const esr                     = require('../index.js');



const testFilePath            = 'test/data/';
const testFileXml1            = testFilePath + 'camt.054-ESR-Test1.xml';
const testFileTxt1_1          = testFilePath + 'camt.054-ESR-Test1-1.txt';

var testIsoJson = '';
var esr_list;


describe('prepare test', function() {
  it('check if testfile exitst', function () {
    expect(fs.existsSync(testFileXml1)).to.be.true;
  });  
  it('check if testfile exitst', function () {
    expect(fs.existsSync(testFileTxt1_1)).to.be.true;
  });  
});

describe('loadXmlFileAsJson()', function () {
  it('load XML from file and parse is to JSON', function () {
    testIsoJson = esr.loadXmlFileAsJson(testFileXml1);
    expect(testIsoJson).to.not.be.empty;;
  });
});


describe('ESR_Record()', function() {
  it('new ESR_Record()', function () {
    var o = new esr.ESR_Record();
    expect(o).to.be.a('object');
  });
  
});

describe('ESR_List()', function() {
  
  it('new ESR_List()', function () {
    esr_list = new esr.ESR_List();
    expect(esr_list).to.be.a('object');
    expect(esr_list.list).to.be.a('array');
    expect(esr_list.count()).to.equal(0);
  });

  it('ESR_List() from test file', function () {
    esr_list = esr.parseFromIso(testIsoJson);
    expect(esr_list).to.be.a('object');
    expect(esr_list.list).to.be.a('array');
    expect(esr_list.count()).to.equal( 7 );
    expect(esr_list.Totalbetrag).to.equal( 11508.5 );
    expect(esr_list.error).to.equal( '' );
    
  });
  
});


describe('ESR_RecordAsString()', function() {
  
  it('compare result with sample file', function () {
    var s1 = toString(fs.readFileSync(testFileTxt1_1));
    var s2 = esr_list.toString();
    expect(s2).to.equal(s1);
  });

  it('save as string and parse back', function () {
    var s1 = esr_list.toString();
    var o = esr.parseFromText(s1);
    var s2 = o.toString();
    expect(s2).to.equal(s1);
  });
  
});


