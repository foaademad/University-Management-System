



// // ========================================================

// let db;

// const request = indexedDB.open("UniversityDB", 1); // تأكد من أنك تستخدم الإصدار الصحيح

// request.onupgradeneeded = function(event) {
//     db = event.target.result;

//     // إنشاء متجر بيانات الطلاب
//     if (!db.objectStoreNames.contains("Students")) {
//         const studentStore = db.createObjectStore("Students", { keyPath: "id", autoIncrement: true });
//         studentStore.createIndex("name", "name", { unique: false });
//         // studentStore.createIndex("result", "result", { unique: false });
//         // studentStore.createIndex("performance", "performance", { unique: false });
//     }
// };

// request.onsuccess = function(event) {
//     db = event.target.result; // Assign the database instance to the db variable
//     displayAllStudents(); // Display existing students
//     updateStatistics() 
// };

// request.onerror = function(event) {
//     console.error("Database error: ", event.target.errorCode);
// };





// function toggleStudentForm() {
//     const studentForm = document.getElementById("studentForm");

//     // Toggle the display between block and none
//     if (studentForm.style.display === "none" || studentForm.style.display === "") {
//         studentForm.style.display = "block"; // Show the form
//     } else {
//         studentForm.style.display = "none"; // Hide the form
//     }
// }

// // Add event listener to the "+" button to toggle the form
// document.getElementById("openFormBtn").addEventListener("click", toggleStudentForm);
// // Add event listener to the "Close" button to hide the form
// document.getElementById("closeFormBtn").addEventListener("click", function() {
//     document.getElementById("studentForm").style.display = "none"; // Hide the form when "Close" is clicked
// });

// document.addEventListener("DOMContentLoaded", function() {
//     // الكود الذي يضيف event listeners هنا
//     document.getElementById("openStudentFormBtn").addEventListener("click", function() {
//         toggleForm("studentForm");
//     });

//     document.getElementById("closeStudentFormBtn").addEventListener("click", function() {
//         document.getElementById("studentForm").style.display = "none";
//     });

// })

// function addStudent(event) {
//     event.preventDefault(); // منع إرسال الفورم تلقائياً
//     const studentName = document.getElementById("studentName").value;
//     const studentResult = document.getElementById("StudentResult").value;
//     const studentPerformance = document.getElementById("StudentPerformance").value;

//     // التحقق من أن جميع الحقول معبأة
//     if (!studentName || !studentResult || !studentPerformance) {
//         alert("Please fill in all fields.");
//         return;
//     }

//     if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(studentName)) {
//         alert('Please enter a valid name containing only letters.');
//         studentName.focus(); // إعادة التركيز على حقل الاسم
//         return;
//     }
    
//     const transaction = db.transaction(["Students"], "readwrite");
//     const studentStore = transaction.objectStore("Students");

//     const student = {
//         name: studentName,
//         result: studentResult,
//         performance: studentPerformance
//     };

//     const request = studentStore.add(student);

//     request.onsuccess = function() {
//         document.getElementById("studentName").value = "";
//         document.getElementById("StudentResult").value = "";
//         document.getElementById("StudentPerformance").value = "";
//         displayAllStudents() // عرض الطلاب بعد الإضافة
//         updateStatistics()
//        // إخفاء نموذج إضافة الطلاب
//        toggleStudentForm();
//     };

//     request.onerror = function(event) {
//         console.error("Error adding student: ", event.target.errorCode);
//     };
    
// }

// function displayAllStudents() {
//     if (!db) { // تأكد من أن db معرف
//         console.error("Database connection is not available.");
//         return; // قم بإيقاف التنفيذ إذا لم يكن db متاحًا
//     }
//     const transaction = db.transaction(["Students"], "readonly");
//     const studentStore = transaction.objectStore("Students");
//     const request = studentStore.getAll();

//     request.onsuccess = function(event) {
//         const students = event.target.result;
//         const studentTableBody = document.querySelector("#studentTable tbody");
//         studentTableBody.innerHTML = ""; // تفريغ الجدول

//         if (students.length > 0) {
//             students.forEach(student => {
//                 const row = document.createElement("tr");

