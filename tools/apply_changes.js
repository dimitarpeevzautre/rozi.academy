const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const prefix = "window['bootstrap'] = JSON.parse('";
const startIdx = html.indexOf(prefix);
const startJson = startIdx + prefix.length;
const endJson = html.indexOf("');", startJson);
const jsStringLiteral = html.substring(startJson, endJson);
const jsonString = eval("'" + jsStringLiteral + "'");
const bootstrap = JSON.parse(jsonString);

// ==========================================
// 1. SECTION 2 (About / Page 3): Age update
// ==========================================
const sec2 = bootstrap.page.A.A[2];
function updateTextInElement(el, oldText, newText) {
    if (el.a && Array.isArray(el.a.A)) {
        for (let t of el.a.A) {
            if (t.A && t.A.includes(oldText)) {
                t.A = t.A.replace(oldText, newText);
                console.log(`Updated text: replaced "${oldText}" with "${newText}"`);
            }
        }
    }
    if (el.c && Array.isArray(el.c)) {
        for (let child of el.c) {
            updateTextInElement(child, oldText, newText);
        }
    }
}

for (let el of sec2.E) {
    updateTextInElement(el, '4 до 8 години', '5 до 9 години');
}

// ==========================================
// 2. SECTION 3 (Services / Page 4): Schedule & Address
// ==========================================
const sec3 = bootstrap.page.A.A[3];

// Element 10 is the address
const el10 = sec3.E[10];
const line1 = "Адрес: кв. Овча купел\n";
const line2 = "ул. Киевска 6 - детска къща Алма";
el10.a.A = [{ "A?": "A", "A": line1 + line2 + "\n" }];
el10.a.B = [
    {
        "A?": "A",
        "A": {
            "font-size": { "B": "29.8537" },
            "font-family": { "B": "YAEnXArs1iQ,0" },
            "color": { "B": "#373d3b" },
            "text-align": { "B": "center" }
        }
    },
    { "A?": "B", "A": line1.length },
    {
        "A?": "A",
        "A": {
            "decoration": { "B": "underline" },
            "link": { "B": "https://maps.google.com/?q=%D0%BA%D0%B2.+%D0%9E%D0%B2%D1%87%D0%B0+%D0%BA%D1%83%D0%BF%D0%B5%D0%BB%2C+%D1%83%D0%BB.+%D0%9A%D0%B8%D0%B5%D0%B2%D1%81%D0%BA%D0%B0+6%2C+%D0%A1%D0%BE%D1%84%D0%B8%D1%8F" }
        }
    },
    { "A?": "B", "A": line2.length },
    {
        "A?": "A",
        "A": {
            "leading": { "B": "1400.0" },
            "tracking": { "B": "0.0" },
            "spacing": { "B": "0.0" },
            "text-transform": { "B": "none" }
        }
    },
    { "A?": "B", "A": 1 },
    {
        "A?": "A",
        "A": {
            "tracking": {},
            "text-align": {},
            "color": {},
            "decoration": {},
            "leading": {},
            "font-size": {},
            "text-transform": {},
            "font-family": {},
            "link": {},
            "spacing": {}
        }
    }
];
console.log('Updated address and map link');

// Update Tuesday (Element 7)
const tuesdayCard = sec3.E[7];
const tuesTime = " 17:45 - 18:45\n";
tuesdayCard.c[0].a.A[0].A = tuesTime;
tuesdayCard.c[0].a.B[1].A = tuesTime.length;

// Update Saturday (Element 9)
const saturdayCard = sec3.E[9];
const satLine1 = "Тематични занимания\n";
const satLine2 = "10:00 - 12:00 часа\n";
saturdayCard.c[0].a.A[0].A = satLine1 + satLine2;
saturdayCard.c[0].a.B[1].A = satLine1.length;
saturdayCard.c[0].a.B[3].A = satLine2.length;

// Reposition 2 columns symmetrically:
// Canvas width: 1366.
// Column 1 (Tuesday): center around X = 406
// Column 2 (Saturday): center around X = 960
tuesdayCard.B = 200.0;
saturdayCard.B = 753.0;

// Tuesday photo (Element 0, width 274.97):
sec3.E[0].B = 268.8;

// Saturday photo (Element 2, width 232.15):
sec3.E[2].B = 843.2;

// Decorative illustrations:
// Element 3 (near Tuesday):
sec3.E[3].B = 470.0;
// Element 4 (near Saturday):
sec3.E[4].B = 800.0;

// Remove Wednesday elements (Element 1 photo, Element 5 illustration, Element 8 card)
sec3.E = sec3.E.filter((el, idx) => idx !== 1 && idx !== 5 && idx !== 8);
console.log('Updated Section 3 schedule and layout into 2 balanced columns');

// ==========================================
// 3. SECTION 6 (Reviews / Page 5): Testimonials
// ==========================================
const sec6 = bootstrap.page.A.A[6];

