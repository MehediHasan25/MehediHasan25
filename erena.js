
$(document).ready(function () {

    const erenaApiURL = "https://erena.herokuapp.com/api/v1/notification/subscribe";
    const publicVapidKey = "BKpxXz__hH5yDCXZd8q0ShS_JOKmOW4GWIMbVwoY7rMfnvn5zXzjpZaQmGMO_kP5bo_3XarFsBdQTi1CwDkr2jc";

    /**
     Utility functions
    */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /** End of Utility function */

    // subscribe function for erena service subscription

    async function send(payload) {
        await fetch(erenaApiURL, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "content-type": "application/json"
            }
        });
    }

    async function subscribe(username, tokenId) {
        try {
            console.log("in subscribe");
            const register = await navigator.serviceWorker.register('https://mehedihasan25.github.io/erena-sw.js', {
                scope: '/'
            });
            console.log("register complete");
            navigator.serviceWorker.ready.then(async function (reg) {

                uint8AppServerKey = urlBase64ToUint8Array(publicVapidKey);
                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: uint8AppServerKey
                });
                console.log(subscription);
                const payload = {
                    username: username,
                    tokenId: tokenId,
                    subscription: subscription
                }
                await send(payload);
                console.log("send complete");
            })

        }
        catch (ex) {
            console.log(ex);
        }
    }


    // main function for starting point
    async function main() {
        if (navigator.serviceWorker) {
            const username = getCookie("username");
            const tokenId = getCookie("tokenId");
            if (username !== "" && tokenId !== "") {
                await subscribe(username, tokenId);
            }
            else console.error("Token cookie not found");
        }
        else {
            console.error("service worker not suppoted");
        }
    }

    // start
    setCookie("username", "nahid", 1);
    setCookie("tokenId", "nahid1234");
    main();

});

