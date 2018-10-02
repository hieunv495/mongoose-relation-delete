var assert = require('assert');

const getRelativePath = require('./getRelativePath')

describe('Function: getRelativePath', () => {
    it('Normal 1', () => {
        let path = 'categories.$[].profile.$[].location'
        let direction = '..'
        let result = getRelativePath(path, direction)
        assert.equal(result, 'categories.$[].profile.$[]')
    })

    it('Normal 2', () => {
        let path = 'categories.$[].profile.$[].location'
        let direction = '..name'
        let result = getRelativePath(path, direction)
        assert.equal(result, 'categories.$[].profile.$[].name')
    })

    it('Normal 3', () => {
        let path = 'categories.$[].profile.$[].location'
        let direction = '...'
        let result = getRelativePath(path, direction)
        assert.equal(result, 'categories.$[].profile')
    })

    it('Normal 4', () => {
        let path = 'categories.$[].profile.$[].location'
        let direction = '.....'
        let result = getRelativePath(path, direction)
        assert.equal(result, 'categories')
    })

    it('Normal 5', () => {
        let path = 'categories.$[].profile.$[].location'
        let direction = '......'
        let result = getRelativePath(path, direction)
        assert.equal(result, '')
    })

    it('Overflow', () => {
        let path = 'categories.$[].profile.$[].location'
        let direction = '.......'
        let result = getRelativePath(path, direction)
        assert.equal(result, null)
    })

    it('Overflow 2', () => {
        let path = 'categories.$[].profile.$[].location'
        let direction = '.......name'
        let result = getRelativePath(path, direction)
        assert.equal(result, null)
    })

    it('Path nil', () => {
        assert.equal(getRelativePath(null), null)
        assert.equal(getRelativePath(undefined), null)
    })

    it('Relation nil', () => {
        assert.equal(getRelativePath('abc', null), 'abc')
    })

    it('Path empty, relation nil', () => {
        assert.equal(getRelativePath(null), null)
        assert.equal(getRelativePath(undefined), null)
    })

    it('Path empty, relation empty', () => {
        assert.equal(getRelativePath('', ''), '')
    })

    it('Path empty, relation normal', () => {
        assert.equal(getRelativePath('', '..'), null)
    })


})