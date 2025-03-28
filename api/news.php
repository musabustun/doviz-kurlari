<?php
// CORS ayarları
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// RSS feed adresi
$rss_url = "https://paratic.com/doviz-haberleri/feed/";

// Önbellek ayarları
$cache_file = __DIR__ . "/feed_cache/news_cache.json";
$cache_time = 3600; // Önbelleğin geçerlilik süresi (saniye) - 1 saat

// Önbellekten veri al veya yeni veri çek
function get_cached_data($url, $cache_file, $cache_time) {
    // Önbellek dosyasını kontrol et
    if (file_exists($cache_file) && (time() - filemtime($cache_file) < $cache_time)) {
        // Önbellek dosyası güncel, dosyadan oku
        $cached_data = file_get_contents($cache_file);
        return json_decode($cached_data, true);
    } else {
        // Önbellek yok veya güncel değil, yeni veri çek
        $fresh_data = get_rss_feed($url);
        
        // Veriyi önbelleğe kaydet
        if (!empty($fresh_data)) {
            file_put_contents($cache_file, json_encode($fresh_data));
        }
        
        return $fresh_data;
    }
}

// RSS verilerini al
function get_rss_feed($url) {
    try {
        // cURL ile RSS içeriğini al
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        $rss_content = curl_exec($ch);
        
        if (curl_errno($ch)) {
            throw new Exception("RSS içeriği alınamadı: " . curl_error($ch));
        }
        
        curl_close($ch);
        
        // XML verisini parse et
        $rss = simplexml_load_string($rss_content);
        
        if (!$rss) {
            throw new Exception("RSS verileri ayrıştırılamadı");
        }
        
        // Haberleri dizi formatına dönüştür
        $items = array();
        foreach ($rss->channel->item as $item) {
            // content:encoded namespace'i için
            $content = '';
            $content_ns = $item->children('content', true);
            if (isset($content_ns->encoded)) {
                $content = (string)$content_ns->encoded;
            } else {
                $content = (string)$item->description;
            }
            
            $news_item = array(
                'title' => (string)$item->title,
                'link' => (string)$item->link,
                'description' => (string)$item->description,
                'content' => $content,
                'pubDate' => (string)$item->pubDate,
                'source' => "Paratic.com"
            );
            
            $items[] = $news_item;
        }
        
        return $items;
        
    } catch (Exception $e) {
        error_log("RSS feed hatası: " . $e->getMessage());
        return array();
    }
}

// Ana işlem
try {
    // Önbellekten veya yeni çekilen verileri al
    $news = get_cached_data($rss_url, $cache_file, $cache_time);
    
    if (empty($news)) {
        // Eğer haber alınamadıysa örnek haberler oluştur
        $news = [
            [
                "title" => "Dolar/TL 2025 ve 2026 sonunda ne kadar olacak? Anket sonuçlandı",
                "link" => "https://paratic.com/dolar-tl-2025-ve-2026-sonunda-ne-kadar-olacak-anket-sonuclandi/",
                "content" => "<p>Ekonomistler, Türkiye'de yaşanan gelişmelerin etkisiyle enflasyon ve dolar/TL kuru beklentilerini güncelledi. ForInvest tarafından düzenlenen ankete katılan ekonomistler enflasyon ve dolar/TL'ye yönelik öngörülerini paylaştı.</p>",
                "pubDate" => date("r"),
                "source" => "Paratic.com"
            ],
            [
                "title" => "Dolar endeksi 3 haftanın en yükseğine çıktı!",
                "link" => "https://paratic.com/dolar-endeksi-3-haftanin-en-yuksegine-cikti/",
                "content" => "<p>Yönünü yukarı çeviren ABD dolar endeksi (DXY), bugün 104,42 ile 3 haftanın en yüksek seviyesine çıktı. Yükseliş, açıklanan ekonomik veriler ve ABD ticaret politikasına ilişkin devam eden belirsizlikle desteklendi.</p>",
                "pubDate" => date("r", time() - 3600),
                "source" => "Paratic.com"
            ],
            [
                "title" => "Ruble dolara karşı güçlü yükseliyor: 84 altını denedi!",
                "link" => "https://paratic.com/ruble-dolara-karsi-guclu-yukseliyor-84-altini-denedi/",
                "content" => "<p>Rus rublesi, devam eden ateşkes müzakereleri ortasında dolar karşısında yaklaşık 83,72'ye yükseldi.</p>",
                "pubDate" => date("r", time() - 7200),
                "source" => "Paratic.com"
            ]
        ];
    }
    
    // Sonucu döndür
    echo json_encode($news);
    
} catch (Exception $e) {
    // Hata durumunda
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Bir hata oluştu: " . $e->getMessage()
    ]);
} 