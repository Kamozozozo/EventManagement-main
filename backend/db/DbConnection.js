
///connecting to the database
import mongoose  from "mongoose";
const connection =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("connected to the data base")
    }
    catch (error) {

    }

}
export default connection