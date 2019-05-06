
self.addEventListener("push", event => {
    const logoUrl = "https://erena.herokuapp.com/logo.png";
    const notification = event.data.json();
    console.log(notification);
    interaction = (notification.requireInteraction === undefined) ? false : true;
    reqRes = notification.requireResponse;
    console.log(reqRes);
    if (reqRes) {
        event.waitUntil(
            self.registration.showNotification(notification.title, {
                body: notification.body,
                icon: logoUrl,
                requireInteraction: true,
                actions: [
                    { action: "yes", title: "Yes" },
                    { action: 'no', title: "No" }
                ],
                tag: notification.notificationId,
                data: { responseUrl: notification.responseUrl }
            })
        );
    }
    else {
        event.waitUntil(
            self.registration.showNotification(notification.title, {
                body: notification.body,
                icon: logoUrl,
                requireInteraction: interaction,
                data: { url: notification.url }
            })
        );
    }

});


self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    if (event.action === "yes") {
        console.log("Notification action yes: ", event.notification.tag);
        let response = {
            notificationId: event.notification.tag,
            action: "yes"
        }
        send(event.notification.data.responseUrl, response)
    }
    else if (event.action === "no") {
        console.log("Notification action no: ", event.notification.tag);
        let response = {
            notificationId: event.notification.tag,
            action: "no"
        }
        send(event.notification.data.responseUrl, response)
    }
    else if (event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }


});

self.addEventListener('notificationclose', event => {
    console.log('[SW] Notification closed', event);
});


// utility functions

async function send(url, response) {
    await fetch(url, {
        method: "POST",
        body: JSON.stringify(response),
        headers: {
            "content-type": "application/json"
        }
    });
    console.log("Response sent to ", url);
}