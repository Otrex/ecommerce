module.exports = ({ validator, handler }) => {
  return async (req, res, next) => {
    let refined = {
      ...req.body,
      ...req.query,
      ...req.params,
    };
    try {
      if (validator) {
        refined = new validator().check(refined);
      }
      refined.account = req.session?.account;
      const { data, message, ...others } = await handler(
        refined,
        req,
        res,
        next
      );
      return res.status(200).json({
        status: 'success',
        message,
        data,
        ...others,
      });
    } catch (err) {
      next(err);
    }
  };
};
