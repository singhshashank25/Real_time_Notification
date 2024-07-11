const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	let token = req.headers["token"];
	if (!token)
		return res
			.status(400)
			// .send({ message: "Access denied, no token provided." })
			.json({message: "Access denied, no token provided."})

	jwt.verify(token, process.env.JWTSECRET, (err, validToken) => {
        console.log(token);
		if (err) {
			return res.status(400).send({ message: "invalid token" });
		} else {
			req.user = validToken;
			next();
		}
	});
};