<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Döviz Kuru Takip ve Haberler</title>
    <!-- Favicon -->
    <link rel="icon" href="img/favicon.ico" type="image/x-icon">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="fas fa-chart-line me-2"></i>Döviz Takip</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Ana Sayfa</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#kurlar">Döviz Kurları</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#haberler">Haberler</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <header class="py-0 text-white text-center" id="header">
        <div class="header-banner">
            <div class="container">
                <div class="header-content">
                    <h1 class="main-title">CANLI DÖVİZ KURLARI</h1>
                    <div class="subtitle-container">
                        <p class="subtitle">TÜRKİYE'NİN EN GÜNCEL FİNANS VE DÖVİZ PLATFORMU</p>
                    </div>
                    <div class="header-icon mt-4">
                        <i class="fas fa-chart-line pulse"></i>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Döviz Kurları Bölümü -->
    <section class="py-5" id="kurlar">
        <div class="container">
            <div class="section-title mb-4">
                <h2>Döviz Kurları</h2>
                <p>Son güncelleme: <span id="lastUpdate"></span></p>
            </div>
            
            <div class="row" id="exchangeRates">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                    <p>Döviz kurları yükleniyor...</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Detaylı Kur Bilgisi -->
    <section class="py-5 bg-light d-none" id="kurDetay">
        <div class="container">
            <div class="section-title mb-4">
                <h2>Detaylı Kur Bilgisi</h2>
                <p id="detayCurrency"></p>
            </div>
            
            <div class="card shadow">
                <div class="card-body">
                    <div id="currencyDetailContent"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Haberler Bölümü -->
    <section class="py-5" id="haberler">
        <div class="container">
            <div class="section-title mb-4">
                <h2>Döviz Haberleri</h2>
            </div>
            
            <div class="row" id="newsContainer">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                    <p>Haberler yükleniyor...</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>Döviz Takip</h5>
                    <p>Güncel döviz kurları ve finans haberleri</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p>&copy; 2025 Döviz Takip. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="js/app.js"></script>
</body>
</html> 