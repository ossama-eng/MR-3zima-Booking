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
        const response = await fetch("https://efficient-trust-production-8836.up.railway.app/api/BookingRequests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingRequest)
        });

        if (response.ok) {
            alert("تم إرسال الطلب بنجاح");
            document.getElementById("contactForm").reset();
        } else {
            alert("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
        }
    }
    catch (error) {
        alert("تعذر الاتصال بالسيرفر. حاول مرة أخرى لاحقًا.");
    }
});