//                 row.innerHTML = `
//                     <td>${student.id}</td>
//                     <td>${student.name}</td>
//                     <td>${student.result}</td>
//                     <td>${student.performance}</td>
//                     <td><button class="btn btn-danger">حذف</button></td>
//                 `;

//                 studentTableBody.appendChild(row);
//             });
//         } else {
//             const row = document.createElement("tr");
//             row.innerHTML = `<td colspan="5">لا يوجد طلاب لعرضهم.</td>`;
//             studentTableBody.appendChild(row);
//         }
//     };
// }

// // =====================================================================================================
//  // delete studentlist

// document.addEventListener('DOMContentLoaded', function() {
//     const tbodyElement = document.getElementById('tbody');
//     if (tbodyElement) {
//         tbodyElement.addEventListener('click', function(event) {
//             if (event.target.classList.contains('btn-danger')) {
//                 // الكود الخاص بحذف الصف
//                 const row = event.target.parentElement.parentElement;
//                 const studentId = parseInt(row.cells[0].textContent, 10); // استخراج ID الطالب من العمود الأول
        
//                 // إنشاء معاملة لحذف الطالب من IndexedDB
//                 const transaction = db.transaction(["Students"], "readwrite");
//                 const studentStore = transaction.objectStore("Students");
        
//                 // طلب حذف الطالب
//                 const deleteRequest = studentStore.delete(studentId);
        
//                 deleteRequest.onsuccess = function() {
//                     console.log(`Student with ID ${studentId} has been deleted.`);
        
//                     // تحديث عرض الطلاب بعد الحذف
//                     displayAllStudents()
//                 };
        
//                 deleteRequest.onerror = function(event) {
//                     console.error("Error deleting student: ", event.target.errorCode);
//                 };
//             }
//             updateStatistics()
//         });
        
//     } else {
//         console.error('Element with ID "tbody" not found.');
//     }
// });
// // =============================================================================================

// // search the table by name
// document.getElementById('search').addEventListener('keyup', function () {
//     var searchValue = this.value.toLowerCase();

//     // الحصول على جميع الطلاب من IndexedDB
//     const transaction = db.transaction(["Students"], "readonly");
//     const studentStore = transaction.objectStore("Students");
//     const request = studentStore.getAll();

//     request.onsuccess = function(event) {
//         const students = event.target.result; // الحصول على جميع الطلاب

//         // تصفية الطلاب بناءً على قيمة البحث
//         const filteredStudents = students.filter(student => {
//             return student.name.toLowerCase().indexOf(searchValue) > -1; // تحقق من اسم الطالب
//         });

//         // عرض الطلاب المصفين في الجدول
//         displayFilteredStudents(filteredStudents);
//     };

//     request.onerror = function(event) {
//         console.error("Error retrieving students: ", event.target.errorCode);
//     };
// });

// // دالة لعرض الطلاب المصفين
// function displayFilteredStudents(filteredStudents) {
//     const studentTableBody = document.querySelector("#studentTable tbody");
//     studentTableBody.innerHTML = ""; // تفريغ الجدول

//     filteredStudents.forEach(student => {
//         const row = document.createElement("tr");

//         row.innerHTML = `
//             <td>${student.id}</td>
//             <td>${student.name}</td>
//             <td>${student.result}</td>
//             <td>${student.performance}</td>
//             <td><button class="btn btn-danger">حذف</button></td>
//         `;

//         studentTableBody.appendChild(row);
//     });
// }
// // ==================================================================================
// // filter 
// // إضافة حدث click للزر
// document.getElementById("filterButton").addEventListener("click", filterStudents);
// // filter students based on result
// function filterStudents() {
//     // الحصول على جميع الطلاب من IndexedDB
//     const transaction = db.transaction(["Students"], "readonly");
//     const studentStore = transaction.objectStore("Students");
//     const request = studentStore.getAll();

//     request.onsuccess = function(event) {
//         const students = event.target.result; // الحصول على جميع الطلاب

//         // تصفية الطلاب الناجحين فقط
//         const filteredStudents = students.filter(student => student.result >= 60);

//         // إذا لم يوجد طلاب ناجحين، عرض جميع الطلاب
//         if (filteredStudents.length === 0) {
//             displayStudents(students); // عرض جميع الطلاب
//         } else {
//             // عرض الطلاب المصفين
//             displayStudents(filteredStudents);
//         }
//     };

