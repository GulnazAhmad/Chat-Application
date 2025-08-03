import jwt from "jsonwebtoken";
export const verifytoken = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.jwttoken;
  console.log(token);
  if (!token) {
    return res.status(401).json("Access Denied: No token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET); // SECRET should be your secret key
    console.log("decoded", decoded);
    req.user = decoded; // Optional: attach decoded payload to request
    next(); // Proceed to the next middleware or route
  } catch (err) {
    return res.status(403).json("Invalid token");
  }
};
