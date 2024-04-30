const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const opportunities = require('./json.json');
const applicants = require('./applicants.json');

app.put('/updateApplicant/:applicantName', (req, res) => {
    console.log("we are in");
    const { applicantName } = req.params;
    const { status } = req.body;

    const index = applicants.findIndex(applicant => applicant.applicantName === applicantName);
    if (index !== -1) {
        applicants[index].status = status;

        res.status(200).json({ message: `Applicant ${applicantName} status updated to ${status}` });
    } else {
        res.status(404).json({ message: `Applicant ${applicantName} not found` });
    }
});

app.get('/funds', (req, res) => {
    res.json(opportunities);
});

app.get('/applicants', (req, res) => {
    res.json(applicants);
});

app.get('/applicants/:bursaryName', (req, res) => {
    const bursaryName = req.params.bursaryName;
    const filteredApplicants = applicants.filter(applicant => applicant.bursaryName === bursaryName);
    res.json(filteredApplicants);
});

app.get('/funds/:type', (req, res) => {
    const type = req.params.type;
    const entry = funds.find(fund => fund.type === type);

    if (!entry) {
        res.status(404).send('Entry not found');
    } else {
        res.json(entry);
    }

});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.post('/funds', (req, res) => {
    const newOpportunity = req.body;
    opportunities.push(newOpportunity);
    res.json(newOpportunity);
    console.log("Information received");
    console.log(opportunities);
});

// Set the port dynamically
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
