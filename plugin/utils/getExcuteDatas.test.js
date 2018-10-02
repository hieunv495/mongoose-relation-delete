var assert = require('assert');
var getExcuteDatas = require('./getExcuteDatas')
var mongoose = require('mongoose')
var Schema = mongoose.Schema


describe('Function: getExcuteDatas', () => {
    it('Case 1', () => {
        var schema = new Schema({
            name: String,
            category: {
                type: Schema.Types.ObjectId,
                ref: 'Category',
                onDelete: 'SET_NULL'
            }
        })

        let excuteData = getExcuteDatas(schema)[0]
        assert.deepEqual(excuteData, {
            type: 'SET',
            value: null,
            ref: 'Category',
            foreignField: '_id',
            localField: 'category',
            updateField: 'category'
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

        let excuteData = getExcuteDatas(schema)[0]
        assert.deepEqual(excuteData, {
            type: 'SET',
            value: null,
            ref: 'Category',
            foreignField: '_id',
            localField: 'category.category',
            updateField: 'category.category'
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

        let excuteData = getExcuteDatas(schema)[0]
        assert.deepEqual(excuteData, {
            type: 'PULL',
            value: undefined,
            ref: 'Category',
            foreignField: '_id',
            localField: 'category.$[]',
            updateField: 'category.$[]'
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

        let excuteData = getExcuteDatas(schema)[0]
        assert.deepEqual(excuteData, {
            type: 'SET',
            value: null,
            ref: 'Category',
            foreignField: '_id',
            localField: 'category.$[].category',
            updateField: 'category.$[].category'
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

        let excuteData = getExcuteDatas(schema)[0]
        assert.deepEqual(excuteData, {
            type: 'PULL',
            value: undefined,
            ref: 'Category',
            foreignField: '_id',
            localField: 'category.$[].$[]',
            updateField: 'category'
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

        let excuteData = getExcuteDatas(schema)[0]
        assert.deepEqual(excuteData, {
            type: 'PULL',
            value: undefined,
            ref: 'Category',
            foreignField: '_id',
            localField: 'category.$[].$[].$[]',
            updateField: 'category.$[]'
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

        let excuteData = getExcuteDatas(schema)[0]
        assert.deepEqual(excuteData, {
            type: 'PULL',
            value: undefined,
            ref: 'Category',
            foreignField: '_id',
            localField: 'category.$[].$[].$[].category',
            updateField: 'category.$[].$[]'
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

        let excuteData = getExcuteDatas(schema)[0]
        assert.deepEqual(excuteData, {
            type: 'PULL',
            value: undefined,
            ref: 'Category',
            foreignField: '_id',
            localField: 'category.$[].$[].$[].category.$[]',
            updateField: 'category.$[].$[].$[]'
        })
    })
})