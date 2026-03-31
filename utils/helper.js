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