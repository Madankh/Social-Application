exports.generateOTP = ()=>{
          let OTP = '';
          for (let i = 0; i <= 3; i++) {
                    let ranVal = Math.round(Math.random()*9);
                    OTP = OTP+ranVal;
          }
          return OTP;
}