//     request.onerror = function(event) {
//         console.error("Error retrieving students: ", event.target.errorCode);
//     };
// }


// // دالة لعرض الطلاب المصفين
// function displayStudents(filteredStudents) {
//     const studentTableBody = document.querySelector("#studentTable tbody");
//     studentTableBody.innerHTML = ""; // تفريغ الجدول

//     // تحقق مما إذا كان هناك طلاب مصفّين
//     if (filteredStudents && filteredStudents.length > 0) {
//         filteredStudents.forEach(student => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${student.id}</td>
//                 <td>${student.name}</td>
//                 <td>${student.result}</td>
//                 <td>${student.performance}</td>
//                 <td><button class="btn btn-danger">حذف</button></td>
//             `;

//             studentTableBody.appendChild(row);
//         });
//     }  else {
//         // عرض رسالة عند عدم وجود طلاب ناجحين
//         const row = document.createElement("tr");
//         row.innerHTML = `<td colspan="5">لا توجد طلاب ناجحين.</td>`;
//         studentTableBody.appendChild(row);
//     }
// }

// // ===============================================================================================

// // إضافة حدث click للزر
// document.getElementById("sortButton").addEventListener("click", sortStudentsAZ);

// // دالة لفرز الطلاب من A-Z
// function sortStudentsAZ() {
//     // الحصول على جميع الطلاب من IndexedDB
//     const transaction = db.transaction(["Students"], "readonly");
//     const studentStore = transaction.objectStore("Students");
//     const request = studentStore.getAll();

//     request.onsuccess = function(event) {
//         const students = event.target.result;
//           // إذا لم يوجد طلاب، لا تفعل شيئاً
//         if (students.length === 0) {
//             console.log("No students available for sorting.");
//             return;
//         }

//         // فرز الطلاب بناءً على الاسم بترتيب أبجدي
//         students.sort((a, b) => a.name.localeCompare(b.name));

//         // عرض الطلاب بعد الفرز
//         displayStudents(students);
//     };

//     request.onerror = function(event) {
//         console.error("Error retrieving students: ", event.target.errorCode);
//     };
// }


// // دالة لعرض الطلاب
// function displayStudents(students) {
//     const studentTableBody = document.querySelector("#studentTable tbody");
//     studentTableBody.innerHTML = ""; // تفريغ الجدول

//     if (students && students.length > 0) {
//         students.forEach(student => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${student.id}</td>
//                 <td>${student.name}</td>
//                 <td>${student.result}</td>
//                 <td>${student.performance}</td>
//                 <td><button class="btn btn-danger">حذف</button></td>
//             `;

//             studentTableBody.appendChild(row);
//         });
//     } else {
//         // عرض رسالة إذا لم يكن هناك طلاب
//         const row = document.createElement("tr");
//         row.innerHTML = `<td colspan="5">لا يوجد طلاب لعرضهم.</td>`;
//         studentTableBody.appendChild(row);
//     }
// }



// // ========================================================================================

// function updateStatistics() {

//     const studentTransaction = db.transaction(["Students"], "readonly");
//     const studentStore = studentTransaction.objectStore("Students");

//     const studentRequest = studentStore.count();

//     studentRequest.onsuccess = function(event) {
//         document.getElementById("totalStudents").textContent = event.target.result; // Update total students count
//     };

// }





let db;
let rahemclient = [] 



const dbPromise = new Promise((resolve, reject) => {
const request = indexedDB.open("IDBDatabase", 1);

request.onerror = function (event) {
    console.error("خطأ في فتح قاعدة البيانات:", event);
    reject(event.target.error);
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("تم فتح قاعدة البيانات بنجاح");
    resolve(db);
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    const doctorStore = db.createObjectStore("client", {
    keyPath: "id",
    autoIncrement: true,
    });
    // doctorStore.createIndex("email", "email", {
    // unique: false,
    // });


}

})




