import { Component, ElementRef } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent {

  data: any;

  constructor(private adminService: AdminService,
              private elRef: ElementRef) {}

  ngOnInit() {
    this.adminService.getAnalytics().subscribe(res => {
      console.log(res);
      this.data = res;
    });
  }

  imprimirLista() {
    const pdf = new jspdf.jsPDF();

    const componentsToCapture = [
      this.elRef.nativeElement.querySelector('app-order-by-status'),
      this.elRef.nativeElement.querySelector('.analytics-container')
    ];

    const promises = componentsToCapture.map(component => html2canvas(component));

    Promise.all(promises).then((canvases) => {
      canvases.forEach((canvas, index) => {
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, (index * pdfHeight) + 10, pdfWidth - 20, pdfHeight);
      });

      pdf.save('Reporte_Ventas.pdf');
    });
  }

  generarReporteExcel() {
    const wb = XLSX.utils.book_new();

    const ordersData = [
      ['Mes', 'Órdenes Actual', 'Órdenes Anterior'],
      ['Este mes', this.data.currentMonthOrders, ''],
      ['Mes anterior', '', this.data.previousMonthOrders]
    ];

    const earningsData = [
      ['Mes', 'Ganancias Actual', 'Ganancias Anterior'],
      ['Este mes', this.data.currentMonthEarnings, ''],
      ['Mes anterior', '', this.data.previousMonthEarnings]
    ];

    const ordersStatusData = [
      ['Pedidos', 'Cantidad'],
      ['Enviados', this.data.sentOrders],
      ['Entregados', this.data.deliveredOrders],
      ['Pendientes', this.data.pendingOrders]
    ];

    const wsOrders = XLSX.utils.aoa_to_sheet(ordersData);
    const wsEarnings = XLSX.utils.aoa_to_sheet(earningsData);
    const wsOrdersStatus = XLSX.utils.aoa_to_sheet(ordersStatusData);

    XLSX.utils.book_append_sheet(wb, wsOrders, 'Órdenes');
    XLSX.utils.book_append_sheet(wb, wsEarnings, 'Ganancias');
    XLSX.utils.book_append_sheet(wb, wsOrdersStatus, 'Estado Pedidos');

    XLSX.writeFile(wb, 'Reporte_Ventas.xlsx');
  }
}
