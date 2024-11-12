import { Component, Input, OnInit } from '@angular/core';
import { ShoppingCart } from '../model/shoppingCart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Currency, OrderItem } from '../model/orderItem.model';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  debounceTimer: any
  user: User
  shoppingCart: ShoppingCart
  constructor(private authService: AuthService, private marketPlaceService: MarketplaceService) {
    this.shoppingCart = {
      id: 1,  
      userId: 1,  
      items: [
        { tourId: 1, tourName: 'Mountain Adventure', price: {cost: 22, currency: Currency.EUR}, quantity: 1 },
        { tourId: 2, tourName: 'City Exploration', price: {cost: 32, currency: Currency.EUR}, quantity: 2 },
        { tourId: 3, tourName: 'Beach Getaway', price: {cost: 12, currency: Currency.EUR}, quantity: 1 }
      ],
      totalPrice: 35
    };
  }

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (user: User) => {
        this.user = user;  
        this.marketPlaceService.getShoppingCartById(user.id).subscribe({
          next: (result: ShoppingCart) => {
            this.shoppingCart = result;  
          }
        });
      }
    });
    this.updateCart = this.debounce(this.updateCart.bind(this), 500)
  }

  getTotalPrice() {
    return this.shoppingCart.items.reduce((total, item) => total + item.price.cost * item.quantity, 0);
  }

  removeItem(itemId: number) {
    this.shoppingCart.items = this.shoppingCart?.items.filter(item => item.tourId !== itemId);
    this.marketPlaceService.removeItemFromCart(this.user.id, itemId)
  }

  checkout() {
    alert('Proceeding to checkout!');
    this.shoppingCart.items = []
    this.marketPlaceService.clearCart(this.user.id)
  }

  decreaseQuantity(item: OrderItem) {
    item.quantity = item.quantity -1
    this.updateCart()
  }

  increaseQuantity(item : OrderItem){
    item.quantity = item.quantity + 1
    this.updateCart()
  }

  updateCart() {
    this.marketPlaceService.updateCart(this.shoppingCart)
  }

  debounce(func: Function, delay: number) {
    return (...args: any[]) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
}