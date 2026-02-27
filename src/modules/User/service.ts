
import { UserModel } from "../../lib/scheema";
import bcrypt from "bcrypt";

class UserService {



    async createUser(username :string, email : string, password : string, confirmPassword : string){
        if(!username || !email || !password || !confirmPassword){
            throw new Error("Missing required fields");
        }
        await this.existEmail(email);
        await this.confirmPassword(password, confirmPassword);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        

        const newUser = await UserModel.create({username, email, password: hashedPassword});
        return (await newUser).save();
    }

    async getUser(id: string){
        const user = await UserModel.findById(id);  
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }




    async existEmail(email: string){
        const user = await UserModel.findOne({email});
        if(user){
            throw new Error("Email already in use");
        }
        return null;
    }




    async confirmPassword(password: string, confirmPassword: string){
        if(password !== confirmPassword){
            throw new Error("Passwords do not match");
        }        return true;
    }




    async encyptPassword(password: string){
        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            return hashedPassword;
        }catch(err){
            return {error: "Error encrypting password"};
        }
    }
}

export { UserService }