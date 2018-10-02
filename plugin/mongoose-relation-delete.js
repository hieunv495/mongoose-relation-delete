var mongoose = require('mongoose')
var getExcuteDatas = require('./utils/getExcuteDatas')


module.exports = function mongooseRelationDeletePlugin(schema, options) {

    var excuteDatas = getExcuteDatas(schema)

    console.log(excuteDatas)

}