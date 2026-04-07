import { getCollection } from "../config/database.js"
import { calculateTotalls, createOrderDocument, generateOrderId, validateOrder } from "../utils/helper.js"

export const orderHandler=(io,socket)=>{
    console.log('a user connected',socket.id)
    // place order
    socket.on("placeOrder", async(data,callback)=>{
        try {
           console.log(`place order from ${socket.id}connected`) 
           const validation=validateOrder(data)
           if(!validation.valid){
            return callback({success:false,message:validation.message})
           }
           const totals=calculateTotalls(data.items);
           const orderId=generateOrderId()
           const order=createOrderDocument(data,orderId,totals);
           const orderCollection=getCollection('orders')
           await orderCollection.insertOne(order)
           socket.join(`order-${orderId}`);
           socket.join('customer')

           io.to('admins').emit('orderId')
           callback({success:true,order})
        } catch (error) {
            
        }
    })

    // order track
    socket.on('orderTrack',async(data,callback)=>{
        try {
            const orderCollection=getCollection('orders')
        const order=await orderCollection.findOne({orderId:data.orderId})
        if(!order){
           return callback({success:false,message:'order cannot found'})
        }

        socket.join(`order-${data.orderId}`);
        return callback({success:true,order})
        } catch (error) {
           console.error( 'order tracking error',error)
           callback({success:false,message:error.message})

        }
    })

    // cancelled ordre
    socket.on('cancelledOrder',async(data,callback)=>{
      try {
          const orderCollection=getCollection('orders');
        const order=await orderCollection.findOne({orderId:data.orderId});
        if(!order){
          return  callback({success:false,message:'order can not found'})
        }
        if(!['pending','confirmed'].includes(order.status)){
            return callback({success:false,message:' can not cancelled the order'})
        }

        await orderCollection.updateOne(
            {orderId:data.orderId},
            {$set:{status:'cancelled',updatedAt:new Date()}},
            {$push:{
                statusHistory:{
                     status:"cancelled",
                    timeStamp:new Date(),
                    by:socket.id,
                    note:data.reason || 'Cancelled by a customer' 
                }
            }}
        )
        io.to(`order-${data.orderId}`).emit('orderCancelled',{orderId:data.orderId});
        io.to('admins').emit('orderCancelled',{orderId:data.orderId,customerName:data.customerName})
        callback({success:true})
      } catch (error) {
           console.error( 'order cancelled error',error)
           callback({success:false,message:error.message})
      }
    })


    // get my orders
    socket.on('getMyorders',async(data,callback)=>{
        try {
           const orderCollecton=getCollection('orders') 
           const orders=await orderCollecton.find({
            customerPhone:data.customerPhone
           }).sort({createdAt:-1}).limit(10).toArray()
           callback({success:true,orders})
        } catch (error) {
            
        }
    })
}