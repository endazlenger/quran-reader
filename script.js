// Başlangıç ayarları
let currentPage = localStorage.getItem("currentPage") ? parseInt(localStorage.getItem("currentPage")) : 0;
let scale = localStorage.getItem("scale") ? parseFloat(localStorage.getItem("scale")) : 1;
const totalPages = 604;
const zoomStep = 0.2, minScale = 0.5, maxScale = 3.0;
let pdfDoc = null;
const url = 'pdf/quran.pdf';

// PDF'yi yükleme
pdfjsLib.getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;
    renderPage(currentPage);
});

// Sayfayı render etme
function renderPage(pageNum) {
    pdfDoc.getPage(pageNum + 1).then(page => { // PDF.js sayfa numaralandırması 1'den başlıyor
        const viewport = page.getViewport({ scale });
        const canvas = document.getElementById('pdf-viewer');
        const context = canvas.getContext('2d');

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.clearRect(0, 0, canvas.width, canvas.height); // Önceki sayfayı temizle

        const renderContext = { canvasContext: context, viewport, transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null };
        page.render(renderContext);
    });

    updatePageStatus();
}

// Sayfa durumunu güncelleme
function updatePageStatus() {
    document.getElementById('page-status').textContent = `Şu anda ${currentPage}. sayfadasınız`;
    document.getElementById('page-number').value = currentPage; // Sayfa numarasını inputa yansıt
}

// Sayfaya gitme
function goToPage() {
    let pageNumber = parseInt(document.getElementById('page-number').value);
    if (pageNumber >= 0 && pageNumber < totalPages) {
        currentPage = pageNumber;
        localStorage.setItem("currentPage", currentPage);
        renderPage(currentPage);
    } else {
        alert('Geçersiz sayfa numarası!');
    }
}

// Sayfa değiştirme fonksiyonları
function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 0 && newPage < totalPages) {
        currentPage = newPage;
        localStorage.setItem("currentPage", currentPage);
        renderPage(currentPage);
    }
}

// Zoom işlemleri
function changeZoom(direction) {
    const newScale = scale + direction * zoomStep;
    if (newScale >= minScale && newScale <= maxScale) {
        scale = newScale;
        localStorage.setItem("scale", scale);
        renderPage(currentPage);
    }
}

// Buton event'leri
document.getElementById('next').addEventListener('click', () => changePage(1));
document.getElementById('prev').addEventListener('click', () => changePage(-1));
document.getElementById('zoom-in').addEventListener('click', () => changeZoom(1));
document.getElementById('zoom-out').addEventListener('click', () => changeZoom(-1));
document.getElementById('go-to-page').addEventListener('click', goToPage);
document.getElementById('page-number').addEventListener('keydown', event => { if (event.key === 'Enter') goToPage(); });
document.getElementById('next-bottom').addEventListener('click', () => changePage(1));
document.getElementById('prev-bottom').addEventListener('click', () => changePage(-1));
