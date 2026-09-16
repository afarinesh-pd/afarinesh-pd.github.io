const API_URL = "https://afarinesh-api.parsababalo1403.workers.dev";

document.addEventListener("DOMContentLoaded", function () {
    
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const navLinks = document.querySelector(".nav-links");

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener("click", function () {
            navLinks.classList.toggle("active");
            
            // انیمیشن ساده دکمه همبرگری
            this.classList.toggle("open");
        });

        // بستن منو پس از کلیک روی هر لینک
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }
    // ۱. فرآیند ثبت‌نام آنلاین (با پشتیبانی کامل از پرونده ۱۰ فیلدی)
const registerForm = document.getElementById("melalRegisterForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const firstName = document.getElementById("firstName")?.value.trim() || "";
        const lastName = document.getElementById("lastName")?.value.trim() || "";
        const fatherName = document.getElementById("fatherName")?.value.trim() || "";
        const nationalId = document.getElementById("nationalId")?.value.trim() || "";
        const birthDate = document.getElementById("birthDate")?.value.trim() || "";
        const education = document.getElementById("education")?.value.trim() || "";
        const schoolName = document.getElementById("schoolName")?.value.trim() || "ثبت نشده";
        const phone = document.getElementById("phone")?.value.trim() || "";
        const address = document.getElementById("address")?.value.trim() || "";
        const ageCategory = document.getElementById("ageCategory")?.value || "";

        let amount = "";
        let categoryName = "";

        if (ageCategory === "kids") {
            amount = "۱,۴۸۰,۰۰۰ تومان";
            categoryName = "کودکان (Kids)";
        } else if (ageCategory === "teens") {
            amount = "۱,۵۸۰,۰۰۰ تومان";
            categoryName = "نوجوانان (Teens)";
        } else if (ageCategory === "adults") {
            amount = "۱,۶۸۰,۰۰۰ تومان";
            categoryName = "بزرگسالان (Adults)";
        }

        fetch(`${API_URL}/api/students/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName, lastName, fatherName, nationalId, birthDate,
                education, schoolName, phone, address,
                category: categoryName, fee: amount
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                alert(`پرونده ${firstName} ${lastName} با موفقیت ثبت گردید.`);
                registerForm.reset();
                window.location.href = "index.html";
            } else {
                const errorMsg = data.message || data.error || "پاسخ معتبری از سرور دریافت نشد.";
                alert("خطا در ثبت اطلاعات: " + errorMsg);
            }
        })
        // --------------------------------------------------------
        .catch(error => alert("خطا در برقراری ارتباط با سرور: " + error.message));
    });
}

                                  
    // اصلاح بخش ۲: ارسال درخواست تعیین سطح به سرور API (به جای LocalStorage)
const placementForm = document.getElementById("placementRequestForm") || document.getElementById("placementBookingForm");
if (placementForm) {
    placementForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const pName = (document.getElementById("plName") || document.getElementById("pName"))?.value.trim();
        const pPhone = (document.getElementById("plPhone") || document.getElementById("pPhone"))?.value.trim();
        const pNationalCode = document.getElementById("plNationalCode")?.value.trim() || "ثبت نشده";
        
        let pType = typeof selectedPlacementType !== "undefined" ? selectedPlacementType : "تلفنی";
        const pTypeEl = document.getElementById("pType");
        if (pTypeEl) {
            pType = pTypeEl.value === "phone" ? "تلفنی (۵ الی ۷ دقیقه)" : "حضوری (۵ الی ۷ دقیقه)";
        }

        let pAgeGroupText = "";
        const ageGroupEl = document.getElementById("plAgeGroup") || document.getElementById("pAgeGroup");
        if (ageGroupEl) {
            pAgeGroupText = ageGroupEl.options[ageGroupEl.selectedIndex]?.text || ageGroupEl.value;
        }

        // ارسال مستقیم به API کلادفلر
        fetch(`${API_URL}/api/placements/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: pName,
                phone: pPhone,
                nationalCode: pNationalCode,
                type: pType,
                ageGroup: pAgeGroupText
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success || data.id) {
                alert(`✅ درخواست تعیین سطح با موفقیت ثبت شد!`);
                placementForm.reset();
                window.location.href = "index.html";
            } else {
                alert("خطا در ثبت تعیین سطح: " + (data.message || "خطای نا مشخص"));
            }
        })
        .catch(err => alert("خطا در برقراری ارتباط با سرور: " + err.message));
    });
}

    // ۳. سیستم ورود (مدیریت یا زبان‌آموز)
    // جایگزین بخش بررسی ورود در script.js
