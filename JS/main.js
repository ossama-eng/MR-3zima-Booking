document.getElementById('burgerBtn').addEventListener('click', function () {
    document.getElementById('mobileMenu').classList.toggle('open');
});

document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var item = btn.parentElement;
        var ans = item.querySelector('.faq-a');
        var wasOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item').forEach(function (i) {
            i.classList.remove('open');
            i.querySelector('.faq-a').style.maxHeight = null;
        });

        if (!wasOpen) {
            item.classList.add('open');
            ans.style.maxHeight = ans.scrollHeight + 'px';
        }
    });
});

var counted = false;

function animateCounters() {
    if (counted) return;

    var els = document.querySelectorAll('[data-count]');

    var visible = Array.from(els).some(function (el) {
        var r = el.getBoundingClientRect();

        return r.top < window.innerHeight && r.bottom > 0;
    });

    if (!visible) return;

    counted = true;

    els.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var current = 0;
        var step = Math.max(1, Math.round(target / 40));

        var t = setInterval(function () {
            current += step;

            if (current >= target) {
                current = target;
                clearInterval(t);
            }

            el.textContent = current;
        }, 25);
    });
}

window.addEventListener('scroll', animateCounters);

animateCounters();

/* ===== Toast Notifications ===== */

var TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
};

var TOAST_CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

function showToast(options) {
    var type = options.type || 'success';
    var title = options.title || (type === 'success' ? 'تم بنجاح' : 'حدث خطأ');
    var message = options.message || '';
    var duration = options.duration || 4500;

    var container = document.getElementById('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast ' + type;

    toast.innerHTML =
        '<div class="toast-icon">' + TOAST_ICONS[type] + '</div>' +
        '<div class="toast-body">' +
            '<div class="toast-title">' + title + '</div>' +
            (message ? '<div class="toast-message">' + message + '</div>' : '') +
        '</div>' +
        '<button class="toast-close" aria-label="إغلاق">' + TOAST_CLOSE_ICON + '</button>' +
        '<div class="toast-progress"></div>';

    // the progress bar's animation-duration is set per-toast via a scoped style tag,
    // since inline styles can't target the CSS ::after pseudo-element
    var pseudoStyle = document.createElement('style');
    var uid = 'toast-' + Math.random().toString(36).slice(2, 9);
    toast.classList.add(uid);
    pseudoStyle.textContent = '.' + uid + ' .toast-progress::after{animation-duration:' + duration + 'ms;}';
    document.head.appendChild(pseudoStyle);

    function removeToast() {
        toast.classList.add('toast-hide');
        setTimeout(function () {
            toast.remove();
            pseudoStyle.remove();
        }, 300);
    }

    var closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', removeToast);

    var timer = setTimeout(removeToast, duration);

    toast.addEventListener('mouseenter', function () {
        clearTimeout(timer);
    });
    toast.addEventListener('mouseleave', function () {
        timer = setTimeout(removeToast, 1200);
    });

    container.appendChild(toast);
}

/* ===== Contact form submission ===== */

document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const grade = document.getElementById("grade").value;
    const notes = document.getElementById("notes").value;

    const bookingRequest = {
        name: name,
        phone: phone,
        grade: grade,
        notes: notes
    };

    try {
        const response = await fetch("http://localhost:8080/api/BookingRequests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingRequest)
        });

        if (response.ok) {
            showToast({
                type: "success",
                title: "تم إرسال الطلب بنجاح",
                message: "هنتواصل معاك في أقرب وقت لتأكيد ميعاد الحصة التجريبية."
            });
            document.getElementById("contactForm").reset();
        } else {
            showToast({
                type: "error",
                title: "حدث خطأ أثناء إرسال الطلب",
                message: "حاول مرة أخرى، أو تواصل معانا مباشرة على الواتساب."
            });
        }
    }
    catch (error) {
        showToast({
            type: "error",
            title: "تعذر الاتصال بالسيرفر",
            message: "تأكد من اتصالك بالإنترنت وحاول مرة أخرى لاحقًا."
        });
    }
});