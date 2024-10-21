
import { db } from '../../../context/firebase'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';

export async function fetchEvents() {
  const eventsCollection = collection(db, 'events');
  const eventsSnapshot = await getDocs(eventsCollection);
  const eventsList = eventsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return eventsList;
}

export async function fetchUser(userId) {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);
  return userDocSnap.exists() ? userDocSnap.data() : null;
}
