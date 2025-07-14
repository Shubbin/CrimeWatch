import mongoose from "mongoose";
import { Criminal } from "../models/criminal.model.js";

// Your MongoDB connection string here
const mongoURI = "mongodb://localhost:27017/crimeWatchDatabase";

const dummyCriminals = [
  {
    name: "Alice Green",
    dob: new Date("1990-05-10"),
    gender: "female",
    crimeCommitted: "Robbery",
    dateOfCrime: new Date("2023-04-12"),
    address: "123 Maple St",
    status: "detained",
    phoneNumber: "08012345678",
    maritalStatus: "single",
    nextOfKin: "Bob Green",
    nextOfKinRelationship: "family",
    nextOfKinAddress: "456 Oak St",
    nextOfKinPhoneNumber: "08087654321",
    mugshotUrl: "http://example.com/mugshots/alice.jpg",
  },
  {
    name: "David White",
    dob: new Date("1985-07-22"),
    gender: "male",
    crimeCommitted: "Fraud",
    dateOfCrime: new Date("2024-01-15"),
    address: "789 Pine Rd",
    status: "bailed",
    phoneNumber: "08023456789",
    maritalStatus: "married",
    nextOfKin: "Linda White",
    nextOfKinRelationship: "partner",
    nextOfKinAddress: "321 Elm St",
    nextOfKinPhoneNumber: "08098765432",
    mugshotUrl: "http://example.com/mugshots/david.jpg",
  },
  {
    name: "Mary Johnson",
    dob: new Date("1992-11-30"),
    gender: "female",
    crimeCommitted: "Assault",
    dateOfCrime: new Date("2023-12-05"),
    address: "45 Birch Ave",
    status: "convicted",
    phoneNumber: "08034567890",
    maritalStatus: "divorced",
    nextOfKin: "Sarah Johnson",
    nextOfKinRelationship: "friend",
    nextOfKinAddress: "22 Cedar St",
    nextOfKinPhoneNumber: "08012349876",
    mugshotUrl: "http://example.com/mugshots/mary.jpg",
  },
  {
    name: "John Smith",
    dob: new Date("1980-03-15"),
    gender: "male",
    crimeCommitted: "Theft",
    dateOfCrime: new Date("2024-02-20"),
    address: "78 Spruce Ln",
    status: "detained",
    phoneNumber: "08045678901",
    maritalStatus: "married",
    nextOfKin: "Jane Smith",
    nextOfKinRelationship: "partner",
    nextOfKinAddress: "78 Spruce Ln",
    nextOfKinPhoneNumber: "08045678902",
    mugshotUrl: "http://example.com/mugshots/john.jpg",
  },
  {
    name: "Patricia Brown",
    dob: new Date("1975-06-18"),
    gender: "female",
    crimeCommitted: "Embezzlement",
    dateOfCrime: new Date("2023-10-10"),
    address: "90 Willow Dr",
    status: "released",
    phoneNumber: "08056789012",
    maritalStatus: "widowed",
    nextOfKin: "Michael Brown",
    nextOfKinRelationship: "family",
    nextOfKinAddress: "12 Poplar St",
    nextOfKinPhoneNumber: "08098761234",
    mugshotUrl: "http://example.com/mugshots/patricia.jpg",
  },
  {
    name: "Michael Davis",
    dob: new Date("1988-08-25"),
    gender: "male",
    crimeCommitted: "Drug Trafficking",
    dateOfCrime: new Date("2024-03-01"),
    address: "56 Chestnut Blvd",
    status: "detained",
    phoneNumber: "08067890123",
    maritalStatus: "single",
    nextOfKin: "Laura Davis",
    nextOfKinRelationship: "family",
    nextOfKinAddress: "34 Pine St",
    nextOfKinPhoneNumber: "08043218765",
    mugshotUrl: "http://example.com/mugshots/michael.jpg",
  },
  {
    name: "Jennifer Wilson",
    dob: new Date("1995-01-12"),
    gender: "female",
    crimeCommitted: "Cybercrime",
    dateOfCrime: new Date("2024-04-07"),
    address: "67 Magnolia Ct",
    status: "bailed",
    phoneNumber: "08078901234",
    maritalStatus: "single",
    nextOfKin: "Emma Wilson",
    nextOfKinRelationship: "friend",
    nextOfKinAddress: "89 Cypress Rd",
    nextOfKinPhoneNumber: "08034561278",
    mugshotUrl: "http://example.com/mugshots/jennifer.jpg",
  },
  {
    name: "Robert Martinez",
    dob: new Date("1982-09-05"),
    gender: "male",
    crimeCommitted: "Arson",
    dateOfCrime: new Date("2023-11-11"),
    address: "101 Redwood St",
    status: "convicted",
    phoneNumber: "08089012345",
    maritalStatus: "married",
    nextOfKin: "Anna Martinez",
    nextOfKinRelationship: "partner",
    nextOfKinAddress: "101 Redwood St",
    nextOfKinPhoneNumber: "08089012346",
    mugshotUrl: "http://example.com/mugshots/robert.jpg",
  },
  {
    name: "Linda Clark",
    dob: new Date("1978-04-20"),
    gender: "female",
    crimeCommitted: "Forgery",
    dateOfCrime: new Date("2023-09-18"),
    address: "202 Cypress Ave",
    status: "released",
    phoneNumber: "08090123456",
    maritalStatus: "divorced",
    nextOfKin: "George Clark",
    nextOfKinRelationship: "family",
    nextOfKinAddress: "58 Spruce St",
    nextOfKinPhoneNumber: "08023456781",
    mugshotUrl: "http://example.com/mugshots/linda.jpg",
  },
  {
    name: "James Lee",
    dob: new Date("1991-12-02"),
    gender: "male",
    crimeCommitted: "Burglary",
    dateOfCrime: new Date("2024-02-28"),
    address: "303 Fir Ln",
    status: "detained",
    phoneNumber: "08001234567",
    maritalStatus: "single",
    nextOfKin: "David Lee",
    nextOfKinRelationship: "family",
    nextOfKinAddress: "45 Oak St",
    nextOfKinPhoneNumber: "08076543210",
    mugshotUrl: "http://example.com/mugshots/james.jpg",
  },
];

async function seed() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to DB");

    // Optional: clear old data if you want
    // await Criminal.deleteMany({});

    const inserted = await Criminal.insertMany(dummyCriminals);
    console.log(`Inserted ${inserted.length} criminals`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
}

seed();
