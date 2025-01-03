# BlurCaptcha
**BlurCaptcha**, botlara karşı koruma sağlamak için dinamik bulanıklaştırma ve kullanıcı dostu doğrulama süreçleri içeren bir CAPTCHA çözümüdür.

## Özellikler
- **Dinamik Hareket ve Bulanıklık**: Botlara karşı ekstra koruma.
- **Esnek Özelleştirme**: Rakam sayısı, bulanıklık seviyesi ve renkler kolayca ayarlanabilir.
- **Sunucu Doğrulaması**: İsteğe bağlı sunucu doğrulama desteği.
- **Kullanıcı Dostu**: Kolay entegrasyon ve kullanım.

## Kurulum

### **CDN ile Kullanım**
```html
<script src="https://cdn.jsdelivr.net/npm/blurcaptcha"></script>
NPM ile Kurulum
npm install blurcaptcha

<div id="captchaContainer"></div>
<button id="submitButton" disabled>Gönder</button>

createCaptcha("captchaContainer", {
  digits: 4, // CAPTCHA'daki rakam sayısı
  blurLevel: 6, // Rakamların bulanıklık seviyesi
  activateButton: "submitButton", // Doğrulamadan sonra etkinleşecek buton
  onComplete: (digits) => {
    alert(`CAPTCHA tamamlandı! Girilen kod: ${digits.join("")}`);
  },
  serverValidation: true,
  serverUrl: "/validate-captcha", // Sunucu doğrulama URL'si
});


Ayar	Varsayılan Değer	Açıklama
digits	4	CAPTCHA'daki rakam sayısı
blurLevel	6	Rakamların bulanıklık seviyesi (0-10)
digitSize	40	Rakam boyutu
inputSize	20	Giriş alanı boyutu
borderColor	'#007bff'	Rakam ve giriş alanı kenarlık rengi
textColor	'#000'	Rakam rengi
instructionText	"Lütfen aşağıdaki sayıları girin"	Kullanıcıya gösterilen talimat metni

