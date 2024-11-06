import { Component, Input, OnInit } from '@angular/core';
import { ShoppingCart } from '../model/shoppingCart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  user: User
  shoppingCart: ShoppingCart
  constructor(private authService: AuthService, private marketPlaceService: MarketplaceService) {
    this.shoppingCart = {
      id: 1,  
      userId: 1,  
      items: [
        { tourId: 1, tourName: 'Mountain Adventure', price: 12, quantity: 1 },
        { tourId: 2, tourName: 'City Exploration', price: 15, quantity: 2 },
        { tourId: 3, tourName: 'Beach Getaway', price: 8, quantity: 1 }
      ],
      totalPrice: 35
    };
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.marketPlaceService.getShoppingCartById(user.id).subscribe({
        next: (result: ShoppingCart) => {
          this.shoppingCart = result
        }
      })
    });
  }

  getTotalPrice() {
    return this.shoppingCart.items.reduce((total, item) => total + item.price, 0);
  }

  removeItem(itemId: number) {
    this.shoppingCart.items = this.shoppingCart?.items.filter(item => item.tourId !== itemId);
    this.marketPlaceService.updateShoppingCart(this.shoppingCart)
  }

  checkout() {
    alert('Proceeding to checkout!');
    this.shoppingCart.items = []
    this.marketPlaceService.updateShoppingCart(this.shoppingCart)
  }
}