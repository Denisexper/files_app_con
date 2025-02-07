import express from 'express';

const app = express();

app.use(express.json());

let port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})