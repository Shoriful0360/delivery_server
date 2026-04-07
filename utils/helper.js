export function validateOrder(data){
if(!data.customerName?.trim()){
    return{
        valid:false,message:"Customer name is required"
    }
}
if(!data.customerPhone.trim()){
    return{
        valid:false,message:"Customer Phone number is required"
    }
}
if(!data.customerAddress.trim()){
    return{
        valid:false,message:"Customer Address  is required"
    }
}
if(!Array.isArray(data.items)){
    return{
        valid:false,message:"order must have a one item"
    }
}
return {valid:true}
}

// order id generator ->format:ORD-20260127-001
export function generateOrderId(){
    const now=new Date();
    const year=now.getFullYear();
    const month=String(now.getMonth()+1).padStart(2,"0");
    const day=String(now.getDay()).padStart(2,'0');
    const randomeNumber=Math.floor(Math.random()*1000).toString().padStart(3,"0")
    return(`ORD-${year}${month}${day}-${randomeNumber}`)
}

export function calculateTotalls(items){
    const subTotal=items.reduce((sum,item)=>sum+(item.price * item.quantity),0)
    const tax=subTotal *0.10;
    const deliveryFee=35.00;
    const total=subTotal + tax+ deliveryFee
    return{
        subTotal:Math.round(subTotal*100)/100,
        tax:Math.round(tax*100)/100,
        deliveryFee,
        totalAmount:Math.round(total*100)/100
    }
}

export function createOrderDocument(orderData,orderId,totals){
   
    customerName:orderData.customerName.trim();
    customerAddress:orderData.customerAddress.trim();
    items:orderData.items;
    subtotal:totals.subTotal;
    tax:totals.tax;
    deliveryFee:totals.deliveryFee;
    totalAmount:totals.totalAmount;
    specialNote:orderData.specialNote || "";
    paymentMethod: orderData.paymentMethod || 'cash';
    status:"pending";
    statusHistory:[{
        status:"pending",
        timeStamp:new Date(),
        by:'customer',
        note:"order Placed"
    }]
    estimatedTime:null;
    createdAd: new Date();
    updatedAt:new Date();

}

// is valid transaction check
export function isValidTransition(currentStatus,newStatus){
    const validTransition={
        'pending':['confirm','cancelled'],
        'confirm':['preparing','cancelled'],
        'preparing':['ready','cancelled'],
        'ready':['out_for_delivery','cancelled'],
        'out_for_delivery':['delivered'],
        'delivered':[],
        'cancelled':[]
    }

   return validTransition[currentStatus]?.includes(newStatus) || false

}