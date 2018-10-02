var _ = require('lodash')
var getRelativePath = require('./getRelativePath')
var getRawDatas = require('./getRawDatas')


/**
 * @typedef {Object} RawData - Raw data before find 'onDelete' in schema
 * @property {String} path - Path in field contain 'onDelete'
 * @property {Object} options - Option of field contain 'onDelete'
 */

/**
 * @typedef {Object} ExcuteData  - Data for bind excute event onDelete
 * @property {'CASECADE' | 'SET' | 'PULL'} type
 * @property {Object} value - Value to set if related field is deleted. Existed only type is 'SET'
 * @property {String} ref - Relation mongoose Model to bind 'remove' event
 * @property {String} foreignField - Path of key in mongoose relation Model
 * @property {String} localField - Path of key in this Model
 * @property {String} updateField - Path of update field
 * 
 */

/**
 * Get type of action on delete relation
 * @param {RawData} rawData 
 * @return {'CASECADE' | 'SET' | 'PULL'} - Type
 */
function getType(rawData) {
    var path = rawData.path
    var options = rawData.options
    var onDelete = options.onDelete

    var typeStr = _.isString(onDelete) ? onDelete : onDelete.type
    if (!typeStr) {
        throw new Error(`'Invalid 'onDelete type' at path '${path}'`)
    }

    var bits = typeStr.split(' ')
    var type = bits[0]
    if (type.startsWith('SET')) return 'SET'
    if (type === 'CASECADE') return 'CASECADE'
    if (type === 'PULL') return 'PULL'

    throw new Error(`'Invalid 'onDelete type' at path '${path}'`)
}

/**
 * Get value if type is 'SET'
 * @param {RawData} rawData
 * @return {Object} 
 */
function getValue(rawData) {
    var path = rawData.path
    var options = rawData.options
    var onDelete = options.onDelete

    var typeStr = _.isString(onDelete) ? onDelete : onDelete.type

    var bits = typeStr.split(' ')
    var type = bits[0]

    if (type === 'SET_NULL') return null
    if (type === 'SET_DEFAULT') {
        var value = options.default
        if (value === undefined)
            throw new Error(`Need default value for 'SET_DEFAULT' onDelete at path '${path}'`)
        return value
    }
    if (type === 'SET') {
        var value = options.onDelete.value
        if (value === undefined)
            throw new Error(`Need value for 'SET' in onDelete at path '${path}'`)
        return value
    }
}

/**
 * Get updateField
 * @param {RawData} rawData
 * @return {String} 
 */
function getUpdateField(rawData) {
    var path = rawData.path
    var options = rawData.options
    var onDelete = options.onDelete

    var typeStr = _.isString(onDelete) ? onDelete : onDelete.type

    var bits = typeStr.split(' ').filter(item => item)
    if (bits.length === 1) {
        return path
    } else if (bits.length === 2) {
        return getRelativePath(path, bits[1])
    } else {
        throw new Error(`'Invalid 'onDelete type': '${typeStr}' in path '${path}' `)
    }
}

/**
 * 
 * @param {RawData} rawData 
 * @return {ExcuteData}
 */
function getExcuteData(rawData) {
    var path = rawData.path
    var options = rawData.options
    var onDelete = options.onDelete

    var result = {
        type: getType(rawData),
        value: getValue(rawData),
        ref: onDelete.ref || options.ref,
        foreignField: onDelete.foreignField || '_id',
        localField: path,
        updateField: getUpdateField(rawData)
    }

    return result
}

/**
 * Get list ExcuteData from schema 
 * 
 * @param {MongooseSchema} schema - Mongoose schema
 * 
 * @return {[ExcuteData]} - List ExcuteData 
 */
function getExcuteDatas(schema) {
    var rawDatas = getRawDatas(schema)
    return rawDatas.map(rawData => getExcuteData(rawData))
}

module.exports = getExcuteDatas