function addClient() {
event.preventDefault();
const studentName = document.getElementById("studentName").value;
const StudentResult = document.getElementById("StudentResult").value;
const StudentPerformance = document.getElementById("StudentPerformance").value;

if (!studentName || !StudentResult || !StudentPerformance ) {
    alert("Please fill out all fields.");
    return;
}

dbPromise.then((db) => {
    const transaction = db.transaction("client", "readwrite");
    const clientStore = transaction.objectStore("client");

    const newClient = { 
        name: studentName, 
        result: StudentResult,
        performance: StudentPerformance 
    };

    const addRequest = clientStore.add(newClient); // استخدم add لإضافة بيانات جديدة دائماً

    addRequest.onsuccess = function () {
        console.log("تمت إضافة العميل بنجاح:", newClient);
        fetchDoctorsDentistry();  // تحديث القائمة هنا
    };

    addRequest.onerror = function (event) {
        console.error("خطأ في إضافة العميل:", event.target.error);
    };
});
// empty the input

document.getElementById("studentName").value = "";
document.getElementById("StudentResult").value = "";
document.getElementById("StudentPerformance").value = "";

close ()

}

// Function to display the list of client
function fetchDoctorsDentistry() {
dbPromise.then((db) => {
    const transaction = db.transaction('client', 'readonly');
    const doctorObjectStore = transaction.objectStore('client');

    const dentistDoctors = doctorObjectStore.getAll();

    dentistDoctors.onsuccess = function (event) {
        console.log(event.target.result)

    let dataClient = event.target.result

    rahemclient = dataClient
        document.getElementById("totalStudents").textContent = dataClient.length
        displayClients(event.target.result)
    };

    dentistDoctors.onerror = function (event) {
        console.error("حدث خطأ في جلب دكاترة الأسنان:", event.target.error);
    };
}).catch((error) => {
    console.error("خطأ في فتح قاعدة البيانات:", error);
});
}
fetchDoctorsDentistry();




