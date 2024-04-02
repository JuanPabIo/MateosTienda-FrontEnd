import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  products: any[] = []; 
  searchProductForm!: FormGroup;
  searchPerformed: boolean = false; 

  constructor(private customerService: CustomerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    })
  }

  getAllProducts() {
    this.products = [];
    this.customerService.getAllProducts().subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  submitForm() {
    this.searchPerformed = true; 
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.customerService.getAllProductsByName(title).subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  addToFavorites(product: any) {
    const wishListDto = {
      productId: product.id,
      userId: UserStorageService.getUserId()
    };
  
    const alreadyInWishlist = product.inWishlist;
  
    if (alreadyInWishlist) {
      this.snackBar.open('El producto ya se encuentra en favoritos', 'Cerrar', {
        duration: 5000
      });
      return; 
    }
  
    this.customerService.addProductToWishlist(wishListDto).subscribe(res => {
      if (res.id != null) {
        this.snackBar.open('Añadido a favoritos', 'Cerrar', {
          duration: 5000
        });
  
        product.inWishlist = true;
      } else {
        this.snackBar.open('Hubo un error al añadir el producto a favoritos', 'Cerrar', {
          duration: 5000
        });
      }
    });
  } 
  
  toggleFavoriteIcon(productId: string, show: boolean) {
    const productIndex = this.products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      this.products[productIndex].showFavoriteIcon = show;
    }
  }

  images = [
    {
      imageSrc:
        'assets/img/Carousel/IMG1.jpeg',
      imageAlt: 'nature1',
    },
    {
      imageSrc:
        'assets/img/Carousel/IMG2.jpeg',
      imageAlt: 'nature2',
    },
    {
      imageSrc:
        'assets/img/Carousel/IMG3.jpeg',
      imageAlt: 'person1',
    },
    {
      imageSrc:
        'assets/img/Carousel/IMG4.jpeg',
      imageAlt: 'person2',
    },
  ]

}
