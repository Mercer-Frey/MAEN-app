const fs = require('fs')

const Category = require('../models/Category')
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')
const { update } = require('./position')

module.exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({
      name: 1,
    })
    res.status(200).json(categories)
  } catch (error) {
    errorHandler(res, error)
  }
}
module.exports.getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    res.status(200).json(category)
  } catch (error) {
    errorHandler(res, error)
  }
}
module.exports.remove = async (req, res) => {
  if (req.params.id) {
    try {
      const categoryForDelete = await Category.findById(req.params.id)
      fs.unlinkSync(categoryForDelete.imageSrc)
      await Category.remove({ _id: req.params.id })
      await Position.remove({ category: req.params.id })

      res.status(200).json({ message: 'Category was removed' })
    } catch (error) {
      errorHandler(res, error)
    }
  }
}
module.exports.create = async (req, res) => {
  const category = new Category({
    name: req.body.name,
    user: req.user.id,
    imageSrc: req.file ? req.file.path : '',
  })
  try {
    await category.save()

    res.status(201).json(category)
  } catch (error) {
    errorHandler(res, error)
  }
}
module.exports.update = async (req, res) => {
  let categoryForDelete
  const updated = {
    name: req.body.name,
  }
  if (req.file) {
    updated.imageSrc = req.file.path
    try {
      categoryForDelete = await Category.findById(req.params.id)
      fs.unlinkSync(categoryForDelete.imageSrc)
    } catch (error) {
      errorHandler(res, error)
    }
  }
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id }, // find
      { $set: updated }, // update fields
      { new: true } // return new object
    )
    res.status(200).json(category)
  } catch (error) {
    errorHandler(res, error)
  }
}
