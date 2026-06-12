---
locale: tr
title: 'Görüntü Tabanlı Otonom Drone İniş Sistemi'
description: 'Raspberry Pi ve DroneKit kullanarak IR marker tespiti ile hassas otonom iniş gerçekleştiren gerçek zamanlı bilgisayarla görme sistemi.'
pubDate: 2026-06-12
updatedAt: 2026-06-12
technologies: ['Python', 'Raspberry Pi', 'DroneKit', 'MAVLink', 'OpenCV', 'Bilgisayarla Görme']
status: 'completed'
---

2023 yılında geliştirilen bu proje, otonom drone'lar için görüntü tabanlı hassas iniş sistemidir. Bir yüksek lisans tezinin üzerine inşa edilmiştir — gereksinimleri, teknik altyapıyı ve temel yaklaşımı tez belgesi kapsamaktadır.

---

## Farklı Yaptıklarım

**Kamera ve işlem donanımı.** Tez, görüntü işleme için OpenMV kamera kullanıp sonuçları UART üzerinden Raspberry Pi'ye gönderiyor. Ben her şeyi Raspberry Pi üzerine taşıdım — Pi kamera görüntü alırken tüm işleme de Pi'de yapılıyor. Boru hattında bir cihaz daha az, seri iletişim yükü yok, hata ayıklama çok daha kolay.

**Gimbal'a monte kamera.** Tezde kamera doğrudan drone gövdesine sabitlenmiş. Drone hareket etmek için eğilir; eğilince sabit kamera da eğilir, marker çerçeveden çıkabilir ve piksel-pozisyon hesabına drone'un o anki açısı da dahil edilmek zorunda kalınır. Bunun yerine kamerayı bir gimbal'a monte ettim — pitch ve roll'dan bağımsız olarak her zaman düz aşağıya bakıyor. Marker harekette çerçevede sabit kalıyor ve açı kompanzasyonu hesaptan tamamen düşüyor.

**İki aşamalı tespit.** Yüksek irtifalarda algoritma çerçevedeki tüm parlak noktaları ortalar ve o merkeze doğru iner. İrtifa, tam T-deseninin güvenilir biçimde çözünebilir olduğu aralığa düştüğünde desen tanıma moduna geçer. Geçiş irtifaya bağlıdır.

**Gürültüye dayanıklı tespit.** Tezdeki PATTERN modu tam olarak dört nokta varsayar ve bunları mesafe-toplam matrisiyle etiketler; sahnede 940nm'de başka bir yansıma varsa bu hata verir. Ben oran tabanlı bir yaklaşıma geçtim: algoritma aday noktalar arasındaki geometrik oranları bilinen T-deseni oranlarıyla karşılaştırır. Rastgele yansımalar yanlış tanımlama yapmak yerine filtrelenir.

**Kapalı döngü hız kontrolü.** Tez her iterasyonda hedef bir GPS koordinatı hesaplayıp `simple_goto` çağırır; bu piksel → mm → UAV gövde çerçevesi → K/D → enlem/boylam zincirini gerektirir. Bunu doğrudan eksen hız komutlarıyla değiştirdim. PID döngüsü piksel ofsetinin kendisini kapatıyor — marker şu an çerçevenin neresinde, bunu hız komutuna çeviriyorum. Koordinat dönüşüm zincirinin tamamı ortadan kalkıyor.

**Uçuş kayıt sistemi.** Her kontrol tiki kaydediliyor: hız komutları, GPS koordinatları, irtifa, pozisyon deltaları. Bu şekilde 27 uçuş kaydı toplandı; sorunları inişten sonra analiz etmek mümkün oldu.

**LAN üzerinden canlı video izleme.** Uçuşlar sırasında Raspberry Pi ekranı yerel ağa gerçek zamanlı aktarıldı.

---

## Marker Tasarımı

İniş platformu, 940 nm kızılötesi LED'lerden yapılmış özel bir T-deseni kullanır. Kameranın önünde eşleşen 940 nm bant geçiren bir filtre var; bu sayede hedef ortamdan ayırt edilebilir oluyor — çim, çakıl ve çoğu doğal yüzey, aktif LED'ler gibi 940 nm KÖ yaymaz veya yansıtmaz.

