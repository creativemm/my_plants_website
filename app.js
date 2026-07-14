// --- ၁။ အခြေခံ Variables များ ---
let currentLang = 'mm'; 
let plantsData = []; 
let currentSearchTerm = '';
let currentCategory = 'all';

// --- ၂။ UI စာသားများ (ဘာသာစကားပြောင်းရန်) ---
const uiTranslations = {
    en: {
        searchPlaceholder: "Search plants...",
        filterAll: "All",
        filterMedicinal: "Medicinal",
        filterSeasonal: "Seasonal",
        filterIndoor: "Indoor",
        // အောက်ပါ Modal Labels များကို အသစ်ထပ်တိုးပါ
        lblSun: "☀️ Sunlight - ",
        lblWater: "💧 Water - ",
        lblSoil: "🌱 Soil - ",
        lblCare: "🛠️ Care Level - "
    },
    mm: {
        searchPlaceholder: "အပင်အမည် ရှာဖွေရန်...",
        filterAll: "အားလုံး",
        filterMedicinal: "ဆေးဖက်ဝင်",
        filterSeasonal: "ရာသီပေါ်",
        filterIndoor: "အိမ်တွင်းစိုက်",
        // အောက်ပါ Modal Labels များကို အသစ်ထပ်တိုးပါ
        lblSun: "☀️ နေရောင်ခြည် - ",
        lblWater: "💧 ရေလိုအပ်ချက် - ",
        lblSoil: "🌱 မြေဆီလွှာ - ",
        lblCare: "🛠️ ပြုစုရန် - "
    }
};

function updateUILanguage() {
    const t = uiTranslations[currentLang]; 
    
    // Search နှင့် Buttons များ
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    
    const btnAll = document.getElementById('btn-filter-all');
    if (btnAll) btnAll.innerText = t.filterAll;
    
    const btnMed = document.getElementById('btn-filter-medicinal');
    if (btnMed) btnMed.innerText = t.filterMedicinal;
    
    const btnSea = document.getElementById('btn-filter-seasonal');
    if (btnSea) btnSea.innerText = t.filterSeasonal;
    
    const btnInd = document.getElementById('btn-filter-indoor');
    if (btnInd) btnInd.innerText = t.filterIndoor;

    // --- အောက်ပါ Modal Labels ပြောင်းလဲသည့် Code များကို အသစ်ထပ်တိုးပါ ---
    const lblSun = document.getElementById('lbl-sun');
    if (lblSun) lblSun.innerText = t.lblSun;

    const lblWater = document.getElementById('lbl-water');
    if (lblWater) lblWater.innerText = t.lblWater;

    const lblSoil = document.getElementById('lbl-soil');
    if (lblSoil) lblSoil.innerText = t.lblSoil;

    const lblCare = document.getElementById('lbl-care');
    if (lblCare) lblCare.innerText = t.lblCare;
}

// --- ၃။ data.json မှ Data များ ယူခြင်း ---
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        plantsData = data;
        displayPlants();
    })
    .catch(error => console.error("Data error:", error));

// --- ၄။ အပင် Data များကို HTML ပေါ်ပြသခြင်း ---
function displayPlants() {
    const container = document.getElementById('plant-container');
    if(!container) return; 
    container.innerHTML = ''; 

    const filteredPlants = plantsData.filter(plant => {
        const langData = plant[currentLang];
        const matchesSearch = langData.name.toLowerCase().includes(currentSearchTerm.toLowerCase());
        const matchesCategory = currentCategory === 'all' || plant.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    filteredPlants.forEach(plant => {
        const langData = plant[currentLang]; 
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.style.cursor = 'pointer'; 
        
        let shortDesc = langData.description;
        if(shortDesc.length > 50) {
            shortDesc = shortDesc.substring(0, 50) + "...";
        }

        card.innerHTML = `
            <img src="${plant.image}" alt="${langData.name}" class="plant-image">
            <h2>${langData.name}</h2>
            <p>${shortDesc}</p>
        `;
        
        card.addEventListener('click', () => {
            openModal(plant);
        });

        container.appendChild(card);
    });
}

// --- ၅။ Modal (Popup) အလုပ်လုပ်မည့် အပိုင်း ---
const modal = document.getElementById('plant-modal');
const closeModalBtn = document.querySelector('.close-modal');

function openModal(plant) {
    if(!modal) return; 
    
    const langData = plant[currentLang];
    document.getElementById('modal-img').src = plant.image;
    document.getElementById('modal-title').innerText = langData.name;
    document.getElementById('modal-desc').innerText = langData.description;
    document.getElementById('modal-sun').innerText = langData.sunlight;
    document.getElementById('modal-water').innerText = langData.water;
    
    // အောက်က နှစ်ကြောင်းကို အသစ်ထပ်တိုးပါ
    document.getElementById('modal-soil').innerText = langData.soil;
    document.getElementById('modal-care').innerText = langData.care_level;
    
    modal.classList.add('show'); 
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// --- ၆။ Search Bar ---
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        displayPlants(); 
    });
}

