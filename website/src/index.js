const express = require("express");
const nodemailer = require("nodemailer");
const supabase = require("./config");
const { error } = require("console");
const site = express();



const person = {
        name:"Abi",
        id:"1"
    }

site.use(express.static("design"));
site.use(express.urlencoded({ extended: false }));
site.set("view engine", "ejs");
site.use(express.json());
site.get("/",(req,res)=>{
    //outputSololItems();
    res.render('home', { person })
})

// Define Port for Application
const port = 5000;
site.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

// Setting up transporter 

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"absuls72@gmail.com",
        pass:"tngc vhzv vgsp ljxg"
    }
});

// function to send an email

async function sendEmail(emailAddress){
    try{
        const mail =await transporter.sendMail({
            from:"absuls72@gmail.com",
            to: emailAddress,
            subject:"Update on Item",
            text: "The item you wanted has been bought by someone"
        });
    }
    catch(error)
    {
        console.log(error);
    }
}

site.post("/login", async(req,res)=>{
    const username = req.body.name;
    const password = req.body.password;
     person.name = username
    const { data, error } = await supabase.from('users').select('*').eq('name', username).eq('password',password);
    if(error)
    {
        console.log("success")
        console.log("error");
    }
    if(data.length > 0)
    {
        person.id = data[0].id
        res.render('home', { person })
    }
    else
    {
        res.send("wrong Password")
    }
})

site.post("/addItem", async(req,res)=>{
    const item = req.body.AddItem[0];
    const solo = req.body.AddItem[1];
    let isSolo = false;
    if(solo === "on"){
        isSolo = true;
    }
    const { error } = await supabase.from('users-Items').insert({userid:person.id,itemName:item,Notify:false,Solo:isSolo});
    res.render('home', { person })
    
})

site.get("/Solo", async(req,res)=>{
    const data = await outputSololItems();
    res.json({message:data});
    
})

site.get("/Group", async(req,res)=>{
    const data = await outputGroupItems();
    res.json({message:data});
    
})

site.get("/ItemNotify", async(req,res)=>{
    const data = await getItemsToNotify();
    res.json({message:data});
    
})

site.post("/RemoveSolo", async(req,res)=>{
    const item = req.body.itemname;
    //const response = await supabase.from('users-Items').delete().eq('userid',person.id).eq('itemName',item);
    
})

site.post("/notify", async(req,res)=>{
    const item = req.body.notify;
    const {error} = await supabase.from("users-Items").update({Notify:true}).eq('userid',person.id).eq('itemName',item);;
    console.log(item)
    res.render('home', { person })
    
})

site.post("/RemoveGroup", async(req,res)=>{
    const item = req.body.itemname;
    //const response = await supabase.from('users-Items').delete().eq('itemName',item);
    const { data, error } = await supabase.rpc("getusertonotify", {item:item})
    if(data != null){
        let num = data.length;
        const date = getCurrentDate();
        for(let i =0; i <num; i++)
        { 
            EmailUser(data[i].user_id);
            //const { error } = await supabase.from('notify-user').insert({date:date,itemname:item,userid:data[i].user_id});
        }
    }
    
})

async function EmailUser(userid){
    const {data,error} = await supabase.from("users").select("email").eq("id",userid)
    if(data[0].email == null)
    {
        return;
    }
    await sendEmail(data[0].email);
}

function getCurrentDate(){
    const d = new Date();
    date = getDateFormat(d);
    return date;
}

function getPreviousDate(){
    const d = new Date();
    d.setUTCDate(d.getUTCDate()-7);
    date = getDateFormat(d)
    return date;
}

function getDateFormat(d){
    let date = "";
    date = date + d.getFullYear();
    if((d.getMonth()+1) < 10){
        date = date + "-0" + (d.getMonth()+1);
    }
    else{
        date = date + "-" + (d.getMonth()+1);
    }
    if (d.getDate() < 10){
        date = date + "-0" + d.getDate();
    }
    else{
        date = date +"-"+ d.getDate();
    }
    return date
}

async function outputSololItems(){
    const { data, error } = await supabase.rpc('getsoloitems',{parameter:person.id});
    return data;

}

async function outputGroupItems() {
    const {data,error} = await supabase.rpc('getmutualitems')
    return data;
}

async function getItemsToNotify(){
    const prevDate = getPreviousDate();
    const currentDate = getCurrentDate();
    const {data,error} = await supabase.rpc('getnotifyitems',{date1:prevDate,date2:currentDate,personid:person.id})
    return data;
}

