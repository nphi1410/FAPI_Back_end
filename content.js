const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware
const { extractSchedule } = require('./extractData');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/schedule2', (req, res) => {
    try {
        res.send('Chao em');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send error as JSON response
    }
    
});

app.post("/schedule", async (req, res) => {
    const cookie = req.headers.fapcookie;

    try {
        const response = await axios.get('https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx', {
            headers: {
                cookie
            }
        });

        console.log(cookie);
        const data = await extractSchedule(response.data);
        res.send(data); 
        console.log("data: ", scheduleData);// Send data as JSON response
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred' }); // Send error as JSON response
    }
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
