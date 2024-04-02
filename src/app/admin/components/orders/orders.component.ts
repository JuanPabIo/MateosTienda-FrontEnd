import { Component, AfterViewInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements AfterViewInit {

  orders: any[] = [];

  constructor(private adminService: AdminService,
    private snackBar: MatSnackBar){
    
  }

  ngAfterViewInit() {
    this.getPlacedOrders();
  }

  getPlacedOrders(){
    this.adminService.getPlacedOrders().subscribe(
      res => {
        this.orders = res;
        console.log(res);
      },
      error => {
        console.error('Error al obtener las órdenes:', error);
      }
    );
  }

  changeOrderStatus(orderId: number, status:string){
    this.adminService.changeOrderStatus(orderId, status).subscribe(
      res => {
        if(res.id != null){
          this.snackBar.open("Estado de la orden cambiado exitosamente", "Cerrar", { duration: 5000 });
          this.getPlacedOrders();
        }else{
          this.snackBar.open("Algo salio mal", "Cerrar", { duration: 5000 });
        }
      },
      error => {
        this.snackBar.open("Algo salio mal", "Cerrar", { duration: 5000 });
        console.error('Error al cambiar el estado de la orden:', error);
      }
    );
  }

}
