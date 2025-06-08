# Döviz Kuru Takip ve Haber Sitesi

Bu proje, güncel döviz kurlarını ve ekonomi haberlerini takip etmek için geliştirilmiş bir web uygulamasıdır. Proje, Exchange Rate API kullanarak döviz kurlarını ve çeşitli haber kaynaklarından RSS beslemeleri alarak ekonomi haberlerini sunar.

## Özellikler

- **Döviz Kurları:** Popüler döviz kurlarının TL karşısındaki güncel değerleri
- **Detaylı Kur Bilgisi:** Seçilen döviz için detaylı bilgi ve geçmiş veriler
- **Ekonomi Haberleri:** RSS beslemelerinden alınan güncel ekonomi ve finans haberleri
- **Responsive Tasarım:** Mobil cihazlara uyumlu kullanıcı arayüzü
- **Koyu Tema:** Göz yormayan modern bir arayüz

## Teknolojiler

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend:** PHP
- **API:** Exchange Rate API
- **Haber Kaynakları:** RSS Beslemeleri (TRT Haber, NTV, Bloomberg HT)

## Kurulum

1. Projeyi bir web sunucusuna (Apache, Nginx vb.) yerleştirin
2. [Exchange Rate API](https://www.exchangerate-api.com/) sitesinden ücretsiz bir API anahtarı alın
3. `api/exchange-rates.php` dosyasındaki `$apiKey` değişkenini kendi API anahtarınızla güncelleyin
4. Web tarayıcısından projeyi açın

## Demo Modu

Projeyi API anahtarı olmadan da test edebilirsiniz. Bu durumda sistem, gerçek verileri çekmek yerine örnek veriler gösterecektir. Gerçek verilerle çalışmak için yukarıda belirtilen API anahtarını almanız gerekmektedir.

## Dosya Yapısı

```
├── index.php            # Ana sayfa
├── css/
│   └── style.css        # Özel stiller
├── js/
│   └── app.js           # JavaScript fonksiyonları
├── api/
│   ├── exchange-rates.php   # Döviz kurları API işlemleri
│   └── news.php             # Haber API işlemleri
└── img/                 # Görseller klasörü
```

## Geliştirme

Projeyi kendi ihtiyaçlarınıza göre özelleştirebilirsiniz:

- Farklı döviz kurları eklemek için `js/app.js` dosyasındaki `popularCurrencies` dizisini güncelleyin
- Haber kaynaklarını değiştirmek için `api/news.php` dosyasındaki `$rssFeeds` dizisini düzenleyin
- Tasarımı özelleştirmek için `css/style.css` dosyasını değiştirin

## Gelecek Özellikler

- Kullanıcı girişi ve favori döviz kurlarını kaydetme
- Geçmiş kur verilerinin grafiksel gösterimi
- Döviz çevirici hesaplama aracı
- Mobil uygulama versiyonu

## Lisans

Bu proje açık kaynaklıdır ve MIT lisansı altında dağıtılmaktadır.

## İletişim

Proje hakkında sorularınız veya önerileriniz için [musabyusufustun@outlook.com] adresine e-posta gönderebilirsiniz.

