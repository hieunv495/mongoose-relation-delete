var _ = require('lodash')
var mongoose = require('mongoose')
var getExcuteDatas = require('./utils/getExcuteDatas')
var getFindQuery = require('./utils/getFindQuery')


function getSetUpdateData(localField, updateField, key, value) {

    if (!localField.startsWidth(updateField)) {
        throw new Error('Data error, localField not startsWidth updateField')
    }

    var localFieldBits = localField.split('.')
    var updateFieldBits = updateField.split('.')

    var i = _.lastIndexOf(updateFieldBits, '$[]')

    var arrayFilters

    if (i > 0) {
        updateFieldBits[i] = '$[element]'
        arrayFilters = [{
            element: getFindQuery(localFieldBits.slice(i + 1))
        }]
    }


    return [
        getFindQuery(localField, key),
        {
            $set: {
                [updateFieldBits.join('.')]: value
            }
        },
        {
            multi: true,
            arrayFilters: arrayFilters
        }
    ]
}



function listenEvent(model) {
    var excuteDatas = getExcuteDatas(model.schema)

    excuteDatas.forEach(function (data) {
        var type = data.type,
            value = data.value,
            ref = data.ref,
            foreignField = data.foreignField,
            localField = data.localField,
            updateField = data.updateField

        var relatedModel = mongoose.model(ref)
        if (type === 'SET') {
            relatedModel.schema.post('remove', function (doc, next) {
                var updateData = getSetUpdateData(localField, updateField, key, value)
                console.log('-- Set Update data')
                console.log(updateData)
                model.update(updateData[0], updateData[1], updateData[2])
            })
        }
    })


}

module.exports = {
    all: function (mongoose) {
        var models = _.values(mongoose.models)
        models.forEach(model => {
            listenEvent(model)
        })

        var baseModelBind = mongoose.model
        mongoose.model = function () {
            var model = baseModelBind.apply(mongoose, arguments)
            if (arguments.length > 1) {
                listenEvent(model)
            }
            return model
        }
    },
    model: listenEvent
}