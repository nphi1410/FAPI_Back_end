const cheerio = require('cheerio');

async function extractSchedule(html) {
    // console.log("data: ",html);
    const $ = cheerio.load(html);
    const tdElements = $('td');
    let isWriting = false; // Flag to track whether to write into the array
    let count = 0;
    let slot; // Counter for '-'

    // Initialize an array to store JSON objects
    const schedule = [];

    // Loop through each 'td' element
    tdElements.each(function(index, tdElement) {
        // Extracting values from tdElement
        const aElements = $(tdElement).find('a');
        let otherValue = $(tdElement).text().trim();

        // Create an array to store the text content of 'a' elements
        const aTextContentArray = [];
        const savelinks = [];

        // Loop through each 'a' element and store its text content
        aElements.each(function(index, aElement) {
            const text = $(aElement).text().trim();
            const href = $(aElement).attr('href');

            if (href) {
                savelinks.push({ href, text });
                aTextContentArray.push(text);
            }
        });

        // Remove the text content of 'a' elements from 'td' element
        aTextContentArray.forEach(function(text) {
            otherValue = otherValue.replace(text, '').trim();
        });

        // Extract the desired remaining text (modify this as needed)
        const remainingValue = otherValue; // For now, we just keep the remaining text

        if (otherValue === 'Slot 0') {
            isWriting = true;
            slot = 0;
        }

        if (slot > 12) {
            isWriting = false;
        }

        if (isWriting) {
            const singleSlot = {
                slot,
                links: savelinks,
                remaining: remainingValue
            };
            schedule.push(singleSlot);
        }

        if (isWriting) {
            count++;
            if (count === 8) {
                count = 0;
                slot++;
            }
        }
    });

    return schedule;
}

module.exports = {
    extractSchedule
};