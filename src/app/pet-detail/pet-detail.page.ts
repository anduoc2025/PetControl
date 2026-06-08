
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService, Pet } from '../services/pet.service';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.page.html',
  styleUrls: ['./pet-detail.page.scss'],
  standalone: false,
})
export class PetDetailPage implements AfterViewInit {
  @ViewChild('carnet', { read: ElementRef }) carnet!: ElementRef;
  pet?: Pet;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private animationCtrl: AnimationController
  ) {
    // Lee el parámetro :id de la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pet = this.petService.getPet(id);
  }

  // ===== ANIMACIÓN IONIC #2: zoom-in (escala + opacidad) del carnet =====
  ngAfterViewInit() {
    if (!this.carnet) return;
    const animation = this.animationCtrl
      .create()
      .addElement(this.carnet.nativeElement)
      .duration(550)
      .easing('cubic-bezier(0.36, 0.66, 0.04, 1)')
      .fromTo('transform', 'scale(0.85)', 'scale(1)')
      .fromTo('opacity', '0', '1');
    animation.play();
  }

  // Cantidad de vacunas aplicadas (usado con interpolación)
  get appliedCount(): number {
    return this.pet?.vaccines.filter((v) => v.applied).length ?? 0;
  }

  goVaccines() {
    if (this.pet) {
      this.router.navigate(['/vaccines', this.pet.id]);
    }
  }
}
