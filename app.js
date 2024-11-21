const express=require('express')
const path = require('path')
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate')
const methodoveride = require('method-override')
const morgan =require('morgan')
const  Campground=require('./model/campground')

// Example MongoDB connection with Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to the database');
})
.catch((err) => {
    console.error('Database connection error:', err);
});


// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//     .then(() => {
//         console.log('Mongo connnection Open')

//     })
//     .catch(err => {
//         console.log('mongo connection fail')
//         console.log(err)
//     });

   

const app =  express();
app.engine('ejs',ejsmate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodoveride('_method'));
app.use(morgan('dev'))

app.get('/',(req,res)=>{
res.render('home')
})

app.get('/campground', async (req,res)=>{
    const campground = await Campground.find({});
    res.render('campground/index',{campground})

} )


app.get('/campground/new', (req,res)=>{
    res.render('campground/new');
})

app.post('/campground', async (req, res,next) => {

      const campground = new Campground(req.body.campground);
      console.log(campground);
      await campground.save();
      res.redirect(`/campground/${campground._id}`);
  
});

app.get('/campground/:id/edit', async(req,res)=>{
    const campground= await Campground.findById(req.params.id);
    res.render('campground/edit',{campground})
})

app.get('/campground/:id' ,async(req,res)=>{
    const campground= await Campground.findById(req.params.id)
     res.render('campground/show',{campground})

})

app.put('/campground/:id', async (req,res)=>{
    const {id} = req.params;
    console.log(req.body.campground)
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campground/${campground._id}`)
})

app.delete('/campground/:id',async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground')
})

app.use((err,req,res,next)=>{
    res.send('Ohh boy error');
})

app.listen(3000,()=>{
    console.log("App is listening")
})

