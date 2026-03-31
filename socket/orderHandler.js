import { validateOrder } from "../utils/helper"

export const orderHandler=(io,socket)=>{
    console.log('a user connected',socket.id)
    // place order
    socket.on("placeOrder", async(Data,callback)=>{
        try {
           console.log(`place order from ${socket.id}connected`) 
           const validation=validateOrder(Data)
           if(!validation.valid){
            return callback({success:false,message:validation.message})
           }
        } catch (error) {
            
        }
    })
}