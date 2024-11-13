import { Component, HostListener, OnInit } from '@angular/core';
import { SellerService } from '../../services/seller.service';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink, RouterModule],
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss'],
})
export class SellerComponent implements OnInit {
  public disableLogin: boolean = false;
  public authenticated: boolean = false;
  public isBuyer: boolean = false;
  public isButtonVisible = window.innerWidth < 1024;

  seller: any;
  pets: any[] = [];

  constructor(
    private sellerService: SellerService,
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSeller();
  }

  loadSeller(): void {
    this.sellerService.getSellerProfile().subscribe({
      next: (data) => {
        this.seller = data;
        this.loadPets();
      },
      error: (err) => console.error('Error loading seller:', err),
    });
  }

  loadPets(): void {
    if (this.seller.pets && this.seller.pets.length) {
      this.seller.pets.forEach((petId: string) => {
        this.itemService.getItemById(petId).then(
          (pet) => this.pets.push(pet),
          (err) => console.error('Error loading pet:', err)
        );
      });
    }
  }

  // Track the expanded state of each card using the pet's name as the key
  public expandedCards: { [key: string]: boolean } = {};

  formatAge(ageInYears: number): string {
    if (ageInYears < 1) {
      // Convert to months if less than 1 year
      const months = Math.round(ageInYears * 12);
      if (months < 3) {
        // Convert to weeks if less than 3 months
        const weeks = Math.round(months * 4.345); // Approximate weeks in a month
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      }
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      // Display in years if 1 year or more
      return `${ageInYears} year${ageInYears !== 1 ? 's' : ''}`;
    }
  }

  navigateToPetDesktop(event: MouseEvent, petId: string): void {
    const targetElement = event.target as HTMLElement;

    // Check if the clicked element or its parent has `data-ignore-click`
    if (
      targetElement.getAttribute('data-ignore-click') === 'true' ||
      targetElement.closest('[data-ignore-click="true"]')
    ) {
      return;
    }

    if (!this.isButtonVisible) {
      this.router.navigate([`/pet/${petId}`]);
    }
  }

  navigateToPetMobile(petId: string): void {
    console.log('mobile');
    this.router.navigate([`/pet/${petId}`]);
  }

  // Listen for window resize events to adjust button visibility
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    this.isButtonVisible = width < 1024;
  }


  // Toggle the expanded state of a card
  toggleCard(name: string) {
    this.expandedCards[name] = !this.expandedCards[name];
  }

  addItem(sellerId: string): void {}

  editItem(itemId: string): void {}

  confirmDelete(itemId: string): void {
    const isConfirmed = confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      this.deleteItem(itemId);
    }
  }

  deleteItem(itemId: string): void {
    this.itemService.deleteItemById(itemId).subscribe({
      next: () => {
        this.pets = this.pets.filter((pet) => pet._id !== itemId); // Remove item from local array
        console.log('Item deleted successfully');
      },
      error: (err: any) => {
        console.error('Error deleting item:', err);
      },
    });
  }
}
