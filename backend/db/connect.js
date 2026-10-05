const mongoose=require('mongoose');

const connectDb= async(url)=>{
   try {
      await mongoose.connect(url, {
         serverSelectionTimeoutMS: 10000, // fail fast after 10s
         connectTimeoutMS: 10000,
      });
      console.log('MongoDB connected successfully');
   } catch (error) {
      console.log('Error in mongodb connection', error);
      throw error; 
   }
}
module.exports=connectDb;