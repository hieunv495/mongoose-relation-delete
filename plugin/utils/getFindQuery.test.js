var assert = require('assert');
var getFindQuery = require('./getFindQuery')

describe('Function: getFindQuery', () => {
    it('Case 1', () => {
        let path = 'category'
        let value = 2
        let pretension = {
            category: {
                $eq: value
            }
        }
        assert.deepEqual(getFindQuery(path, value), pretension)
    })

    it('Case 2', () => {
        let path = 'categories.$[]'
        let value = 2
        let pretension = {
            categories: {
                $elementMatch: {
                    $eq: value
                }
            }
        }
        assert.deepEqual(getFindQuery(path, value), pretension)
    })

    it('Case 3', () => {
        let path = 'categories.$[].name'
        let value = 2
        let pretension = {
            categories: {
                $elementMatch: {
                    name: {
                        $eq: value
                    }
                }
            }
        }
        assert.deepEqual(getFindQuery(path, value), pretension)
    })

    it('Empty', () => {
        let path = ''
        let value = 2
        let pretension = {
            $eq: value
        }
        assert.deepEqual(getFindQuery(path, value), pretension)
    })

    it('Nil', () => {
        let path = undefined
        let value = 2
        let pretension = {
            $eq: value
        }
        assert.deepEqual(getFindQuery(path, value), pretension)
    })
})