const mongoose = require("mongoose");
const ung = require('unique-names-generator');
require('dotenv').config();
const names = require('unique-names-generator').names;
const starWars=require('unique-names-generator').starWars;
const User = require('./models/User');
const Product=require('./models/Product');
const Payment=require('./models/Payment');
const bcrypt =require('bcrypt');

const connect = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



//Create new users

function UserData(){
    Users=[];
    role=['customer','designer'];
    for (let index = 0; index < 200; index++) {
        const name = ung.uniqueNamesGenerator({dictionaries: [names]});
        const lname = ung.uniqueNamesGenerator({dictionaries: [names]});
        const hash = bcrypt.hashSync(name+"@123",10);
        let user={
        name : name,
        lastname : lname,
        email: name+"@gmail.com",
        password: hash,
        role: role[Math.floor(Math.random()*2)],
        balance: Math.floor(Math.random()*5000+1000),
        }
        Users.push(user);
    }

    User.insertMany(Users)
    .then(function(){
        console.log("UserData inserted")  
    }).catch(function(error){
        console.log(error)      
    });
}


//Create new designs
function ProductData(){
    let imageNum=1;
    let Products=[];
    User.find({role:"designer"},(err,docs)=>{
        docs.forEach(user=>{
            let size = Math.floor(Math.random()*5+1);
            for (let index = 0; index < size; index++) {
                const url="https://picsum.photos/id/"+(imageNum)+"/1080/720";
                imageNum+=1;
                const name= ung.uniqueNamesGenerator({dictionaries: [starWars]});
                product={
                    writer: user._id,
                    title:name,
                    description:name,
                    price:Math.floor(Math.random()*300+50),
                    images:[url],
                }
                Products.push(product);
            }
        })
        Product.insertMany(Products)
        .then(function(){
            console.log("ProductData inserted")  
        }).catch(function(error){
            console.log(error)      
        });
    })
}

function ReferenceProductUser(){
    console.log("Referencing")
    References=[];
    Product.find({},async (err,docs)=>{
        docs.forEach((product)=>{
            let found=false;
            for (let index = 0; index < References.length; index++) {
                if(References[index].uid.equals(product.writer)){
                    let pidarr=References[index].pid;
                    pidarr.push(product._id);
                    References[index].pid=pidarr;
                    found=true;
                    break;
                }
            }
            if(found==false){
                let pidarr=[]
                pidarr.push(product._id);
                let Reference={
                    uid: product.writer,
                    pid: pidarr,
                }
                References.push(Reference);
            }
        })
        for (let index = 0; index < References.length; index++) {
            await User.findOneAndUpdate({_id:References[index].uid},{products: References[index].pid},(err,docs)=>{
                if(err)
                    console.log(err)
            });
        }
    })
}

async function PaymentData (){
    console.log("Payments")
    Payments=[];
    const productList= await Product.find({});
    User.find({role:"customer"},async (err,docs)=>{
        docs.forEach(async (user)=>{
            let times=Math.floor(Math.random()*20+5);
            for (let index = 0; index < times; index++) {
                let items=Math.floor(Math.random()*10+5);
                let dateofPurchase = 1619333903714
                let userDetails ={
                    id:user._id,
                    name:user.name,
                    email:user.email,
                }
                let products=[];
                let amount=0;
                for (let index = 0; index < items; index++) {
                    let rindex=Math.floor(Math.random()*productList.length);
                    products.push({
                        name: productList[rindex].title,
                        id: productList[rindex]._id,
                        price: productList[rindex].price,
                        quantity: 1,
                        paymentId: "PAYID-MCCRF7Q5YV12107YB160402R",
                        dateofPurchase: dateofPurchase,
                        
                    })
                    amount+=productList[rindex].price;
                }
                let rdate=Math.floor(Math.random()*29+2)
                let DatePurchased=new Date(2021,3,rdate);
                payment={
                    user: [userDetails],
                    product: products,
                    createdAt: DatePurchased.toISOString(),
                    updatedAt: DatePurchased.toISOString(),
                    productPrice: amount,
                }
                Payments.push(payment);
                for (let index = 0; index < products.length; index++) {
                    await Product.findByIdAndUpdate(products[index].id,{ $inc:{ sold: 1}},(err,res)=>{
                        if(err)
                            console.log(err)
                    })
                }
            }

        })
        Payment.insertMany(Payments)
        .then(function(){
            console.log("PaymentData inserted")  
        }).catch(function(error){
            console.log(error)      
        });

    })
}


//Call Functions
UserData();
setTimeout(ProductData,5000);
setTimeout(ReferenceProductUser,15000);
setTimeout(PaymentData,30000);