const loginForm = document.getElementById("adminLoginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const usernameInput = document.getElementById("username").value.trim();
        const passwordInput = document.getElementById("password").value.trim();

        // ۱. ورود مدیر
        if (usernameInput === "admin123" && passwordInput === "paria405") {
            sessionStorage.setItem("admin_logged_in", "true");
            window.location.href = "admin-panel.html";
            return;
        }

        // ۲. بررسی ورود زبان‌آموز از طریق API کلادفلر
        fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem("user_logged_in", "true");
                sessionStorage.setItem("current_user_id", data.user.id);
                window.location.href = "user-panel.html";
            } else {
                alert("❌ نام کاربری یا رمز عبور اشتباه است!");
            }
        })
        .catch(error => {
            alert("خطا در برقراری ارتباط با سرور: " + error.message);
        });
});
}

    // ۴. لود داده‌ها در پنل مدیریت
    const studentTableBody = document.getElementById("studentTableBody");
    const approvedTableBody = document.getElementById("approvedTableBody");
    const placementTableBody = document.getElementById("placementTableBody");

    if (studentTableBody || approvedTableBody || placementTableBody) {
        if (sessionStorage.getItem("admin_logged_in") !== "true") {
            window.location.href = "admin-login.html";
            return;
        }

        // ۱. دریافت لیست ثبت‌نام‌های جدید از کلادفلر
        async function loadStudents() {
            if (!studentTableBody) return;
            studentTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 20px;">در حال دریافت اطلاعات...</td></tr>`;

            try {
                const res = await fetch(`${API_URL}/api/admin/pending-students`);
                const students = await res.json();
                studentTableBody.innerHTML = "";

                if (!students || students.length === 0) {
                    studentTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 20px; color: #86868b;">هیچ ثبت‌نام جدیدی در انتظار بررسی وجود ندارد.</td></tr>`;
                    return;
                }

                students.forEach((student, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td style="font-weight:bold;">${student.name}</td>
                        <td>${student.phone}</td>
                        <td>${student.nationalId}</td>
                        <td>${student.category}</td>
                        <td style="color:#e61c23; font-weight:bold;">${student.fee}</td>
                        <td>${student.date}</td>
                        <td>
                            <button class="btn" style="padding: 5px 10px; font-size:12px; background:#0071e3; color:white; border-radius:6px; cursor:pointer;" onclick="showStudentDetails(${student.id}, 'pending')">📋 پرونده</button>
                        </td>
                        <td>
                            <button class="btn-confirm" style="cursor:pointer;" onclick="openCredModal(${student.id}, '${student.name}', '${student.phone}', '${student.nationalId}')">✅ تأیید و ساخت پنل</button>
                        </td>
                        <td>
                            <button class="btn" style="padding: 5px 10px; font-size:12px; background:#ff3b30; color:white; border-radius:6px; cursor:pointer;" onclick="deleteStudent(${student.id}, 'pending')">حذف</button>
                        </td>
                    `;
                    studentTableBody.appendChild(row);
                });
            } catch (error) {
                studentTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 20px; color: #e61c23;">خطا در دریافت اطلاعات از سرور</td></tr>`;
            }
        }

        // ۲. دریافت لیست زبان‌آموزان تأییدشده از کلادفلر
        async function loadApprovedStudents() {
            if (!approvedTableBody) return;
            approvedTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 20px;">در حال دریافت اطلاعات...</td></tr>`;

            try {
                const res = await fetch(`${API_URL}/api/admin/approved-students`);
                const approved = await res.json();
                approvedTableBody.innerHTML = "";

                if (!approved || approved.length === 0) {
                    approvedTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 20px; color: #86868b;">هنوز هیچ زبان‌آموزی تأیید نهایی نشده است.</td></tr>`;
                    return;
                }

                approved.forEach((student, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td style="font-weight:bold; color:#27ae60;">${student.name}</td>
                        <td style="font-weight:bold;">${student.username || '-'}</td>
                        <td><code>${student.password || '-'}</code></td>
                        <td>${student.category}</td>
                        <td style="color:#27ae60; font-weight:bold;">${student.fee}</td><td>${student.approvedDate || student.date}</td>
                        <td>
                            <button class="btn" style="padding: 5px 10px; font-size:12px; background:#0071e3; color:white; border-radius:6px;" onclick="showStudentDetails(${student.id}, 'approved')">📋 پرونده</button>
                        </td>
                        <td>
                            <button onclick="showStudentHistory(${student.id})" class="btn" style="background:#6c5ce7; color:white; padding:5px 10px; font-size:12px; border-radius:6px; border:none; cursor:pointer;">📜 تاریخچه ثبت‌نام</button>
                        </td>
                        <td>
                            <button class="btn" style="padding: 5px 10px; font-size:12px; background:#27ae60; color:white; border-radius:6px;" onclick="openGradeModal(${student.id}, '${student.name}')">➕ افزودن نمره</button>
                        </td>
                        <td>
                            <button class="btn" style="padding: 5px 10px; font-size:12px; background:#ff3b30; color:white; border-radius:6px;" onclick="deleteStudent(${student.id}, 'approved')">حذف</button>
                        </td>
                    `;
                    approvedTableBody.appendChild(row);
                });
            } catch (error) {
                approvedTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 20px; color: #e61c23;">خطا در دریافت اطلاعات از سرور</td></tr>`;
            }
        }

        // باز کردن مودال ساخت نام‌کاربری
        window.openCredModal = function(id, name, phone, nationalId) {
            document.getElementById("targetStudentId").value = id;
            document.getElementById("targetStudentName").innerText = name;
            document.getElementById("newStudentUsername").value = phone || "";
            document.getElementById("newStudentPassword").value = nationalId || "123456";
            document.getElementById("createCredentialsModal").style.display = "flex";
        };

        // فرم تایید نهایی و ساخت پنل
        const credForm = document.getElementById("credForm");
if (credForm) {
    credForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("targetStudentId").value;
        const uName = document.getElementById("newStudentUsername").value.trim();
        const pWord = document.getElementById("newStudentPassword").value.trim();

        fetch(`${API_URL}/api/admin/approve-student`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, username: uName, password: pWord })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`✅ ثبت‌نام تایید و پنل شخصی زبان‌آموز ساخته شد!\nنام کاربری: ${uName}\nرمز عبور: ${pWord}`);
                closeCredModal();
                loadStudents();
                loadApprovedStudents();
            } else {
                alert("خطا در تایید ثبت‌نام: " + data.message);
            }
        })
        .catch(err => alert("خطا در ارتباط با سرور: " + err.message));
    });
}

        // باز و بسته کردن مودال ثبت نمره
