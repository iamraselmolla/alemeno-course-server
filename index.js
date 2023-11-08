const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51M97QKAix5nU0JTZs2TDDaBqMo1wGKzD8iuzOFMPgaQ4zdSYprKVRF9BsrYxiG8miYDeJyLeZ54Cp2atlYviSzAq00xiZCOVMy')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json())

const port = 5000;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = "mongodb+srv://rasel:rasel@cluster0.q37bxqk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const courses = client.db('alemeno').collection('courses')


        // Payment Method
        app.post('/create-payment-intent', async (req, res) => {
            const { itemPrice } = req.body;
            const amount = itemPrice * 100;

            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                "payment_method_types": [
                    "card"
                ]
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        });




        // Find All courses
        app.get('/all-courses', async (req, res) => {
            const allCourses = await courses.find().toArray();
            res.send(allCourses)
        });

        // Find single Course
        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const findCourse = await courses.findOne(query);
            res.send(findCourse)
        });




        // Enrolled Students
        app.put('/enrolled', async (req, res) => {
            {
                const { id, allPaymentandUserInfo, progress } = req.body;
                allPaymentandUserInfo.progress
                const query = { _id: new ObjectId(id) };

                const result = await courses.updateOne(query, { $push: { 'students': allPaymentandUserInfo } });
                res.send(result)
            }
        });


        // mark course completed
        app.put('/mark-completed', async (req, res) => {
            const { id, email } = req.body;
            const result = await courses.findOneAndUpdate({ "_id": new ObjectId(id), 'students.studentsInfo.email': email }, { $set: { "students.$.progress": 100 } });

            res.status(201).json({ message: 'Course marked as complete' })


        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(e => console.log(e.message))




app.get('/', (req, res) => {
    res.send('Alemeno Server is running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})