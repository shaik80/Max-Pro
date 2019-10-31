
$(function(){
    prefershop()
    
})
// start getting questions
function prefershop(){
    $.getJSON('http://localhost:3000/demands',function(json){
        demands = json;
        let sortdemandprofit = []
        let sortall = []
        let len = Object.keys(demands).length;
        demands.forEach((v,k,arr) => {
            // console.log(v.ProductName,v.demand)
           $('#productname').append("<option>"+v.ProductName+"</option>")
        });
        const demanddata = demands.map((v,k) =>{
            return {
                demandproductname:v.ProductName,
                demandvalue:v.demand
            }
        })

    $.getJSON('http://localhost:3000/wholesales',function(json){
        wholesales = json;
        let len = Object.keys(wholesales).length;
        let wholesalesdata = wholesales.map((v,k) =>{
            return {
                id:v._id, 
                productname:v.ProductName, 
                Shopname:v.ShopName,
                onepackageprofit:(v.SellingPrice - v.CostPrice),
                CostPrice:v.CostPrice,
                FixedQty:v.fixedQty,
                Totalpackage: v.totalpackage,
            }
        })
        .sort((a,b) => b.onepackageprofit - a.onepackageprofit)
        .forEach((wholesalesvalue,wholesaleskeys) => {
            demanddata.forEach((demandsvalue,demandskeys) =>{
                if(wholesalesvalue.productname === demandsvalue.demandproductname){
                    if(sortdemandprofit[demandskeys] === undefined ||sortdemandprofit[demandskeys].Productname !== wholesalesvalue.productname && sortdemandprofit[demandskeys].profit > wholesalesvalue.productname )
                    {
                        let a = JSON.parse(
                                           '{"Productname":'+ "\""+wholesalesvalue.productname+ "\""+
                                           ',"id":'+ "\""+wholesalesvalue.id+"\""+
                                           ',"Onepackageprofit":'+ wholesalesvalue.onepackageprofit+
                                           ',"Shop":'+ "\""+wholesalesvalue.Shopname+"\"" +
                                           ',"Costprice":' + wholesalesvalue.CostPrice +
                                           ',"FixedQty":' + wholesalesvalue.FixedQty +
                                           ',"Totalpackages":' + wholesalesvalue.Totalpackage +
                                           ',"Demand":' + demandsvalue.demandvalue +
                                           '}')
                        sortdemandprofit.push(a)// console.log([...new Set(a)])
                    }
                    else{
                        console.log("error")
                    }
                }
        })
        })
        console.log(wholesalesdata)
        let price = 100000
        // console.log(sortdemandprofit)
        sortdemandprofit.forEach((v,k) =>{
            if(price == v.Productname){
                console.log(v,k)
            }
        })
    })
})
}
