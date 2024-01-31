const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const header = req.headers['authorization'];

    if (typeof header === 'undefined')
        return res.status(403).json({ error: 'Unauthorized - Missing token' });

    else {
        try {

            const token = header.split(" ")[1];
        
            req.token = token;

            const decoded = jwt.verify(token, 'secretkeyappearshere');
       
            req.user = decoded;
    
            if (decoded.role && decoded.role === 'admin') {
                next();
            } else {
                return res.status(403).json({ error: 'Forbidden - Insufficient privileges' });
            }

        } catch (error) {
            console.error('JWT Verification Error:', error);
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
    }
};

module.exports = { authenticateUser };
