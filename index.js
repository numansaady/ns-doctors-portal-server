const express = require('express')
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhpec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const serviceCollection = client.db('doctors_portal').collection('service');
    const bookingCollection = client.db('doctors_portal').collection('booking');

    app.get('/service', async(req, res)=>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })

    app.post('/booking', async(req, res)=> {
      const booking = req.body;
      const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}
      const exists = bookingCollection.findOne(query);
      if(exists){
        return res.send({success: false, booking:exists})
      }
      const result = await bookingCollection.insertOne(booking);
      return res.send({success: true, result});
    })
  }
  finally{

  }
}
run().catch(console.dir())


app.get('/', (req, res) => {
  res.send('Doctors Portal Server is Running!')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})