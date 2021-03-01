export default function(user = {}, action) {
     if(action.type === 'ADD_USER') {
        var newInfo = action.payload
        return newInfo;
      } else {
          return user
      }
   }