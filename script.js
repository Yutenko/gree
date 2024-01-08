const canvas = document.getElementById('canvas'); // Stellen Sie sicher, dass Ihr Canvas-Element die ID 'canvas' hat
const ctx = canvas.getContext('2d');
const size = 320; // Größe des Canvas
const minSize = size * 0.3; // Minimale Größe der Dreieckseiten
const maxSize = size * 0.5; // Maximale Größe der Dreieckseiten
let trainingsDaten = [];
let trainingsLabels = [];
const submitGuessButton = document.getElementById('submitGuessButton');
const angleInput = document.getElementById('angle-input');
const output = document.getElementById('output');
const datasets = document.getElementById('datasets');
let counter = 0;
let p1, p2, p3; // Globale Variablen für die Dreieckspunkte
let currentAngle = 0;
let trained = false;
let prediction = "";

const buttons = {
    a: document.querySelector('.button--a'),
    b: document.querySelector('.button--b'),
    c: document.querySelector('.button--c')
}


buttons.a.addEventListener('click', () => {
    trainiereModell(modell, trainingsDaten, trainingsLabels);
});

buttons.b.addEventListener('click', poop.clean);
buttons.c.addEventListener('click', poop.clean);
output.addEventListener('click', reset);


// TensorFlow.js Modell initialisieren
const modell = tf.sequential();
modell.add(tf.layers.dense({ units: 1, inputShape: [6] }));
modell.compile({
    loss: 'meanSquaredError',
    optimizer: 'sgd'
});



async function trainiereModell(modell, trainingsDaten, trainingsLabels) {
    const xs = tf.tensor2d(trainingsDaten);
    const ys = tf.tensor1d(trainingsLabels);
    await modell.fit(xs, ys, {
        epochs: 100
    });
    console.log('Modell ist trainiert.');
    poop.scoreDisplay.innerHTML = "Modell ist trainiert an " + trainingsLabels.length + " Datensätzen.";
    trained = true;
}

submitGuessButton.addEventListener('click', async () => {
    counter++
    datasets.innerHTML = counter
    const guessedAngle = parseFloat(angleInput.value);
    sammleDaten(p1, p2, p3, guessedAngle); // Aktualisiert, um die Dreieckspunkte zu speichern
    await vorhersageMachen(p1, p2, p3)
    output.innerHTML = `Geschätzter Winkel: ${guessedAngle}° 
    <br/> Tatsächlicher Winkel: ${parseInt(currentAngle)}°
    ${(trained ? "<br/> Vorhergesagter Winkel: <span id='prediction'></span>°" : "")}
    <span id="refreshButton" class="refresh-symbol">&#x21bb;</span> `;

});

function reset() {
    //reset 
    output.innerHTML = "";
    angleInput.value = "";
    drawRandomTriangle();
}

// Funktion, um eine Vorhersage mit dem Modell zu treffen
async function vorhersageMachen(p1, p2, p3) {
    // Normalisiere die Punkte, wie zuvor erklärt
    const eingabe = [p1.x, p1.y, p2.x, p2.y, p3.x, p3.y].map(x => x / size);

    // Umwandlung der Punkte in einen Tensor
    const eingabeTensor = tf.tensor2d([eingabe]);

    // Nutze das Modell, um den Winkel zu schätzen
    const vorhersage = modell.predict(eingabeTensor);

    // Konvertiere den Tensor zurück in einen für uns nützlichen Wert
    vorhersage.data().then(vorhersageWinkel => {
        // Rückumwandlung der normalisierten Vorhersage in Grad
        const vorhersageInGrad = vorhersageWinkel[0] * 180;
        prediction = vorhersageInGrad.toFixed(2)
        var d = document.getElementById('prediction')
        if (d) d.innerHTML = prediction
        console.log(`Vorhergesagter Winkel: ${vorhersageInGrad.toFixed(2)} Grad`);
    }).catch(error => {
        console.error('Fehler bei der Vorhersage:', error);
    });
}

// ...

// Funktion zum Sammeln der Trainingsdaten
function sammleDaten(p1, p2, p3, geschaetzterWinkel) {
    // Normalisiere die Punkte, wie zuvor erklärt
    const eingabe = [p1.x, p1.y, p2.x, p2.y, p3.x, p3.y].map(x => x / size);

    // Füge die normalisierten Punkte und den geschätzten Winkel zu den Trainingsdaten hinzu
    trainingsDaten.push(eingabe);
    // Winkel normalisieren, indem sie durch 180 geteilt werden, um sie zwischen 0 und 1 zu skalieren
    trainingsLabels.push(geschaetzterWinkel / 180);
}





