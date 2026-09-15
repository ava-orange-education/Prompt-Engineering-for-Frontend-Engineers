import { Component, input, output, model, computed, effect } from '@angular/core';

// From the book, section "Signal Inputs, Outputs, and model()"
@Component({
  selector: 'app-product-card',
  template: `
    <h3>{{ title() }}</h3>
    <p>{{ summary() }}</p>
    <input [value]="qty()" (input)="qty.set(+$event.target.value)" type="number" min="1" />
    @if (qty() > 10) {
      <p class="note">Bulk discount applied</p>
    }
    <button (click)="addToCart.emit({ id: productId(), qty: qty() })">Add</button>
  `,
})
export class ProductCardComponent {
  productId = input.required<number>(); // read-only signal input
  title = input.required<string>();
  price = input<number>(0);
  qty = model<number>(1); // two-way bindable signal
  summary = computed(() => `${this.title()} — $${this.price().toFixed(2)}`);
  addToCart = output<{ id: number; qty: number }>(); // signal output

  constructor() {
    effect(() => console.log(`${this.title()} qty: ${this.qty()}`));
  }
}
