import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePasswords = (password, hash) => {
    return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
    // TODO: salt
    return bcrypt.hash(password, 5);
};

export const createJWT = (user) => {
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        process.env.JWT_SECRET
    );

    return token;
};

export const protect = (req, res, next) => {
    // Bearer - this person is sending some type of token
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401);
        res.json({message: "Not Authorized"});
        return;
    }

    const [, token] = bearer.split(" ");
    if (!token) {
        res.status(401);
        res.json({message: "Token not valid"});
        return;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401);
        res.json({message: "Token not valid"});
        return;
    }
};