function drawRandomTriangle() {
    // Zuerst löschen wir den aktuellen Inhalt des Canvas
    ctx.clearRect(0, 0, size, size);

    // Generiere drei zufällige Punkte innerhalb der Grenzen des Canvas
    // Generiere drei zufällige Punkte innerhalb der Grenzen des Canvas
    // Die Punkte werden so gewählt, dass sie ein größeres Dreieck bilden
    const points = [];
    while (points.length < 3) {
        points.push({
            x: Math.random() * (size - minSize * 2) + minSize,
            y: Math.random() * (size - minSize * 2) + minSize
        });
        if (points.length === 3) {
            // Überprüfe, ob das Dreieck groß genug ist
            const a = calculateDistance(points[0], points[1]);
            const b = calculateDistance(points[1], points[2]);
            const c = calculateDistance(points[2], points[0]);
            if (a < minSize || b < minSize || c < minSize) {
                points.length = 0; // Reset und erneut versuchen
            }
        }
    }



    // Zeichne das Dreieck
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < 3; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    // Fülle das Dreieck mit einer Farbe
    ctx.fillStyle = '#FFD700';
    ctx.fill();

    // Zeichne die Umrandung des Dreiecks
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    highlightSmallestAngle(points);
    // Gebe den Winkel in Grad zurück
    const anglePointIndex = Math.floor(Math.random() * 3);
    const anglePoint = points[anglePointIndex];
    p1 = points[(anglePointIndex + 1) % 3];
    p2 = points[(anglePointIndex + 2) % 3];
    p3 = points[(anglePointIndex + 3) % 3];

    // Berechne den Winkel in Radiant
    const angle = calculateAngle(anglePoint, p1, p2);
    currentAngle = angle.degrees;
    return currentAngle;
}





// Zeichne den Bogen für den kleinsten Winkel im Dreieck
function drawAngleArc(anglePoint, p1, p2, radius) {
    // Berechne den Winkel in Radiant
    const angle = calculateAngle(anglePoint, p1, p2);
    // Finde den kleinsten Winkel und passe den Radius entsprechend an, um den Bogen innerhalb des Dreiecks zu halten
    const smallestSide = Math.min(
        calculateDistance(anglePoint, p1),
        calculateDistance(anglePoint, p2)
    );
    const arcRadius = Math.min(radius, smallestSide / 2);

    // Zeichne den Bogen für den Winkel
    ctx.beginPath();
    ctx.arc(anglePoint.x, anglePoint.y, arcRadius, angle.start, angle.end, false);
    ctx.lineTo(anglePoint.x, anglePoint.y);
    ctx.closePath();

    // Fülle den Sektor
    ctx.fillStyle = '#FF0000'; // Rot für die Hervorhebung
    ctx.fill();
}

// Verwende diese Funktion, um den kleinsten Winkel im Dreieck zu zeichnen
function highlightSmallestAngle(points) {
    const angles = [
        calculateAngle(points[0], points[1], points[2]),
        calculateAngle(points[1], points[2], points[0]),
        calculateAngle(points[2], points[0], points[1])
    ];
    const smallestAngle = angles.reduce((min, angle) => angle.radians < min.radians ? angle : min, angles[0]);
    drawAngleArc(points[angles.indexOf(smallestAngle)], points[(angles.indexOf(smallestAngle) + 1) % 3], points[(angles.indexOf(smallestAngle) + 2) % 3], 20);
}

// Berechne den Winkel zwischen den Punkten
function calculateAngle(p0, p1, p2) {
    const a = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
    const b = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    const c = Math.sqrt(Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2));
    const angle = Math.acos((a * a + c * c - b * b) / (2 * a * c));
    return {
        radians: angle,
        degrees: angle * (180 / Math.PI),
        start: Math.atan2(p1.y - p0.y, p1.x - p0.x),
        end: Math.atan2(p2.y - p0.y, p2.x - p0.x)
    };
}

// Hilfsfunktion zum Berechnen der Distanz zwischen zwei Punkten
function calculateDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Zeichne ein zufälliges Dreieck beim Laden der Seite
window.onload = drawRandomTriangle;

// Optional: Zeichne ein neues Dreieck, wenn auf das Canvas geklickt wird
canvas.addEventListener('click', reset);





