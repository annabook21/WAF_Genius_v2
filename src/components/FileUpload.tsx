
import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileSelect: (content: string) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const processFile = (file: File) => {
    if (!file.name.endsWith('.json') && !file.name.endsWith('.txt') && !file.name.endsWith('.log')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a .json, .txt, or .log file",
        variant: "destructive"
      });
      return;
    }
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onFileSelect(e.target.result as string);
      }
    };
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was a problem reading the file",
        variant: "destructive"
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="mb-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging ? 'border-cyber-green bg-cyber-green/10' : 'border-cyber-gray hover:border-cyber-green'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-cyber-green mb-4" />
        <h2 className="text-xl font-bold mb-2 cyber-text">Upload WAF Log File</h2>
        <p className="text-cyber-gray mb-4">Drag and drop your AWS WAF log file here, or click to select</p>
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".json,.txt,.log"
          onChange={handleFileChange}
        />
        
        <Button 
          onClick={handleButtonClick}
          className="bg-cyber-dark border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-black"
        >
          Select File
        </Button>
        
        {fileName && (
          <div className="mt-4 p-2 bg-cyber-dark/50 rounded flex items-center justify-between">
            <span className="text-sm truncate mr-2">{fileName}</span>
            <AlertTriangle className="h-4 w-4 text-cyber-yellow flex-shrink-0" />
          </div>
        )}
        
        <div className="mt-3 text-xs text-cyber-red flex items-center justify-center">
          <AlertTriangle className="h-3 w-3 mr-1" /> 
          All uploads are processed locally - no data leaves your browser
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
