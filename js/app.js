// Global değişkenler
const baseCurrency = 'TRY'; // Temel para birimi (Türk Lirası)
const popularCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'CNY', 'RUB', 'SAR'];
let exchangeRateData = null;

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    // Döviz kurlarını al
    fetchExchangeRates();
    
    // Haberleri al
    fetchNews();
    
    // Sayfa içi linklerin smooth scroll özelliği
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Exchange Rate API'den döviz kurlarını almak için fonksiyon
async function fetchExchangeRates() {
    try {
        // API isteği yap
        const response = await fetch(`api/exchange-rates.php`);
        
        if (!response.ok) {
            throw new Error('Döviz kuru verileri alınamadı');
        }
        
        const data = await response.json();
        exchangeRateData = data;
        
        // Alınan verileri görüntüle
        displayExchangeRates(data);
        
        // Son güncelleme zamanını göster
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleString('tr-TR');
        
    } catch (error) {
        console.error('Hata:', error);
        document.getElementById('exchangeRates').innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Döviz kurları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                </div>
            </div>
        `;
    }
}

// Döviz kurlarını ekranda göstermek için fonksiyon
function displayExchangeRates(data) {
    const container = document.getElementById('exchangeRates');
    container.innerHTML = '';
    
    // Popüler para birimlerini filtrele ve göster
    popularCurrencies.forEach((currency, index) => {
        if (data.rates[currency]) {
            // TRY/X formatından X/TRY formatına çevir (1 Dolar kaç TL gibi)
            const rate = 1 / data.rates[currency];
            
            const card = document.createElement('div');
            card.className = 'col-md-4 col-sm-6 fade-in';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="card currency-card" data-currency="${currency}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${getCurrencyFullName(currency)}</span>
                        <span class="badge bg-primary">${currency}</span>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="currency-rate">${rate.toFixed(4)} ₺</div>
                                <div class="rate-change">
                                    <i class="fas fa-arrow-up rate-up"></i>
                                    <span>%0.25</span>
                                </div>
                            </div>
                            <div>
                                <img src="https://flagcdn.com/48x36/${getCurrencyFlag(currency)}.png" alt="${currency}" width="48" height="36">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
            
            // Kur kartına tıklama olayı ekle
            card.querySelector('.currency-card').addEventListener('click', () => {
                showCurrencyDetail(currency, rate);
            });
        }
    });
}

// Para birimi detaylarını gösterme fonksiyonu
function showCurrencyDetail(currency, rate) {
    const detaySection = document.getElementById('kurDetay');
    const detayCurrency = document.getElementById('detayCurrency');
    const detayContent = document.getElementById('currencyDetailContent');
    
    // Başlığı güncelle
    detayCurrency.textContent = `${getCurrencyFullName(currency)} (${currency}) / Türk Lirası (TRY)`;
    
    // İçeriği oluştur
    detayContent.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-4">
                <h4>Güncel Kur</h4>
                <div class="display-4 mb-3">${rate.toFixed(4)} ₺</div>
                <p>1 ${currency} = ${rate.toFixed(4)} TRY</p>
                <p>1 TRY = ${(1/rate).toFixed(6)} ${currency}</p>
            </div>
            <div class="col-md-6 mb-4">
                <h4>Değişim</h4>
                <div class="d-flex align-items-center mb-2">
                    <span class="me-2">24 Saat:</span>
                    <span class="badge bg-success"><i class="fas fa-arrow-up me-1"></i> %0.25</span>
                </div>
                <div class="d-flex align-items-center mb-2">
                    <span class="me-2">1 Hafta:</span>
                    <span class="badge bg-success"><i class="fas fa-arrow-up me-1"></i> %1.32</span>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-2">1 Ay:</span>
                    <span class="badge bg-danger"><i class="fas fa-arrow-down me-1"></i> %0.87</span>
                </div>
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-12">
                <h4>Geçmiş Veriler</h4>
                <div class="d-flex mb-3">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="loadHistoricalData('${currency}', 7)">7 Gün</button>
                    <button class="btn btn-sm btn-primary me-2" onclick="loadHistoricalData('${currency}', 30)">30 Gün</button>
                    <button class="btn btn-sm btn-outline-primary" onclick="loadHistoricalData('${currency}', 90)">90 Gün</button>
                </div>
                <div class="chart-container" style="position: relative; height:300px; background-color: #2c2c2c; border-radius: 8px;">
                    <canvas id="rateHistoryChart"></canvas>
                    <div id="chartLoading" class="d-flex justify-content-center align-items-center" style="position:absolute; top:0; left:0; width:100%; height:100%;">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Yükleniyor...</span>
                        </div>
                        <span class="ms-2">Grafik yükleniyor...</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Detay bölümünü göster
    detaySection.classList.remove('d-none');
    
    // Sayfayı detay bölümüne kaydır
    detaySection.scrollIntoView({ behavior: 'smooth' });
    
    // Geçmiş verileri yükle (varsayılan 30 gün)
    loadHistoricalData(currency, 30);
}

// Geçmiş döviz kuru verilerini yükleme fonksiyonu
async function loadHistoricalData(currency, days) {
    try {
        // Aktif butonları güncelle
        document.querySelectorAll('#kurDetay .btn-primary').forEach(btn => {
            btn.classList.replace('btn-primary', 'btn-outline-primary');
        });
        
        document.querySelector(`#kurDetay button[onclick="loadHistoricalData('${currency}', ${days})"]`).classList.replace('btn-outline-primary', 'btn-primary');
        
        // Yükleme göstergesini aç
        document.getElementById('chartLoading').style.display = 'flex';
        
        // API isteği yap
        const response = await fetch(`api/exchange-rates-history.php?currency=${currency}&days=${days}`);
        
        if (!response.ok) {
            throw new Error('Geçmiş veriler alınamadı');
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.message || 'API verisi alınamadı');
        }
        
        // Grafik verilerini hazırla
        const chartLabels = [];
        const chartData = [];
        
        if (data.history && data.history.length > 0) {
            data.history.forEach(item => {
                // Tarih formatını düzenle
                const date = new Date(item.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                
                chartLabels.push(formattedDate);
                chartData.push(item.rate);
            });
            
            // Grafiği oluştur
            createChart(chartLabels, chartData, currency);
        } else {
            throw new Error('Geçmiş veriler bulunamadı');
        }
        
    } catch (error) {
        console.error('Grafik hatası:', error);
        document.getElementById('chartLoading').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Grafik yüklenirken bir hata oluştu: ${error.message}
            </div>
        `;
    }
}

// Chart.js ile grafik oluşturma fonksiyonu
function createChart(labels, data, currency) {
    // Önceki grafik varsa temizle
    if (window.rateChart) {
        window.rateChart.destroy();
    }
    
    // Yükleme göstergesini kapat
    document.getElementById('chartLoading').style.display = 'none';
    
    // Grafik renk ayarları
    const ctx = document.getElementById('rateHistoryChart').getContext('2d');
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(30, 144, 255, 0.5)');
    gradientFill.addColorStop(1, 'rgba(30, 144, 255, 0.1)');
    
    // Grafiği oluştur
    window.rateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `1 ${currency} = ? TRY`,
                data: data,
                borderColor: '#1E90FF',
                borderWidth: 2,
                backgroundColor: gradientFill,
                fill: true,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#1E90FF',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Segoe UI',
                            size: 12
                        },
                        color: '#e0e0e0'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(40, 40, 40, 0.9)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#e0e0e0',
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(4)} ₺`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(80, 80, 80, 0.2)'
                    },
                    ticks: {
                        color: '#9e9e9e',
                        font: {
                            family: 'Segoe UI',
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        display: true,
                        color: 'rgba(80, 80, 80, 0.2)'
                    },
                    ticks: {
                        color: '#9e9e9e',
                        font: {
                            family: 'Segoe UI',
                            size: 10
                        },
                        callback: function(value) {
                            return value.toFixed(2) + ' ₺';
                        }
                    }
                }
            }
        }
    });
}

