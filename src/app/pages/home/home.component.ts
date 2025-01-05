import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { loadProducts, Product } from '../../store/products/product.reducer';
import { Store } from '@ngrx/store';
import { selectAllProducts } from '../../store/products/product.selectors';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importamos FormsModule para ngModel
import { CartService } from '../../services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products$: Observable<Product[]>;
  searchKeyword: string = ''; // Propiedad para manejar el input de búsqueda

  constructor(private readonly store: Store, private readonly cartService: CartService, private readonly toastr: ToastrService) {
    this.products$ = this.store.select(selectAllProducts);
  }

  ngOnInit(): void {
    console.log('Dispatching loadProducts');
    this.store.dispatch(loadProducts({}));
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({
      id: +product.id,
      name: product.name,
      price: product.price,
      quantity: 1, // Por defecto, agregar una unidad
    });
    this.toastr.success(`${product.name} agregado al carrito`);
  }

  // Método para realizar la búsqueda
  searchProducts(): void {
    console.log(`Searching products with keyword: ${this.searchKeyword}`);
    this.store.dispatch(loadProducts({ keyword: this.searchKeyword }));
  }
}
