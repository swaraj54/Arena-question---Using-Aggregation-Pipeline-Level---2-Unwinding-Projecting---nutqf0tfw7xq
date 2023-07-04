const fs = require("fs");
const Product = require('./models/Product');

const products_list = JSON.parse(fs.readFileSync(`${__dirname}/./data/products.json`));

async function seedWithDummyData() {
    try {
        // CLEAR DB
        await Product.deleteMany({});

        const createdProducts = await Product.insertMany(products_list);

        console.log(`${createdProducts.length} products created.`);
    } catch (error) {
        console.error(`Error seeding data: ${error}`);
        process.exit(1);
    }
}

module.exports = seedWithDummyData