const products = [
    { name: "DZYN Phoenix", price: 12999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", sizes: [36,37,38,39,40,41,42,43,44] },
    { name: "Golden Falcon", price: 15999, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500", sizes: [36,37,38,39,40,41,42,43,44] },
    { name: "DZYN Monarch", price: 18999, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500", sizes: [36,37,38,39,40,41,42,43,44] },
    { name: "Sahara Luxe", price: 13999, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500", sizes: [36,37,38,39,40,41,42,43,44] },
    { name: "DZYN Aura", price: 21999, image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500", sizes: [36,37,38,39,40,41,42,43,44] },
    { name: "Atlas Gold", price: 9999, image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500", sizes: [36,37,38,39,40,41,42,43,44] }
];

const wilayas = [
    "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
    "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
    "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "عمان", "المسيلة", "معسكر", "ورقلة",
    "وهران", "البيض", "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي",
    "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية", "غليزان",
    "تميمون", "برج باجي مختار", "أولاد جلال", "بني عباس", "عين صالح", "عين قزام", "توقرت", "جانت",
    "المغير", "المنيعة", "أولاد مهدي", "بوخضرة", "زاوية", "ثنية", "بوقاعة", "القل", "الداموس", "الصومعة", "العامرية"
];

let currentProduct = "";

function renderProducts() {
    const grid = document.getElementById("productsGrid");
    grid.innerHTML = products.map((p, idx) => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price} دج</div>
                <button class="order-btn" data-name="${p.name}">اطلب الآن</button>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".order-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            currentProduct = btn.dataset.name;
            document.getElementById("productName").value = currentProduct;
            document.getElementById("orderModal").style.display = "flex";
        });
    });
}

function populateSizes() {
    const sizeSelect = document.getElementById("size");
    for(let i=36; i<=44; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        sizeSelect.appendChild(opt);
    }
}

function populateWilayas() {
    const wilayaSelect = document.getElementById("wilaya");
    wilayas.forEach(w => {
        let opt = document.createElement("option");
        opt.value = w;
        opt.textContent = w;
        wilayaSelect.appendChild(opt);
    });
}

document.getElementById("orderForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    let phone = document.getElementById("phone").value.replace(/\D/g, '');
    if(!phone.startsWith("213")) phone = "213" + phone;
    if(phone.length !== 12 || !phone.startsWith("213")) {
        alert("رقم الهاتف يجب أن يبدأ بـ +213 ويتكون من 9 أرقام بعد 213");
        return;
    }

    const orderData = {
        fullName: document.getElementById("fullName").value,
        phone: `+${phone}`,
        wilaya: document.getElementById("wilaya").value,
        productName: currentProduct,
        size: document.getElementById("size").value,
        quantity: document.getElementById("quantity").value
    };

    if(!orderData.fullName || !orderData.wilaya || !orderData.size) {
        alert("يرجى ملء جميع الحقول");
        return;
    }

    // رابط Google Apps Script مدمج مباشرة
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8sZrfl0z2rRgDqnBncLNMl9bR0nuMC-6ALqXpCm9JpiL7DUCiV6s5I3J-1V0HU8Tn/exec";

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });
        document.getElementById("formMessage").innerHTML = "<p style='color:#ffd700; text-align:center;'>✅ تم استلام طلبك، سنتصل بك قريباً</p>";
        setTimeout(() => {
            document.getElementById("orderModal").style.display = "none";
            document.getElementById("orderForm").reset();
            document.getElementById("formMessage").innerHTML = "";
        }, 2000);
    } catch(err) {
        alert("حدث خطأ، حاول مرة أخرى");
    }
});

document.querySelector(".close").onclick = () => {
    document.getElementById("orderModal").style.display = "none";
};
window.onclick = (e) => {
    if(e.target === document.getElementById("orderModal"))
        document.getElementById("orderModal").style.display = "none";
};

renderProducts();
populateSizes();
populateWilayas();