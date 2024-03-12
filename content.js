const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware
const { extractSchedule } = require('./extractData');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.get("/Report/ScheduleOfWeek.aspx", async (req, res) => {
    const cookie = req.headers.fapcookie;
    console.log(req.headers);

    try {
        if (!cookie) {
            throw new Error('Cookie is missing in the request headers');
        }

        const response = await axios.get('https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx', {
            headers: {
                cookie
            }
        });

        // Logging the cookie might pose a security risk, consider removing it in production
        // console.log("Received cookie:", cookie);

        const data = await extractSchedule(response.data);

        // Sending extracted data as JSON response
        res.json(data);

        // Logging the data for debugging purposes
        console.log("Extracted schedule data:", data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message }); // Sending error as JSON response
    }
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
