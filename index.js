var express = require("express");
var bodyParser = require("body-parser");
 var DataStore = require("nedb");

 var PORT = 3000;
 var BASE_API_PATH = "/api/v1";
 var dbFileName = __dirname + "/contratos.json";

 console.log("Starting API server...");

 var app = express();
 app.use(bodyParser.json());

 var initialcontratos = [

    {"NoCandidato": 1, "Nombre": "Maria" ,"Apellido": "Soto", 
    "Puesto":"Investigadora", "Categoria":"Gerente", "Tipo de contrato":"Indeterminado","Sueldo":100,"NoContrato":1,
    "Fecha Inicio":"09-01-2019", "Fecha Fin":"09-03-2019"}
 ];

 var db = new DataStore({
     filename: dbFileName,
     autoload: true
 });

 db.find({},(err,contratos)=>{
     if(err){
         console.error("Error accesing DB");
         process.exit(1);
     }else{
         if(contratos.length == 0){
             console.log("Empty DB, initializaing data...");
             db.insert(initialcontratos);
         }else{
             console.log("Loaded DB with "+contratos.length+" contratos.");
         }
            
     }
 });

 app.get("/", (req, res) => {
     res.send("<html><body><h1>My server</h1></body></html>");
 });

 app.get(BASE_API_PATH + "/contratos", (req, res) => {
     // Obtain all contratos
     console.log(Date()+" - GET /contratos");
     
     db.find({},(err,contratos)=>{
         if(err){
             console.error("Error accesing DB");
             res.sendStatus(500);
         }else{
             res.send(contratos.map((contrato)=>{
                 delete contrato._id;
                 return contrato;
             }));
         }
     });

 });

 app.post(BASE_API_PATH + "/contratos", (req, res) => {
     // Create a new contrato
     console.log(Date()+" - POST /contratos");

     var contrato = req.body;

     db.insert(contrato);

     res.sendStatus(201);
 });

 app.put(BASE_API_PATH + "/contratos", (req, res) => {
     // Forbidden
     console.log(Date()+" - PUT /contratos");

     res.sendStatus(405);
 });

 app.delete(BASE_API_PATH + "/contratos", (req, res) => {
     // Remove all contratos
     console.log(Date()+" - DELETE /contratos");

     db.remove({});
     
     res.sendStatus(200);
 });


 app.post(BASE_API_PATH + "/contratos/:NoCandidato", (req, res) => {
     // Forbidden
     console.log(Date()+" - POST /contratos");

     res.sendStatus(405);
 });



 app.get(BASE_API_PATH + "/contratos/:NoCandidato", (req, res) => {
     // Get a single contrato
     var NoCandidato = req.params.NoCandidato;
     console.log(Date()+" - GET /contratos/"+NoCandidato);

     db.find({"NoCandidato": NoCandidato},(err,contratos)=>{
         if(err){
             console.error("Error accesing DB");
             res.sendStatus(500);
         }else{
             if(contratos.length>1){
                 console.warn("Incosistent DB: duplicated name");
             }
             res.send(contratos.map((contrato)=>{
                 delete contrato._id;
                 return contrato;
             })[0]);
         }
     });
 });


 app.delete(BASE_API_PATH + "/contratos/:NoCandidato", (req, res) => {
     // Delete a single contrato
     var NoCandidato = req.params.NoCandidato;
     console.log(Date()+" - DELETE /contratos/"+NoCandidato);

     db.remove({"NoCandidato": NoCandidato},{},(err,numRemoved)=>{
         if(err){
             console.error("Error accesing DB");
             res.sendStatus(500);
         }else{
             if(numRemoved>1){
                 console.warn("Incosistent DB: duplicated name");
             }else if(numRemoved == 0) {
                 res.sendStatus(404);
             } else {
                 res.sendStatus(200);
             }
         }
     });
 });

 app.put(BASE_API_PATH + "/contratos/:NoCandidato", (req, res) => {
     // Update contrato
     var NoCandidato = req.params.NoCandidato;
     var updatedcontrato = req.body;
     console.log(Date()+" - PUT /contratos/"+NoCandidato);

     if(name != updatedcontrato.name){
         res.sendStatus(409);
         return;
     }

     db.update({"name": name},updatedcontrato,(err,numUpdated)=>{
         if(err){
             console.error("Error accesing DB");
             res.sendStatus(500);
         }else{
             if(numUpdated>1){
                 console.warn("Incosistent DB: duplicated name");
             }else if(numUpdated == 0) {
                 res.sendStatus(404);
             } else {
                 res.sendStatus(200);
             }
         }
     });
 });

 app.listen(PORT);

 console.log("Server ready with static content!");