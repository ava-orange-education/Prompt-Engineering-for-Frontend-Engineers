import { Component } from '@angular/core';
import { ProductCardComponent } from './product-card';

@Component({
  imports: [ProductCardComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  onAddToCart(event: { id: number; qty: number }) {
    console.log('add to cart', event);
  }
}