window.openGradeModal = function(id, name) {
    document.getElementById("gradeStudentId").value = id;
    document.getElementById("gradeStudentName").innerText = name;
    document.getElementById("examName").value = "";
    document.getElementById("examScore").value = "";
    document.getElementById("addGradeModal").style.display = "flex";
};

window.closeGradeModal = function() {
    document.getElementById("addGradeModal").style.display = "none";
};

// ثبت نمره و ذخیره در LocalStorage
const gradeForm = document.getElementById("gradeForm");
if (gradeForm) {
    gradeForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("gradeStudentId").value;
        const examName = document.getElementById("examName").value.trim();
        const examScore = document.getElementById("examScore").value.trim();

        fetch(`${API_URL}/api/grades/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: id, examName, score: examScore })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ نمره آزمون با موفقیت ثبت شد.");
                closeGradeModal();
                loadApprovedStudents();
            } else {
                alert("خطا در ثبت نمره: " + data.message);
            }
        })
        .catch(err => alert("خطا در ارتباط با سرور: " + err.message));
    });
}
        window.showStudentDetails = function(id) {
            fetch(`${API_URL}/api/student/details?id=${id}`)
            .then(res => res.json())
            .then(student => {
                if (!student) return;
                const modalBody = document.getElementById("modalBodyDetails");
                if (modalBody) {
                    modalBody.innerHTML = `
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; text-align:right; font-size:14px; line-height:1.8;">
                        <div><strong>👤 نام و نام خانوادگی:</strong> ${student.name}</div>
                        <div><strong>👨‍👦 نام پدر:</strong> ${student.fatherName || 'ثبت نشده'}</div>
                        <div><strong>🆔 کد ملی:</strong> ${student.nationalId}</div>
                        <div><strong>🎂 تاریخ تولد:</strong> ${student.birthDate || 'ثبت نشده'}</div>
                        <div><strong>📞 شماره تماس:</strong> ${student.phone}</div>
                        <div><strong>🎓 میزان تحصیلات:</strong> ${student.education || 'ثبت نشده'}</div>
                        <div><strong>🏫 نام مدرسه / محل تحصیل:</strong> ${student.schoolName || 'ثبت نشده'}</div>
                        <div><strong>📚 دوره ثبت‌نامی:</strong> ${student.category}</div>
                        <div><strong>💳 شهریه پرداختی:</strong> ${student.fee}</div>
                        <div><strong>📅 تاریخ ثبت‌نام:</strong> ${student.date || '-'}</div>
                        <div style="grid-column: 1 / -1; margin-top:10px; background:#f5f5f7; padding:10px; border-radius:8px;">
                            <strong>🏠 آدرس کامل منزل:</strong><br>${student.address || 'ثبت نشده'}
                        </div>
                    </div>
                `;
                document.getElementById("studentModal").style.display = "flex";
            }
        });
};

        window.closeModal = function() {
            const modal = document.getElementById("studentModal");
            if (modal) modal.style.display = "none";
        };

        async function loadPlacements() {
    if (!placementTableBody) return;
    try {
        const res = await fetch(`${API_URL}/api/placements`);
        const placements = await res.json();
        placementTableBody.innerHTML = "";

        if (!placements || placements.length === 0) {
            placementTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color: #86868b;">هیچ درخواست تعیین سطحی ثبت نشده است.</td></tr>`;
            return;
        }

        placements.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td style="font-weight:bold;">${item.name}</td>
                <td>${item.phone}</td>
                <td>${item.nationalCode || 'ثبت نشده'}</td>
                <td style="color:#0071e3; font-weight:bold;">${item.type}</td>
                <td>${item.ageGroup}</td>
                <td>${item.date || '-'}</td>
                <td>
                    <button class="btn" style="padding: 5px 10px; font-size:12px; background:#ff3b30; color:white; border-radius:6px; cursor:pointer;" onclick="deletePlacement(${item.id})">حذف</button>
                </td>
            `;
            placementTableBody.appendChild(row);
        });
    } catch (err) {
        placementTableBody.innerHTML =`<tr><td colspan="8" style="text-align:center; padding: 20px; color: #e61c23;">خطا در دریافت لیست تعیین سطح</td></tr>`;
    }
}

        window.deleteStudent = function (id, type) {
    if (confirm("آیا از حذف این پرونده مطمئن هستید؟")) {
        fetch(`${API_URL}/api/admin/delete-student`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, type })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ پرونده با موفقیت حذف شد.");
                loadStudents();
                loadApprovedStudents();
            } else {
                alert("خطا در حذف پرونده: " + data.message);
            }
        })
        .catch(err => alert("خطا در برقراری ارتباط: " + err.message));
    }
};

window.deletePlacement = function (id) {
    if (confirm("آیا از حذف این درخواست تعیین سطح مطمئن هستید؟")) {
        fetch(`${API_URL}/api/admin/delete-placement`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ درخواست تعیین سطح حذف شد.");
                if (typeof loadPlacements === 'function') loadPlacements();
            } else {
                alert("خطا در حذف درخواست: " + data.message);
            }
        })
        .catch(err => alert("خطا در برقراری ارتباط: " + err.message));
    }
};

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                sessionStorage.removeItem("admin_logged_in");
                window.location.href = "index.html";
            });
        }

        loadStudents();
        loadApprovedStudents();
        loadPlacements();
        loadRenewals();
    }


// ۵. لود داده‌ها در پنل شخصی زبان‌آموز
    // ۵. لود داده‌ها در پنل شخصی زبان‌آموز
const studentProfileDetails = document.getElementById("studentProfileDetails");
if (studentProfileDetails) {
    if (sessionStorage.getItem("user_logged_in") !== "true") {
        window.location.href = "admin-login.html";
        return;
    }

    const currentUserId = sessionStorage.getItem("current_user_id");

    fetch(`${API_URL}/api/student/profile?id=${currentUserId}`)
        .then(res => res.json())
        .then(student => {
            if (!student) return;

            document.getElementById("studentWelcomeTitle").innerText = `خوش آمدید، ${student.name} عزیز 🌺`;

            studentProfileDetails.innerHTML = `
                <div><strong>👤 نام و نام خانوادگی:</strong> ${student.name}</div>
                <div><strong>👨‍👦 نام پدر:</strong> ${student.fatherName || 'ثبت نشده'}</div>
                <div><strong>🆔 کد ملی:</strong> ${student.nationalId}</div>
                <div><strong>📞 شماره تماس:</strong> ${student.phone}</div>
                <div><strong>🏫 نام محل تحصیل:</strong> ${student.schoolName || 'ثبت نشده'}</div>
                <div><strong>🎓 میزان تحصیلات:</strong> ${student.education || 'ثبت نشده'}</div>
            `;

            // لود جدول نمرات
            const studentGradesTable = document.getElementById("studentGradesTable");
            if (studentGradesTable) {
                const grades = student.grades || [];
                studentGradesTable.innerHTML = "";

                if (grades.length === 0) {
                    studentGradesTable.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 15px; color: #86868b;">هنوز هیچ نمره‌ای برای شما ثبت نشده است.</td></tr>`;
                } else {
                    grades.forEach((g, idx) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${idx + 1}</td>
                            <td style="font-weight:bold;">${g.examName}</td>
                            <td style="color:#0071e3; font-weight:bold; font-size:15px;">${g.score}</td>
                            <td>${g.date}</td>
                        `;
                        studentGradesTable.appendChild(row);
                    });
                }
            }

            // لود جدول سوابق ثبت‌نام و تمدیدها
            const historyTable = document.getElementById("studentHistoryTable");
            if (historyTable) {
                historyTable.innerHTML = "";
                
                const historyList = student.history || [{
                    id: Date.now(),
                    category: student.category,
                    fee: student.fee,
                    date: student.date,
                    status: 'تأییدشده',
                    type: 'ثبت‌نام اولیه'
                }];

                historyList.forEach((h, idx) => {
                    let statusBadge = '';
                    if (h.status === 'تأییدشده') {
                        statusBadge = `<span style="background:#e6fffa; color:#38a169; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:12px;">تأییدشده</span>`;
                    } else if (h.status === 'ردشده') {
                        statusBadge = `<span style="background:#ffe5e5; color:#e61c23; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:12px;">ردشده</span>`;
                    } else {
                        statusBadge = `<span style="background:#fffaf0; color:#dd6b20; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:12px;">در انتظار تأیید</span>`;
                    }

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${idx + 1}</td>
                        <td style="font-weight:bold; color:#0071e3;">${h.category} (${h.type || 'ثبت‌نام'})</td><td style="color:#27ae60; font-weight:bold;">${h.fee}</td>
                        <td>${h.date}</td>
                        <td>${h.status === 'تأییدشده' ? (student.approvedDate || h.date) : '-'}</td>
                        <td>${statusBadge}</td>
                    `;
                    historyTable.appendChild(row);
                });
            }
        })
        .catch(err => console.error("خطا در دریافت اطلاعات زبان‌آموز:", err));

    const userLogoutBtn = document.getElementById("userLogoutBtn");
    if (userLogoutBtn) {
        userLogoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("user_logged_in");
            sessionStorage.removeItem("current_user_id");
            window.location.href = "admin-login.html";
        });
    }
}
});
/* ===================================================
   سیستم ترجمه اختصاصی و هوشمند ۶ زبانه (بدون گوگل)
   =================================================== */

