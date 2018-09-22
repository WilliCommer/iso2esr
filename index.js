/* 
 * 
 */

const esr                           = require('./esr-mod.js');
const utils                         = require('./utils.js');

exports.options                     = esr.options;
exports.ESR_Record                  = esr.ESR_Record;
exports.ESR_List                    = esr.ESR_List;
exports.parseFromIso                = esr.parseFromIso;
exports.parseFromText               = esr.parseFromText;
exports.loadXmlFileAsJson           = utils.loadXmlFileAsJson;

