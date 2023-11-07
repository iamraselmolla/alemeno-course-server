const express = require("express");
const cors = require("cors");
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