const translations = {
    fa: {
        welcome: "به آکادمی تخصصی زبان آفرینش خوش آمدید",
        home: "خانه",
        classes: "کلاس‌های زبان",
        exams: "آزمون‌ها",
        olympiad: "المپیاد",
        achievements: "دستاوردها",
        events: "ایونت‌ها",
        azmoon: "آزمونک",
        contact: "مشاوره و تماس",
        loginBtn: "ورود به پنل شخصی",
        registerBtn: "ثبت‌نام آنلاین",
        heroBadge: "🌐 آکادمی بین‌المللی زبان‌های خارجی",
        heroTitle: "شروع نسخه بین‌المللی تو...",
        heroDesc: "برگزاری دوره‌های تخصصی و عمومی مکالمه، آمادگی آزمون‌های بین‌المللی بدون محدودیت سنی و متناسب با سطح شما تحت نظارت مستقیم سوپروایزر برتر مجموعه سرکار خانم پریا پوراحمد",
        startBtn: "شروع یادگیری و ثبت نام",
        coursesBtn: "مشاهده دوره‌ها"
    },
    en: {
        welcome: "Welcome to Afarinesh Language Academy",
        home: "Home",
        classes: "Classes",
        exams: "Exams",
        olympiad: "Olympiad",
        achievements: "Achievements",
        events: "Events",
        azmoon: "Quiz",
        contact: "Contact Us",
        loginBtn: "Student Login",
        registerBtn: "Online Register",
        heroBadge: "🌐 International Language Academy",
        heroTitle: "...Start Your International Version",
        heroDesc: "Specialized and general conversation courses, preparation for international exams for all ages under the supervision of Supervisor Mrs. Paria Pourahmada",
        startBtn: "Start Learning & Register",
        coursesBtn: "View Courses"
    },
    de: {
        welcome: "Willkommen in der Sprachakademie Afarinesh",
        home: "Startseite",
        classes: "Sprachkurse",
        exams: "Prüfungen",
        olympiad: "Olympiade",
        achievements: "Erfolge",
        events: "Events",
        azmoon: "Quiz",
        contact: "Kontakt",
        loginBtn: "Anmelden",
        registerBtn: "Online-Registrierung",
        heroBadge: "🌐 Internationale Sprachakademie",
        heroTitle: "...Starten Sie Ihre internationale Version",
        heroDesc: "Spezialisierte Sprachkurse und Vorbereitung auf internationale Prüfungen für alle Altersgruppen",
        startBtn: "Jetzt starten & Anmelden",
        coursesBtn: "Kurse anzeigen"
    },
    tr: {
        welcome: "Afarinesh Dil Akademisine Hoş Geldiniz",
        home: "Anasayfa",
        classes: "Kurslar",
        exams: "Sınavlar",
        olympiad: "Olimpiyat",
        achievements: "Başarılar",
        events: "Etkinlikler",
        azmoon: "Bilgi Yarışması",
        contact: "İletişim",
        loginBtn: "Giriş Yap",
        registerBtn: "Online Kayıt",
        heroBadge: "🌐 Uluslararası Dil Akademisi",
        heroTitle: "...Uluslararası Versiyonunuzu Başlatın",
        heroDesc: "Her yaşa uygun özel ve genel konuşma kursları ve uluslararası sınavlara hazırlık",
        startBtn: "Öğrenmeye Başla ve Kaydol",
        coursesBtn: "Kursları İncele"
    },
    fr: {
        welcome: "Bienvenue à l'Académie de Langues Afarinesh",
        home: "Accueil",
        classes: "Cours",
        exams: "Examens",
        olympiad: "Olympiade",
        achievements: "Réalisations",
        events: "Événements",
        azmoon: "Questionnaire",
        contact: "Contact",
        loginBtn: "Espace Personnel",
        registerBtn: "Inscription en Ligne",
        heroBadge: "🌐 Académie Internationale de Langues",
        heroTitle: "...Commencez Votre Version Internationale",
        heroDesc: "Cours de conversation spécialisés et préparation aux examens internationaux pour tous les âges",
        startBtn: "Commencer & S'inscrire",
        coursesBtn: "Voir les Cours"},
    zh: {
        welcome: "欢迎来到 Afarinesh 外语学院",
        home: "首页",
        classes: "语言课程",
        exams: "考试",
        olympiad: "竞赛",
        achievements: "成就",
        events: "活动",
        azmoon: "測驗",
        contact: "联系我们",
        loginBtn: "个人中心登录",
        registerBtn: "在线报名",
        heroBadge: "🌐 国际外语学院",
        heroTitle: "...开启你的国际化之旅",
        heroDesc: "面向所有年龄段的专业对话课程及国际考试备考课程",
        startBtn: "开始学习并报名",
        coursesBtn: "查看课程"
    }
};

