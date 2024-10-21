"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../context/firebase';
import { collection, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { UseAuth } from '../context/useAuth';

const Page = () => {
  const { user } = UseAuth(); 
  const [events, setEvents] = useState([]); 

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events'); 
      const eventsSnapshot = await getDocs(eventsCollection); 
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data() 
      }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const handleRegisterEvent = async (eventId) => {
    if (!user) return; 

    const eventRef = doc(db, 'events', eventId);
    const userRef = doc(db, 'users', user.uid); 

    try {
      await updateDoc(eventRef, {
        registeredUsers: arrayUnion(user.email), 
      });

      await updateDoc(userRef, {
        registeredEvents: arrayUnion(eventId), 
      });
      alert("event registerd,refresh page")
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Events</h1>
        <div className="grid grid-cols-1 gap-4">
          {events.length > 0 ? events.map(event => (
            <div
              key={event.id}
              className={`p-4 border rounded 
                bg-white'
              `}
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600">By: {event.author}</p>
              <p className="text-sm text-gray-600">Date: {event.date}</p>
              <p className="mt-2">{event.description}</p>

              {user && user.email !== event.author ? (
                user.registeredEvents.includes(event.id) ? (
                  <button className="mt-2 p-2 bg-green-200 text-gray-700 rounded" disabled>
                    Already Registered
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegisterEvent(event.id)}
                    className="mt-2 p-2 bg-green-500 text-white rounded"
                  >
                    Register
                  </button>
                )
              ) : null}
            </div>
          )) : <h1>No events</h1>}
        </div>
      </div>
    </>
  );
};

export default Page;
