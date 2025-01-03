class Captcha {
  constructor(containerId, options = {}) {
    const defaultSettings = {
      digits: 4,
      blurLevel: 6,
      digitSize: 40,
      inputSize: 20,
      borderColor: '#007bff',
      textColor: '#000',
      onComplete: () => {},
      activateButton: null,
      serverValidation: false,
      serverUrl: '',
      instructionText: 'Lütfen aşağıdaki sayıları girin',
    };

    this.settings = { ...defaultSettings, ...options };
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with ID "${containerId}" not found.`);
    }

    this.digits = Array.from({ length: this.settings.digits }, () => Math.floor(Math.random() * 10));
    this.firstInteractionComplete = false; // İlk mouse ve tıklama kontrolü yapılmamış
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="captcha-container" style="position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <div class="instruction" style="font-size: 14px; color: #555; text-align: center;">${this.settings.instructionText}</div>
        <div class="captcha" style="display: flex; gap: 5px;"></div>
        <div class="input-row" style="display: flex; gap: 5px; margin-top: 5px;"></div>
        <div class="overlay" id="captchaOverlay" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); justify-content: center; align-items: center; z-index: 10;">
          <div class="checkmark" style="font-size: 50px; color: #28a745;">✔</div>
        </div>
      </div>
    `;

    const captcha = this.container.querySelector('.captcha');
    const inputRow = this.container.querySelector('.input-row');

    this.digits.forEach((digit, index) => {
      const randomRotation = Math.floor(Math.random() * 41 - 20);
      const digitElement = document.createElement('div');
      digitElement.textContent = digit;
      digitElement.style.width = `${this.settings.digitSize}px`;
      digitElement.style.height = `${this.settings.digitSize}px`;
      digitElement.style.fontSize = `${this.settings.digitSize * 0.6}px`;
      digitElement.style.textAlign = 'center';
      digitElement.style.lineHeight = `${this.settings.digitSize}px`;
      digitElement.style.border = `1px solid ${this.settings.borderColor}`;
      digitElement.style.borderRadius = '5px';
      digitElement.style.backgroundColor = '#f8f9fa';
      digitElement.style.color = this.settings.textColor;
      digitElement.style.filter = index === 0 ? 'none' : `blur(${this.settings.blurLevel}px)`;
      digitElement.style.transform = `rotate(${randomRotation}deg)`;

      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.maxLength = 1;
      inputElement.disabled = true; // Başlangıçta devre dışı
      inputElement.style.width = `${this.settings.inputSize}px`;
      inputElement.style.height = `${this.settings.inputSize}px`;
      inputElement.style.fontSize = `${this.settings.inputSize * 0.6}px`;
      inputElement.style.textAlign = 'center';
      inputElement.style.border = `1px solid ${this.settings.borderColor}`;
      inputElement.style.borderRadius = '5px';
      inputElement.style.backgroundColor = index === 0 ? '#fff' : '#f8f9fa';

      inputElement.addEventListener('input', () => {
        if (inputElement.value === digitElement.textContent) {
          digitElement.style.filter = 'none';
          digitElement.style.transform = 'rotate(0deg)';
          inputElement.disabled = true;

          if (index < this.digits.length - 1) {
            const nextInput = inputRow.children[index + 1];
            const nextDigit = captcha.children[index + 1];
            nextInput.disabled = false;
            nextInput.focus();
            nextDigit.style.filter = 'none';
          } else if (this.settings.serverValidation) {
            this.validateWithServer();
          } else {
            this.showSuccessOverlay();
          }

          if (this.settings.activateButton) {
            const button = document.getElementById(this.settings.activateButton);
            if (button) button.disabled = false;
          }
        } else {
          inputElement.value = '';
        }
      });

      inputElement.addEventListener('click', () => {
        if (!this.firstInteractionComplete) {
          this.firstInteractionComplete = true; // İkinci aşama tamamlandı
          const firstInput = inputRow.querySelector('input');
          if (firstInput) firstInput.disabled = false; // İlk giriş alanını etkinleştir
        }
      });

      captcha.appendChild(digitElement);
      inputRow.appendChild(inputElement);
    });

    // Mouse ile CAPTCHA alanına giriş kontrolü
    this.container.addEventListener('mouseenter', () => {
      if (!this.firstInteractionComplete) {
        const firstInput = inputRow.querySelector('input');
        if (firstInput) firstInput.disabled = false; // İlk giriş alanını etkinleştir
      }
    });
  }

  validateWithServer() {
    if (!this.settings.serverUrl) {
      throw new Error('Server URL is not defined for CAPTCHA validation.');
    }

    fetch(this.settings.serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ digits: this.digits }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('CAPTCHA validation failed.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          this.showSuccessOverlay();
        } else {
          alert('CAPTCHA doğrulama başarısız. Tekrar deneyin.');
        }
      })
      .catch((error) => {
        console.error('CAPTCHA doğrulama hatası:', error);
        alert('Bir hata oluştu. Tekrar deneyin.');
      });
  }

  showSuccessOverlay() {
    const overlay = document.getElementById('captchaOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.style.display = 'none';
      this.container.style.display = 'none';
    }, 1500);
  }
}

function createCaptcha(containerId, options) {
  return new Captcha(containerId, options);
}
