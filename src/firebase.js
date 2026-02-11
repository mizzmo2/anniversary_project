
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, onSnapshot, query, orderBy, addDoc, Timestamp} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyC6GnsZ_Zr1Qvz64tkY-_mCODjpnsCQSiw",
    authDomain: "anniversary-project-8e18b.firebaseapp.com",
    projectId: "anniversary-project-8e18b",
    storageBucket: "anniversary-project-8e18b.firebasestorage.app",
    messagingSenderId: "99181894238",
    appId: "1:99181894238:web:c4ca156227f7200e8ff2cf",
    measurementId: "G-SLD72NK3G1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "login.html";
    } else {
      return;
    }
  });

// Get reference to database.
const db = getFirestore(app);

export async function getReadingList(callback) {
  const colRef = collection(db, "reading_list");
  const q = query(colRef, orderBy("added", "asc"));

  return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(docSnap => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        title: data.title,
        author: data.author,
        added: data.added,
        who: data.who
      };
    });

    callback(docs);
  });
}

export async function addReadingList(title, author, who){
  const timestamp = Timestamp.now()

  const colRef = collection(db, "reading_list");
  // Add Document to Collection
  await addDoc(colRef,{
    title: title,
    author: author,
    added: timestamp,
    who: who
  });
}

export async function getCurrentReading(callback) {
  const colRef = collection(db, "current_reading");
  const q = query(colRef);

   return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(docSnap => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        title: data.title,
        author: data.author,
        added: data.added,
        who: data.who,
        rating: data.rating,
        review: data.review
      };
    });

    callback(docs);
  });
}

export async function addCurrentReading(title, author, who, review, rating) {
  const timestamp = Timestamp.now();

  // Document for the current reading
  const currentDocRef = doc(db, "current_reading", who);

  // Collection for archived entries
  const timelineColRef = collection(db, "reading_timeline");

  // Get existing current reading
  const currentSnap = await getDoc(currentDocRef);

  // Archive it if it exists
  if (currentSnap.exists()) {
    const oldData = currentSnap.data();

    await addDoc(timelineColRef, {
      ...oldData,
      archivedAt: timestamp
    });
  }

  // Replace current reading
  await setDoc(currentDocRef, {
    title,
    author,
    who,
    review,
    rating,
    added: timestamp
  });
}

export async function getTimeline(callback) {
  const colRef = collection(db, "reading_timeline");
  const q = query(colRef);

   return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(docSnap => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        title: data.title,
        author: data.author,
        added: data.added,
        archivedAt: data.archivedAt,
        who: data.who,
        rating: data.rating,
      };
    });

    callback(docs);
  });
}

export async function getAllWants(callback) {
  const colRef = collection(db, "all_wants");
  //const q = query(colRef, orderBy("added", "asc"));
  const q = query(colRef);

  return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        link: data.link,
        added: data.added,
        who: data.who
      };
    });

    callback(docs);
  });
}

export async function addWotw(want, link, who) {
  const timestamp = Timestamp.now();

  const currentDocRef = doc(db, "current_wants", who);
  const allWantsRef = collection(db, "all_wants");

  const data = {
    name: want,
    link,
    who,
    added: timestamp
  };

  await addDoc(allWantsRef, data);

  await setDoc(currentDocRef, data);
}

export async function getWotw(callback) {
  const colRef = collection(db, "current_wants");
  const q = query(colRef);

   return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(docSnap => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        name: data.name,
        link: data.link,
        added: data.added,
        who: data.who,
      };
    });
    console.log("firebase.js")
    callback(docs);
  });
}

export async function getChipRankings(callback) {
  const colRef = collection(db, "chip_rankings");
  const q = query(colRef);
   return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(docSnap => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        ranks: data.ranks
      };
    });

    callback(docs);
  });
}

export async function saveChipRankings(userId, ranksArray) {
  try {
    await setDoc(
      doc(db, "chip_rankings", userId),
      { ranks: ranksArray },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving rankings:", error);
  }
}


export async function addChipToBothLists(chipName) {

    const users = ["toby", "mimi"];

    for (const user of users) {

        const docRef = doc(db, "chip_rankings", user);
        const snap = await getDoc(docRef);

        let currentRanks = [];

        if (snap.exists()) {
            currentRanks = snap.data().ranks || [];
        }

        const updatedRanks = [...currentRanks, chipName];

        await setDoc(docRef, {
            ranks: updatedRanks
        }, { merge: true });
    }
}



/**
 * Get all images from a specific folder in Firebase Storage
 * @param {string} folderPath - The path to the folder (e.g., "images/documents")
 * @returns {Promise<Array>} - Array of image objects with name and URL
 */
export async function getImagesFromFolder(folderPath) {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    // Get download URLs for all items
    const imagePromises = result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        url: url,
        fullPath: itemRef.fullPath
      };
    });
    
    const images = await Promise.all(imagePromises);
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}
