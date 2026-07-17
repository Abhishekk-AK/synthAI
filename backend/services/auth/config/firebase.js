import { cert, initializeApp } from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" with {type:"json"};

export const app=initializeApp({
  credential: cert(serviceAccount)
});


// or


// import admin from "firebase-admin";

// import serviceAccount from "../serviceAccountKey.json" with {type:"json"};

// export const app=admin.initializeApp({
//   credential: cert(serviceAccount)
// });
