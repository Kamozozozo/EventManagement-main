import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { URL } from "./App";

const publicVapidKey = "BO4lq1bZSvVXYK3r612qFIHOSyKORELeRIV68orwNQadptewncS80dYjanob-xkjBVxbH2z-_-VgMSZlC8ER_9s";

export default function NotificationManager() {

  
  // Function to convert VAPID key to UInt8Array
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    try {
      const rawData = window.atob(base64);
      return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
    } catch (error) {
      console.error("Base64 decoding failed:", error.message);
      return new Uint8Array();
    }
  };

  // Function to request notification permission
  const requestNotificationPermission = async () => {
    console.log('Current notification permission status:', Notification.permission);
  
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return;
    }
  
    if (Notification.permission === 'default') {
      // Permission has not been asked yet
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permission granted for notifications.');
        subscribeUserToPush();
      } else {
        console.log('Permission denied or dismissed.');
      }
    } else if (Notification.permission === 'granted') {
      // Already granted
      console.log('Permission already granted.');
      subscribeUserToPush();
    } else {
      toast.error(`Notification permission is not granted. Please enable it in your browser settings. Follow this URL: chrome://settings/content/notifications`);
    }
  };
    

  // Main function to handle push subscription
  const subscribeUserToPush = async () => {
    if (!("serviceWorker" in navigator && "PushManager" in window)) {
      toast.error("Push notifications are not supported in this browser. please use another browser");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      toast.success("subscribed to push notifications:", subscription);

      const subscriptionData = {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: {
          p256dh: subscription.getKey("p256dh") ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")))) : null,
          auth: subscription.getKey("auth") ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")))) : null,
        },
      };

      await sendSubscriptionToServer(subscriptionData); // Added await here to ensure completion
    } catch (error) {
      toast.error.error("Failed to subscribe  to push notifications:", error);
    }
  };

  // Function to send the subscription data to the server
  const sendSubscriptionToServer = async (subscriptionData) => {
    try {
      const response = await fetch(`${URL}/api/auth/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriptionData),
        credentials: "include",
      });
    
      if (!response.ok) {
        const errorData = await response.text();
        toast.error("Server response error:", errorData);
      } else {
        const data = await response.json();
        toast.success("Subscription successfully sent to server:", data);
      }
    } catch (error) {
      toast.error("Error sending subscription to server:", error);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white p-2 rounded-[10px]"
        onClick={() => {
            console.log("Button clicked to request notification permission.");
            requestNotificationPermission();
          }}
      >
        Request Notification Permission
      </button>
    </div>
  );
}
