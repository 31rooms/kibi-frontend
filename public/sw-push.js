/**
 * Service Worker for Push Notifications
 * Handles push events and notification clicks
 */

// Listen for push events
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push received:', event);

  if (!event.data) {
    console.log('[Service Worker] Push event but no data');
    return;
  }

  try {
    // Parse the push payload
    const data = event.data.json();
    console.log('[Service Worker] Push data:', data);

    const title = data.title || 'Nueva notificación';
    const options = {
      body: data.body || '',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.data?.url || '/dashboard',
        type: data.data?.type,
        timestamp: data.data?.timestamp || Date.now(),
        metadata: data.data?.metadata,
      },
      actions: [
        {
          action: 'open',
          title: 'Ver',
        },
        {
          action: 'close',
          title: 'Cerrar',
        },
      ],
      requireInteraction: false,
      tag: data.data?.type || 'general',
      renotify: false,
    };

    // Show the notification
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('[Service Worker] Error parsing push data:', error);

    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('Nueva notificación', {
        body: 'Tienes una nueva notificación de Kibi',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
      })
    );
  }
});

// Listen for notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked:', event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Check if there's already a window/tab open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === new URL(urlToOpen, self.location.origin).href && 'focus' in client) {
            return client.focus();
          }
        }

        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Listen for push subscription change
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker] Push subscription changed');

  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: event.oldSubscription.options.applicationServerKey
    })
    .then(function(newSubscription) {
      console.log('[Service Worker] New subscription:', newSubscription);

      // Send message to all clients to update subscription
      // The client has access to the auth token and can make the authenticated request
      return self.clients.matchAll({ type: 'window' })
        .then(function(clientList) {
          clientList.forEach(function(client) {
            client.postMessage({
              type: 'PUSH_SUBSCRIPTION_CHANGED',
              subscription: newSubscription.toJSON()
            });
          });
        });
    })
    .catch(function(error) {
      console.error('[Service Worker] Failed to resubscribe:', error);
    })
  );
});

console.log('[Service Worker] Push notification service worker loaded');
