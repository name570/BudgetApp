 var budgetController = (function (){
    var x = 23;

    var add = function(a){
        return x + a;
    }
    
    return {
        publicTest: function(b){
            return add(b);
        }
    } 
 })();

  var UIController = (function(){
      //TODO
  })();


  var controller = (function(budgetCtlr, UICtrl){

    var z = budgetCtlr.publicTest(5);

    return {
        anotherPublic: function(){
            console.log(z);
        }
    }

  })(budgetController,UIController);