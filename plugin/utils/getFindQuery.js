var _ = require('lodash')

/**
 * Get mongoose find query object for path equal value
 * @param {String} path Field Path, example: categories.$[].name
 * @param {Object} value Value to find for path
 */
function getFindQuery(path, value) {
    if (_.isNil(path)) {
        return {
            $eq: value
        }
    }

    function recursiveGetFindQuery(pathBits, value) {
        var part = pathBits[0]
        if (!part) return {
            $eq: value
        }

        if (part === '$[]') {
            return {
                $elementMatch: recursiveGetFindQuery(pathBits.slice(1), value)
            }
        }

        return {
            [part]: recursiveGetFindQuery(pathBits.slice(1), value)
        }
    }

    var bits = path.split('.').filter(function (item) {
        return item
    })

    return recursiveGetFindQuery(bits, value)
}

module.exports = getFindQuery