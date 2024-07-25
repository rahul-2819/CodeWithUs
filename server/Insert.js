const axios = require('axios');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://rahul:rahul123@demo.sieh6ij.mongodb.net/?retryWrites=true&w=majority&appName=Demo";

// Function to fetch question data from the API
async function fetchFromAPI() {
    try {
        // Make a GET request to the API endpoint
        const response = await axios.get("https://alfa-leetcode-api.onrender.com/select?titleSlug=house-robber");
        
        // Return the data from the response
        return response.data;
    } catch (error) {
        // If there's an error fetching data from the API, log it and throw the error
        console.error("Error fetching from API", error);
        throw error;
    }
}

// Function to insert data into the MongoDB database
async function insertData(data) {
    // Create a new MongoClient instance with the provided connection URI
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB database
        await client.connect();
        console.log('Connected to DB');

        // Access the "noob" database
        const database = client.db('noob');
        
        // Access the "ques" collection within the database
        const collection = database.collection('ques');
        const customId = "House Robber"; // Replace with your desired ID
        
        // Add your custom _id to the data object
        data._id = customId;
        // Insert the fetched data into the collection
        await collection.insertOne(data);
        console.log('Data stored');
    } catch (error) {
        // If there's an error inserting data into the database, log it and throw the error
        console.log('Error', error);
        throw error;
    } finally {
        // Close the database connection
        await client.close();
        console.log("Disconnected");
    }
}

// Function to fetch data from the API and insert it into the database
async function fetchAndInsertData() {
    try {
        // Fetch question data from the API
        const data = await fetchFromAPI();
        
        // Insert the fetched data into the database
        await insertData(data);
    } catch (error) {
        // If there's an error fetching and inserting data, log it
        console.error('Error fetching and inserting data:', error);
    }
}

// Call the fetchAndInsertData function to start the process
fetchAndInsertData();
