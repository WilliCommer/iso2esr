/* 
 * ESRmod 
 * 
 * Behandelt Einzahlungen im alten ESR Format.
 * Wandelt ISO20022 Dateien der Bank in das ESR Format um.
 * 
 * (c) 2018 WCS
 * 
 */

/*
 * export
 */
exports.options                     = options;
exports.ESR_Record                  = ESR_Record;
exports.ESR_List                    = ESR_List;
exports.parseFromIso                = parseFromIso;
exports.parseFromText               = parseFromText;




/*
 * import
 */
const utils                   = require('./utils.js');             // own utils
const padEnd                  = require('lodash/padEnd');
const padStart                = require('lodash/padStart');
const toString                = require('lodash/toString');
const _repeat                 = require('lodash/repeat');
const parseInt                = require('lodash/parseint');

var options = {
  CRLF:                       '\r\n',
  LF:                         '\r\n',
  txtLf:                      '\r\n',
  parseCustomerInfo:          true
};


function ESR_Record( Teilnehmernummer, KundenReferenz, AuftraggeberReferenz, Betrag, ValutaDatum, Reject ) {
  this.Teilnehmernummer             = Teilnehmernummer || '';
  this.KundenReferenz               = KundenReferenz || '';
  this.AuftraggeberReferenz         = AuftraggeberReferenz || '';
  this.Betrag                       = Betrag || 0;
  this.ValutaDatum                  = ValutaDatum;
  this.AufgabeDatum                 = ValutaDatum;
  this.Reject                       = Reject;
}



function ESR_List() {
  this.Teilnehmernummer       = '';
  this.Totalbetrag            = 0;
  this.ValutaDatum            = null;
  this.ErstellungsDatum       = null;
  this.list                   = [];
  this.count                  = count;
  this.toString               = toString;
  
  function count() {
    if(this.list) return this.list.length;
    return 0;
  }
  
  function toString() {
    var result = '';
    for(let i=0; i < this.count(); i++) {
      let s = ESR_RecordAsString(this.list[i]);
      result += s + options.txtLf;
    }
    result += ESR_ListTotalAsString(this);
    result += options.txtLf;
    
    return result;
  }
}



function ESR_RecordAsString( esr ) {

  if(!esr) return null;

  var Result = '';
  Result = Result + '002';  // Transaktionsart
  var Teilnehmernummer = ReplaceLines(esr.Teilnehmernummer);
  Result = Result + padStart(Teilnehmernummer,9, '0');
  Result = Result + padStart(esr.KundenReferenz,27,'0');
  Result = Result + BetragStr(esr.Betrag,8);
  Result = Result + padEnd(esr.AuftraggeberReferenz,10);
//  Result = Result + FormatDate(esr.AufgabeDatum); // Aufgabe-Datum
  Result = Result + FormatDate(esr.ValutaDatum); // Aufgabe-Datum
  Result = Result + FormatDate(esr.ValutaDatum); // Verarbeitungs-Datum
  Result = Result + FormatDate(esr.ValutaDatum); // Valuta-Datum
  Result = Result + StringOfChar('0', 9); //  Mikrofilm Nr. Post
  Result = Result + '0'; // Reject Code
  Result = Result + StringOfChar('0', 9); // Reserve
  Result = Result + StringOfChar('0', 4); // Taxen Post
  
  return Result;
}


function ESR_ListTotalAsString( esr ) {  // esr = ESR_List
  var result = '';
  var s;
  
  // Transaktionsart
  if(esr.Totalbetrag < 0) s = '995'; else s = '999';
  result += s;  

  var Teilnehmernummer = ReplaceLines(esr.Teilnehmernummer);
  result += padStart(Teilnehmernummer, 9, '0');
  result += StringOfChar('0', 27); // Sortierschlüssel
  result += BetragStr(esr.Totalbetrag, 10);
  s = toString(esr.count());
  result += padStart(s, 12, '0');
  result += FormatDate(esr.ErstellungsDatum); // Erstellungs-Datum
  result += StringOfChar('0', 9); // Post-Taxen
  result += StringOfChar('0', 9); // Taxen für Nachbearbeitung
  result += StringOfChar(' ', 13); // Reserve

  return result;
}


/*
 * parseFromText
 * @param {string} txt 
 * @returns ESR_List
 * 
 * use this to parse old ESR files
 * 
 */

function parseFromText( txt ) {
  
//  txt = toString(txt);
  
  var result = new ESR_List();
  var lines  = txt.split(options.txtLf);
  var lastLine, line, s;
  var anzahlTransaktionen, transaktionsart;
  
// console.log('lines:',lines);
  
  // find total line
  lastLine = lines.length - 1;
  while((lastLine > 0) && (lines[lastLine].length === 0)) lastLine--;
  // return null if total not found
  if(lastLine < 1) return null;

  line = lines[lastLine];
// console.log('line',line);
  anzahlTransaktionen = parseIntFrom(line, 51, 12, 1 );
// console.log('anzahlTransaktionen',anzahlTransaktionen);
  // get Totalbetrag
  transaktionsart = (line.substring(2,1) === '5') ? '-' : '';
// console.log('transaktionsart',transaktionsart);
  s = transaktionsart + parseIntFrom(line,39,10,0) + '.' + parseIntFrom(line,49,2,0);
// console.log('s',s);
  try {
    result.Totalbetrag = Number.parseFloat(s);
  } catch (e) {
    result.Totalbetrag = 0;
  }
  result.Teilnehmernummer = line.substring(3,12);
  s = line.substring(63,69);
// console.log('s',s);
  result.ErstellungsDatum = '20' + s.substring(0,2) + '-' + s.substring(2,4) + '-' + s.substring(4,6);

  // parse transactions
  for(let i = 0; i < lastLine; i++) {
    line = lines[i];
    rec  = new ESR_Record();
    rec.index = i;
    s = parseIntFrom(line,39,8) + '.' + parseIntFrom(line,47,2);
    try { rec.Betrag = Number.parseFloat(s); } catch (e) {};
//    rec.Teilnehmernummer =  dashedNumber(line.substring(3,12));
    rec.Teilnehmernummer =  line.substring(3,12);
    rec.KundenReferenz = line.substring(12,12+27);
    rec.KundenReferenz = trimLeadingZero(rec.KundenReferenz);
    rec.AuftraggeberReferenz = line.substring(49,49+9);
    s = line.substring(71,71+6);
    rec.ValutaDatum = '20' + s.substring(0,2) + '-' + s.substring(2,4) + '-' + s.substring(4,6);
    rec.Reject = line.substring(86,87);
    result.list.push(rec);
    
    if(!result.ValutaDatum) result.ValutaDatum = rec.ValutaDatum;
  }

  return result;
  
}


