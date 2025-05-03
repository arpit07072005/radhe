import mongoose from "mongoose";

const connectdb = async ()=>{
    try{
     const connection = await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
     console.log("database connected ",connection);
    }catch(error){
        console.log("mongodb connection failed ", error);
        process.exit(1);
    }
}
export default connectdb;