var _ = require('lodash')

/**
 * Get relative path from base path and direction
 * 
 * @param {String} path - Base path
 * @param {String} direction - Directive to relative path
 * 
 * @return {String} - Relative path
 */
function getRelativePath(path, direction) {
    if (_.isNil(path)) return path
    if (!_.isString(path)) throw Error('Path need is String')

    if (_.isNil(direction)) return path
    if (!_.isString(direction)) throw Error('Direction need is String')

    var baseBits = path.split('.').filter(item => item)

    var relativeBits = Array.from(baseBits)

    var directionBits = direction.match(/(\.+)|([^ \.]+)/gm)

    if (!_.isArray(directionBits)) return path

    var part

    for (part of directionBits) {
        if (part.startsWith('.')) {
            var popLen = part.length - 1
            if (popLen > baseBits.length)
                return null
            relativeBits.splice(-popLen, popLen)
        } else {
            relativeBits.push(part)
        }
    }

    return relativeBits.join('.')
}

module.exports = getRelativePath