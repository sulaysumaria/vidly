function validate(validator) {
  return (req, res, next) => {
    const { error } = validator(req.body)

    if (error) {
      let errorMessage = ''
      error.details.map(d => (errorMessage += d.message))

      return res.status(400).send(errorMessage)
    }

    next()
  }
}

module.exports = {
  validate,
}