Bu düşük irtifalarda iyi çalıştı. Asıl kısıt güç: LED'leri yüksek irtifadan görünür kılacak parlaklıkta çalıştırmak ısı birikimine ve hızlı batarya tüketimine yol açıyor.

En pratik uzun vadeli çözüm: bekleme modu mimarisi. Marker platformunda bir GPS modülü ve mikrodenetleyici dinleme modunda bekler. Drone yaklaştığında şifreli radyo üzerinden iniş sinyali yayınlar. Marker GPS koordinatlarını gönderir, ETA alır ve LED'leri yalnızca yaklaşma süresi boyunca aktif eder. Sürekli aydınlatma yok, termal artış yok.

---

## Sistem Mimarisi

Sistem, MAVLink üzerinden uçuş kontrolcüsüne bağlı Raspberry Pi üzerinde çalıştı; araç kontrolü için DroneKit kullanıldı.

**Aşama 1 — Başlatma:** Aracı arm et, sensör durumunu doğrula, MAVLink iletişimini kur.

**Aşama 2 — Kalkış ve Arama:** Arama irtifasına çık, marker'ı tara. Drone pozisyon tutar ve döner; desen çerçevede tespit edilene kadar.

**Aşama 3 — Navigasyon ve İniş:** Marker ofsetini çerçeve merkezine göre hesapla, hız düzeltmesine çevir, mesafeyi kapat. Kontrol döngüsü drone inerken yanal pozisyonu sürekli düzeltir.

Geri besleme döngüsü: piksel cinsinden marker ofseti → ölçeklenmiş hız komutu → uçuş kontrolcüsüne gönderim. İrtifa LIDAR ile (menzil içindeyken) veya barometre ile ölçülür — aşama geçişlerini tetiklemek ve disarm için kullanılır, pozisyon hesabına değil.

---

## Kayıtların Gösterdikleri

27 uçuş kaydı toplandı. Her satır o tikteki kontrol durumunu kayıt eder: hız komutları, GPS, irtifa, pozisyon deltaları. Yaklaşma aşaması yanal düzeltmelerin küçüldüğüyle, iniş aşaması irtifanın azalmasıyla görünür hâle gelir.

Düşük irtifa yaklaşmasında bazı kayıtlarda salınım göze çarpıyor. Drone, marker'a oranla fiziksel olarak büyük; o irtifada tüm araç düzeltmelere tepki veriyor — "kamera hareket eder" ile "drone hareket eder" arasında izolasyon yok.

---

## Uç Durumlar

**Yakın mesafede marker'ın çerçeveden çıkması.** Drone doğrudan üstte ve çok yakınken desenin bazı parçaları çerçeveden çıkıyor. Daha iyi yaklaşım: marker çerçevede belirli bir boyut eşiğini aştığında tam desen tanımayı bırakıp görünür kalan parçaların merkezini takip etmek.

**Rüzgara maruz platformda düşük irtifa takibi.** İki metre irtifada drone'u stabilizasyon platformu olarak kullanmak, her rüzgar esintisini kontrol girdisine dönüştürüyor. Gimbal'ı yatay olarak süren ikincil bir kontrol döngüsü, şu anda aşımaya yol açan bozukluklarda marker'ı çerçevede tutardı.

---

## Çıkarımlar

Bilgisayarla görme ile hassas iniş, mütevazı donanımla çözülebilir bir problem. Raspberry Pi, bu uygulama için yeterince hızlı gerçek zamanlı bir tespit ve kontrol döngüsü çalıştırabiliyor. Asıl zor problemler mekanik ve optik: kamerayı araçtan izole etmek ve ilgilenilen tüm irtifa aralığında tespit edilebilir bir marker tasarlamak.

Sonraki versiyon; bağımsız kontrol döngülü iki eksenli stabilize gimbal, iki aşamalı marker sistemi (arama için büyük pasif marker, iniş için aktif KÖ marker) ve tam desen görünür olmadığında zarif biçimde degrade olan — kısmi tespitlerin merkezini takip eden — bir yedek tespit mekanizması içerecek.