// RSS ile haberleri almak için fonksiyon
async function fetchNews() {
    try {
        // API isteği yap
        const response = await fetch(`api/news.php`);
        
        if (!response.ok) {
            throw new Error('Haberler alınamadı');
        }
        
        const data = await response.json();
        
        // Alınan verileri görüntüle
        displayNews(data);
        
    } catch (error) {
        console.error('Hata:', error);
        document.getElementById('newsContainer').innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Haberler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                </div>
            </div>
        `;
    }
}

// Haberleri ekranda göstermek için fonksiyon
function displayNews(news) {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';
    
    if (!news || news.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">Şu anda gösterilecek haber bulunmamaktadır.</div></div>';
        return;
    }
    
    // Ana satır
    const row = document.createElement('div');
    row.className = 'row';
    container.appendChild(row);
    
    // Başlangıçta sadece 9 haber göster
    const initialNewsCount = 9;
    const hasMoreNews = news.length > initialNewsCount;
    
    // Gösterilecek haber sayısını belirle
    const newsToShow = hasMoreNews ? initialNewsCount : news.length;
    
    // Her bir haberi görüntüle
    for (let i = 0; i < newsToShow; i++) {
        const item = news[i];
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 fade-in';
        card.style.animationDelay = `${i * 0.1}s`;
        
        // Haberin içeriğinden ilk paragrafı al (açıklama olarak)
        const parser = new DOMParser();
        const doc = parser.parseFromString(item.content, 'text/html');
        let description = '';
        
        // İlk paragrafı bul
        const firstParagraph = doc.querySelector('p');
        if (firstParagraph) {
            description = firstParagraph.textContent.trim();
            if (description.length > 120) {
                description = description.substring(0, 120) + '...';
            }
        } else if (item.description) {
            // Eğer paragraf bulunamazsa description alanını kullan
            description = item.description.length > 120 ? item.description.substring(0, 120) + '...' : item.description;
        } else {
            description = 'Haber detayını görmek için tıklayın...';
        }
        
        // Tarih formatını ayarla
        const pubDate = new Date(item.pubDate);
        const formattedDate = pubDate.toLocaleDateString('tr-TR') + ' ' + pubDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        
        card.innerHTML = `
            <div class="card news-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${description}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="news-date">${formattedDate}</span>
                    <a href="#" class="btn btn-sm btn-primary read-more" data-news-id="${i}">Devamını Oku</a>
                </div>
            </div>
        `;
        
        row.appendChild(card);
        
        // Devamını oku butonuna tıklanınca
        card.querySelector('.read-more').addEventListener('click', (e) => {
            e.preventDefault();
            showNewsDetail(item);
        });
    }
    
    // Eğer 9'dan fazla haber varsa "Daha Fazla" butonu ekle
    if (hasMoreNews) {
        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'col-12 text-center mt-4';
        loadMoreContainer.innerHTML = `
            <button id="loadMoreNews" class="btn btn-outline-primary btn-lg">
                <i class="fas fa-newspaper me-2"></i>Daha Fazla Haber
            </button>
        `;
        container.appendChild(loadMoreContainer);
        
        // Daha fazla butonu tıklama olayı
        document.getElementById('loadMoreNews').addEventListener('click', function() {
            showAllNews(news);
            this.parentNode.remove(); // Butonu kaldır
        });
    }
}

// Tüm haberleri göster
function showAllNews(news) {
    const row = document.querySelector('#newsContainer .row');
    
    // 9. haberden sonraki tüm haberleri ekle
    for (let i = 9; i < news.length; i++) {
        const item = news[i];
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 fade-in';
        card.style.animationDelay = `${(i-9) * 0.1}s`;
        
        // Haberin içeriğinden ilk paragrafı al (açıklama olarak)
        const parser = new DOMParser();
        const doc = parser.parseFromString(item.content, 'text/html');
        let description = '';
        
        // İlk paragrafı bul
        const firstParagraph = doc.querySelector('p');
        if (firstParagraph) {
            description = firstParagraph.textContent.trim();
            if (description.length > 120) {
                description = description.substring(0, 120) + '...';
            }
        } else if (item.description) {
            // Eğer paragraf bulunamazsa description alanını kullan
            description = item.description.length > 120 ? item.description.substring(0, 120) + '...' : item.description;
        } else {
            description = 'Haber detayını görmek için tıklayın...';
        }
        
        // Tarih formatını ayarla
        const pubDate = new Date(item.pubDate);
        const formattedDate = pubDate.toLocaleDateString('tr-TR') + ' ' + pubDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        
        card.innerHTML = `
            <div class="card news-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${description}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="news-date">${formattedDate}</span>
                    <a href="#" class="btn btn-sm btn-primary read-more" data-news-id="${i}">Devamını Oku</a>
                </div>
            </div>
        `;
        
        row.appendChild(card);
        
        // Devamını oku butonuna tıklanınca
        card.querySelector('.read-more').addEventListener('click', (e) => {
            e.preventDefault();
            showNewsDetail(item);
        });
    }
}

// Haber detayını modal ile gösterme
function showNewsDetail(newsItem) {
    // Eğer zaten bir modal varsa kaldır
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Tarih formatını ayarla
    const pubDate = new Date(newsItem.pubDate);
    const formattedDate = pubDate.toLocaleDateString('tr-TR') + ' ' + pubDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    // Yeni modal oluştur
    const modalHtml = `
        <div class="modal fade" id="newsDetailModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header">
                        <h5 class="modal-title">${newsItem.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Kapat"></button>
                    </div>
                    <div class="modal-body">
                        <div class="news-content">
                            ${newsItem.content}
                        </div>
                        <div class="mt-3 text-muted">
                            <small>Kaynak: ${newsItem.source}</small><br>
                            <small>Yayınlanma Tarihi: ${formattedDate}</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                        <a href="${newsItem.link}" target="_blank" class="btn btn-primary">Kaynağa Git</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Modal'ı sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Modal'ı göster
    const modal = new bootstrap.Modal(document.getElementById('newsDetailModal'));
    modal.show();
}

// Para birimi kodu ile ülke bayrağı kodu dönüştürme
function getCurrencyFlag(currencyCode) {
    const flagMap = {
        'USD': 'us',
        'EUR': 'eu',
        'GBP': 'gb',
        'CHF': 'ch',
        'JPY': 'jp',
        'CAD': 'ca',
        'AUD': 'au',
        'CNY': 'cn',
        'RUB': 'ru',
        'SAR': 'sa'
    };
    
    return flagMap[currencyCode] || 'unknown';
}

// Para birimi kodu ile tam adını dönüştürme
function getCurrencyFullName(currencyCode) {
    const nameMap = {
        'USD': 'Amerikan Doları',
        'EUR': 'Euro',
        'GBP': 'İngiliz Sterlini',
        'CHF': 'İsviçre Frangı',
        'JPY': 'Japon Yeni',
        'CAD': 'Kanada Doları',
        'AUD': 'Avustralya Doları',
        'CNY': 'Çin Yuanı',
        'RUB': 'Rus Rublesi',
        'SAR': 'Suudi Arabistan Riyali'
    };
    
    return nameMap[currencyCode] || currencyCode;
} 