const validateStatus = (req, res, next) => {
  const { status } = req.body
  const validStatus = [ 'To do', 'In progress', 'Done']

  if (!validStatus.includes(status)) {
    return res.status(400).json({message: `Invalid status value`})
  }

  next()
}

module.exports = validateStatus
