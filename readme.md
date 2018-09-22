# iso2esr
Convert ISO20022 camt.054.xml to ESR files ESR Gutschriften Einzahlungsscheine

## Installation
```
npm install iso2esr
```

## Usage
```

const fs                = require('fs');         // npm  file system
const esr               = require('iso2esr');    // iso2esr module

const testFilePath      = 'test/data/';
const testFileXml1      = testFilePath + 'camt.054-ESR-Test1.xml';
const testFileTxt1_1    = testFilePath + 'camt.054-ESR-Test1-1.txt';
const testFileTxt2      = testFilePath + 'result.txt';

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

```

## Interface
In der Datei ISO20022toESR.ini können einige Einstellungen vorgenommen werden.

#### function ESR_Record( Teilnehmernummer, KundenReferenz, AuftraggeberReferenz, Betrag, ValutaDatum, Reject )
Return a ESR_Record for a single transaction
```
var r = new ESR_Record();
```

#### function ESR_List()
Return a ESR_List object for multiple transactions
```
var list = new ESR_List();
```
##### Properties
* Teilnehmernummer
* Totalbetrag
* ValutaDatum
* ErstellungsDatum
* list	(array of ESR_Record)
* count()	(number of transactions)
* toString()	

#### function loadXmlFileAsJson( fileName )
Read a ISO20022 XML file and return an object.

#### function parseFromIso( iso )
Return a ESR_List with transactions from <i>iso</i>,
where <i>iso</i> is a JSON loaded by function loadXmlFileAsJson(). 

#### function parseFromText( txt )
Return a ESR_List with transactions from <i>txt</i>,
where <i>txt</i> is a string as camt format. 

## License
MIT License

## GitHub
[Version on GitHub](http://github.com/WilliCommer/iso2esr-js/)



