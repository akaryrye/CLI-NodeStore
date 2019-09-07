const inquirer = require('inquirer');
const mysql = require('mysql');
require('events').EventEmitter.defaultMaxListeners = 25;

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
                choices: ["display goods", "buy item", "exit"]
            }
        ])
        .then(input => {
            if (input.choices === 'display goods') {
                displayGoods();
            } else if (input.choices === 'buy item') {
                buyPrompt();
            } else if (input.choices === 'exit') {
                connection.end();
                console.log("Have a nice day!")
                process.exit(0);
            }
        });

}

function buyPrompt() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the item\'s ID: ',
            name: 'itemId',
        },
        {
            type: 'input',
            message: 'Please enter how many you would like to buy: ',
            name: 'howMany'
        }
    ]).then(input => {
        changeQuantity(input.itemId, input.howMany);
    });
}

function displayGoods() {
    connection.query('SELECT * FROM products', function (err, res, fields) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(
                `------------------------------------
                ID: ${res[i].id}
                NAME: ${res[i].name}
                PRICE: $ ${res[i].price}.00
                QUANTITY: ${res[i].quantity}
                DESCRIPTION: ${res[i].description}`
            );
        }
        console.log("------------------------------------");
        initialPrompt();
    });
}

function changeQuantity(item, num) {
    connection.query("SELECT id, name, price, quantity FROM products WHERE ID = ?", item, function (err, res, fields) {
        if (err) throw err;
        console.log("\n==============\n")
        console.log(`Item Selected:\n   ID: ${res[0].id}\n   Name: ${res[0].name}\n   Price(ea): ${res[0].price}\n   Quantity Available: ${res[0].quantity}`);

        if (res[0].quantity < num) {
            console.log("\nInsufficient stock for this purchase");
            console.log("\n==============\n")
            initialPrompt();
        } else {
            let newQuantity = res[0].quantity - num;
            let purchasePrice = num * parseFloat(res[0].price);
            connection.query("UPDATE products SET quantity = ? WHERE ID = ?", [newQuantity, item], function (error, response, fields) {
                if (error) throw error;
                console.log(`\nYou have successfuly purchased ${num} ${res[0].name}'s for the price of $ ${purchasePrice}.00`);
                console.log("\n==============\n")
                initialPrompt();
            });
        }
    });
}

// Display the current stock when program opens
displayGoods();