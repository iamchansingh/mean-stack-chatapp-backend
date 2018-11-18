const joi=require('joi');
module.exports={
    CreateUser(req,res){
        const schema=joi.object().keys({
            username:joi.string().min(5).max(10).required(),
            email:joi.string().email().required(),
            password:joi.string().min(5).required()
        })

        const {error,value}=joi.validate(req.body,schema);
        if(error &&error.details){
            return res.status(500).json({message:error.details});

        }        
    }
} 
