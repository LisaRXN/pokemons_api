const connection = require("../database.js");

function fetchMultipleResults(stm, params, res) {

    connection.query(stm, params, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
          }

        if (!results || results.length === 0) {
            console.log("Query executed but no data returned.");
            return res.status(200).json({ results: [] });
        }

        console.log("Query success, sending results.");
        return res.status(200).json(results);
    });
}


function fetchSingleResult(stm, params, res) {

    connection.query(stm, params, (error, results) => {

        if (error) {
            return res.status(500).json({ error });
          }

        if (!results || results.length === 0) {
            console.log("Query executed but no data found.");
            return res.status(404).json({ message: "Data not found" });
        }

        console.log("Query success, sending result.");
        return res.status(200).json(results[0]);
    });
}

module.exports = {fetchSingleResult, fetchMultipleResults};
