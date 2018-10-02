/**
 * @typedef {Object} RawData - Raw data before find 'onDelete' in schema
 * @property {String} path - Path in field contain 'onDelete'
 * @property {Object} options - Option of field contain 'onDelete'
 */

/** 
 * Recursive find option data of field contain 'onDelete' 
 * 
 * @param {Object} options - Data of path
 * @param {String} path - Current path
 * @return {[RawData]} - List path and options contain 'onDelete'
 */
function recursiveGetRawDatas(options, path) {

    if (!options) return []

    if ((options.ref && options.onDelete) || (options.onDelete && options.onDelete.ref)) {
        return [{
            path,
            options
        }]
    }

    if (options instanceof Function) {
        return []
    }

    if (options instanceof Array) {
        return recursiveGetRawDatas(options[0], path + '.$[]')
    }

    if (options instanceof Object && !options.type) {
        return Object.keys(options).map(key => {
            return recursiveGetRawDatas(options[key], path + '.' + key)
        }).reduce((final, datas) => {
            final.push(...datas)
            return final
        }, [])
    }

    if (options.type) {
        return recursiveGetRawDatas(options.type, path)
    }

    return []

}



/**
 * get list RawData container 'onDelete'
 * 
 * @param {MongooseSchema} schema - Mongoose Shema
 * 
 * @return {[RawData]} - List path and option
 */
function getRawDatas(schema) {

    let result = []
    schema.eachPath(function (pathname, schemaType) {
        result.push(...recursiveGetRawDatas(schemaType.options, pathname))
    })
    return result
}

module.exports = getRawDatas