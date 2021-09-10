import * as path from 'path';
import PDFDocument from 'pdfkit';

import { Injectable, Logger } from '@nestjs/common';
import { Invoice, InvoiceItem } from '../invoices/invoices.schema';
import { Customer } from '../customers/customers.schema';
import { formatCurrency, formatDate, formatHour, formatReportNr, formatRegistration, hr, formatFullDate, vr } from './pdf.utils';
import { createWriteStream } from 'fs';
import { Order } from '../orders/orders.schema';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(private settingsService: SettingsService) {
  }

  async exportInvoice(invoice: Invoice): Promise<PDFDocument> {
    const filepath = path.join(__dirname, `Fatura_${formatReportNr(invoice.invoiceNumber)}.pdf`);

    let doc: PDFDocument = new PDFDocument({ margin: 50 });

    await this.generateHeader(doc, 'invoiceEmail');
    let lastPosition = this.generateInvoiceHeader(doc, invoice, 180);
    lastPosition = this.generateInvoiceItems(doc, invoice, lastPosition);
    this.generateExtraInfo(doc, invoice, lastPosition);
    this.generateFooter(doc);
  
    doc.end();
    doc.pipe(createWriteStream(filepath));

		
    this.logger.log(`PDF successfully read for invoice ${formatReportNr(invoice.invoiceNumber)}`)
		return doc;
	}

  async exportOrder(order: Order): Promise<PDFDocument> {
    const filepath = path.join(__dirname, `OS_${formatReportNr(order.orderNumber)}.pdf`);

    let doc: PDFDocument = new PDFDocument({ margin: 50 });

    await this.generateHeader(doc, 'orderEmail');
    let lastPosition = this.generateOrderHeader(doc, order, 180);
    this.generateOrderBody(doc, order, lastPosition);
    this.generateFooter(doc);
  
    doc.end();
    doc.pipe(createWriteStream(filepath));

		
    this.logger.log(`PDF successfully read for order ${formatReportNr(order.orderNumber)}`)
		return doc;
	}

  async generateHeader(doc: PDFDocument, emailPropery: string) {

    const { company } = await this.settingsService.get();
    doc
      .image('images/logo.png', 50, 60, { width: 200 })
      .fillColor('#444444')
      .fontSize(8)
      .font('Helvetica-Bold')
      .text(company.fullName, 200, 45, { align: 'right' })
      .font('Helvetica')
      .text(`${company.address} - ${company.county}`, 200, 60, { align: 'right' })
      .text(`${company.city}/${company.state} - CEP: ${company.zipCode}`, 200, 75, { align: 'right' })
      .text(`CNPJ: ${company.registrationNr} - IM: ${company.extraInfo}`, 200, 90, { align: 'right' })
      .text(`Telefone: ${company.contactPhone}`, 200, 105, { align: 'right' })
      .text(`E-mail: ${company[emailPropery]}`, 200, 120, { align: 'right' })
      .moveDown();
  }

  generateInvoiceHeader(doc: PDFDocument, invoice: Invoice, position: number) {
    this.logger.log(`> generateInvoiceHeader - ${JSON.stringify(invoice.customer)}`);

    doc
      .fillColor('#444444')
      .fontSize(18)
      .text('Fatura', 50, 160);
    
    hr(doc, position);

    const custormerInfoPosition = position + 5;
    this.generateCustomerInfo(doc, invoice.customer, custormerInfoPosition);

    doc
      .fontSize(10)
      .text('Número da Fatura:', 50, custormerInfoPosition)
      .font('Helvetica-Bold')
      .text(formatReportNr(invoice.invoiceNumber), 150, custormerInfoPosition)
      .font('Helvetica')
      .text('Emitida em:', 50, custormerInfoPosition + 15)
      .text(formatDate(invoice.createdAt), 150, custormerInfoPosition + 15)
      .text('Vencimento em:', 50, custormerInfoPosition + 30)
      .text(formatDate(invoice.dueDate), 150, custormerInfoPosition + 30)
      .text('Valor da fatura:', 50, custormerInfoPosition + 45)
      .text(formatCurrency(invoice.amount - invoice.discount - invoice.amountPaid), 150, custormerInfoPosition + 45);
  
    hr(doc, custormerInfoPosition + 60);
    this.logger.log(`< generateInvoiceHeader`);

    return custormerInfoPosition + 65;
  }

  generateOrderHeader(doc: PDFDocument, order: Order, position: number) {
    this.logger.log(`> generateOrderHeader - ${JSON.stringify(order.customer)}`);
    
    doc
      .fillColor('#444444')
      .fontSize(18)
      .text('Ordem de Serviço', 50, 160);
      
    hr(doc, position);

    const custormerInfoPosition = position + 5;
    this.generateCustomerInfo(doc, order.customer, custormerInfoPosition);

    doc
      .fontSize(10)
      .text('Número da OS:', 50, custormerInfoPosition)
      .font('Helvetica-Bold')
      .text(formatReportNr(order.orderNumber), 150, custormerInfoPosition)
      .font('Helvetica')
      .text('Aberto em:', 50, custormerInfoPosition + 15)
      .text(formatFullDate(order.createdAt), 150, custormerInfoPosition + 15)
      .text('Modelo:', 50, custormerInfoPosition + 30)
      .text(order.printer?.product?.model, 150, custormerInfoPosition + 30)
      .text('Série:', 50, custormerInfoPosition + 45)
      .text(order.printer?.serialNumber, 150, custormerInfoPosition + 45);

    hr(doc, custormerInfoPosition + 60);
    this.logger.log(`< generateOrderHeader`);

    return custormerInfoPosition + 65;
  }

  generateCustomerInfo(doc: PDFDocument, customer: Customer, custormerInfoPosition: number) {    
    if (!customer) {
      this.logger.warn(`> generateCustomerInfo - No customer information found on Invoice`);
      return;
    }

    this.logger.log(`> generateCustomerInfo ${JSON.stringify(customer)}`);

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`${customer.fullName || customer.name} ${formatRegistration(customer.registrationNr, customer.customerNumber)}`, 300, custormerInfoPosition)
      .font('Helvetica')
      .text(customer.contactName, 300, custormerInfoPosition + 15)
      .text(customer.address, 300, custormerInfoPosition + 30)
      .text(`${customer.city}/${customer.state}`, 300, custormerInfoPosition + 45)
      .moveDown();

      this.logger.log(`< generateCustomerInfo`);
  }

  generateInvoiceItems(doc: PDFDocument, invoice: Invoice, position: number) {
    doc
    .fillColor('#444444')
    .fontSize(13)
    .text('Items da Fatura', 50, position + 20);

    hr(doc, position + 35);

    let i;
    const invoiceTableTop = position + 40;
  
    doc.font("Helvetica-Bold");
    this.generateTableRow(
      doc,
      invoiceTableTop,
      "Item",
      "Código/Modelo",
      "Descrição do Produto",
      "Valor Unitário",
      "Quantidade",
      "Valor Total"
    );

    hr(doc, invoiceTableTop + 15);
    doc.font("Helvetica");
  
    for (i = 0; i < invoice.items.length; i++) {
      const item: InvoiceItem = invoice.items[i];
      if (!item.product) {
        this.logger.warn(`> generateInvoiceTable - No product information found on Invoice Item`);
        break;
      } else {
        this.logger.log(`> generateInvoiceTable - ${JSON.stringify(item.product)}`);
      }
      const position = invoiceTableTop + (i + 1) * 20;
      this.generateTableRow(
        doc,
        position,
        i + 1,
        `${item.product.model}`,
        item.description || item.product.description,
        formatCurrency(item.price),
        item.quantity,
        formatCurrency(item.price * item.quantity)
      );
  
      hr(doc, position + 15);
    }
  
    const subtotalPosition = invoiceTableTop + (i + 1) * 20;
    this.generateTableRow(
      doc,
      subtotalPosition,
      "",
      "",
      "",
      "Sub-total",
      "",
      formatCurrency(invoice.amount)
    );

    const discountPosition = subtotalPosition + 20;
    this.generateTableRow(
      doc,
      discountPosition,
      "",
      "",
      "",
      "Desconto",
      "",
      formatCurrency(invoice.discount, true)
    );
  
    const paidToDatePosition = discountPosition + 20;
    this.generateTableRow(
      doc,
      paidToDatePosition,
      "",
      "",
      "",
      "Total pago",
      "",
      formatCurrency(invoice.amountPaid, true)
    );
  
    const totalAmpountPosition = paidToDatePosition + 20;
    doc.font("Helvetica-Bold");
    this.generateTableRow(
      doc,
      totalAmpountPosition,
      "",
      "",
      "",
      "Total a pagar",
      "",
      formatCurrency(invoice.amount - invoice.discount - invoice.amountPaid)
    );
    doc.font("Helvetica");

    hr(doc, totalAmpountPosition + 20);

    return totalAmpountPosition + 25;
  }

  generateOrderBody(doc: PDFDocument, order: Order, position: number) {
    position += 15

    doc
    .fillColor('#444444')
    .fontSize(13)
    .text('Atendimento da OS', 50, position);

    hr(doc, position + 20);

    const bodyPosition = position + 35;
    const vPosition = position + 20;

    doc
      .fontSize(10)
      .font('Helvetica')
      .text('P/B Atual:', 55, bodyPosition)
      .text(`${order.currentPB || ''}`, 115, bodyPosition - 2) 
      .text('_____________', 115, bodyPosition)
      .text('Color Atual:', 55, bodyPosition + 30)
      .text(`${order.currentColor || ''}`, 115, bodyPosition + 30 - 2) 
      .text('_____________', 115, bodyPosition + 30)
      .text('Atendimento:', 230, bodyPosition);

    if (!!order.startedAt) {
      doc
      .text(`${formatDate(order.startedAt)}`, 315, bodyPosition - 2) 
      .text('______________', 302, bodyPosition) 
      .text('Início:', 230, bodyPosition + 20)
      .text(`${formatHour(order.startedAt)}`, 325, bodyPosition +20 - 2) 
      .text('_____________', 302, bodyPosition + 20)        
    } else {
      doc
      .text('____/____/____', 302, bodyPosition) 
      .text('Início:', 230, bodyPosition + 20)
      .text('______:______', 302, bodyPosition + 20)
    }
    if (!!order.finishedAt) {
      doc
      .text('Término:', 230, bodyPosition + 40)
      .text(`${formatHour(order.finishedAt)}`, 325, bodyPosition + 40- 2) 
      .text('_____________', 302, bodyPosition + 40) 
    } else {
      doc
        .text('Término:', 230, bodyPosition + 40)
        .text('______:______', 302, bodyPosition + 40) 
    }

    doc
      .text('Técnico:', 410, bodyPosition)
      .text(`${order.technicalUser?.name || ''} ${order.technicalUser?.lastName || ''}`, 460, bodyPosition - 2) 
      .text('__________________', 460, bodyPosition) 
      .text('N.OS:', 410, bodyPosition + 30)
      .text(`${order.nos || ''}`, 460, bodyPosition + 30 -2) 
      .text('__________________', 460, bodyPosition + 30);

    vr(doc, 210, vPosition, 80);
    vr(doc, 400, vPosition, 80);
    hr(doc, vPosition + 80);

    doc
      .fontSize(9)
      .text('Pendêcias:', 55, vPosition + 100)  
      .text(`${order.points || ''}`, 115, vPosition + 98) 
    hr(doc, vPosition + 107, 115);
    hr(doc, vPosition + 137, 115);
    hr(doc, vPosition + 167);

    const problemPostion = vPosition + 167;

    doc
      .fontSize(10)
      .text('Sintoma:', 55, problemPostion + 15)
      .font("Helvetica-Bold")
      .text(`${order.problem?._id || ''} - ${order.problem?.name || ''}`, 115, problemPostion + 15, { align: 'center' })
      .font("Helvetica")
      .text('Ação:', 55, problemPostion + 45)
      .text(`${order.actions || ''}`, 115, problemPostion + 43);
    
    hr(doc, problemPostion + 52, 115);
    hr(doc, problemPostion + 82, 115);
    hr(doc, problemPostion + 112);

    const obsPosition = problemPostion + 142;
    doc
      .fontSize(9)
      .text('Observações:', 55, obsPosition)
      .text(`${order.notes || ''}`, 115, obsPosition - 2);

    hr(doc, obsPosition + 7, 115);
    hr(doc, obsPosition + 37, 115);
    hr(doc, obsPosition + 67, 115);
    hr(doc, obsPosition + 97);
  }

  generateExtraInfo(doc: PDFDocument, invoice: Invoice, position: number) {
    doc
    .fontSize(9)
    .text('Referente Contrato(a):', 50, position)
    .text('De acordo com a Lei Complementar Federal n. 116 de 31/07/2003', 125, 700)
    .text(`Valor aproximado dos tributos: PIS (0.65% = ${formatCurrency(invoice.amount * 0.0065)} / COFINS (3.00% =  ${formatCurrency(invoice.amount * 0.03)})`, 125, 710)
  }
  
  generateFooter(doc: PDFDocument) {
    hr(doc, 725);
    doc
    .fontSize(10)
    .text('Assinatura ou Autenticação:', 50, 730)
    .text('Data:', 425, 730)
  }
  
  generateTableRow(
    doc,
    y,
    item,
    code,
    description,
    unitCost,
    quantity,
    lineTotal
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(code, 100, y)
      .text(description, 200, y)
      .text(unitCost, 300, y, { width: 90, align: "right" })
      .text(quantity, 390, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
  }
}