function displayClients(clients) {
    clientList.innerHTML = "";  // إفراغ القائمة قبل إعادة العرض
    clients.map(client => {
        const card = document.createElement("div");
        card.className = "card-show";
        card.dataset.clientId = client.id; // إضافة data-client-id

       
        const cardBody = document.createElement("div");
        cardBody.className = "small-card-body";

        const name = document.createElement("p");
        name.className = "card-email";
        name.textContent = `Name: ${client.name}`;

        const result = document.createElement("p");
        result.className = "card-password";
        result.textContent = `Result: ${client.result}`;

        const performance = document.createElement("p");
        performance.className = "card-password";
        performance.textContent = `Student performance: ${client.performance}`;


        cardBody.appendChild(name);
        cardBody.appendChild(result);
        cardBody.appendChild(performance);

        // إنشاء زر التحديث والحذف
        const cardActions = document.createElement("div");
        cardActions.className = "card-show-actions";

        // تعريف زر التعديل
        const editBtn = document.createElement("button");
        editBtn.className = "refresh-btn";
        editBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
         // تعديل معلومات الطلاب
        editBtn.addEventListener("click", () => {
            // فتح النافذة التي سيتم تعديل المعلومات
            const modal = document.getElementById("studentForm");
            modal.style.display = "block";
            document.getElementById("studentName").value = client.name;
            document.getElementById("StudentResult").value = client.result;
            document.getElementById("StudentPerformance").value = client.performance;

            // ��نشا�� ��ر الحف��
            const updateBtn = document.getElementById("updateBtn");
            const addBTn = document.getElementById("add-student-btn");
            addBTn.style.display = "none";
            updateBtn.style.display = "block";
            // حفظ معرف الطالب في زر التحديث
            updateBtn.dataset.clientId = client.id; // حفظ id الطالب في data-client-id
  
               // إضافة حدث زر التحديث
         updateBtn.addEventListener("click", (event) => {
            const clientId = event.target.dataset.clientId; // استرجاع معرف الطالب من data-client-id
            
            if (!clientId) {
                console.error("الطالب ID غير موجود أو غير صالح:", clientId);
                return;
            }

            dbPromise.then((db) => {
                const transaction = db.transaction("client", "readwrite");
                const clientStore = transaction.objectStore("client");
                
                // جلب الطالب المحدد من قاعدة البيانات
                const clientToUpdateRequest = clientStore.get(parseInt(clientId));
                
                clientToUpdateRequest.onsuccess = function (event) {
                    const clientToUpdate = event.target.result; // الكائن الفعلي للطالب

                    // تحديث بيانات الطالب
                    clientToUpdate.result = document.getElementById("StudentResult").value;
                    clientToUpdate.performance = document.getElementById("StudentPerformance").value;

                    // وضع الطالب المحدث في قاعدة البيانات
                    const updateRequest = clientStore.put(clientToUpdate);

                    updateRequest.onsuccess = function () {
                        console.log("تم تحديث الطالب بنجاح:", clientToUpdate);
                        modal.style.display = "none"; // إخفاء الـ modal بعد التحديث
                        fetchDoctorsDentistry(); // إعادة جلب القائمة المحدثة
                    };

                    updateRequest.onerror = function (event) {
                        console.error("خطأ في تحديث الطالب:", event.target.error);
                    };
                };

                clientToUpdateRequest.onerror = function (event) {
                    console.error("خطأ في جلب الطالب:", event.target.error);
                };

                transaction.oncomplete = function () {
                    console.log("تمت عملية التحديث بنجاح");
                };

                transaction.onerror = function (event) {
                    console.error("خطأ في عملية التحديث:", event.target.error);
                };
            });
        });

            
                   
             


























                // ��لغا�� النافذة التي سيتم تعديل المعلومات
                const closeBtn = document.getElementById("closeFormBtn");
                closeBtn.addEventListener("click", () => {
                    modal.style.display = "none";
                });
                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                };
            });



        // تعريف زر الحذف
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            // حذف الطلاب
            deleteBtn.addEventListener("click", () => {
                if (confirm("Do you want to delete the student?")) {
                    dbPromise.then((db) => {
                        const transaction = db.transaction("client", "readwrite");
                        const clientStore = transaction.objectStore("client");
                        const clientToDelete = clientStore.get(client.id);
                        clientToDelete.onsuccess = function (event) {
                            clientStore.delete(event.target.result.id);
                            console.log("تم حذف الطالب بنجا��:", event.target.result);
                            fetchDoctorsDentistry();
                        };
                        clientToDelete.onerror = function (event) {
                            console.error("خطأ في حذف الطالب:", event.target.error);
                        };
                        transaction.oncomplete = function () {
                            console.log("تم حذف الطالب بنجا��");
                        };
                        transaction.onerror = function (event) {
                            console.error("خطأ في عملية الحذف:", event.target.error);
                        };

                    });
                }});

        // إضافة الأزرار إلى cardActions
        cardActions.appendChild(editBtn);
        cardActions.appendChild(deleteBtn);

        // إضافة محتويات البطاقة والأزرار إلى البطاقة الرئيسية
        card.appendChild(cardBody);
        card.appendChild(cardActions);

        // إضافة البطاقة إلى القائمة
        clientList.appendChild(card);
    });

}

function updateStatistics() {


    const clientTransaction = db.transaction(["client"], "readonly");
    const clientStore = clientTransaction.objectStore("client");
    const clientRequest = clientStore.count();

    clientRequest.onsuccess = function(event) {
        document.getElementById("totalStudents").textContent = event.target.result; // Update total courses count
    };
}

// إضافة حدث click للزر
document.getElementById("sortButton").addEventListener("click", sortStudentsAZ);

// دالة لفرز الطلاب 
        function sortStudentsAZ() {
            rahemclient.sort((a, b) => a.name.localeCompare(b.name));
            console.log("sort students");
            
            displayClients(rahemclient);
        }

// search the name


document.getElementById("search").addEventListener("input", filterStudents);
    function filterStudents() {
        const searchTerm = document.getElementById("search").value.toLowerCase();
        const filteredStudents = rahemclient.filter(student => student.name.toLowerCase().includes(searchTerm));
        displayClients(filteredStudents);
    }
    
    
        // حذف الطلاب
    function deleteStudent(id) {
        dbPromise.then((db) => {
            const transaction = db.transaction('client', 'readwrite');
            const clientStore = transaction.objectStore('client');
            clientStore.delete(id);
            transaction.oncomplete = function () {
                console.log('تم حذف الطالب بنجا��');
                fetchDoctorsDentistry();
            };
            transaction.onerror = function (event) {
                console.error('حدث خطأ في حذف الطالب:', event.target.error);
            };


        }).catch((error) => {
            console.error('خطأ في فتح قا��دة البيانات:', error);
        });
    }