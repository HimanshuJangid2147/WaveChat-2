import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });

    res.cookie('jwt', token, {
        httpOnly: true, // Prevent XSS attacks
        sameSite: 'strict', // CSRF protection
        maxAge: 15 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== 'development', // Set to true for production
    });
    
    return token; // Returning for logging purposes
}