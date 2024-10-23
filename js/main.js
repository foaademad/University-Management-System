
 //* give event margin left if dir arabic * */
 let days = document.getElementsByClassName('day');

 // تحقق مما إذا كانت القيمة 'rtl'
 if ( localStorage.getItem("language") || "en" === 'rtl') {
     for (let i = 0; i < days.length; i++) {
         days[i].style.marginLeft="20px"; // تطبيق الـ margin left إذا كانت الاتجاه 'rtl'
     }
 }