const reviews = [
    {
        author: 'Мария с Ева\nна 6 години\n',
        text: '„Откакто дъщеря ми посещава ролевите игри при Рози, забелязвам напредък в начина, по който се изразява у дома. Вече не изпада в афект, а използва думи, за да ни обясни какво я мъчи или радва. Изключително благодарни сме за топлата среда и вниманието, с което работите с децата!“\n'
    },
    {
        author: 'Хриси с Настя\nна 7 години\n',
        text: '„Форматът на групата е прекрасен и позитивен, защото децата учат по най-естествения – през игра и движение. Рози има невероятен подход и успява да центрира всяко дете според неговите индивидуални нужди. Много ни помогна в момент, в който детето отиде от детска градина в първи клас. Препоръчвам горещо тези срещи на всеки родител!“\n'
    },
    {
        author: 'Иван със Стефан\nна 9 години\n',
        text: '„Синът ми беше много притеснителен и изпитваше силен страх да се изправя пред хора или да говори в група. Заниманията по ролеви игри с Рози му помогнаха да пребори страха си от показване. Днес го виждам по-спокоен, уверен и готов да заявява себе си без притеснение!“\n'
    }
];

const bubbleIndices = [1, 2, 3];
const authorIndices = [4, 6, 8];
const textIndices = [5, 7, 9];

const cardTops = [95.0, 290.0, 485.0];
const cardHeight = 180.0;
const cardLeft = 540.0;
const cardWidth = 770.0;

for (let i = 0; i < 3; i++) {
    const bIndex = bubbleIndices[i];
    const aIndex = authorIndices[i];
    const tIndex = textIndices[i];
    const top = cardTops[i];
    const rev = reviews[i];

    // Update Bubble
    const bubble = sec6.E[bIndex];
    bubble.A = top;
    bubble.B = cardLeft;
    bubble.D = cardWidth;
    bubble.C = cardHeight;

    // Update Author
    const authorEl = sec6.E[aIndex];
    authorEl.A = top + 35.0;
    authorEl.B = cardLeft + 35.0;
    authorEl.D = 185.0;
    authorEl.C = 60.0;
    authorEl.a.A = [{ "A?": "A", "A": rev.author }];
    authorEl.a.B = [
        {
            "A?": "A",
            "A": {
                "direction": { "B": "ltr" },
                "font-weight": { "B": "bold" },
                "decoration": { "B": "none" },
                "text-transform": { "B": "none" },
                "color": { "B": "#373d3b" },
                "spacing": { "B": "0.0" },
                "head-indent": { "B": "0.0" },
                "kerning": { "B": "0.0" },
                "list-marker": { "B": "none" },
                "link": { "B": "" },
                "style": { "B": "body" },
                "font-style": { "B": "normal" },
                "font-size": { "B": "18.0" },
                "font-family": { "B": "YAEwfYJNRYY,0" },
                "text-align": { "B": "start" },
                "tracking": { "B": "0.0" },
                "leading": { "B": "1300.0" },
                "list-level": { "B": "0.0" }
            }
        },
        { "A?": "B", "A": rev.author.length },
        { "A?": "A", "A": {} }
    ];

    // Update Text
    const textEl = sec6.E[tIndex];
    textEl.A = top + 18.0;
    textEl.B = cardLeft + 230.0;
    textEl.D = 490.0;
    textEl.C = 145.0;
    textEl.a.A = [{ "A?": "A", "A": rev.text }];
    textEl.a.B = [
        {
            "A?": "A",
            "A": {
                "direction": { "B": "ltr" },
                "font-weight": { "B": "normal" },
                "decoration": { "B": "none" },
                "text-transform": { "B": "none" },
                "color": { "B": "#373d3b" },
                "spacing": { "B": "0.0" },
                "head-indent": { "B": "0.0" },
                "kerning": { "B": "0.0" },
                "list-marker": { "B": "none" },
                "link": { "B": "" },
                "style": { "B": "body" },
                "font-style": { "B": "normal" },
                "font-size": { "B": "16.0" },
                "font-family": { "B": "YAEnXArs1iQ,0" },
                "text-align": { "B": "start" },
                "tracking": { "B": "0.0" },
                "leading": { "B": "1500.0" },
                "list-level": { "B": "1.0" }
            }
        },
        { "A?": "B", "A": rev.text.length },
        { "A?": "A", "A": {} }
    ];
}

// Reposition left illustration group in sec6 to align nicely with the taller cards
sec6.E[10].A = 260.0;

console.log('Updated Section 6 reviews and card dimensions');

// ==========================================
// Serialize back to index.html
// ==========================================
const newJsonString = JSON.stringify(bootstrap);
const newEscaped = JSON.stringify(newJsonString);
const newScriptTag = "window['bootstrap'] = JSON.parse(" + newEscaped + ");";

const updatedHtml = html.substring(0, startIdx) + newScriptTag + html.substring(endJson + 3);
fs.writeFileSync('index.html', updatedHtml, 'utf8');
console.log('Successfully updated index.html!');
