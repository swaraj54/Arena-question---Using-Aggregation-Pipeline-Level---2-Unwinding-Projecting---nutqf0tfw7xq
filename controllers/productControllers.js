/* Product Controllers */

const Product = require('../models/Product');

const searchProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, sort, minPrice, maxPrice } = req.query;
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (category) {
            query.category = category;
        }
        if (minPrice && maxPrice) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) {
            query.price = { $gte: minPrice };
        } else if (maxPrice) {
            query.price = { $lte: maxPrice };
        }
        const sortOrder = sort === "asc" ? "price" : "-price";
        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sortOrder);
        const count = await Product.countDocuments(query);
        res.status(200).json({
            status: "success",
            data: {
                count,
                products,
            },
        });
    } catch (err) {
        res.status(404).json({
            message: "Products Not Found",
            status: "Error",
            error: err,
        });
    }
};


/*
Implement an aggregation pipeline to retrieve the projected data of products.
Instructions:
The function should use the aggregate pipeline with a $project stage to project only the necessary fields from the Product collection and perform some transformations to rename and calculate new fields.
The aggregated data should be returned in a JSON response with a status code of 200 and the following format:
{
"status": "success",
    "data": {
        "numberOfDocuments": <number of documents in the result>,
        "data": <array of projected product objects>
    }
}

Sample Projected Product Object:
{
  "name": "Product 1",
  "tags": ["tag1", "tag2", "tag3"],
  "noOfSales": 10,
  "averageRating": 4.5
}

If an error occurs during the aggregation, the function should return a JSON response with a status code of 400 and the following format:
{
"message": "Could Not Fetch Products",
"status": "Error",
"error": <the error object>
}
*/
// Aggregation Pipeline : Projection Stage
const getProjectedData = async (req, res) => {
    try {
        const agg = [{
            $project: {
                _id: 0,  // Exclude the _id from the projection
                name: 1,
                tags: 1,
                noOfSales: '$metrics.totalQuantitySold',
                averageRating: '$metrics.avgRating'
            }
        }]
        const aggregatedData = await Product.aggregate(agg);
        const count = aggregatedData.length;
        res.status(200).json({
            status: "success",
            data: {
                numberOfDocuments: count,
                data: aggregatedData
            },
        });
        // req.send("True")
    } catch (err) {
        res.status(400).json({
            message: "Could Not Fetch Products",
            status: "Error",
            error: err,
        });
    }
};


/*
Implement an aggregation pipeline to get the number of times each tag occurs, and also find the number of distinct tags.
Instructions:
The function should use the aggregate pipeline with multiple stages to group the products by tags, count the number of products in each group, and sort the result by the count in descending(-1) order.
The aggregated data should be returned in a JSON response with a status code of 200 and the following format:
{
    "status": "success",
    "data": {
        "totalDistinctTags": <number of distinct tags in the result>,
        "data": <array of tag count objects>
    }
}

Sample tag count object:
{
  "_id": "tag1",
  "count": 5
}

If an error occurs during the aggregation, the function should return a JSON response with a status code of 400 and the following format:
{
    "message": "Could Not Fetch Products",
    "status": "Error",
    "error": <the error object>
}
*/
const getTagCount = async (req, res) => {
    try {
        const agg = [
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]
        const aggregatedData = await Product.aggregate(agg);
        const count = aggregatedData.length;
        res.status(200).json({
            status: "success",
            data: {
                totalDistinctTags: count,
                data: aggregatedData
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "Could Not Fetch Products",
            status: "Error",
            error: err,
        });
    }
};


module.exports = { searchProducts, getProjectedData, getTagCount };
