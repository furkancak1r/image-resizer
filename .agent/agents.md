# Agent Guidelines for Image Frame Resizer

## Project Overview

Bu proje, kullanıcıların görsellerini belirli çerçeve boyutlarına göre yeniden boyutlandırmasını sağlayan statik bir web uygulamasıdır. Tamamen frontend tabanlıdır ve sunucu gerektirmez.

## Tech Stack

- **HTML5** – Sayfa yapısı
- **CSS3** – Modern stillendirme (glassmorphism, gradients, animations)
- **Vanilla JavaScript** – Uygulama mantığı, Canvas API kullanımı

## File Structure

| Dosya | Amaç |
|-------|------|
| `index.html` | Ana HTML yapısı, form elemanları ve grid layout |
| `style.css` | Tüm stiller, responsive tasarım, animasyonlar |
| `app.js` | Görsel işleme, drag-drop, dosya yönetimi, Canvas işlemleri |

## Key Concepts

### Image Processing Flow
1. Kullanıcı dosya seçer → `pendingFiles` dizisine eklenir
2. "Oluştur" tıklanır → `processImage()` ile Canvas'ta işlenir
3. Sonuç `processedImages` dizisine kaydedilir → Kart olarak render edilir

### Canvas Logic (`processImage`)
- Hedef çerçeve boyutunda canvas oluşturulur
- Arka plan seçilen HEX rengiyle doldurulur
- Görsel **contain** modunda (oran korunarak) ölçeklenir ve ortalanır
- PNG olarak export edilir

## Coding Guidelines

1. **Basitlik** – Vanilla JS kullan, framework ekleme
2. **Performans** – Büyük dosyalarda memory leak'e dikkat et
3. **UX** – İşlem durumunu kullanıcıya göster (loading state)
4. **Responsive** – Mobil uyumluluğu koru
5. **LocalStorage** – Kullanıcı tercihlerini sakla (renk gibi)

## Common Tasks

### Yeni Özellik Ekleme
- `app.js` içinde ilgili event listener ve fonksiyonları ekle
- Gerekirse `index.html`'e yeni UI elemanları ekle
- Stilleri `style.css`'e ekle

### Çıktı Formatı Değiştirme
- `processImage()` fonksiyonunda `toDataURL()` parametresini güncelle
- Dosya uzantısını `newName` oluştururken değiştir

### Yeni Dosya Formatı Desteği
- `fileInput` accept attribute'unu güncelle
- Drop handler'da file type kontrolünü düzenle

## Testing

- Tarayıcıda `index.html` dosyasını aç
- Farklı boyut ve formatlarda görseller test et
- Çeşitli HEX renk kodlarını dene
- Drag-drop ve dosya seçici her ikisini de test et