/*
 * parseFromIso( iso )
 * 
 * @param {object} iso 
 * @returns ESR_List
 * 
 * iso is a ISI20022 parsed to JSON. 
 * Use utils.loadXmlFileAsJson() to read this object from XML file.
 * 
 */

function parseFromIso( iso ) {
  
  var esr_master  = new ESR_Record();
  var result      = new ESR_List();
  var Ntry        = iso.Document.BkToCstmrDbtCdtNtfctn.Ntfctn.Ntry;

  // set error property
  if(Ntry) {
    result.error = '';
  } else {
    result.error = 'data not found';
    return result;
  }
  
  result.Teilnehmernummer = Ntry.NtryRef;
  result.Totalbetrag      = Ntry.Amt;
  result.ValutaDatum      = Ntry.ValDt.Dt;
  result.ErstellungsDatum = result.ValutaDatum;
  
  esr_master.Teilnehmernummer = result.Teilnehmernummer;
  esr_master.ValutaDatum      = result.ValutaDatum;
  
  var Dtls = Ntry.NtryDtls.TxDtls;
  
  // todo 
  // esr_master.AuftraggeberReferenz = Dtls.length;
  
  for(var i=0; i < Dtls.length; i++) {
    var rec = Dtls[i];
    var s = '';
    var esr = Object.assign({}, esr_master);
   
    // add index
    esr.index = i;
   
    // get reject
    esr.Reject = '0';
    s = rec.AddtlRmtInf;
    if(s && s.startsWith('?REJECT?')) {
      esr.Reject = s.substr(8);
    }
    
    // get Betrag
    esr.Betrag = rec.Amt || 0;
    
    // get KundenReferenz
    esr.KundenReferenz = rec.RmtInf.Strd.CdtrRefInf.Ref;
    
    
    // get Date
    s = utils.get_value(rec, 'RltdDts.AccptncDtTm');
    if(s) esr.AufgabeDatum = s.substr(0,10);
    
    if(options.parseCustomerInfo) {
      // get Name
      s = utils.get_value(rec, 'RltdPties.Dbtr.Nm');
      if(s) esr.Name = s;
    
      // get Address
      s = utils.get_value(rec, 'RltdPties.Dbtr.PstlAdr.AdrLine');
      if(s) esr.Address = s;

      // get IBAN
      s = utils.get_value(rec, 'RltdPties.DbtrAcct.Id.IBAN');
      if(s) esr.IBAN = s;
    }

    result.list.push(esr);
    
  }
  
  return result;
}




function BetragStr( betrag, len) {
  
  var b = betrag.toString();
  var p = b.indexOf('.');
  var l = len || 8;
  
  if(p === -1) {
    return padStart(b,l,'0') + '00';
  } else {
    return padStart( b.substr(0, p), l, '0' ) + padEnd( b.substr(p+1), 2, '0' );
  }
}


function StringOfChar( char, count ) {
  
//  return padEnd('', char, count);
  return _repeat(char, count);
  
}

function ReplaceLines( value ) {
  var s = toString(value);
  
  while(s.indexOf('-') >= 0) s = s.replace('-','');
  
  return s;
  
}


function FormatDate( value ) {

  // sample '2017-10-13T13:27:09'   ->  '171013'
  
  result = ''
         + value.substring(2,4)   // year
         + value.substring(5,7)   // month
         + value.substring(8,10);  // day
 // console.log('FormatDate('+value+') =', result);
 
  return result;
 
}




function parseIntAt( stringToParse, startPos, endPos, defaultValue ) {
  
  stringToParse = toString(stringToParse);
  if(!startPos) startPos = 0;
  if(!endPos) endPos = stringToParse.length - 1;
  if(!defaultValue) defaultValue = 0;
  try {
    var s = stringToParse.substring(startPos, endPos);
    var n = parseInt(s);
    if(!Number.isInteger(n)) n = defaultValue;
    return n;
  } catch(err) {
    return defaultValue;  
  }
  
}

function parseIntFrom( stringToParse, startPos, len, defaultValue ) {

  stringToParse = toString(stringToParse);
  if(!startPos) startPos = 0;
  if(!len) len = stringToParse.length;
  if(!defaultValue) defaultValue = 0;
  return parseIntAt( stringToParse, startPos, startPos + len, defaultValue);
  
}


function trimLeadingZero( str ) {
  
  var i = 0;
  while((i < str.length) && (str.substring(i,i+1) === '0')) i++;
  return str.substring(i,str.length);
}

function dashedNumber( str ) {
  
  return str.substring(0,2) + '-' + str.substring(2,8) + '-' + str.substring(8,10);
  
}