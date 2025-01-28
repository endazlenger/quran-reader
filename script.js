// Başlangıç sayfası
let currentPage = localStorage.getItem("currentPage") ? parseInt(localStorage.getItem("currentPage")) : 1;
let scale = localStorage.getItem("scale") ? parseFloat(localStorage.getItem("scale")) : 1; // Zoom seviyesini kaydet
const totalPages = 604; // Kur'an'da toplam sayfa sayısı
let pdfDoc = null; // PDF doküman objesi
const zoomStep = 0.2; // Zoom artırma/azaltma miktarı
const minScale = 0.5; // Minimum zoom seviyesi
const maxScale = 3.0; // Maksimum zoom seviyesi

// PDF dosyasının yolu
const url = 'pdf/quran.pdf';

// PDF dosyasını yükleme
pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    renderPage(currentPage); // Başlangıçta kaldığınız sayfayı yükle
});

// Sayfa render fonksiyonu
function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then(function (page) {
        // Ölçeklendirme ve viewport ayarı
        const viewport = page.getViewport({ scale: scale });

        // Canvas elemanını ayarlama
        const canvas = document.getElementById('pdf-viewer');
        const context = canvas.getContext('2d');

        // Yüksek çözünürlük için canvas boyutlarını ayarla
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;

        // PDF sayfasını canvas üzerine çiz
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform
        };

        page.render(renderContext);
    });
}

// Sayfaya gitme işlevi (Girilen sayfaya +1 eklenerek işlem yapılır)
function goToPage() {
    let pageNumber = parseInt(document.getElementById('page-number').value); // Kullanıcıdan sayfa numarasını al
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        pageNumber += 1; // Girilen sayfa numarasına +1 ekleyelim
        currentPage = pageNumber; // Sayfayı güncelle
        renderPage(currentPage); // Yeni sayfayı render et
        localStorage.setItem("currentPage", currentPage); // Sayfa numarasını kaydet
    } else {
        alert('Geçersiz sayfa numarası!'); // Hatalı sayfa numarası girildiğinde uyarı
    }
}

// Önceki sayfa butonuna tıklanınca çağrılan fonksiyon
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
        localStorage.setItem("currentPage", currentPage); // Sayfa numarasını sakla
    }
}

// Sonraki sayfa butonuna tıklanınca çağrılan fonksiyon
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        localStorage.setItem("currentPage", currentPage); // Sayfa numarasını sakla
    }
}

// Zoom In (Yakınlaştırma) fonksiyonu
function zoomIn() {
    if (scale < maxScale) {
        scale += zoomStep; // Zoom seviyesi artırılıyor
        localStorage.setItem("scale", scale); // Zoom seviyesini sakla
        renderPage(currentPage); // Mevcut sayfayı yeniden çiz
    }
}

// Zoom Out (Uzaklaştırma) fonksiyonu
function zoomOut() {
    if (scale > minScale) { // Minimum zoom seviyesi
        scale -= zoomStep; // Zoom seviyesi azaltılıyor
        localStorage.setItem("scale", scale); // Zoom seviyesini sakla
        renderPage(currentPage); // Mevcut sayfayı yeniden çiz
    }
}

// Butonlara tıklama olaylarını ekliyoruz
document.getElementById('prev').addEventListener('click', prevPage);
document.getElementById('next').addEventListener('click', nextPage);
document.getElementById('zoom-in').addEventListener('click', zoomIn);
document.getElementById('zoom-out').addEventListener('click', zoomOut);

// Sayfaya gitme işlevi (Girilen sayfaya +1 eklenerek işlem yapılır)
document.getElementById('go-to-page').addEventListener('click', goToPage);
document.getElementById('page-number').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // ENTER tuşuna basıldığında
        goToPage(); // Sayfaya gitme fonksiyonunu çalıştır
    }
});