function changeLanguage(langCode, dir) {
    document.documentElement.dir = dir;
    document.documentElement.lang = langCode;

    const langData = translations[langCode] || translations['fa'];

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            element.textContent = langData[key];
        }
    });

    localStorage.setItem('selected_lang', langCode);
    localStorage.setItem('selected_dir', dir);
}


const savedLang = localStorage.getItem('selected_lang') || 'fa';
const savedDir = localStorage.getItem('selected_dir') || 'rtl';
changeLanguage(savedLang, savedDir);



/* ===================================================
   سیستم تمدید ترم و مدیریت تاریخچه ثبت‌نام‌ها
   =================================================== */

// ۱. تابع ثبت درخواست تمدید ترم توسط دانش‌آموز
window.renewTerm = function () {
    const currentUserId = sessionStorage.getItem("current_user_id");
    if (!currentUserId) {
        alert("لطفاً ابتدا وارد پنل شوید.");
        return;
    }

    if (confirm("آیا از ارسال درخواست تمدید ترم مطمئن هستید؟")) {
        fetch(`${API_URL}/api/student/renew`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: currentUserId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ درخواست تمدید ترم با موفقیت ثبت شد و به مدیریت ارسال گردید.");
                location.reload();
            } else {
                alert("توجه: " + (data.message || "خطا در ثبت تمدید"));
            }
        })
        .catch(err => alert("خطا در برقراری ارتباط: " + err.message));
    }
};

