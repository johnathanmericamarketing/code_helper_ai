import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileText } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

export const ExportButton = ({ data, fileName = 'request', type = 'request' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsJSON = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported as JSON');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(18);
      doc.text(type === 'request' ? 'Code Request Details' : 'Generated Code Report', 20, yPosition);
      yPosition += 15;

      // Metadata
      doc.setFontSize(10);
      doc.text(`Exported: ${new Date().toLocaleString()}`, 20, yPosition);
      yPosition += 10;

      // Content
      doc.setFontSize(12);
      if (data.id) {
        doc.text(`ID: ${data.id}`, 20, yPosition);
        yPosition += 8;
      }

      if (data.raw_request) {
        doc.setFontSize(10);
        doc.text('Request Description:', 20, yPosition);
        yPosition += 6;
        const lines = doc.splitTextToSize(data.raw_request, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 6 + 5;
      }

      if (data.status) {
        doc.text(`Status: ${data.status}`, 20, yPosition);
        yPosition += 8;
      }

      if (data.area_of_app) {
        doc.text(`Area: ${data.area_of_app}`, 20, yPosition);
        yPosition += 8;
      }

      if (data.summary) {
        doc.text('Summary:', 20, yPosition);
        yPosition += 6;
        const summaryLines = doc.splitTextToSize(data.summary, 170);
        doc.text(summaryLines, 20, yPosition);
      }

      doc.save(`${fileName}.pdf`);
      toast.success('Exported as PDF');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('PDF export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={isExporting}>
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportAsJSON} className="gap-2">
          <FileJson className="w-4 h-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsPDF} className="gap-2">
          <FileText className="w-4 h-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
