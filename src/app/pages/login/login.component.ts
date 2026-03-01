import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { auth } from '../../firebase-integration';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page" [dir]="lang === 'ar' ? 'rtl' : 'ltr'">
      <div class="bg-layer" [style.background-image]="'url(assets/images/bg.jpg)'"></div>
      
      <div class="bubbles">
        <div class="bubble" *ngFor="let b of [1,2,3,4,5,6,7,8]"></div>
      </div>

      <div class="lang-bar">
        <button (click)="setLang('en')" [class.active]="lang==='en'">EN</button>
        <button (click)="setLang('tr')" [class.active]="lang==='tr'">TR</button>
        <button (click)="setLang('ar')" [class.active]="lang==='ar'">AR</button>
      </div>

      <div class="login-card ultra-hover-glow" [class.shake]="loginFailed">
        <h1 class="glow-txt">{{ t[lang].welcome }}</h1>
        <p class="subtitle">CTS AI MASTER</p>
        <p class="travel-quote">"{{ t[lang].quote }}"</p>

        <div class="input-group">
          <label>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            {{ t[lang].user }}
          </label>
          <input type="email" [(ngModel)]="email" [placeholder]="t[lang].emailPlaceholder">
        </div>

        <div class="input-group">
          <label>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
            {{ t[lang].pass }}
          </label>
          <input type="password" [(ngModel)]="password" placeholder="••••••••">
        </div>

        <div class="actions">
          <button class="login-btn ultra-hover-glow" (click)="login()">{{ t[lang].login }}</button>
          <div class="links-row">
            <a class="reg-link" (click)="showRegModal = true">{{ t[lang].reg }}</a>
            <a class="forgot-link" (click)="forgotPassword()">{{ t[lang].forgot }}</a>
          </div>
        </div>

        <div class="footer-note">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align: middle; margin-bottom: 2px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
          Designed by <span class="designer-name">ÖZCAN ALMAIS</span> 2026
        </div>
      </div>

      <div class="modal-overlay" *ngIf="showRegModal">
        <div class="modal-card">
          <h2 class="glow-txt" style="font-size: 1.5rem;">{{ t[lang].reg }}</h2>
          <div class="input-group">
            <input type="email" [(ngModel)]="regEmail" [placeholder]="t[lang].emailPlaceholder">
          </div>
          <div class="input-group">
            <input type="password" [(ngModel)]="regPassword" placeholder="New Password">
          </div>
          <div class="modal-btns">
            <button class="confirm-btn" (click)="register()">{{ t[lang].reg }}</button>
            <button class="cancel-btn" (click)="showRegModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page { height: 100vh; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden; background-color: #0f172a; font-family: 'Segoe UI', sans-serif; }
    .bg-layer { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 0; filter: brightness(0.5); }
    .bubbles { position: absolute; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
    .bubble { position: absolute; bottom: -100px; background: rgba(45, 212, 191, 0.2); border-radius: 50%; border: 1px solid rgba(45, 212, 191, 0.1); animation: rise 15s infinite ease-in; }
    @keyframes rise { 0% { bottom: -100px; transform: translateX(0) scale(1); opacity: 0.8; } 100% { bottom: 110vh; transform: translateX(100px) scale(1.5); opacity: 0; } }
    .bubble:nth-child(1) { width: 80px; height: 80px; left: 10%; animation-duration: 18s; }
    .bubble:nth-child(2) { width: 40px; height: 40px; left: 25%; animation-duration: 12s; animation-delay: 2s; }
    .bubble:nth-child(3) { width: 120px; height: 120px; left: 45%; animation-duration: 25s; }
    .bubble:nth-child(4) { width: 60px; height: 60px; left: 70%; animation-duration: 15s; animation-delay: 5s; }
    .bubble:nth-child(5) { width: 90px; height: 90px; left: 85%; animation-duration: 20s; }
    .login-card { position: relative; z-index: 10; width: 100%; max-width: 420px; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(25px); padding: 40px; border-radius: 30px; border-left: 6px solid #2dd4bf; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
    .glow-txt { color: #2dd4bf; text-shadow: 0 0 20px rgba(45, 212, 191, 0.6); text-align: center; font-size: 2.2rem; }
    .subtitle { color: #38bdf8; text-align: center; letter-spacing: 4px; font-weight: 900; margin-top: -10px; }
    .travel-quote { color: #94a3b8; text-align: center; font-size: 0.8rem; font-style: italic; margin-bottom: 25px; }
    label { color: #2dd4bf; font-size: 0.75rem; font-weight: bold; display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
    input { width: 100%; background: rgba(30, 41, 59, 0.6); border: 1px solid #334155; padding: 14px; border-radius: 12px; color: #ccfbf1; margin-bottom: 15px; transition: 0.3s; }
    .login-btn { width: 100%; padding: 16px; background: #2dd4bf; border: none; border-radius: 12px; color: #0f172a; font-weight: 900; cursor: pointer; font-size: 1.1rem; }
    .links-row { display: flex; justify-content: space-between; margin-top: 25px; font-weight: bold; font-size: 0.9rem; }
    .reg-link, .forgot-link { color: #38bdf8; cursor: pointer; }
    .modal-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.9); display: flex; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(10px); }
    .modal-card { background: #1e293b; padding: 30px; border-radius: 20px; width: 90%; max-width: 350px; border: 1px solid #2dd4bf; }
    .modal-btns { display: flex; gap: 10px; margin-top: 10px; }
    .confirm-btn { flex: 1; padding: 12px; background: #2dd4bf; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .cancel-btn { flex: 1; padding: 12px; background: transparent; border: 1px solid #94a3b8; color: #94a3b8; border-radius: 8px; cursor: pointer; }
    .lang-bar { position: absolute; top: 20px; right: 20px; z-index: 20; display: flex; gap: 8px; }
    .lang-bar button { background: rgba(30, 41, 59, 0.8); border: 1px solid #2dd4bf; color: #2dd4bf; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
    .lang-bar button.active { background: #2dd4bf; color: #0f172a; }
    .footer-note { margin-top: 40px; text-align: center; font-size: 0.8rem; color: #2dd4bf; font-weight: 600; }
    .designer-name { font-weight: 800; text-decoration: underline; }
    [dir="rtl"] .login-card { border-left: none; border-right: 6px solid #2dd4bf; }
  `]
})
export class LoginComponent {
  lang: 'en' | 'tr' | 'ar' = 'en';
  email = ''; password = '';
  regEmail = ''; regPassword = '';
  loginFailed = false; showRegModal = false;

  t: any = {
    en: { welcome: 'WELCOME', quote: 'Traveling - it leaves you speechless, then turns you into a storyteller', user: 'AGENT EMAIL', emailPlaceholder: 'access@cts.ai', pass: 'SECURITY CODE', login: 'INITIALIZE SYSTEM', reg: 'Register', forgot: 'Forgot Password?', regSuccess: 'Account created!', resetSent: 'Reset link sent!', enterEmail: 'Enter email first' },
    tr: { welcome: 'HOŞ GELDİNİZ', quote: 'Seyahat etmek sizi dilsiz bırakır, sonra bir hikayeciye dönüştürür', user: 'TEMSİLCİ E-POSTASI', emailPlaceholder: 'erisim@cts.ai', pass: 'GÜVENLİK KODU', login: 'SİSTEMİ BAŞLAT', reg: 'Kayıt Ol', forgot: 'Şifremi Unuttum?', regSuccess: 'Hesap oluşturuldu!', resetSent: 'Sıfırlama linki gönderildi!', enterEmail: 'Önce e-postayı girin' },
    ar: { welcome: 'مرحباً بك', quote: 'السفر يجعلك صامتاً في البداية، ثم يحولك إلى راوٍ للقصص', user: 'بريد الوكيل', emailPlaceholder: 'admin@cts.ai', pass: 'رمز الأمان', login: 'تشغيل النظام', reg: 'إنشاء حساب', forgot: 'نسيت كلمة السر؟', regSuccess: 'تم إنشاء الحساب!', resetSent: 'تم إرسال رابط الاستعادة!', enterEmail: 'اكتب بريدك الإلكتروني أولاً' }
  };

  constructor(private router: Router) {}
  setLang(l: any) { this.lang = l; }

  async login() {
    try {
      this.loginFailed = false;
      await signInWithEmailAndPassword(auth, this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e) { this.triggerShake(); }
  }

  async register() {
    if (!this.regEmail || !this.regPassword) return;
    try {
      await createUserWithEmailAndPassword(auth, this.regEmail, this.regPassword);
      alert(this.t[this.lang].regSuccess);
      this.showRegModal = false;
    } catch (e: any) { alert(e.message); }
  }

  async forgotPassword() {
    if (!this.email) return alert(this.t[this.lang].enterEmail);
    try {
      await sendPasswordResetEmail(auth, this.email);
      alert(this.t[this.lang].resetSent);
    } catch (e: any) { alert(e.message); }
  }

  triggerShake() {
    this.loginFailed = true;
    setTimeout(() => this.loginFailed = false, 500);
  }
}
