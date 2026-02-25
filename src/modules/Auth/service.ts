import { UserModel } from "../../lib/scheema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService{

    async login(email : string, password : string) {

        if(!email || !password){
            throw new Error("Missing required fields");
        }

        const jwt_secret = process.env.JWT_SECRET as string
    
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign({ userId: user._id, user: user }, jwt_secret, { expiresIn: '12h' });
        return token;
    }

}

export {AuthService}