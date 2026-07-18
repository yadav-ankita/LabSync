const mongoose=require('mongoose');

const connectDb= async(url)=>{
   try {
      await mongoose.connect(url);
      console.log('MongoDB connected successfully');
   } catch (error) {
      console.log('Error in mongodb connection', error);
      throw error; 
   }
}
module.exports=connectDb;