// ۲. لود لیست افراد در انتظار تمدید ترم در پنل مدیریت
async function loadRenewals() {
    const renewalTableBody = document.getElementById("renewalTableBody");
    if (!renewalTableBody) return;

    try {
        const res = await fetch(`${API_URL}/api/admin/renewals`);
        const renewals = await res.json();
        renewalTableBody.innerHTML = "";

        if (!renewals || renewals.length === 0) {
            renewalTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 15px; color: #86868b;">هیچ درخواست تمدید ترمی در انتظار تأیید وجود ندارد.</td></tr>`;
            return;
        }

        renewals.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td style="font-weight:bold; color:#d9534f;">${item.name}</td>
                <td>${item.phone}</td>
                <td>${item.category}</td>
                <td style="color:#27ae60; font-weight:bold;">${item.fee}</td>
                <td>${item.date || '-'}</td>
                <td>
                    <button class="btn" style="padding: 5px 10px; font-size:12px; background:#27ae60; color:white; border-radius:6px; cursor:pointer;" onclick="approveRenewal(${item.studentId}, ${item.id})">✅ تأیید تمدید</button>
                    <button class="btn" style="padding: 5px 10px; font-size:12px; background:#ff3b30; color:white; border-radius:6px; cursor:pointer;" onclick="rejectRenewal(${item.studentId}, ${item.id})">❌ رد درخواست</button>
                </td>
            `;
            renewalTableBody.appendChild(row);
        });
    } catch (err) {
        renewalTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 15px; color: #e61c23;">خطا در دریافت تمدیدی‌ها</td></tr>`   ;
    }
}

