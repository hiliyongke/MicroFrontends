import { Platform } from '@angular/cdk/platform';
import { registerLocaleData } from '@angular/common';
import { Injectable } from "@angular/core";
import ngEn from '@angular/common/locales/en';
import ngZh from '@angular/common/locales/zh';
import { enUS as dfEn, zhCN as dfZhCn, zhTW as dfZhTw } from 'date-fns/locale';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { en_US as zorroEnUS, NzI18nService, zh_CN as zorroZhCN, zh_TW as zorroZhTW } from 'ng-zorro-antd/i18n';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";



interface LangConfigData {
  abbr: string;
  text: string;
  ng: NzSafeAny;
  zorro: NzSafeAny;
  date: NzSafeAny;
}

const DEFAULT = 'zh-CN';
const LANGS: { [key: string]: LangConfigData } = {
  'zh-CN': {
    text: '简体中文',
    ng: ngZh,
    zorro: zorroZhCN,
    date: dfZhCn,
    abbr: '🇨🇳'
  },
  'en-US': {
    text: 'English',
    ng: ngEn,
    zorro: zorroEnUS,
    date: dfEn,
    abbr: '🇬🇧'
  }
};



@Injectable({ providedIn: 'root' })
export class I18NService {

  protected _defaultLang = DEFAULT;

  protected _currentLang = '';

  private _langs = Object.keys(LANGS).map(code => {
    const item = LANGS[code];
    return { code, text: item.text, abbr: item.abbr };
  });

  constructor(
    private http: HttpClient,
    private nzI18nService: NzI18nService,
    private platform: Platform
  ) {

    const defaultLang = this.getDefaultLang();
    this._defaultLang = this._langs.findIndex(w => w.code === defaultLang) === -1 ? DEFAULT : defaultLang;
  }


  private getDefaultLang(): string {
    if (!this.platform.isBrowser) {
      return DEFAULT;
    }
    // if (this.settings.layout.lang) {
    //   return this.settings.layout.lang;
    // }
    let res = (navigator.languages ? navigator.languages[0] : null) || navigator.language;
    const arr = res.split('-');
    return arr.length <= 1 ? res : `${arr[0]}-${arr[1].toUpperCase()}`;
  }

  loadLangData(lang: string): Observable<NzSafeAny> {
    return this.http.get(`assets/tmp/i18n/${lang}.json`);
  }

  use(lang: string, data: Record<string, unknown>): void {
    if (this._currentLang === lang) return;

    // this._data = this.flatData(data, []);

    const item = LANGS[lang];
    registerLocaleData(item.ng);
    this.nzI18nService.setLocale(item.zorro);
    this.nzI18nService.setDateLocale(item.date);
    // this.delonLocaleService.setLocale(item.delon);
    this._currentLang = lang;

    // this._change$.next(lang);
  }

  getLangs(): Array<{ code: string; text: string; abbr: string }> {

    return this._langs;
  }


}