

const authenticateUser = (req, res, next) => {
    
    
    const userId = req.headers['user-id'];
  
  
    req.user = { _id: userId }; 
  
    next(); 
  };
  
  module.exports = authenticateUser;
  