// ۳. تأیید تمدید ترم توسط مدیر
window.approveRenewal = function (studentId, historyId) {
    fetch(`${API_URL}/api/admin/approve-renewal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, historyId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("✅ تمدید ترم با موفقیت تأیید شد.");
            loadRenewals();
            if (typeof loadApprovedStudents === 'function') loadApprovedStudents();
        }
    })
    .catch(err => alert("خطا در برقراری ارتباط: " + err.message));
};

// ۴. رد تمدید ترم توسط مدیر
window.rejectRenewal = function (studentId, historyId) {
    if (!confirm("آیا از رد این درخواست تمدید مطمئن هستید؟")) return;

    fetch(`${API_URL}/api/admin/reject-renewal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, historyId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("❌ درخواست تمدید ترم رد شد.");
            loadRenewals();
            if (typeof loadApprovedStudents === 'function') loadApprovedStudents();
        }
    })
    .catch(err => alert("خطا در برقراری ارتباط: " + err.message));
};

// ۴. نمایش مودال تاریخچه کامل ثبت‌نام‌ها برای مدیر
window.showStudentDetails = function(id) {
    fetch(`${API_URL}/api/student/details?id=${id}`)
        .then(res => res.json())
        .then(student => {
            if (!student) return;
            const modalBody = document.getElementById("modalBodyDetails");
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; text-align:right; font-size:14px; line-height:1.8;">
                        <div><strong>👤 نام و نام خانوادگی:</strong> ${student.name}</div>
                        <div><strong>👨‍👦 نام پدر:</strong> ${student.fatherName || 'ثبت نشده'}</div>
                        <div><strong>🆔 کد ملی:</strong> ${student.nationalId}</div>
                        <div><strong>🎂 تاریخ تولد:</strong> ${student.birthDate || 'ثبت نشده'}</div>
                        <div><strong>📞 شماره تماس:</strong> ${student.phone}</div>
                        <div><strong>🎓 میزان تحصیلات:</strong> ${student.education || 'ثبت نشده'}</div>
                        <div><strong>🏫 نام مدرسه / محل تحصیل:</strong> ${student.schoolName || 'ثبت نشده'}</div>
                        <div><strong>📚 دوره ثبت‌نامی:</strong> ${student.category}</div>
                        <div><strong>💳 شهریه پرداختی:</strong> ${student.fee}</div>
                        <div><strong>📅 تاریخ ثبت‌نام:</strong> ${student.date || '-'}</div>
                        <div style="grid-column: 1 / -1; margin-top:10px; background:#f5f5f7; padding:10px; border-radius:8px;">
                            <strong>🏠 آدرس کامل منزل:</strong><br>${student.address || 'ثبت نشده'}
                        </div>
                    </div>
                `;
                document.getElementById("studentModal").style.display = "flex";
            }
        })
        .catch(err => alert("خطا در دریافت جزئیات پرونده: " + err.message));
};

window.showStudentHistory = function (studentId) {
    fetch(`${API_URL}/api/student/details?id=${studentId}`)
        .then(res => res.json())
        .then(student => {
            if (!student) return;

            let historyList = [];
            try {
                historyList = typeof student.history === 'string' ? JSON.parse(student.history) : (student.history || []);
            } catch(e) { historyList = []; }

            if (historyList.length === 0) {
                historyList = [{
                    category: student.category,
                    fee: student.fee,
                    date: student.date || '-',
                    status: 'تأییدشده',
                    type: 'ثبت‌نام اولیه'
                }];
            }

            let historyHtml = `
                <h3 style="margin-bottom:15px; color:#1d1d1f;">📜 تاریخچه کامل ثبت‌نام‌های ${student.name}</h3>
                <table style="width:100%; border-collapse:collapse; text-align:right;">
                    <thead>
                        <tr style="background:#f8fafc;">
                            <th style="padding:8px; border-bottom:1px solid #ddd;">ردیف</th>
                            <th style="padding:8px; border-bottom:1px solid #ddd;">نوع درخواست</th>
                            <th style="padding:8px; border-bottom:1px solid #ddd;">دوره / رده</th>
                            <th style="padding:8px; border-bottom:1px solid #ddd;">شهریه</th>
                            <th style="padding:8px; border-bottom:1px solid #ddd;">تاریخ ثبت</th>
                            <th style="padding:8px; border-bottom:1px solid #ddd;">وضعیت</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            historyList.forEach((h, idx) => {
                historyHtml += `
                    <tr>
                        <td style="padding:8px; border-bottom:1px solid #eee;">${idx + 1}</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">${h.type || 'ثبت‌نام'}</td>
                        <td style="padding:8px; border-bottom:1px solid #eee;">${h.category}</td>
                        <td style="padding:8px; border-bottom:1px solid #eee; color:#27ae60;">${h.fee}</td>
                        <td style="padding:8px; border-bottom:1px solid #eee;">${h.date || '-'}</td>
                        <td style="padding:8px; border-bottom:1px solid #eee;">
                            <span style="background:#e6fffa; color:#38a169; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:bold;">${h.status || 'تأییدشده'}</span>
                        </td>
                    </tr>
                `;
            });

            historyHtml += `</tbody></table>`;

            const modalBody = document.getElementById("modalBodyDetails");
            if (modalBody) {
                modalBody.innerHTML = historyHtml;
                document.getElementById("studentModal").style.display = "flex";
            }
        })
        .catch(err => alert("خطا در دریافت تاریخچه: " + err.message));
};
