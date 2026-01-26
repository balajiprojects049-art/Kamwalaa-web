import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to load image
const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};

export const generateInvoice = async (booking, user) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const primaryColor = [59, 130, 246]; // Blue-500
    const grayColor = [107, 114, 128]; // Gray-500
    const lightGray = [243, 244, 246]; // Gray-100

    // --- Header ---
    // Logo
    try {
        // Assume logo is at /logo.png
        const logoUrl = window.location.origin + '/logo.png';
        const logoImg = await loadImage(logoUrl);
        // Add Image (x=14, y=10, w=35, h=auto based on aspect ratio usually, but fixed w/h for now)
        // Adjust width/height as needed. Assuming squarish or wide? 
        // Let's create a reasonable size.
        doc.addImage(logoImg, 'PNG', 14, 10, 40, 12);
    } catch (err) {
        // Fallback if logo fails
        console.warn('Logo failed to load:', err);
        doc.setFontSize(24);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Kamwalaa', 14, 20);
    }

    // Company Info
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Trusted Home Service Partner', 14, 26);
    doc.text('Hyderabad, Telangana, 500081', 14, 31);
    doc.text('support@kamwalaa.com | +91 9000000000', 14, 36);

    // Invoice Label
    doc.setFontSize(30);
    doc.setTextColor(200, 200, 200); // Faint gray
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 14, 25, { align: 'right' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 45, pageWidth - 14, 45);

    // --- Invoice Details ---
    const startY = 55;

    // Left: Customer Info
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(user.name || 'Customer', 14, startY + 6);
    doc.text(user.phone || '', 14, startY + 11);
    // Address (wrap text)
    if (user.address) {
        doc.text(user.address, 14, startY + 16, { maxWidth: 80 });
    }

    // Right: Invoice Metadata
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Invoice No:', pageWidth - 60, startY);
    doc.text('Date:', pageWidth - 60, startY + 6);
    doc.text('Status:', pageWidth - 60, startY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(`#${booking.id}`, pageWidth - 14, startY, { align: 'right' });
    doc.text(booking.date, pageWidth - 14, startY + 6, { align: 'right' });

    // Status Badge Logic (Simple text color)
    const statusColor = booking.status === 'Completed' ? [16, 185, 129] : [245, 158, 11]; // Green or Orange
    doc.setTextColor(...statusColor);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.status.toUpperCase(), pageWidth - 14, startY + 12, { align: 'right' });

    // Sanitize Currency (Remove ₹ which renders as garbage in standard fonts)
    const displayAmount = (booking.amount || '0').toString().replace(/₹/g, 'Rs. ');

    // --- Services Table ---
    autoTable(doc, {
        startY: startY + 30,
        head: [['Item Description', 'Service Date', 'Price']],
        body: [
            [
                { content: booking.service, styles: { fontStyle: 'bold' } },
                booking.date,
                { content: displayAmount, styles: { halign: 'right' } }
            ]
        ],
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'left'
        },
        styles: {
            fontSize: 10,
            cellPadding: 5,
            valign: 'middle'
        },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Description
            1: { cellWidth: 40 },     // Date
            2: { cellWidth: 35, halign: 'right' } // Price
        }
    });

    // --- Total Section ---
    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : startY + 60) + 10;

    // Subtotal & Tax
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text('Subtotal:', pageWidth - 65, finalY);
    doc.text('Tax (0%):', pageWidth - 65, finalY + 6);

    doc.setTextColor(0, 0, 0);
    doc.text(displayAmount, pageWidth - 14, finalY, { align: 'right' });
    doc.text('Rs. 0.00', pageWidth - 14, finalY + 6, { align: 'right' });

    // Divider Line
    doc.setDrawColor(220, 220, 220);
    doc.line(pageWidth - 65, finalY + 9, pageWidth - 14, finalY + 9);

    // Grand Total
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', pageWidth - 65, finalY + 16);
    doc.text(displayAmount, pageWidth - 14, finalY + 16, { align: 'right' });

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing Kamwalaa services!', pageWidth / 2, finalY + 30, { align: 'center' });

    // Save PDF
    doc.save(`Invoice_${booking.id}.pdf`);
};
