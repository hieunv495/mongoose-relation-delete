var _ = require('lodash')
var mongooseRelationDelete = require('../plugin/mongoose-relation-delete')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost:27017/mongoose-relation-delete');


require('../plugin/utils/getRelativePath.test.js')
require('../plugin/utils/getRawDatas.test.js')
require('../plugin/utils/getExcuteDatas.test.js')

var categorySchema = new Schema({
    key: String,
    name: String
})

var postSchema = new Schema({
    key: String,
    name: String,

    category0: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        onDelete: 'SET_NULL'
    },

    category1: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
        onDelete: 'SET_DEFAULT'
    },

    category2: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        onDelete: 'CASECADE'
    },

    category3: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        onDelete: {
            type: 'SET',
            value: null
        }
    },

    category4: {
        type: String,
        onDelete: {
            type: 'SET_NULL',
            ref: 'Category',
            foreignField: 'key'
        }
    },

    category5: {
        name: String,
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            onDelete: 'SET_NULL'
        }
    },

    category6: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        onDelete: 'PULL' // Default: PULL .
    }],

    category7: [{
        name: String,
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            onDelete: 'SET_NULL'
        }
    }],

    category8: [{
        name: String,
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            onDelete: 'PULL ..' // Default: PULL ...
        }
    }],

    category9: [
        [{
            type: Schema.Types.ObjectId,
            ref: 'Category',
            onDelete: 'PULL ...' // Default: PULL ..
        }]
    ],

    category10: [
        [
            [{
                type: Schema.Types.ObjectId,
                ref: 'Category',
                onDelete: 'PULL ...' // Default PULL ..
            }]
        ]
    ]

})

postSchema.plugin(mongooseRelationDelete)


var Category = mongoose.model('Category', categorySchema)
var Post = mongoose.model('Post', postSchema)


var categories = []
var posts = []

function clearData() {
    return Promise.all([
        Category.remove({}),
        Post.remove({})
    ])
}

async function createData() {

    var createCategories = _.range(0, 8).map(i => {
        return Category.create({
            key: i,
            name: 'Category ' + i
        })
    })

    await Promise.all(createCategories)
    categories = await Category.find({}).sort('key')

    var createPosts = _.range(0, 5).map(i => {
        return Post.create({
            key: i,
            name: 'Post ' + i,
            ['category' + i]: categories[i]

        })
    })

    var createPost5 = Post.create({
        key: 5,
        name: 'Post 5',
        category5: {
            category: categories[5]
        }
    })

    var createCategory6 = Post.create({
        key: 6,
        name: 'Post 6',
        category6: categories[6]
    })

    await Promise.all([...createPosts, createPost5, createCategory6])

    posts = await Post.find({}).sort('key')

    // console.log(categories)
    // console.log(posts)

}

describe('INIT_DATA', () => {
    it('clearData', async () => {
        await clearData()
    })

    it('createData', async () => {
        await createData()
    })

    it('createRelation', async () => {
        categories[0]
    })
})

describe('SINGLE', function () {
    describe('SET_NULL', function () {
        return true
    })
})