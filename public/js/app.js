
$(function(){
    demand()
    
})
// start getting questions
function demand(){
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
                FixedQty:v.fixedQty,
                TotalQty:(v.fixedQty*v.totalpackage),
                totalpackageprofit:((v.SellingPrice - v.CostPrice)*(v.fixedQty*v.totalpackage))
            }
        })
        .sort((a,b) => b.onepackageprofit - a.onepackageprofit)
        .forEach((wholesalesvalue,wholesaleskeys) => {
            demanddata.forEach((demandsvalue,demandskeys) =>{
                if(wholesalesvalue.productname === demandsvalue.demandproductname){
                    if(sortdemandprofit[demandskeys][typeof(Productname)] === undefined ||sortdemandprofit[demandskeys].Productname !== wholesalesvalue.productname ){
                    let a = JSON.parse('{"Productname":'+ "\""+wholesalesvalue.productname+ "\""+',"profit":'+ wholesalesvalue.onepackageprofit+',"Shop":'+ "\""+wholesalesvalue.Shopname+"\"" + ',"demand":' + demandsvalue.demandvalue +'}')
                    sortdemandprofit.push(a)// console.log([...new Set(a)])
                }
                
                    console.log()
                    console.log()
                }

        })
        })
        // let prodname = sortdemandprofit.map((v) => v.Productname) 
        // let uniquecompanyname = new Set([...prodname])
        // uniquecompanyname.forEach((v) => {
        //     console.log(v)
        //             })


        // let prodname = sortdemandprofit.map((v,k) => {
        //     v.productname,k
        // })




        // let sorted = sortdemandprofit.reduce((unique,item) => {
        //     // console.log(item,unique,unique.includes(item),
        //     // unique.includes(item) ? unique : [...unique,item])
        //     return unique.includes(item) ? unique : [...unique,item]
        // })


        // let uniquecompanyname = new Set([...sortdemandprofit])
        // uniquecompanyname.forEach((v,k) => {
        //                 sortall.push(v.productname)
        //             })
 
        // let unsorted = new Set(sortdemandprofit);
        // let sorted = [...unsorted]
        // console.log(uniquecompanyname)
        console.log(wholesalesdata)
        console.log(sortdemandprofit)

    })
})

}
// v.productname === demanddata[demandkey].demandproductname ?
// console.log(v.productname + " = " + demanddata[k].demandvalue )
// : console.log("error")
