  
 // BUDGET CONTROLLER
 var budgetController = (function (){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.precentage = -1;
    };

    Expense.prototype.calcPrecentage = function(totalIncome){
        if (totalIncome > 0){
            this.precentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.precentage = -1;
        }
    
    };

    Expense.prototype.getPrecentage = function(){
        return this.precentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calcualteTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;

    };
    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        precentage: -1
    };

    return {
         addItem: function(type, des, val){
            var newItem, ID;
            
            //New ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
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
         calculateBudget: function(){
             //calculate total incomes and expenses
            calcualteTotal('exp');
            calcualteTotal('inc');

             //calculate the budget: incomes - expenses
            data.budget = data.totals.inc - data.totals.exp;
             //calcualte the precentage of income that we spent
            if (data.totals.inc > 0){
                data.precentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else{
                data.precentage = -1;
            }
         },

         calculatePrecentages: function(){
             data.allItems.exp.forEach(function(curr){
                curr.calcPrecentage(data.totals.inc);
             });
       },

       getPrecentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPrecentage();
            });
            return allPerc;
       },

         deleteItem: function(type, id){
            var ids, index;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id); 

            if (index !== -1){
                data.allItems[type].splice(index,1);
            }
         },

         getBudget: function(){
             return {
                 budget: data.budget,
                 totalIncome: data.totals.inc,
                 totalExpenses: data.totals.exp,
                 precentage: data.precentage 
             }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        precentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
     };
     var formatNumber = function(number, type){
        var numSplit, int, dec, acc;
        number = Math.abs(number);
        number = number.toFixed(2);

        numSplit = number.split('.');
        int = numSplit[0];
        acc = int.substr(0,int.length % 3);
        for(i = int.length % 3; i <= int.length; i += 3){
            var currItem = int.substr(i,3);
            if (acc === ""){
                acc += currItem;
            } else if (currItem !== ""){
                acc += ',' + int.substr(i, 3);
            }
        }
        int = acc; 
        // if (int.length > 3){
        //     int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
        // }
        dec = numSplit[1];


        return (type === 'exp' ?'-' : '+') + ' ' + int + '.' + dec;

    };
    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">\
                <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">\
                <i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>\
                <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>\
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                </div></div></div>';
            } 

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

          },

          deleteListItem: function(selectorID){
            var element;
            element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
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
          displayBudget: function(obj){
            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp'
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome,'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpenses, 'exp');

            if (obj.precentage > 0){
            document.querySelector(DOMStrings.precentageLabel).textContent = obj.precentage + '%' ;
            } else{
                document.querySelector(DOMStrings.precentageLabel).textContent = '---'
            }
            }, 
            displayPrecentages: function(percentages){
                var fields;
                fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
                nodeListForEach(fields, function(current, index){
                    if (percentages[index] > 0){
                        current.textContent = percentages[index] + '%';
                    } else {
                        current.textContent = '---';
                    }
                });

            },
            
            displayMonth: function(){
                var now, year, month;
                now = new Date();
                //christmas = new Date(2019, 11, 25);
                months = ['January', 'February', 'March', 'April', 'May', 
                'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                
                month = now.getMonth();
                year = now.getFullYear();

                document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;


            },
            changedType: function(){
                var fields  = document.querySelectorAll(
                    DOMStrings.inputType + ',' + 
                    DOMStrings.inputDescription + ',' +
                    DOMStrings.inputValue
                );
                nodeListForEach(fields, function(cur){
                    cur.classList.toggle('red-focus');
                });
                
                document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }; 
    
    var updateBudget = function(){

        // 1. Calculate budget
        budgetCtlr.calculateBudget();
        // 2. Return budget
        var budget = budgetCtlr.getBudget(); 
        // 3. Display budget 
        UIController.displayBudget(budget);

    };

    var updatePrecentages = function(){
        var  percentages;
        //1. Calculate precentages
        budgetCtlr.calculatePrecentages();
        //2. Read them from budget controller
        percentages = budgetCtlr.getPrecentages();
        //3. Update the UI with new precentages
        UICtrl.displayPrecentages(percentages);

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

        //6. Update precentages
        updatePrecentages();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID){
            splitID = itemID.split('-')
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtlr.deleteItem(type,ID); 
            // 2. delete the item from UI 
            UICtrl.deleteListItem(itemID);
            // 3. update and show the new budget 
            updateBudget();
            //4. Update precentages
            updatePrecentages();

        }
    };
    return {
        init: function(){
            console.log('Application has started');
            UICtrl.displayMonth();
            UIController.displayBudget( {
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                precentage: -1 
            });
            setupEventListners();
            
        }
    }
})(budgetController,UIController);

controller.init();