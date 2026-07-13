import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

// Servicio que adapta la configuración según la plataforma
@Injectable({ providedIn: 'root' })
export class PlatformService {

  getPlatform(): string {
    return Capacitor.getPlatform();
  }

  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  getConfig() {
    const platform = this.getPlatform();
    if (platform === 'android') {
      return { nombre: 'Android', usaGPSNativo: true, mensaje: 'Ejecutando en Android' };
    } else if (platform === 'ios') {
      return { nombre: 'iOS', usaGPSNativo: true, mensaje: 'Ejecutando en iOS' };
    } else {
      return { nombre: 'Web', usaGPSNativo: false, mensaje: 'Ejecutando en el navegador' };
    }
  }
}