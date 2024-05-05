const express = require('express');
const Joi = require('joi');
const { Pool } = require('pg');

const app = express();
const port = 3001;

const schema = Joi.object({
  studentno: Joi.string().alphanum().min(3).max(30).required()
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getDbDatasForMobile(studentno) {
  const dbConfig = {
    user: 'maya',
    host: 'gultenguzel.postgres.database.azure.com',
    database: 'postgres',
    password: 'Gulten.5515253',
    port: 5432,
    ssl: true
  };

  const pool = new Pool(dbConfig);
  const queryParams = [studentno];
  const queryText = "SELECT s.studentid, s.studentsbalance, t.tuitionamount FROM students AS s JOIN studenttuition AS t ON s.studentid = t.studentid WHERE s.studentid = $1;"; 
  
  try {
    const res = await pool.query(queryText, queryParams);
    console.log('Mobile query result:', res.rows);
    return res.rows;
  } catch (err) {
    console.error('Connection error:', err.stack);
    throw err;
  } finally {
    await pool.end();
  }
}

app.post('/unpaidTuitionStatus', async (req, res) => {
  var body = req.body;
  const { error, value } = schema.validate(body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    console.log('Received request to /unpaidTuitionStatus:', body);
    console.log('Validated request:', value);
    var db = await getDbDatasForMobile(body.studentno);
    await sleep(5000);
    console.log("DB Query Result:", db);
    res.send('Tuition total: ' + db[0].tuitionamount + ", Student balance: " + db[0].studentsbalance);
  }
});

app.listen(port, () => {
  console.log(`Service A listening on port ${port}`);
});
