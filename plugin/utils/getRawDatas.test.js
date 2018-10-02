var assert = require('assert');
var getRawDatas = require('./getRawDatas')
var mongoose = require('mongoose')
var Schema = mongoose.Schema


describe('Function: getRawDatas', () => {
    it('Case 1', () => {
        var schema = new Schema({
            name: String,
            category: {
                type: Schema.Types.ObjectId,
                ref: 'Category',
                onDelete: 'SET_NULL'
            }
        })

        let rawData = getRawDatas(schema)[0]
        assert.deepEqual(rawData, {
            path: 'category',
            options: schema.paths.category.options
        })
    })

    it('Case 2', () => {
        var schema = new Schema({
            name: String,
            category: {
                name: String,
                category: {
                    type: Schema.Types.ObjectId,
                    ref: 'Category',
                    onDelete: 'SET_NULL'
                }
            }
        })

        let rawData = getRawDatas(schema)[0]
        assert.deepEqual(rawData, {
            path: 'category.category',
            options: schema.paths['category.category'].options
        })
    })


    it('Case 3', () => {
        var schema = new Schema({
            name: String,
            category: [{
                type: Schema.Types.ObjectId,
                ref: 'Category',
                onDelete: 'PULL' // Default: PULL .
            }],
        })

        let rawData = getRawDatas(schema)[0]
        assert.deepEqual(rawData, {
            path: 'category.$[]',
            options: schema.paths.category.options.type[0]
        })
    })

    it('Case 4', () => {
        var schema = new Schema({
            name: String,
            category: [{
                name: String,
                category: {
                    type: Schema.Types.ObjectId,
                    ref: 'Category',
                    onDelete: 'SET_NULL'
                }
            }],
        })

        let rawData = getRawDatas(schema)[0]
        assert.deepEqual(rawData, {
            path: 'category.$[].category',
            options: schema.paths.category.options.type[0].category
        })
    })

    it('Case 5', () => {
        var schema = new Schema({
            name: String,
            category: [
                [{
                    type: Schema.Types.ObjectId,
                    ref: 'Category',
                    onDelete: 'PULL ...' // Default: PULL ..
                }]
            ],
        })

        let rawData = getRawDatas(schema)[0]
        assert.deepEqual(rawData, {
            path: 'category.$[].$[]',
            options: schema.paths.category.options.type[0][0]
        })
    })

    it('Case 6', () => {
        var schema = new Schema({
            name: String,
            category: [
                [
                    [{
                        type: Schema.Types.ObjectId,
                        ref: 'Category',
                        onDelete: 'PULL ...' // Default PULL ..
                    }]
                ]
            ],
        })

        let rawData = getRawDatas(schema)[0]
        assert.deepEqual(rawData, {
            path: 'category.$[].$[].$[]',
            options: schema.paths.category.options.type[0][0][0]
        })
    })

    it('Case 7', () => {
        var schema = new Schema({
            name: String,
            category: [
                [
                    [{
                        name: String,
                        category: {
                            type: Schema.Types.ObjectId,
                            ref: 'Category',
                            onDelete: 'PULL ...' // Default PULL ..
                        }
                    }]
                ]
            ],
        })

        let rawData = getRawDatas(schema)[0]
        assert.deepEqual(rawData, {
            path: 'category.$[].$[].$[].category',
            options: schema.paths.category.options.type[0][0][0].category
        })
    })

    it('Case 8', () => {
        var schema = new Schema({
            name: String,
            category: [
                [
                    [{
                        name: String,
                        category: [{
                            type: Schema.Types.ObjectId,
                            ref: 'Category',
                            onDelete: 'PULL ...' // Default PULL ..
                        }]
                    }]
                ]
            ],
        })

        let rawData = getRawDatas(schema)[0]
        assert.deepEqual(rawData, {
            path: 'category.$[].$[].$[].category.$[]',
            options: schema.paths.category.options.type[0][0][0].category[0]
        })
    })
})