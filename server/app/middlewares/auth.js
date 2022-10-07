import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers?.authorization ? req.headers.authorization.split(" ")[1] : null;

        if(token) {
            const isCustomAuth = token.length < 500;

            let decodedData;

            if(isCustomAuth) {
                decodedData = jwt.verify(token, 'Steganografia - Marcin Herman');
                
                req.userId = decodedData?.id;
            } else {
                decodedData = jwt.decode(token);
                
                req.userId = decodedData?.sub;
            }
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;