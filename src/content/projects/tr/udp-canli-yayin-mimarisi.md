---
locale: tr
title: 'UDP Canlı Yayın Mimarisi'
description: 'Düşük gecikmeli yayın için UDP tabanlı bir aktarım altyapısının prototiplenmesi.'
pubDate: 2026-05-13
updatedAt: 2026-05-13
technologies: ['C++', 'FFmpeg', 'Linux', 'UDP']
status: 'active'
githubUrl: 'https://github.com/example/udp-live-stream'
---

## 1. Proje Özeti

Amaç, yerel ağda düşük gecikmeli canlı yayın akışını test etmekti.

## 2. Süreç

- TCP yerine UDP seçiminin etkilerini ölçtüm.
- Paket kaybı durumunda yeniden toparlanma davranışını inceledim.
- Buffer ayarlarının gecikme/kararlılık dengesini test ettim.

## 3. Sonuç

Yerel ağ için kabul edilebilir gecikme elde edildi. Sonraki adım, hata tolerans mekanizmasını iyileştirmek.
