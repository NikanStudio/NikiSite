/* =========================
   نیکی سایت
   سیستم تاپیک و کامنت
========================= */


/* تاپیک های پیش فرض */

let topics = JSON.parse(localStorage.getItem("nikiTopics")) || [

    {
        id: 1,
        title: "به نیکی سایت خوش آمدید 💜",
        text: "این اولین تاپیک نیکی سایته! نظرتون درباره سایت چیه؟",
        author: "nikan studio",
        category: "عمومی",
        likes: 5,
        comments: [
            {
                author: "کاربر نیکی",
                text: "خیلی باحاله 😍"
            }
        ],
        date: new Date().toLocaleDateString("fa-IR")
    },

    {
        id: 2,
        title: "بهترین بازی که تا حالا بازی کردید؟ 🎮",
        text: "بیاید درباره بازی مورد علاقه‌مون صحبت کنیم!",
        author: "nikan studio",
        category: "گیم",
        likes: 12,
        comments: [],
        date: new Date().toLocaleDateString("fa-IR")
    }

];


/* دسته فعلی */

let currentCategory = "همه";


/* ذخیره */

function saveTopics() {

    localStorage.setItem(
        "nikiTopics",
        JSON.stringify(topics)
    );

}


/* نمایش تاپیک ها */

function renderTopics(list = topics) {

    const container =
        document.getElementById("topicsContainer");

    const empty =
        document.getElementById("emptyMessage");


    container.innerHTML = "";


    if (list.length === 0) {

        empty.style.display = "block";

        return;

    }


    empty.style.display = "none";


    list.forEach(topic => {

        const card =
            document.createElement("div");

        card.className = "topic-card";


        card.onclick = function () {

            openTopic(topic.id);

        };


        card.innerHTML = `

            <div class="topic-title">
                ${escapeHTML(topic.title)}
            </div>

            <div class="topic-text">
                ${escapeHTML(shortText(topic.text))}
            </div>

            <div class="topic-info">

                <span>
                    👤 ${escapeHTML(topic.author)}
                </span>

                <span class="topic-category">
                    ${escapeHTML(topic.category)}
                </span>

                <span>
                    💬 ${topic.comments.length}
                </span>

                <button
                    class="like-btn"
                    onclick="event.stopPropagation(); likeTopic(${topic.id})"
                >
                    ❤️ ${topic.likes}
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


/* کوتاه کردن متن */

function shortText(text) {

    if (text.length > 120) {

        return text.substring(0, 120) + "...";

    }

    return text;

}


/* جلوگیری از HTML خطرناک */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* لایک */

function likeTopic(id) {

    const topic =
        topics.find(t => t.id === id);


    if (!topic) return;


    topic.likes++;


    saveTopics();

    renderTopics(getFilteredTopics());

}


/* باز کردن پنجره ساخت */

function openTopicModal() {

    document
        .getElementById("topicModal")
        .classList.add("show");

}


/* بستن پنجره ساخت */

function closeTopicModal() {

    document
        .getElementById("topicModal")
        .classList.remove("show");

}


/* ساخت تاپیک */

function createTopic() {

    const title =
        document.getElementById("topicTitle").value.trim();

    const text =
        document.getElementById("topicText").value.trim();

    const author =
        document.getElementById("topicAuthor").value.trim();

    const category =
        document.getElementById("topicCategory").value;


    if (!title) {

        alert("لطفاً عنوان تاپیک را بنویس.");

        return;

    }


    if (!text) {

        alert("لطفاً متن تاپیک را بنویس.");

        return;

    }


    const newTopic = {

        id: Date.now(),

        title: title,

        text: text,

        author: author || "کاربر نیکی",

        category: category,

        likes: 0,

        comments: [],

        date: new Date().toLocaleDateString("fa-IR")

    };


    topics.unshift(newTopic);


    saveTopics();


    document.getElementById("topicTitle").value = "";

    document.getElementById("topicText").value = "";

    document.getElementById("topicAuthor").value = "";


    closeTopicModal();


    currentCategory = "همه";


    document
        .querySelectorAll(".category")
        .forEach(btn => btn.classList.remove("active"));

    document
        .querySelector(".category")
        .classList.add("active");


    renderTopics();


    alert("تاپیک با موفقیت ساخته شد! 🎉");

}


/* باز کردن تاپیک */

function openTopic(id) {

    const topic =
        topics.find(t => t.id === id);


    if (!topic) return;


    const modal =
        document.getElementById("viewModal");

    const details =
        document.getElementById("topicDetails");


    let commentsHTML = "";


    if (topic.comments.length === 0) {

        commentsHTML = `
            <p style="color:#888;">
                هنوز کسی پاسخ نداده است.
            </p>
        `;

    } else {

        topic.comments.forEach(comment => {

            commentsHTML += `

                <div class="comment">

                    <div class="comment-author">
                        👤 ${escapeHTML(comment.author)}
                    </div>

                    <div class="comment-text">
                        ${escapeHTML(comment.text)}
                    </div>

                </div>

            `;

        });

    }


    details.innerHTML = `

        <h1>
            ${escapeHTML(topic.title)}
        </h1>

        <div class="topic-info">

            <span>
                👤 ${escapeHTML(topic.author)}
            </span>

            <span>
                ${escapeHTML(topic.date)}
            </span>

            <span>
                ${escapeHTML(topic.category)}
            </span>

        </div>


        <div class="main-text">
            ${escapeHTML(topic.text)}
        </div>


        <button
            class="like-btn"
            onclick="likeFromTopic(${topic.id})"
        >
            ❤️ لایک ${topic.likes}
        </button>


        <h3 class="comments-title">
            💬 پاسخ‌ها (${topic.comments.length})
        </h3>


        <div>
            ${commentsHTML}
        </div>


        <div class="comment-form">

            <textarea
                id="commentText"
                placeholder="پاسخ خود را بنویس..."
            ></textarea>

            <input
                id="commentAuthor"
                placeholder="نام شما"
            >

            <button
                onclick="addComment(${topic.id})"
            >
                ارسال پاسخ
            </button>

        </div>

    `;


    modal.classList.add("show");

}


/* لایک داخل صفحه تاپیک */

function likeFromTopic(id) {

    const topic =
        topics.find(t => t.id === id);


    if (!topic) return;


    topic.likes++;


    saveTopics();


    openTopic(id);

    renderTopics(getFilteredTopics());

}


/* افزودن کامنت */

function addComment(id) {

    const text =
        document.getElementById("commentText").value.trim();

    const author =
        document.getElementById("commentAuthor").value.trim();


    if (!text) {

        alert("لطفاً متن پاسخ را بنویس.");

        return;

    }


    const topic =
        topics.find(t => t.id === id);


    if (!topic) return;


    topic.comments.push({

        author: author || "کاربر نیکی",

        text: text

    });


    saveTopics();


    openTopic(id);

    renderTopics(getFilteredTopics());

}


/* بستن صفحه تاپیک */

function closeViewModal() {

    document
        .getElementById("viewModal")
        .classList.remove("show");

}


/* انتخاب دسته */

function filterCategory(category, button) {

    currentCategory = category;


    document
        .querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    renderTopics(getFilteredTopics());

}


/* گرفتن تاپیک های فیلتر شده */

function getFilteredTopics() {

    if (currentCategory === "همه") {

        return topics;

    }


    return topics.filter(
        topic => topic.category === currentCategory
    );

}


/* جستجو */

function searchTopics() {

    const query =
        document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();


    let result = getFilteredTopics();


    if (query) {

        result = result.filter(topic =>

            topic.title
                .toLowerCase()
                .includes(query)

            ||

            topic.text
                .toLowerCase()
                .includes(query)

            ||

            topic.author
                .toLowerCase()
                .includes(query)

        );

    }


    renderTopics(result);

}


/* بستن Modal با کلیک بیرون */

window.addEventListener("click", function(event) {

    const topicModal =
        document.getElementById("topicModal");

    const viewModal =
        document.getElementById("viewModal");


    if (event.target === topicModal) {

        closeTopicModal();

    }


    if (event.target === viewModal) {

        closeViewModal();

    }

});


/* اجرای اولیه */

renderTopics();
