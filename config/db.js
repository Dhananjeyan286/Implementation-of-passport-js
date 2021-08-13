const mongoose=require("mongoose")





const connectdb=async()=>{
    try{
        const con=await mongoose.connect(process.env.mongo_uri,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log("Database connected...")
    }
    catch(err)
    {
        console.log(err)
        process.exit(1);
    }
}

module.exports=connectdb