 
 // BUDGET CONTROLLER
 var budgetController = (function (){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp: 0,
            inc: 0
        }

    };
    
 })();

// UI Controller
 var UIController = (function(){
     var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'

     };
      return {
          getInput: function(){

            return {
                type: document.querySelector(DOMStrings.inputType).value, // Either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value 
            };     
          },
          getDOMStrings: function(){
              return DOMStrings; 
          }
      };
  })();


  //GLOBAL APP CONTROLLER
  var controller = (function(budgetCtlr, UICtrl){
    
    var setupEventListners = function(){
        var DOM =  UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
        
            if  (event.keyCode === 13  || event.which === 13){
                ctrlAddItem(); 
            }
        });
    }; 
    
    var ctrlAddItem = function() {
        // TO DO LIST
        // 1. Get the field input data
        var input = UICtrl.getInput();
        // 2. Add the item to the budget controller
        // 3.  Add new item to UI
        // 4. Calculate the budget
        // 5. Display the budget on the UIm 

    }
    return {
        init: function(){
            console.log('Application has started');
            setupEventListners();
        }
    }
})(budgetController,UIController);

controller.init();