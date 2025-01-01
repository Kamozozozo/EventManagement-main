import { URL } from "../src/App";
console.log("worker server has bieng loaded")
self.addEventListener('push', function(event) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        data: data.data, 
    });
});

self.addEventListener('notificationclick', function(event) {
    const eventId = event.notification.data.eventId;
    event.notification.close();  // Close the notification
    event.waitUntil(
        clients.openWindow(`${URL}/event/${eventId}`) 
    );
});