import express from 'express';
import cors from 'cors';
import multer from 'multer'; //nos permite tener un input tipefile y subirlo tambien
import csvToJson from 'convert-csv-to-json' //nos convierte convertir archivos csv to json

const app = express();

app.use(cors()); //enable cors
app.use(express.json());

let port = 3000;

//para guardar el carchivo en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage })

let userData = [];

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

//endpoints

app.post('/api/files', upload.single('file'), async (req, res) => {
    // 1. extrac file from the request
    const { file } = req;
    //2. validate that we have files
    if (!file) {
        return res.status(500).send({ message: "File is required" });
    }
    //3. validate the mimetype (csv)
    if(file.mimetype != 'text/csv'){
        return res.status(500).send({ message: "File must be a csv" });
    }
    //4. transform el file (Buffer) to string

    let json = [];
    try {
        const rowwCsv = Buffer.from(file.buffer).toString('utf-8')
        console.log(rowwCsv)
        //5. transform the string (csv) to json
        json = csvToJson.fieldDelimiter(',').csvStringToJson(rowwCsv)
    } catch (error) {
        return res.status(500).send({
            message: "Error parsing the file",
        })
    }
    //6. save the JSON to db (or memory)
    userData = json;
    //7. return 200 with the message and the JSON
    return res.status(200).send({
        message: "el archivo se cargo correctamente",
        data: json
    })
})

app.get('api/users', async (req, res) => {
    //1. extract the query param q from the request
    const { q } = req.query;
    //2. validate that we have the query param
    if (!q) {
        return res.status(500).send({
            message: "Query param q is required",
        })
    }
    //3. filter the data from the db (or memory) whit the query param 
    const search = q.toLowerCase();

    const filterData = userData.filter(row => {
        return Object.values(row).some(value => value.toLowerCase().includes
    (search))
    })
    //4. return 200 with the filter data
    return res.status(200).send({
        data: filterData
    })
})