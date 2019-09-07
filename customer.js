const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '4418',
    database: 'store'
});

connection.connect();

function initialPrompt() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: "choices",
                message: "Select from the following options:",
                choices: ["display goods", "buy item"]
            }
        ])
        .then(input => {
            if (input.choices === 'display goods') {
                displayGoods();
            } else if (input.choices === 'buy item') {
                buyPrompt();
            }
        });

}

function buyPrompt() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'enter the id of the item you would like to buy',
            name: 'itemId',
        },
        {
            type: 'input',
            message: 'enter the quantity you would like to purchase',
            name: 'howMany'
        }
    ]).then( input => {
        console.log(input);
    })
}

function displayGoods() {
    connection.query('SELECT * FROM products', function (err, res, fields) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(
                `------------------------------------
ID: ${res[i].ID}
NAME: ${res[i].NAME}
PRICE: $ ${res[i].PRICE}.00
QUANTITY: ${res[i].QUANTITY}
DESCRIPTION: ${res[i].DESCRIPTION}`
            );
        }
        console.log("------------------------------------");
        initialPrompt();
    });
}


function changeQuantity(item, num) {
    connection.query("SELECT quantity FROM products WHERE ID = ?", item, function (err, res, fields) {
        if (err) throw err;
        console.log(res)
        if (res.quantity < num) {
            return console.log("There are not enough items for this purchase")
        } else {
            let newQuantity = parseInt(res.quantity) - num;
            console.log("New Quantity: " + newQuantity);
            //connection.query("")
        }
        initialPrompt();
    });
}

// Entry Point
displayGoods();