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
  
  // Define the broiler record structure
  const Broiler = Record({
    id: Principal,
    age: nat64,
    numberOfBroilers: nat64,
    breed: text,
    createdAt: nat64,
    available: nat64,
    sold: nat64,
  });
  
  // Define the Broiler type
  type BroilerType = typeof Broiler.tsType;
  
  // Initialize a database for broiler records
  let Broilers = StableBTreeMap<Principal, Broiler>(0);
  
  // Define the layer record structure
  const Layer = Record({
    id: Principal,
    age: nat64,
    numberOfLayers: nat64,
    breed: text,
    createdAt: nat64,
    available: nat64,
    sold: nat64,
    // laidEggs: nat64,
    // damagedEggs: nat64,
  });
  const Egg = Record({
    id: Principal,
    createdAt: nat64,
    available: nat64,
    sold: nat64,
    laidEggs: nat64,
    damagedEggs: nat64,
  })
  
  //types
  type LayerType = typeof Layer.tsType;
  type EggType = typeof Egg.tsType;
  
  //database for records
  let Layers = StableBTreeMap<Principal, Layer>(0);
  let Eggs = StableBTreeMap<Principal, Egg>(1);
  
  export default Canister({
    // Function to create broiler records
    createBroilers: update([nat64, nat64, text], Broiler, (age, numberOfBroilers, breed) => {
      const id = generateId();
      //const createdAt =Date.now();
      const newBroilers = {
        id,
        age,
        numberOfBroilers,
        breed,
        createdAt: ic.time(),
        available: numberOfBroilers,
        sold: 0,
      };
      Broilers.insert(id, newBroilers);
      return newBroilers;
    }),
  
  // Function to update the availability of broilers after sale
  SoldBroilers: update([nat64, nat64, text], Broiler, (age, numberOfBroilers, breed) => {
    const id = generateId();
    //const createdAt =Date.now();
    const newBroilers = {
      id,
      age,
      numberOfBroilers,
      breed,
      createdAt: ic.time(),
      available: 0,
      sold: numberOfBroilers,
    };
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
      const newLayers = {
        id,
        age,
        numberOfLayers,
        breed,
        createdAt: ic.time(),
        available: numberOfLayers,
        sold: 0,
        // laidEggs: 0,
        // damagedEggs: 0,
      };
      Layers.insert(id, newLayers);
      return newLayers;
    }),
  
    // Function to update the availability of layers after sale
    SoldLayers: update([nat64, nat64, text], Layer, (age, sold, breed) => {
      const id = generateId();
      const newLayers = {
        id,
        age,
        numberOfLayers: sold,
        breed,
        createdAt: ic.time(),
        available: 0,
        sold,
        // laidEggs: 0,
        // damagedEggs: 0,
      };
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
    LaidEggs: update([ text, nat64], Egg, (breed, laidEggs) => {
      const id = generateId();
      const newEggs = {
        id,
        // age,
        // numberOfLayers,
        breed,
        createdAt: ic.time(),
        available: laidEggs,
        sold: 0,
        laidEggs,
        damagedEggs: 0,
      };
      Eggs.insert(id, newEggs);
      return newEggs;
    }),
  
     // Function to add laid eggs for a specific layer
     SOldEggs: update([ text, nat64], Egg, (breed, sold) => {
      const id = generateId();
      const newEggss = {
        id,
        // age,
        // numberOfLayers,
        breed,
        createdAt: ic.time(),
        available: sold,
        sold,
        laidEggs: 0,
        damagedEggs: 0,
      };
      Eggs.insert(id, newEggss);
      return newEggss;
    }),
  
    // Function to add damaged eggs for a specific layer
    DamagedEggs: update([text, nat64], Egg, (breed, damagedEggs) => {
      const id = generateId();
      const newEgg = {
        id,
        // age,
        // numberOfLayers,
        breed,
        createdAt: ic.time(),
        available: damagedEggs,
        sold: 0,
        laidEggs: 0,
        damagedEggs,
      };
      Eggs.insert(id, newEgg);
      return newEgg;
    }),
  
     // Function to get eggs records by ID
     getEggById: query([Principal], Opt(Egg), (id) => {
      return Eggs.get(id);
    }),
  
    // Function to get all eggs records
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
  
  
