// Sucht die IP-Adresse des Server im lokalen Netzwerk.
// Wenn gefunden, verbinde direkt mit dem WBS-Interface



var portToCheck = 5000;
var timeout = 500; // Milliseconds
var delay = 10; // Milliseconds
var totalRequests = 255; // Gesamtanzahl der Anfragen
var requestsCompleted = 0; // Zählervariable für abgeschlossene Anfragen
var serverIP = null; // Gefundene IP-Adresse des Servers
var testNummer = 1 // Versuchsebene



// sucht eine eingegebene Server-IP
function checkServerIP(ip) {
    let url = "http://" + ip + ":" + portToCheck + "/check";

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            requestsCompleted++;
            // überprüfe ob schon eine Adresse gefunden wurde
            if (serverIP != null) { return }
            if (xhr.status === 200) {
                serverIP = ip
            }
            // Überprüfen, ob alle Anfragen abgeschlossen sind
            if (requestsCompleted === totalRequests) {
                allRequestsCompleted();
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.timeout = timeout;
    xhr.send();
}



// Sucht ob eine Server-IP gefunden wurde
function CheckForIp() {
    if (serverIP != null) {
        ipGefunden(serverIP)
        return
    }
    setTimeout(CheckForIp, 100)
}


// Wenn alle IP-Adressen einer Ebene ohne Erfolg durchgelaufen sind
// erhöhe auf nächste Ebene
function allRequestsCompleted() {
    testNummer++
    testMuster(testNummer)
}


function ipGefunden(serverIP) {
    console.log("Server gefunden unter: " + serverIP)
    document.getElementById("userInterface").style.display = "none"
    document.getElementsByTagName("iframe")[0].src = "http://" + serverIP + ":" + portToCheck
}






// Versucht die IP-Adressen nach den warscheinlichsten Host-IPs zu finden
function testMuster(nummer) {

    function testIP(baseIP) {
        requestsCompleted = 0
        for (let i = 1; i <= 255; i++) {
            if (serverIP != null) { return }
            let ipToCheck = baseIP + i;
            setTimeout(checkServerIP.bind(null, ipToCheck), i * delay);
        }
    }


    switch (nummer) {
        case 1: testIP("192.168.178."); break   // Fritz-Box Default
        case 2: testIP("192.168.0."); break
        case 3: testIP("192.168.1."); break
        case 4: testIP("192.168.2."); break
        case 5: testIP("10.0.0."); break
        default: console.log("Server nicht gefunden...")
    }
}




CheckForIp()
testMuster(testNummer)