import { Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-product-detail',
  templateUrl: './view-product-detail.component.html',
  styleUrls: ['./view-product-detail.component.scss']
})
export class ViewProductDetailComponent {
  productId: number = this.activatedRoute.snapshot.params["productId"];
  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];
  showImageModal: boolean = false;
  expandedImage: string = '';

  showZoom: boolean = false;
  lensSize: number = 100; 
  zoomLevel: number = 3; 

  constructor(private snackBar: MatSnackBar,
              private customerService: CustomerService,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog,) {}

              
     toggleZoom(show: boolean) {
    this.showZoom = show;
  }

  ngOnInit() {
    this.getProductDetailById();
    this.product = { hovered: false };
  }

  getProductDetailById() {
    this.customerService.getProductDetailById(this.productId).subscribe(res => {
      this.product = res.productDto;
      this.product.processedImg = 'data:image/png;base64,' + res.productDto.byteImg;
  
      this.FAQS = res.faqDtoList;
  
      console.log("FAQS:", this.FAQS); 
  
      res.reviewDtoList.forEach(element => {
        element.processedImg = 'data:image/png;base64,' +  element.returnedImg;
        this.reviews.push(element);
      });
    }, error => {
      console.error("Error al obtener los detalles del producto:", error);
    });
  }

  addToWishlist() {
    const wishListDto = {
      productId : this.productId,
      userId: UserStorageService.getUserId()
    };

    this.customerService.addProductToWishlist(wishListDto).subscribe(res => {
      if(res.id != null) {
        this.snackBar.open('Producto añadido a la lista de favoritos', 'Cerrar', {
          duration: 5000
        });
        this.product.inWishlist = true; // Actualiza el estado del producto para reflejar que está en la lista de favoritos
      } else {
        this.snackBar.open('El producto ya está en la lista de favoritos', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  addToCart(id: any) {
    this.customerService.addToCart(id).subscribe(res => {
      this.snackBar.open("El producto fue añadido al carrito", "Close", {
        duration: 5000
      })
    })
  }

  toggleFavoriteIcon(hovered: boolean) {
    this.product.hovered = hovered;
  }

  toggleImageModal(imageUrl: string) {
    this.expandedImage = imageUrl;
    this.showImageModal = !this.showImageModal;
  }

  closeImageModal() {
    this.showImageModal = false;
}

@HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent) {
    if (this.showImageModal) {
      this.closeImageModal();
    }
  }
  placeOrder(){
    this.dialog.open(PlaceOrderComponent);
  }
}