// --- ၇။ Category Filters ---
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        displayPlants();
    });
});

// --- ၈။ Hamburger Menu ---
const hamburgerBtn = document.getElementById('hamburger-menu');
const sideMenu = document.getElementById('side-menu');
const closeMenuBtn = document.getElementById('close-menu');

if (hamburgerBtn && sideMenu) {
    hamburgerBtn.addEventListener('click', () => {
        sideMenu.classList.add('show');
    });
}

if (closeMenuBtn && sideMenu) {
    closeMenuBtn.addEventListener('click', () => {
        sideMenu.classList.remove('show');
    });
}

// --- ၉။ Dark / Light Mode ---
const btnTheme = document.getElementById('btn-theme');
if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if(document.body.classList.contains('dark-mode')) {
            btnTheme.innerText = '☀️ Light Mode';
        } else {
            btnTheme.innerText = '🌙 Dark Mode';
        }
    });
}

// --- ၁၀။ Menu အတွင်းရှိ Language ပြောင်းခြင်း ---
const btnEnMenu = document.getElementById('btn-en-menu');
const btnMmMenu = document.getElementById('btn-mm-menu');

function setLanguage(lang) {
    currentLang = lang;
    displayPlants(); 
    updateUILanguage(); 
    
    if (btnEnMenu && btnMmMenu) {
        if (lang === 'en') {
            btnEnMenu.classList.add('active');
            btnMmMenu.classList.remove('active');
        } else {
            btnMmMenu.classList.add('active');
            btnEnMenu.classList.remove('active');
        }
    }
}

if (btnEnMenu) {
    btnEnMenu.addEventListener('click', () => {
        setLanguage('en');
        if (sideMenu) sideMenu.classList.remove('show');
    });
}

if (btnMmMenu) {
    btnMmMenu.addEventListener('click', () => {
        setLanguage('mm');
        if (sideMenu) sideMenu.classList.remove('show');
    });
}

// ပထမဆုံး စတင်ချိန်တွင် UI ကို Update လုပ်ရန်
updateUILanguage();
// --- ၁၁။ Contact Us Modal အလုပ်လုပ်မည့် အပိုင်း ---
const contactModal = document.getElementById('contact-modal');
const btnContact = document.getElementById('btn-contact');
const closeContactBtn = document.querySelector('.close-contact');

if (btnContact) {
    btnContact.addEventListener('click', () => {
        contactModal.classList.add('show');
        if (sideMenu) sideMenu.classList.remove('show'); // Menu ကို ပိတ်ပြီး Modal ဖွင့်မည်
    });
}

if (closeContactBtn) {
    closeContactBtn.addEventListener('click', () => {
        contactModal.classList.remove('show');
    });
}

// Modal အပြင်ဘက်ကို နှိပ်လျှင် ပိတ်မည့်စနစ် (Plant Modal ရော Contact Modal ရော အလုပ်လုပ်ရန် ပြင်ဆင်ထားသည်)
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
    if (e.target === contactModal) {
        contactModal.classList.remove('show');
    }
});
// --- ၁၂။ Back to Top ခလုတ် အလုပ်လုပ်မည့် အပိုင်း ---
const backToTopBtn = document.getElementById("back-to-top");

// စခရင်ကို အောက်ဘက်သို့ Pixel 300 ခန့် ဆွဲချလိုက်သောအခါ ခလုတ်ကို ပြမည်
window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.style.display = "flex";
        } else {
            backToTopBtn.style.display = "none";
        }
    }
});

// ခလုတ်ကို နှိပ်သောအခါ အပေါ်ဆုံးသို့ ညင်သာစွာ (smooth) ပြန်တက်မည်
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' /* ညင်သာစွာ အပေါ်တက်မည့် Effect */
        });
    });
}