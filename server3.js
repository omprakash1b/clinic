const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mysql');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const con = sql.createConnection(
  {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'clinic',
    port : 3306
  }
);

con.connect((err)=>{
  if(err) throw err;
  console.log('Connected');
});

app.post('/login', (req, res) => {
    const { empId, password } = req.body;

    const q = 'SELECT * FROM users WHERE empId = ?';
    
    con.query(q, [empId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result[0];

        if (user.password === password) {
            return res.status(200).json({ id: user.empId });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.post('/patient-registration',async (req,res)=>{
    const {name, age , condition, fees} = req.body
    const q = 'INSERT INTO patients (name, age, conditions, fees)  VALUES (?, ?, ?, ?)';
    con.query(q,[name,age,condition,prescription,fees],(err,results)=>{
        if(err)
            res.status(500).json({err})

        res.status(200).json({id : results.insertId})
    })
})

app.get('/getpatients',(req,res)=>{
    const q = "SELECT * from patients"
    con.query(q,(err,results)=>{
        if(err){
            res.status(500).json({error : err})
        }

        res.status(200).json({results : results})
    })
})

app.post('/pres',(req,res)=>{
    const {token_id,pres} = req.body
    const q = "UPDATE patients SET prescription = ? WHERE (token_id = ?)"
    con.query(q,[pres,token_id],(err,results)=>{
        if(err){
            res.status(500).json({error : err})
        }
        res.status(200).json({results : results})
    })
})

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});