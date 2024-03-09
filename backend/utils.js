import jwt from 'jsonwebtoken';

export const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(createError(401, 'You are not authenticated!'));

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.userId = decoded.id; // Set the user ID in the request object for further processing
    next();
  } catch (err) {
    return next(createError(403, 'Token is not valid!'));
  }
};
