"use client"
import React, { useEffect, useState } from 'react';

import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore'; // Firestore operations
import { db } from '../context/firebase';
import { UseAuth } from '../context/useAuth';
const RegisteredUsersDropdown = ({ registeredUsers }) => {
    return (
      <div className="mt-2">
        <label htmlFor="registered-users" className="block text-sm font-medium">Registered Users:</label>
        <select id="registered-users" className="mt-1 block w-full border rounded-md">
          {registeredUsers.map(userId => (
            <option key={userId} value={userId}>
              {userId} {/* Replace with a function to fetch user details if needed */}
            </option>
          ))}
        </select>
      </div>
    );
  };
const Page = () => {
  const { user } = UseAuth(); 
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });

 
  useEffect(() => {
    const fetchEventDetails = async () => {
      const fetchEventsById = async (eventIds) => {
        const eventsData = await Promise.all(
          eventIds.map(async (eventId) => {
            const eventDoc = await getDoc(doc(db, 'events', eventId));
            return { id: eventId, ...eventDoc.data() };
          })
        );
        return eventsData;
      };

      if (user?.registeredEvents) {
        const fetchedRegisteredEvents = await fetchEventsById(user.registeredEvents);
        setRegisteredEvents(fetchedRegisteredEvents);
      }

      if (user?.myEvents) {
        const fetchedMyEvents = await fetchEventsById(user.myEvents);
        setMyEvents(fetchedMyEvents);
      }
    };

    fetchEventDetails();
  }, [user]);

  const handleEventCreate = async (e) => {
    e.preventDefault();

    if (newEvent.title && newEvent.description && newEvent.date) {
  
     
      const eventRef = await addDoc(collection(db, 'events'), {
        ...newEvent,
        author: user.email,
        registeredUsers: [], 
      });

     
      
      
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        myEvents: arrayUnion(eventRef.id), 
      });

    
      setNewEvent({ title: '', description: '', date: '' });

      
      setMyEvents((prevEvents) => [
        ...prevEvents,
        { id: eventRef.id, ...newEvent, author: user.email },
      ]);
    }
  };

  return (
    <div className="p-6">
   
      <div className="mb-6 flex justify-between items-center">
  <div>
    <h1 className="text-2xl font-bold">{user?.name || 'Anonymous'}</h1>
    <p className="text-gray-600">{user?.email}</p>
  </div>
  <img
    src={user?.profileImg } 
    alt="Profile"
    className="w-16 h-16 rounded-full object-cover" 
  />
</div>


     
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Registered Events</h2>
        <div className="grid grid-cols-1 gap-4">
          {registeredEvents.map(event => (
            <div key={event.id} className="p-4 bg-gray-100 border rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {event.date}</p>
            </div>
          ))}
        </div>
      </div>

    
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">My Events</h2>
        <div className="grid grid-cols-1 gap-4">
          {myEvents.map(event => (
            <div key={event.id} className="p-4 bg-gray-100 border rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {event.date}</p>
              {event.registeredUsers && event.registeredUsers.length > 0 && (
                <RegisteredUsersDropdown registeredUsers={event.registeredUsers} />
              )}
            </div>
          ))}
        </div>
      </div>

     
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
        <form onSubmit={handleEventCreate} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="Event Title"
            className="p-2 border rounded-lg"
            required
          />
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder="Event Description"
            className="p-2 border rounded-lg"
            required
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="p-2 border rounded-lg"
            required
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
