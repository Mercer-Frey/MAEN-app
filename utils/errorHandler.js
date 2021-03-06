module.exports = (res, error, data) => {
  res.status(500).json({
    data: data? data: 'no data',
    success: false,
    message: error.message ? error.message : error,
  })
}
