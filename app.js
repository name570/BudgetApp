  
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

    return {
         addItem: function(type, des, val){
            var newItem, ID;
            
            //New ID
            if (data.allItems[type].lenght > 0){
            ID = data.allItems[type][data.allItems[type].lenght - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create a new item based on type 
            if (type === 'exp')  {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            } 
            data.allItems[type].push(newItem);
            return newItem;
         },
         testing: function(){
            console.log(data);
        }
    };
    
 })();

// UI Controller
 var UIController = (function(){
     var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'

     };
      return {
          getInput: function(){

            return {
                type: document.querySelector(DOMStrings.inputType).value, // Either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };     
          },
          addListItem: function(obj, type){
            var html,newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc'){
                element =  DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix">\
                <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">\
                <i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>\
                <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>\
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                </div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);




          },
          clearFields: function(){
            var fields, fieldsArr; 
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fields.forEach(function(current, index, array){
                current.value = ""; 
            });
            fieldsArr[0].focus();
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
    
    var updateBudget = function(){

        // 1. Calculate budget

        // 2. Return budget

        // 3. Display budget 

    };

    var ctrlAddItem = function() {
        // TO DO LIST
        var input;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
        // 2. Add the item to the budget controller
        newItem = budgetCtlr.addItem(input.type, input.description, input.value);

        // 3.  Add new item to UI
        UIController.addListItem(newItem, input.type);

        // 4. Clear fields
        UIController.clearFields();
        // 5. Calculate and update budget
        updateBudget();
        }
    }
    return {
        init: function(){
            console.log('Application has started');
            setupEventListners();
        }
    }
})(budgetController,UIController);

controller.init();