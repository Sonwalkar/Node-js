const express = require('express')
const mongoose = require('mongoose')
const nanoID = require('nanoid')
const URLS = require('./module/urls')

const app = express()

const dbURI = //mongodb url

mongoose.connect(dbURI)
    .then((result)=>{
        console.log("Connected to database");
        app.listen(3000)
    })
    .catch((err)=>{
        console.log(err);
    })


app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))

app.use(express.static('public'));

app.use(express.json());

app.get('/',(req, res)=>{
    URLS.find().sort({createdAt:-1})
        .then((result)=>{
            res.render('index', {title: 'All URLs', URLSData: result})
        })
        .catch(err =>{
            console.log(err);
        })
})

app.get('/createURL', (req, res)=>{
    res.render('createURL', {title:'Create a new URL'})
})

app.post('/createURL', (req, res)=>{
    let breakOrContinue = false;
    const {longURL} = req.body;

    do{
        let shortURL = nanoID.nanoid(6)
        URLS.findOne({'shortURL':shortURL})
            .then((result)=>{
                if(result === null){
                    const newURL = new URLS({
                        longURL: req.body.longURL,
                        shortURL: shortURL
                    })
                    newURL.save()
                        .then(result=>{
                            // console.log(result);
                            res.json(result)
                            // res.redirect('/')
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                }else{
                    breakOrContinue = true
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    }while(breakOrContinue);
    
})

app.get('/:id', (req,res)=>{
    const shortURL = req.params.id
    URLS.findOne({'shortURL':shortURL})
        .then((result)=>{
            res.redirect(result.longURL);
            
        })
        .catch(err=>{
            res.render('404', {title:'404 page not found'})
        })

})

app.use((req,res)=>{
    res.render('404', {title:'404 page not found'})
})
