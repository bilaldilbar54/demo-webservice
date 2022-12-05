var DEFAULT_PORT = 5000
var DEFAULT_HOST = '127.0.0.1'
var SERVER_NAME = 'healthrecords'

var http = require ('http');
const { ObjectId } = require('mongoose');
var mongoose = require ("mongoose");


var ipaddress = DEFAULT_HOST;
var port = process.env.PORT || DEFAULT_PORT;

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = 
  process.env.MONGODB_URI || 
  'mongodb+srv://bilaldilbar:0hCvISOBY7fuUtCI@cluster0.xn5enkc.mongodb.net/healthrecords?retryWrites=true&w=majority';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("!!!! Connected to db: " + uristring)
});


// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var patientsSchema = new mongoose.Schema({
    patientId: String,
		firstName: String,
		lastName: String,
    age: String,
    gender: String,
    weight: String,
		address: String,
    phoneNumber: String,
		dateOfBirth: String,
		report: String,
		doctor: String,
    ward: String
  },
  {
    timestamps: true,
  }
);


// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var patientsSchemaTest = new mongoose.Schema({
    id: ObjectId,
		date: String,
		nurseName: String,
		type: String,
    category: String,
		readings: {
      diastolic: String,
      systolic: String
    }
});


// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Patients' collection in the MongoDB database
var Patients = mongoose.model('Patients', patientsSchema);

var PatientsTest = mongoose.model('PatientsTest', patientsSchemaTest);

var errors = require('restify-errors');
var restify = require('restify')
  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})
  
  server.listen(port, ipaddress, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints: http://127.0.0.1:5000/patients method: GET, POST')
  console.log('Resources:')
  console.log(' /patients')
  console.log(' /patients/:id')
})


server
  // Allow the use of POST
  .use(restify.plugins.fullResponse())

  // Maps req.body to req.params
  .use(restify.plugins.bodyParser())

// Get all patients in the system
server.get('/patients', function (req, res, next) {
  console.log('GET request: patients');
  // Find every entity within the given collection
  Patients.find({}).exec(function (error, result) {
    if (error) return next(new Error(JSON.stringify(error.errors)))
    res.send(result);
  });
})


// Get a single patients by their patients id
server.get('/patients/:id', function (req, res, next) {
  console.log('GET request: patients/' + req.params.id);

  // Find a single patients by their id
  Patients.find({ _id: req.params.id }).exec(function (error, patients) {
    if (patients) {
      // Send the patients if no issues
      res.send(patients)
    } else {
      // Send 404 header if the patients doesn't exist
      res.send(404)
    }
  })
})


// Create a new patients
server.post('/patients', function (req, res, next) {
  console.log('POST request: patients params=>' + JSON.stringify(req.params));
  console.log('POST request: patients body=>' + JSON.stringify(req.body));
  
  if (req.body.patientId === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('patientId must be supplied'))
  }
  // Make sure name is defined
  if (req.body.firstName === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('firstName must be supplied'))
  }
  if (req.body.lastName === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('lastName must be supplied'))
  }
  if (req.body.age === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('lastName must be supplied'))
  }
  if (req.body.gender === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('lastName must be supplied'))
  }
  if (req.body.weight === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('lastName must be supplied'))
  }
  if (req.body.address === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('address must be supplied'))
  }
  if (req.body.phoneNumber === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('phoneNumber must be supplied'))
  }
  if (req.body.dateOfBirth === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('dateOfBirth must be supplied'))
  }
  if (req.body.report === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('department must be supplied'))
  }
  if (req.body.doctor === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('doctor must be supplied'))
  }
  if (req.body.ward === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('lastName must be supplied'))
  }


  // Creating new patients
  var newPatients = new Patients({
    patientId: req.body.patientId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    gender: req.body.gender,
    weight: req.body.weight,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    dateOfBirth: req.body.dateOfBirth,
    report: req.body.report,
    doctor: req.body.doctor,
    ward: req.body.ward
  });


  // Create the patients and saving to db
  newPatients.save(function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))
    // Send the patients if no issues
    res.send(201, result)
  })
})


// Delete patients with the given id
server.del('/patients/:id', function (req, res, next) {
  console.log('DEL request: patients/' + req.params.id);
  Patients.remove({ _id: req.params.id }, function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  });
})


// Delete all of the patients
server.del('/patients', function (req, res, next) {
  // Delete all of the patients
  Patients.deleteMany({}, function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


// --------------------------------
// Create a new patient test record
// --------------------------------
server.post('/patients/:id/tests', function (req, res, next) {
  console.log('POST request: patients params=>' + JSON.stringify(req.params));
  console.log('POST request: patients body=>' + JSON.stringify(req.body));
  // Make sure name is defined
  if (req.body.date === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('date must be supplied'))
  }
  if (req.body.nurseName === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('nurseName must be supplied'))
  }
  if (req.body.type === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('type must be supplied'))
  }
  if (req.body.category === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('category must be supplied'))
  }


// Creating new patients test record
var newPatientsTest = new PatientsTest({
  _id: req.params.id,
  date: req.body.date,
  nurseName: req.body.nurseName,
  type: req.body.type,
  category: req.body.category,
  readings: {
    diastolic: req.body.diastolic,
    systolic: req.body.systolic
  }
});

// Create the patients test record and saving to db
newPatientsTest.save(function (error, result) {
  // If there are any errors, pass them to next in the correct format
  if (error) return next(new Error(JSON.stringify(error.errors)))
  // Send the patients if no issues
  res.send(201, result)
})
})


// Get all patients test records in the system
server.get('/patients/tests', function (req, res, next) {
  console.log('GET request: patients test records');
  // Find every entity within the given collection
  PatientsTest.find({}).exec(function (error, result) {
    if (error) return next(new Error(JSON.stringify(error.errors)))
    res.send(result);
  });
})


// Get a single patients test record by their patients id
server.get('/patients/:id/tests', function (req, res, next) {
  console.log('GET request: patients/' + req.params.id);

  // Find a single patients by their id
  PatientsTest.find({ _id: req.params.id }).exec(function (error, patients) {
    if (patients) {
      // Send the patients if no issues
      res.send(patients)
    } else {
      // Send 404 header if the patients doesn't exist
      res.send(404)
    }
  })
})


// Delete patients test record with the given id
server.del('/patients/:id/tests', function (req, res, next) {
  console.log('DEL request: patients/' + req.params.id);
  PatientsTest.remove({ _id: req.params.id }, function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  });
})


// Delete all of the patients test records
server.del('/patients/tests', function (req, res, next) {
  // Delete all of the patients
  PatientsTest.deleteMany({}, function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})