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
                choices: ["display goods", "buy item", "add item", "update item quantity", "exit"]
            }
        ])
        .then(input => {
            if (input.choices === 'display goods') {
                displayGoods();
            } else if (input.choices === 'buy item') {
                buyPrompt();
            } else if (input.choices === 'add item') {
                addItemPrompt();
            } else if (input.choices === 'update item quantity') {
                updatePrompt();
            } else if (input.choices === 'exit') {
                connection.end();
                console.log("Have a nice day!");
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
        buyItem(input.itemId, input.howMany);
    });
}

function addItemPrompt() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Name: ',
            name: 'itemName',
        },
        {
            type: 'input',
            message: 'Price: ',
            name: 'itemPrice'
        },
        {
            type: 'input',
            message: 'Quantity: ',
            name: 'itemQuantity'
        },
        {
            type: 'input',
            message: 'Enter a description: ',
            name: 'itemDescription'
        }
    ]).then(input => {
        addItem(input.itemName, input.itemPrice, input.itemQuantity, input.itemDescription);
    });
}

function updatePrompt() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the ID of the item you want to update: ',
            name: 'itemId',
        },
        {
            type: 'input',
            message: 'Please enter the number of items to add to inventory: ',
            name: 'howMany'
        }
    ]).then(input => {
        updateQuantity(input.howMany, input.itemId);
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

function buyItem(item, num) {
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

function addItem(name, price, quantity, description) {
    connection.query('INSERT INTO products SET name = ?, price = ?, quantity = ?, description = ?', [name, price, quantity, description], function (error, response, fields) {
        if (error) throw error;
        console.log('item successfully added');
        initialPrompt();
    });
}

function updateQuantity(num, id) {
    connection.query('SELECT quantity FROM products WHERE id = ?', id, function (error, response, fields) {
        if (error) throw error;
        let oldQuantity = parseInt(response[0].quantity);
        let newQuantity = oldQuantity + parseInt(num);
        connection.query('UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, id], function (error, response, fields) {
            if (error) throw error;
            console.log(`\n-------------\nQuantity successfully updated from ${oldQuantity} to ${newQuantity}\n-------------\n`);
            initialPrompt();
        });
    });
}

// Display the current stock when program opens
displayGoods();