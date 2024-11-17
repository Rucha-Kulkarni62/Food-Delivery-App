import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ruchak:3456278@cluster0.dcqek.mongodb.net/Food-del').then(()=>console.log("DB Connected"));

}