const express=require("express")
const loginData=require("../Controllers/login");
const mySqlPool = require("../config/db");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const router=express.Router();

router.post("/login",async(req,res)=>{
    // const data=req.body;
    // alert("hello")
    console.log(req.body)
    try{
        const dataquery=await mySqlPool.query(`SELECT * FROM employee_info WHERE Email=? LIMIT 1`,[req.body.email]);
        // console.log(dataquery);
        if(!dataquery)
        {
            return res.send({
                sucess:false,
                message:"Something Went Wrong",
                

            })
        }
        // console.log()
        if(dataquery[0][0].Password===req.body.password)
        {
            const token= jwt.sign({Name:dataquery[0][0].Name, Email:dataquery[0][0].Email},process.env.SECRET_KEY);
            // obj.token=token;
            return res.status(200).send({
                sucess:true,
                message:"Login SucessFul",
                data:{Name:dataquery[0][0].Name,Email:dataquery[0][0].Email,Password:dataquery[0][0].Password,token:token}
            })
        }
        return res.status(400).send({
            sucess:false,
            message:"Something Went Wrong",

        })
      


        

    }
    catch(e)
    {
        console.log("There is Error in login"+e);
        res.status(500).send({
            sucess:false,
            message:"Something Went Wrong",
            err:e
        })
    }
  

})
router.post("/signup",async(req,res)=>{
    console.log("sign up is hited")
const urlData=req.body;
console.log(urlData);
const obj={
    Name:urlData.name,
    Email:urlData.email,
    Password:urlData.password,
    token:""
}
try{
    const data=await mySqlPool.query(`INSERT INTO employee_info (Name,Email,Password) VALUES (?,?,?)`,[obj.Name, obj.Email, obj.Password]);
    console.log(data);
    if(!data)
    {
      return   res.status(404).send({
            sucess:false,
            message:"Something Went Wrong",
            err:e


        })
    }

    const token= jwt.sign({Name:urlData.name, Email:urlData.Email},process.env.SECRET_KEY);
    obj.token=token;
    console.log("This is Token")
    console.log(token);
    // res.cookie('jwt', token, { httpOnly: true });
    const sql = 'SELECT * FROM employee_info WHERE Email = ? LIMIT 1';

    return res.status(200).send({
        sucess:true,
        message:"You Are Sign In",
        data:obj
    })

}
catch(e)
{
    console.log("There is an error in Sign up "+e);
    res.status(500).send({
        sucess:false,
            message:"Something Went Wrong",
            err:e

    })
}


})


router.post("/organizationU/:id",async(req,res)=>{
    console.log("This is Eail"+req.body.NameData)
    console.log(req.params.id);
    console.log(process.env.SECRET_KEY);



    const Token=jwt.sign({EmailOrganiser:req.params.id,EmailAuthor:req.body.name,role:"Organization"},process.env.SECRET_KEY);
    console.log("THe Gerenerated Web Token");
    console.log(Token);
    const link=`http://localhost:3000/authLogin/${Token}`;





    try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "parasnaulia88@gmail.com",
            pass: "yyxz zpqm xqcl pzeo",
          },
        });
    
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: {
            name:req.params.id ,
            address: req.body.EmailData,
          },
          to:`${req.body.EmailData}` , // List of receivers
          subject: "Create Account Here ✔", // Subject line
          text: link, // Plain text body
          html: ` Password Reset Link ${link}`, // HTML body
        });
    
        console.log("Mail sent:", info.response);
       return  res.status(200).send({ message: "Mail sent successfully" });
      } catch (error) {
        console.error("Error sending mail:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    

    





    




   
   
})


router.post("/auth",async(req,res)=>{

    console.log(req.body)

    const tokenData=jwt.verify(req.body.token,process.env.SECRET_KEY);
    console.log(tokenData);

  

  return res.status(200).send({
        message:"Auth SucessFully",
        data:tokenData
    })


    

    console.log("Api is Hitted");
     return res.status(200).send({message:"Done"});
})
module.exports=router;










// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiTXVrZXNoIiwiRW1haWwiOiJwYXJhc0BnbWFpbC5jb20iLCJpYXQiOjE3MjM1NTg3NDh9.fZhX5od_5yxrEZGfdSX1o_dA6C7t7b2AVByTQuyRd2w