import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import jsPDF from 'jspdf';

// Company logo embedded as base64 (PNG from word/media/image1.png in the DOCX)
const COMPANY_LOGO_BASE64 = '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';

@Component({
  selector: 'app-job-details-modal',
  templateUrl: './job-details-modal.component.html',
  styleUrls: ['./job-details-modal.component.scss']
})
export class JobDetailsModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() job: any = null;
  @Output() close = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['job'] && this.job) {
      console.log('Modal received job data:', this.job);
      console.log('Modal job responsibilities:', this.job.responsibilities);
      console.log('Modal job requirements:', this.job.requirements);
      console.log('Modal job qualifications:', this.job.qualifications);

      // For testing - add mock data if missing
      if (!this.job.responsibilities || this.job.responsibilities.length === 0) {
        this.job.responsibilities = [
          'Design and develop architectural plans',
          'Collaborate with clients and stakeholders',
          'Ensure compliance with building codes and regulations'
        ];
      }
      if ((!this.job.requirements && !this.job.qualifications) || (this.job.requirements || this.job.qualifications || []).length === 0) {
        this.job.requirements = [
          'Bachelor\'s degree in Architecture',
          '5+ years of experience in architectural design',
          'Proficiency in AutoCAD and architectural software'
        ];
      }
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  downloadPDF(): void {
    if (!this.job) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();   // 595.28
    const pageHeight = doc.internal.pageSize.getHeight(); // 841.89
    const margin = 42;
    const contentWidth = pageWidth - margin * 2;

    // ── HEADER: company logo image ──────────────────────────────────────────
    // Logo dimensions: 1257 × 648 px → scale to fit header area (height ~60pt)
    const logoTargetH = 56;
    const logoTargetW = logoTargetH * (1257 / 648); // maintain aspect ratio ≈ 108pt
    const logoX = margin;
    const logoY = 20;
    doc.addImage(
      'data:image/png;base64,' + COMPANY_LOGO_BASE64,
      'PNG',
      logoX, logoY,
      logoTargetW, logoTargetH
    );

    let cursorY = logoY + logoTargetH + 20; // position after logo

    // ── JOB TITLE ───────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text(this.job.title || 'Job Title', margin, cursorY);
    cursorY += 8;

    // ── LOCATION ────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    cursorY += 16;
    doc.text(`Location: ${this.job.location || 'Nairobi'}`, margin, cursorY);
    cursorY += 20;

    // ── SECTION HELPERS ──────────────────────────────────────────────────────
    const addSection = (title: string, lines: string[]): void => {
      // Check if we need a new page
      if (cursorY + 50 > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }

      // Section header blue banner
      const bannerColor: [number, number, number] = [28, 117, 188];
      doc.setFillColor(...bannerColor);
      doc.rect(margin, cursorY, contentWidth, 24, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text(title, margin + 8, cursorY + 16);
      cursorY += 34;

      // Section content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);

      lines.forEach((line, index) => {
        // Wrap long lines
        const wrapped = doc.splitTextToSize(line, contentWidth - 10);
        wrapped.forEach((wrappedLine: string, wIdx: number) => {
          if (cursorY + 16 > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
          }
          // Only show bullet on the first line of a wrapped item
          if (wIdx === 0) {
            doc.text(`${index + 1}. ${wrappedLine}`, margin + 10, cursorY);
          } else {
            doc.text(`    ${wrappedLine}`, margin + 10, cursorY);
          }
          cursorY += 16;
        });
      });

      cursorY += 10; // spacing after section
    };

    const addParagraphSection = (title: string, text: string): void => {
      // Check if we need a new page
      if (cursorY + 50 > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }

      // Section header blue banner
      const bannerColor: [number, number, number] = [28, 117, 188];
      doc.setFillColor(...bannerColor);
      doc.rect(margin, cursorY, contentWidth, 24, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text(title, margin + 8, cursorY + 16);
      cursorY += 34;

      // Section content as paragraph
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);

      const wrapped = doc.splitTextToSize(text, contentWidth - 10);
      wrapped.forEach((wrappedLine: string) => {
        if (cursorY + 16 > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(wrappedLine, margin + 10, cursorY);
        cursorY += 16;
      });

      cursorY += 10; // spacing after section
    };

    // ── JOB DESCRIPTION SECTION ─────────────────────────────────────────────
    const description = this.job.description || 'No description available';
    addParagraphSection('Job Description', description);

    // ── RESPONSIBILITIES ────────────────────────────────────────────────────
    if (this.job.responsibilities && this.job.responsibilities.length > 0) {
      addSection('Responsibilities', this.job.responsibilities);
    }

    // ── REQUIREMENTS / QUALIFICATIONS ───────────────────────────────────────
    const requirements = this.job.requirements || this.job.qualifications;
    if (requirements && requirements.length > 0) {
      addSection('Requirements', requirements);
    }

    // ── SAVE ────────────────────────────────────────────────────────────────
    const fileName = `${this.job.title || 'job-details'}.pdf`
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    doc.save(fileName);
  }

  // Legacy helpers kept for compatibility (no longer used for PDF generation)
  private generateJobTextContent(): string {
    let content = `${this.job.title || 'Job Title'}\n\n`;
    content += 'JOB DESCRIPTION\n================\n';
    content += `${this.job.description || 'No description available'}\n\n`;
    if (this.job.responsibilities && this.job.responsibilities.length > 0) {
      content += 'RESPONSIBILITIES\n================\n';
      this.job.responsibilities.forEach((resp: string) => { content += `• ${resp}\n`; });
      content += '\n';
    }
    const requirements = this.job.requirements || this.job.qualifications;
    if (requirements && requirements.length > 0) {
      content += 'REQUIREMENTS\n============\n';
      requirements.forEach((req: string) => { content += `• ${req}\n`; });
    }
    return content;
  }
}