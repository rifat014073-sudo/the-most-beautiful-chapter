
const envelope = document.getElementById("envelope");
const clickText = document.getElementById("clickText");
const letterContent = document.getElementById("letterContent");
const typedText = document.getElementById("typedText");
const nextBtn = document.getElementById("nextBtn");

let letterOpened = false;

const message = `Happy Birthday, my love! ❤️

I don't know if words will ever be enough to express how special you are to me. But today, I want to try.

তোমাকে আমার জীবনে পাওয়াটা আমার কাছে সত্যিই অনেক সুন্দর একটা অনুভূতি। তোমার হাসি, তোমার অভিমান, তোমার ছোট ছোট কথাগুলো—সবকিছুই আমার কাছে ভীষণ প্রিয়।

হয়তো প্রতিদিন তোমাকে সব কথা বলা হয় না। হয়তো কখনো কখনো আমার অনুভূতিগুলো ঠিকভাবে প্রকাশ করতে পারি না। কিন্তু একটা কথা বিশ্বাস করো, তুমি আমার কাছে অনেক বেশি গুরুত্বপূর্ণ।

আমি চাই তোমার প্রতিটি দিন হাসিতে ভরে উঠুক। তোমার সব স্বপ্ন একে একে পূরণ হোক। জীবনের প্রতিটি পথে তুমি সুখ, শান্তি আর ভালোবাসা খুঁজে পাও।

আর আমি চাই, তোমার জীবনের সুন্দর মুহূর্তগুলোর পাশে থাকতে। তোমার হাসির কারণ হতে, মন খারাপের দিনে একটু স্বস্তি দিতে।

You are not just a part of my story. You are one of my favorite chapters.

আজকের দিনটা শুধু তোমার। অনেক অনেক ভালোবাসা আর শুভকামনা রইল তোমার জন্য।`;

function openLetter() {

    if (letterOpened) return;

    letterOpened = true;

    envelope.classList.add("open");

    clickText.style.display = "none";

    setTimeout(() => {

        letterContent.classList.add("show");

        let index = 0;

        function typeWriter() {

            if (index < message.length) {

                typedText.textContent += message.charAt(index);

                index++;

                setTimeout(typeWriter, 35);

            } else {

                nextBtn.classList.add("show");

            }

        }

        typeWriter();

    }, 1200);
}

function goNext() {
    window.location.href = "page4.html";
}
