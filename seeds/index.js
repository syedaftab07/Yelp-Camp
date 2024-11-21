const mongoose = require('mongoose');
const cities = require('./cities')
const{places,descriptors}= require('./seedHelpers')
const  Campground=require('../model/campground')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('Mongo connnection Open')

    })
    .catch(err => {
        console.log('mongo connection fail')
        console.log(err)
    });

    const sample = array => array[Math.floor(Math.random() * array.length)];
    const price= Math.floor(Math.random()*1000);

    const seedDB = async () => {
        await Campground.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * 1000);
            const camp = new Campground({
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                image:"https://source.unsplash.com/random",
                description:'Emmet is great for that. With it installed in the code editor you are using, you can type “lorem” and then tab and it will expand into a paragraph of Lorem Ipsum placeholder text. But it can do more! You can control how much you get, place it within HTML structure as it expands, and get different bits of it in repeated elements.',
                price
            })
            await camp.save();
        }
    }
    
    

    seedDB().then(()=>{
        mongoose.connection.close();
    })