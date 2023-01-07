const mongoose = require('mongoose')
const URL =`mongodb+srv://khanhduy:khanhduy@cluster0.vkxyqmo.mongodb.net/furnit?retryWrites=true&w=majority`
const connectDB = async ()=>{
    try {
        await mongoose.connect(URL)
            .then(()=>{
                console.log("Connect DB successfully!");
            })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {connectDB}