let BudgetConroler = (function () {
    //this function creat a new object for the new inc or exp
    let INCOME = function (id, disc, val) {

        this.id = id;
        this.disc = disc;
        this.val = val;

    }
    let EXPENCE = function (id, disc, val) {
        this.id = id;
        this.disc = disc;
        this.val = val;
    }
    //this object store the data from the UI 
    let data = {
        AllItems: {
            inc: [],
            exp: [],
        },
        totale: {
            inc: 0,
            exp: 0,
        },
        Budget: 0,
    }
    window.addEventListener("beforeunload", () => localStorage.setItem('DATA', JSON.stringify(data)))
    window.addEventListener("load", () => data = JSON.parse(localStorage.getItem('DATA')))
    //this function calcul sun of ths inc and exp
    let totals = function (type) {
        let sum = 0;
        data.AllItems[type].forEach(element => {
            sum += element.val;
        });
        data.totale[type] = sum;
    };
    return {
        // this function do Two thing:
        // 1-give us a new ID for the new inc or exp that coming from UI
        // 2- decide where this data will gona store and push it into it
        AddItems: function (type, des, valu) {
            if (data.AllItems[type].length > 0) {
                ID = data.AllItems[type][data.AllItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === "inc") {
                newItem = new INCOME(ID, des, valu);
            } else if (type === "exp") {
                newItem = new EXPENCE(ID, des, valu);

            }
            data.AllItems[type].push(newItem);
            return newItem;
        },
        //this function return the sun of inc and exp and the Global Budget 
        calcul: function () {
            totals("inc");
            totals("exp");
            data.Budget = data.totale.inc - data.totale.exp;


        },
        //this function return the sun of inc and exp and the Global Budget 
        getbudget: function () {
            return {
                inc: data.totale.inc,
                exp: data.totale.exp,
                Global: data.Budget,
            }
        },


        // detelete from Budge
        deleteBudget: function (type, id) {
            let idarry = data.AllItems[type].map(function (element) {
                // console.log(element.id)
                return element.id;
            })
            let index = idarry.indexOf(id);
            if (index !== -1) {
                data.AllItems[type].splice(index, 1);
            }


        },

        data,
    }


})();

let UiControler = (function () {
    return {
        // this functio return the inputs value from tha UI
        getInput: function () {
            return {
                type: document.getElementById("type").value,
                discription: document.getElementById("discription").value,
                value: parseFloat(document.getElementById("value").value),
            }
        },
        // this function add items in the UI with the new value
        addlistitem: function (obj, type) {
            let HTML, newHTML, element;
            if (type === "inc") {
                element = document.getElementById("incomes");
                HTML = '<div class="inc_info" id="inc_%id%"><div ><p>%description%</p></div><div class="inc_val"><div><p class="inc_color"><span>+ %value%</span>DH</p></div><div> <img class="delet_btn" src="Delet_btn.svg" alt=""></div></div></div>'
            } else if (type === "exp") {
                element = document.getElementById("expences");
                HTML = ' <div class="exp_info" id="exp_%id%"><div><p>%description%</p></div><div class="inc_val"><div><p class="exp_color"><span>- %value%</span>DH</p></div><div> <img class="delet_btn" src="Delet_btn.svg" alt=""></div></div></div>'
            }
            newHTML = HTML.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.disc);
            newHTML = newHTML.replace('%value%', obj.val);
            element.insertAdjacentHTML("beforeend", newHTML);
        },
        addlistitem2: function(type , para){
            element = document.getElementById(type);
            HTML = para
            newHTML = HTML.replace('%id%', i.id);
            newHTML = newHTML.replace('%description%', i.disc);
            newHTML = newHTML.replace('%value%', i.val);
            element.insertAdjacentHTML("beforeend", newHTML);
        },

        //this function Clear the inputs
        ClearInput: function () {
            document.getElementById("discription").value = '';
            document.getElementById("value").value = '';
        },
        // this function add the value into Global inc or Global exp 
        BudgetUi: function (obj, type) {
            if (type == "inc") {
                document.getElementById("inc_bud").innerHTML = obj.inc;
                document.getElementById("Global").innerHTML = obj.Global;
            } else if (type == "exp") {
                document.getElementById("inc_exp").innerHTML = obj.exp;
                document.getElementById("Global").innerHTML = obj.Global;
            }

        },
        target_delete: function (type, target_Items) {
            if (type === "inc" || type === "exp") {
                element = document.getElementById(target_Items);
                element.parentNode.removeChild(element);
            };
        },

        Delet_items: function () {
            let targetItemss = event.target.parentNode.parentNode.parentNode.id;
            let targetArrys = targetItemss.split("_");
            let types = targetArrys[0];
            let IDs = targetArrys[1];
            return {
                targetItems: targetItemss,
                targetArry: targetArrys,
                type: types,
                ID: parseInt(IDs),

            };
        },
    }

})();

let controler = (function (BudContro, UiContro) {
    // when the user click the "Enter btn" all this fuonction run 
    document.addEventListener("keypress", function (e) {
        if (e.keyCode === 13 || e.which === 13) {
            //get the value and type of opiration (inc or exp ) and discription 
            let input = UiContro.getInput();
            if (!input.value == "" && !input.discription !== "") {
                //add items into the budegt COntrolet (new object)
                let newI = BudContro.AddItems(input.type, input.discription, input.value)
                // call the funtion for add items in the UI
                UiContro.addlistitem(newI, input.type);
                // call function for clear inputs
                UiContro.ClearInput();
                // call function to push the value into budget controler
                BudContro.calcul(input.type);
                // call the sum of all 
                let ConBud = BudContro.getbudget();
                // call function to show the resulte in UI
                UiContro.BudgetUi(ConBud, input.type);
            }
        }
    });
    // get the local storage and set it into the UI
    window.addEventListener("load", function () {
        let data = JSON.parse(localStorage.getItem('DATA'));
        let totIncome = data.totale.inc;
        document.getElementById("inc_bud").innerHTML = totIncome;
        let totexp = data.totale.exp;
        document.getElementById("inc_exp").innerHTML = totexp;
        let glob = totIncome - totexp;
        document.getElementById("Global").innerHTML = glob;
        for (i of data.AllItems.inc) {
            let HTML = '<div class="inc_info" id="inc_%id%"><div ><p>%description%</p></div><div class="inc_val"><div><p class="inc_color"><span>+ %value%</span>DH</p></div><div> <img class="delet_btn" src="Delet_btn.svg" alt=""></div></div></div>'
            UiContro.addlistitem2("incomes",HTML )
        }
        for (i of data.AllItems.exp) {
            let HTML = ' <div class="exp_info" id="exp_%id%"><div><p>%description%</p></div><div class="inc_val"><div><p class="exp_color"><span>- %value%</span>DH</p></div><div> <img class="delet_btn" src="Delet_btn.svg" alt=""></div></div></div>';
            UiContro.addlistitem2("expences", HTML)
        }

    });
    document.getElementById("contianer").addEventListener("click", function (event) {
        //get information about the delete items
        let targo = UiContro.Delet_items();
        //call the items frpm the ui
        UiContro.target_delete(targo.type, targo.targetItems);
        //call the function for delete it from the data structurs
        BudContro.deleteBudget(targo.type, targo.ID);
        //camcul the budget
        BudContro.calcul(targo.type);
        //get the new budget 
        let badge = BudContro.getbudget();
        //update into UI
        UiContro.BudgetUi(badge, targo.type);
        // BudContro.testing();
    })

})(BudgetConroler, UiControler);