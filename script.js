let topics = JSON.parse(
    localStorage.getItem("nikanTopics")
) || [

    {
        id: 1,

        title: "به نیکی‌سایت خوش آمدید 💜",

        text: "این اولین تاپیک نیکی‌سایته! نظرتون درباره سایت چیه؟",

        author: "نیکان",

        category: "عمومی",

        likes: 5,

        comments: [],

        date: new Date().toLocaleDateString("fa-IR")
    },

    {
        id: 2,

        title: "بهترین بازی که بازی کردید؟ 🎮",

        text: "بیاید درباره بازی مورد علاقه‌مون صحبت کنیم!",

        author: "نیکان",

        category: "گیم",

        likes: 8,

        comments: [],

        date: new Date().toLocaleDateString("fa-IR")
    }

];


let currentCategory = "همه";


/* ذخیره */

function saveTopics() {

    localStorage.setItem(
        "nikanTopics",
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
                ${shortText(topic.text)}
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
                    onclick="event.stopPropagation();
                    likeTopic(${topic.id})"
                >
                    ❤️ ${topic.likes}
                </button>

            </div>

        `;

        container.appendChild(card);

    });

}


/* متن کوتاه */

function shortText(text) {

    text = escapeHTML(text);

    if (text.length > 120) {

        return text.substring(0,120) + "...";

    }

    return text;
}


/* امنیت */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}


/* لایک */

function likeTopic(id) {

    const topic =
        topics.find(t => t.id === id);

    if (!topic) return;

    topic.likes++;

    saveTopics();

    renderTopics(
        getFilteredTopics()
    );
}


/* باز کردن ساخت تاپیک */

function openTopicModal() {

    document
        .getElementById("topicModal")
        .classList.add("show");
}


/* بستن */

function closeTopicModal() {

    document
        .getElementById("topicModal")
        .classList.remove("show");
}


/* ساخت تاپیک */

function createTopic() {

    const title =
        document.getElementById("topicTitle")
        .value.trim();

    const text =
        document.getElementById("topicText")
        .value.trim();

    const author =
        document.getElementById("topicAuthor")
        .value.trim();

    const category =
        document.getElementById("topicCategory")
        .value;


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

        author: author || "کاربر نیکان",

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

    renderTopics();


    alert("تاپیک با موفقیت ساخته شد! 🎉");
}


/* نمایش تاپیک */

function openTopic(id) {

    const topic =
        topics.find(t => t.id === id);

    if (!topic) return;


    let commentsHTML = "";


    if (topic.comments.length === 0) {

        commentsHTML = `
            <p style="color:#888">
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


    document.getElementById("topicDetails").innerHTML = `

        <h1>
            ${escapeHTML(topic.title)}
        </h1>

        <div class="topic-info">

            👤 ${escapeHTML(topic.author)}

            |

            ${escapeHTML(topic.category)}

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
            💬 پاسخ‌ها
        </h3>

        ${commentsHTML}

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


    document
        .getElementById("viewModal")
        .classList.add("show");
}


/* لایک داخل تاپیک */

function likeFromTopic(id) {

    const topic =
        topics.find(t => t.id === id);

    if (!topic) return;

    topic.likes++;

    saveTopics();

    openTopic(id);

    renderTopics(
        getFilteredTopics()
    );
}


/* کامنت */

function addComment(id) {

    const text =
        document.getElementById("commentText")
        .value.trim();

    const author =
        document.getElementById("commentAuthor")
        .value.trim();


    if (!text) {

        alert("لطفاً متن پاسخ را بنویس.");

        return;
    }


    const topic =
        topics.find(t => t.id === id);


    topic.comments.push({

        author: author || "کاربر نیکان",

        text: text

    });


    saveTopics();

    openTopic(id);

    renderTopics(
        getFilteredTopics()
    );
}


/* بستن تاپیک */

function closeViewModal() {

    document
        .getElementById("viewModal")
        .classList.remove("show");
}


/* دسته بندی */

function filterCategory(category, button) {

    currentCategory = category;


    document
        .querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    renderTopics(
        getFilteredTopics()
    );
}


/* فیلتر */

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
        document.getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();


    let result =
        getFilteredTopics();


    if (query) {

        result = result.filter(topic =>

            topic.title
                .toLowerCase()
                .includes(query)

            ||

            topic.text
                .toLowerCase()
                .includes(query)

        );
    }


    renderTopics(result);
}


/* تغییر بخش */

function showSection(section) {

    document.getElementById("homeSection")
        .style.display = "none";

    document.getElementById("aboutSection")
        .style.display = "none";

    document.getElementById("gameSection")
        .style.display = "none";


    if (section === "home") {

        document.getElementById("homeSection")
            .style.display = "block";
    }


    if (section === "about") {

        document.getElementById("aboutSection")
            .style.display = "block";
    }


    if (section === "game") {

        document.getElementById("gameSection")
            .style.display = "block";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================= بازی ================= */

let score = 0;

let timeLeft = 10;

let gameTimer = null;

let gameRunning = false;


function startGame() {

    score = 0;

    timeLeft = 10;

    gameRunning = true;


    document.getElementById("score")
        .textContent = score;

    document.getElementById("time")
        .textContent = timeLeft;

    document.getElementById("gameResult")
        .textContent = "";

    document.getElementById("clickGame")
        .disabled = false;

    document.getElementById("startGame")
        .disabled = true;


    gameTimer = setInterval(function() {

        timeLeft--;

        document.getElementById("time")
            .textContent = timeLeft;


        if (timeLeft <= 0) {

            endGame();

        }

    },1000);
}


function clickGame() {

    if (!gameRunning) return;

    score++;

    document.getElementById("score")
        .textContent = score;
}


function endGame() {

    clearInterval(gameTimer);

    gameRunning = false;


    document.getElementById("clickGame")
        .disabled = true;

    document.getElementById("startGame")
        .disabled = false;


    document.getElementById("gameResult")
        .textContent =
        "🎉 بازی تمام شد! امتیاز شما: " + score;
}


/* بستن پنجره با کلیک بیرون */

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


/* شروع */

renderTopics();
