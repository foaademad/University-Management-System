
 //* give event margin left if dir arabic * */
 let days = document.getElementsByClassName('day');

 // تحقق مما إذا كانت القيمة 'rtl'
 if ( localStorage.getItem("language") || "en" === 'rtl') {
     for (let i = 0; i < days.length; i++) {
         days[i].style.marginLeft="20px"; // تطبيق الـ margin left إذا كانت الاتجاه 'rtl'
     }
 }

// ==============================================================================================================
//  database for tranning 

let dbTraining;
let trainingCartona = []; // تعديل اسم المتغير

const dbTrainings = new Promise((resolve, reject) => {
    const request = indexedDB.open("trainingDatabase", 1);

    request.onerror = function (event) {
        console.error("خطأ في فتح قاعدة البيانات:", event);
        reject(event.target.error);
    };

    request.onsuccess = function (event) {
        dbTraining = event.target.result;
        console.log("تم فتح قاعدة البيانات بنجاح");
        resolve(dbTraining);
    };

    request.onupgradeneeded = function (event) {
        dbTraining = event.target.result;
        const trainingStore = dbTraining.createObjectStore("training", {
            keyPath: "id",
            autoIncrement: true,
        });
    };
});

function addTraining() {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const trainingName = document.getElementById("TrainingName").value;
    const trainingDay = document.getElementById("Day").value;
    const trainingTime = document.getElementById("Time").value;

    if (!trainingName || !trainingDay || !trainingTime) {
        alert("Please fill out all fields.");
        return;
    }

    dbTrainings.then((dbTraining) => {
        const transaction = dbTraining.transaction("training", "readwrite");
        const trainingsStore = transaction.objectStore("training");

        const newTraining = { 
            name: trainingName, 
            date: trainingDay, 
            time: trainingTime 
        };

        const addRequest = trainingsStore.add(newTraining);

        addRequest.onsuccess = function () {
            console.log("Training added successfully:", newTraining);
            fetchTraining();
        };

        document.getElementById("TrainingName").value = "";
        document.getElementById("Day").value = "";
        document.getElementById("Time").value = "";

        toggleTrainingForm();

        addRequest.onerror = function (event) {
            console.error("Error adding training:", event.target.error);
        };
    });
}

function toggleTrainingForm() {
    const modal = document.getElementById("TrainingForm");

    if (!modal) {
        console.error("TrainingForm not found in the DOM");
        return;
    }

    modal.style.display = (modal.style.display === "none" || modal.style.display === "") 
        ? "block" 
        : "none";
}


function fetchTraining() {
    dbTrainings.then((dbTraining) => {
        const transaction = dbTraining.transaction('training', 'readonly');
        const trainingObjectStore = transaction.objectStore('training');

        const trainingRequest = trainingObjectStore.getAll();

        trainingRequest.onsuccess = function (event) {
            console.log(event.target.result);
            let dataTraining = event.target.result;
            trainingCartona = dataTraining;
            document.getElementById("TotalTrainings").textContent = dataTraining.length;
            displayTraining(event.target.result);
        };

        trainingRequest.onerror = function (event) {
            console.error("حدث خطأ في جلب التدريب:", event.target.error);
        };
    }).catch((error) => {
        console.error("خطأ في فتح قاعدة البيانات:", error);
    });
}
fetchTraining();

function displayTraining(trainings) {
    const trainingList = document.getElementById("trainingList");
    trainingList.innerHTML = "";

    trainings.forEach(training => {
        const card = document.createElement("div");
        card.className = "training-card";

        const daySection = document.createElement("div");
        daySection.className = "day-section";

        const dayName = document.createElement("div");
        dayName.className = "day-name";
        dayName.textContent = new Date(training.date).toLocaleString('en-US', { weekday: 'short' });

        const dayNumber = document.createElement("div");
        dayNumber.className = "day-number";
        dayNumber.textContent = new Date(training.date).getDate();

        daySection.appendChild(dayName);
        daySection.appendChild(dayNumber);

        const contentSection = document.createElement("div");
        contentSection.className = "content-section";

        const trainingTitle = document.createElement("h3");
        trainingTitle.className = "training-title";
        trainingTitle.textContent = training.name;

        const timeInfo = document.createElement("p");
        timeInfo.className = "training-time";
        timeInfo.innerHTML = `<i class="fas fa-clock"></i> ${training.time}`;

        const meetingIcon = document.createElement("p");
        meetingIcon.className = "meeting-icon";
        meetingIcon.innerHTML = `<i class="fas fa-video"></i> Google Meeting`;

        contentSection.appendChild(trainingTitle);
        contentSection.appendChild(timeInfo);
        contentSection.appendChild(meetingIcon);

        card.appendChild(daySection);
        card.appendChild(contentSection);

        trainingList.appendChild(card);
    });
}

function filterTrainingsByDate() {
    const selectedDate = document.getElementById("filterDate").value;

    fetchAllTrainings().then((trainings) => {
        const filteredTrainings = trainings.filter((training) => training.date === selectedDate);
        displayTraining(filteredTrainings);
    }).catch((error) => {
        console.error("Error in filtering trainings:", error);
    });
}

function fetchAllTrainings() {
    return dbTrainings.then((dbTraining) => {
        const transaction = dbTraining.transaction("training", "readonly");
        const trainingsStore = transaction.objectStore("training");

        return new Promise((resolve, reject) => {
            const request = trainingsStore.getAll();

            request.onsuccess = function (event) {
                resolve(event.target.result);
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    });
}
