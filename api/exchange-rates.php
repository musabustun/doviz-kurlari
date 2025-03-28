<?php
// CORS ayarları
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Exchange Rate API anahtarı
$apiKey = "c57b07a2200e2d614cf327be";

// Gerçek API'dan veri çekme fonksiyonu
function getExchangeRates($apiKey) {
    // USD baz para birimi olarak API isteği yap (verilen örnek istek formatına göre)
    $url = "https://v6.exchangerate-api.com/v6/{$apiKey}/latest/USD";
    
    // cURL ile API isteği yap
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    
    // Veriyi al
    $response = curl_exec($curl);
    
    // Hata kontrolü
    if($response === false) {
        $error = curl_error($curl);
        curl_close($curl);
        return [
            'error' => true,
            'message' => "cURL Hatası: $error"
        ];
    }
    
    curl_close($curl);
    
    // JSON verisini PHP dizisine dönüştür
    $data = json_decode($response, true);
    
    // API'den gelen veri formatını TRY baz olacak şekilde dönüştür
    if(isset($data['result']) && $data['result'] === 'success' && isset($data['conversion_rates'])) {
        $tryRate = $data['conversion_rates']['TRY'];
        
        // Yeni sonuç formatı
        $result = [
            'result' => $data['result'],
            'base_code' => 'TRY',
            'time_last_update_utc' => $data['time_last_update_utc'],
            'time_next_update_utc' => $data['time_next_update_utc'],
            'rates' => []
        ];
        
        // Her para birimi için TRY bazlı oranı hesapla
        foreach($data['conversion_rates'] as $currency => $rate) {
            // TRY/X oranını hesapla
            $result['rates'][$currency] = $rate / $tryRate;
        }
        
        // TRY'nin kendisine oranı 1'dir
        $result['rates']['TRY'] = 1;
        
        return $result;
    }
    
    return $data;
}

// Demo amaçlı örnek veri (API çağrısında hata olması durumunda)
function getSampleData() {
    return [
        'result' => 'success',
        'base_code' => 'TRY',
        'time_last_update_utc' => date("D, d M Y H:i:s +0000"),
        'time_next_update_utc' => date("D, d M Y H:i:s +0000", time() + 86400),
        'rates' => [
            'TRY' => 1,
            'USD' => 0.031,
            'EUR' => 0.029,
            'GBP' => 0.025,
            'CHF' => 0.028,
            'JPY' => 4.71,
            'CAD' => 0.042,
            'AUD' => 0.047,
            'CNY' => 0.226,
            'RUB' => 2.81,
            'SAR' => 0.116
        ]
    ];
}

// Ana işlem
try {
    // API'den veriyi çek
    $data = getExchangeRates($apiKey);
    
    // API'den veri çekilirken hata oluştuysa
    if(isset($data['error']) && $data['error'] === true) {
        // Hata mesajını logla
        error_log("Exchange Rate API Hatası: " . $data['message']);
        
        // Demo veri kullan
        $data = getSampleData();
    }
    
    // Sonucu döndür
    echo json_encode($data);
    
} catch(Exception $e) {
    // Hata durumunda
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Bir hata oluştu: " . $e->getMessage()
    ]);
} 