# 🖼️ Image Frame Resizer

Fotoğraflarınızı istediğiniz çerçeve boyutuna göre yeniden boyutlandıran, kullanımı kolay bir web uygulaması.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Özellikler

- **Çoklu Dosya Desteği** – Birden fazla görsel seçip toplu işlem yapabilirsiniz
- **Sürükle-Bırak** – Dosyalarınızı kolayca yükleyin
- **Özelleştirilebilir Boyutlar** – Çerçeve genişliği ve yüksekliğini piksel cinsinden belirleyin
- **Dolgu Rengi** – HEX renk kodu veya renk seçici ile arka plan rengini ayarlayın
- **Oran Koruma** – Orijinal görsel oranını koruyarak yeniden boyutlandırma
- **Önizleme** – İşlem öncesi seçilen dosyaları görüntüleyin
- **Toplu İndirme** – Tüm işlenmiş görselleri tek seferde indirin
- **Renk Hafızası** – Son kullanılan renk localStorage'da saklanır

## 🚀 Kullanım

1. `index.html` dosyasını tarayıcıda açın
2. Çerçeve boyutlarını (genişlik/yükseklik) ayarlayın
3. Dolgu rengini seçin
4. Görselleri sürükle-bırak veya "Dosya Seçin" ile yükleyin
5. "Oluştur" butonuna tıklayın
6. İşlenmiş görselleri tek tek veya toplu indirin

## 📁 Proje Yapısı

```
image-resizer/
├── index.html      # Ana HTML sayfası
├── style.css       # Stillendirme
├── app.js          # Uygulama mantığı
└── README.md       # Bu dosya
```

## 🎨 Çıktı Formatı

- Çıktı dosyaları PNG formatında kaydedilir
- Dosya adları `_resized` soneki ile oluşturulur (örn: `foto_resized.png`)
- Görsel, çerçeve içinde ortalanır ve boş alanlar seçilen renkle doldurulur

## 🛠️ Teknik Detaylar

- **Frontend-only** – Sunucu gerektirmez, tamamen tarayıcıda çalışır
- **Canvas API** – Görsel işleme için HTML5 Canvas kullanılır
- **localStorage** – Kullanıcı tercihlerini saklar
- **Desteklenen Formatlar** – PNG, JPG, WEBP

## 📜 Lisans

MIT License
