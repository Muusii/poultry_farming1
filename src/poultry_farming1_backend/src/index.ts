import {
    Canister,
    query,
    text,
    update,
    Record,
    Vec,
    nat64,
    Principal,
    StableBTreeMap,
    Opt,
    ic,
} from "azle";

// Define the record structures for broilers and layers
const Broiler = Record({
    id: Principal,
    age: nat64,
    numberOfBroilers: nat64,
    breed: text,
    createdAt: nat64,
    available: nat64,
    sold: nat64,
});

const Layer = Record({
    id: Principal,
    age: nat64,
    numberOfLayers: nat64,
    breed: text,
    createdAt: nat64,
    available: nat64,
    sold: nat64,
});

const Egg = Record({
    id: Principal,
    breed: text,
    createdAt: nat64,
    available: nat64,
    sold: nat64,
    laidEggs: nat64,
    damagedEggs: nat64,
});

// Initialize databases for broiler, layer, and egg records
let Broilers = StableBTreeMap<Principal, Broiler>(0);
let Layers = StableBTreeMap<Principal, Layer>(1);
let Eggs = StableBTreeMap<Principal, Egg>(2);

// Generate a random ID
function generateId(): Principal {
    const randomBytes = new Array(29).fill(0).map(() => Math.floor(Math.random() * 256));
    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}

export default Canister({
    // Function to create broiler records
    createBroilers: update([nat64, nat64, text], Broiler, (age, numberOfBroilers, breed) => {
        const id = generateId();
        const createdAt = ic.time();
        const available = numberOfBroilers;
        const sold = 0n;
        const newBroilers = { id, age, numberOfBroilers, breed, createdAt, available, sold };
        Broilers.insert(id, newBroilers);
        return newBroilers;
    }),

    // Function to update the availability of broilers after sale
    soldBroilers: update([nat64, nat64, text], Broiler, (age, numberOfBroilers, breed) => {
        const id = generateId();
        const createdAt = ic.time();
        const available = 0n;
        const sold = numberOfBroilers;
        const newBroilers = { id, age, numberOfBroilers, breed, createdAt, available, sold };
        Broilers.insert(id, newBroilers);
        return newBroilers;
    }),

    // Function to get broiler record by ID
    getBroilerById: query([Principal], Opt(Broiler), (id) => {
        return Broilers.get(id);
    }),

    // Function to get all broiler records
    getAllBroilers: query([], Vec(Broiler), () => {
        return Broilers.values();
    }),

    // Function to create layer records
    createLayers: update([nat64, nat64, text], Layer, (age, numberOfLayers, breed) => {
        const id = generateId();
        const createdAt = ic.time();
        const available = numberOfLayers;
        const sold = 0n;
        const newLayers = { id, age, numberOfLayers, breed, createdAt, available, sold };
        Layers.insert(id, newLayers);
        return newLayers;
    }),

    // Function to update the availability of layers after sale
    soldLayers: update([nat64, nat64, text], Layer, (age, sold, breed) => {
        const id = generateId();
        const createdAt = ic.time();
        const available = 0n;
        const newLayers = { id, age, numberOfLayers: sold, breed, createdAt, available, sold };
        Layers.insert(id, newLayers);
        return newLayers;
    }),

    // Function to get layer record by ID
    getLayerById: query([Principal], Opt(Layer), (id) => {
        return Layers.get(id);
    }),

    // Function to get all layer records
    getAllLayers: query([], Vec(Layer), () => {
        return Layers.values();
    }),

    // Function to add laid eggs for a specific layer
    laidEggs: update([text, nat64], Egg, (breed, laidEggs) => {
        const id = generateId();
        const createdAt = ic.time();
        const available = laidEggs;
        const sold = 0n;
        const newEggs = { id, breed, createdAt, available, sold, laidEggs, damagedEggs: 0n };
        Eggs.insert(id, newEggs);
        return newEggs;
    }),

    // Function to add sold eggs for a specific layer
    soldEggs: update([text, nat64], Egg, (breed, sold) => {
        const id = generateId();
        const createdAt = ic.time();
        const available = sold;
        const newEggs = { id, breed, createdAt, available, sold, laidEggs: 0n, damagedEggs: 0n };
        Eggs.insert(id, newEggs);
        return newEggs;
    }),

    // Function to add damaged eggs for a specific layer
    damagedEggs: update([text, nat64], Egg, (breed, damagedEggs) => {
        const id = generateId();
        const createdAt = ic.time();
        const available = damagedEggs;
        const sold = 0n;
        const newEgg = { id, breed, createdAt, available, sold, laidEggs: 0n, damagedEggs };
        Eggs.insert(id, newEgg);
        return newEgg;
    }),

    // Function to get egg records by ID
    getEggById: query([Principal], Opt(Egg), (id) => {
        return Eggs.get(id);
    }),

    // Function to get all egg records
    getAllEggs: query([], Vec(Egg), () => {
        return Eggs.values();
    }),
});

// Function to generate a random ID
   function generateId(): Principal {
     const randomBytes = new Array(29)
       .fill(0)
       .map((_) => Math.floor(Math.random() * 256));
     return Principal.fromUint8Array(Uint8Array.from(randomBytes));
   }
  
  
