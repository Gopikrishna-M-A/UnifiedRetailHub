'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useSession } from "next-auth/react";

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toggle, setToggle] = useState(false);


  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchAnalytics= async () => {
      try {
        if (user) {
          const response = await axios.get(`${baseURL}/api/analytics/${user._id}`);
          setAnalytics(response.data);
        } else {
          setAnalytics([]); // Set an empty array if no user
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [toggle]); // Add dependencies if needed

  const addAnalyticsEvent = async (eventType, eventData) => {
    try {
      const response = await axios.post(`${baseURL}/api/analytics`, {
        eventType,
        user: user?._id,
        eventData:eventData._id,
      });
    //   console.log('Analytics event added:', response.data);

      // Update recently viewed items if event type is "Page View"
      if (eventType === "Page View" && eventData) {
        setRecentlyViewed(prevRecentlyViewed => {
          const updatedRecentlyViewed = [eventData, ...prevRecentlyViewed.filter(product => product._id !== eventData._id)].slice(0, 10);
        //   localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed)); // Update local storage
            console.log("updatedRecentlyViewed",updatedRecentlyViewed);
          return updatedRecentlyViewed;
        });
      }
    } catch (error) {
      console.error('Error adding analytics event:', error);
    }
  };


  return (
    <AnalyticsContext.Provider value={{ recentlyViewed, isLoading, error, addAnalyticsEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};
