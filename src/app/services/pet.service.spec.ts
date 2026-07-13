import { TestBed } from '@angular/core/testing';
import { PetService } from './pet.service';
import { StorageService } from './storage.service';

//  PRUEBA UNITARIA: PetService 
describe('PetService (prueba unitaria)', () => {
  let service: PetService;

  const storageMock = {
    data: {} as any,
    async init() {},
    async set(key: string, value: any) { this.data[key] = value; },
    async get(key: string) { return this.data[key]; },
    async remove(key: string) { delete this.data[key]; },
  };

  beforeEach(() => {
    storageMock.data = {};
    TestBed.configureTestingModule({
      providers: [
        PetService,
        { provide: StorageService, useValue: storageMock },
      ],
    });
    service = TestBed.inject(PetService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería cargar las mascotas por defecto la primera vez', async () => {
    await service.loadPets();
    expect(service.getPets().length).toBeGreaterThan(0);
  });

  it('debería agregar una mascota nueva', async () => {
    await service.loadPets();
    const antes = service.getPets().length;
    await service.addPet({
      name: 'Firulais', species: 'Perro', breed: 'Quiltro', age: 2,
      sex: 'Macho', color: 'Café', diseases: 'Ninguna', photo: '🐶',
    });
    expect(service.getPets().length).toBe(antes + 1);
  });

  it('debería iniciar sesión con las credenciales correctas', async () => {
    const ok = await service.login('demo@petcontrol.cl', '123456');
    expect(ok).toBeTrue();
  });

  it('debería rechazar credenciales incorrectas', async () => {
    const ok = await service.login('malo@correo.cl', 'clave-mala');
    expect(ok).toBeFalse();
  });

  it('debería cerrar sesión correctamente', async () => {
    await service.login('demo@petcontrol.cl', '123456');
    await service.logout();
    const autenticado = await service.isAuthenticated();
    expect(autenticado).toBeFalse();
  });
});