const validator=require('validator');

const validateRegister=(data)=>{
    const mandatoryField=['firstName','emailId','password'];
    const isAllowed=mandatoryField.every(k=>Object.keys(data).includes(k));

    if(!isAllowed){
        throw new Error("Field Missing");
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("Email is not valid");
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error("Weak password");
    }
};

const validateLogin=(data)=>{

    const mandatoryField=['emailId','password'];

    const isAllowed=mandatoryField.every(k=>Object.keys(data).includes(k));

    if(!isAllowed){
        throw new Error("Field Missing");
    }
};

module.exports={validateRegister,validateLogin};