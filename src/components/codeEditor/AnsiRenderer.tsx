/* eslint-disable no-control-regex */
import React from 'react';

interface AnsiProps {
  text: string;
}

const Ansi: React.FC<AnsiProps> = ({ text }) => {
  const convertAnsiToHtml = (input: string) => {
    const TIME_PATTERN_REGEX = /\[(\d{2}):(\d{2}):(\d{2})\]/g;

    // Replace ANSI escape codes with HTML elements and insert newline before [ss:mm:hh]
    const newLineInput= input.replace(TIME_PATTERN_REGEX, (match) => `\n${match}`);
    // Regular expression to match ANSI escape codes
    const ansiRegex = /\u001b\[[0-9]{1,2}m/g;

    // Split the input text by ANSI escape codes
    const parts = newLineInput.split(ansiRegex);

    

    // Map each part to either a span with appropriate style or plain text
    return parts.map((part, index) => {
        if (part.match(ansiRegex)) {
          // Extract ANSI color code and apply corresponding style
          const colorCode = part.slice(2, -1); // Remove escape characters
          const spanStyle = {
            color: getAnsiColor(parseInt(colorCode))
          };
          return <span key={index} style={spanStyle}>{part}</span>;
        } else {
          return <span key={index}>{part}</span>;
        }
      });
  };
 

  // Function to get the corresponding color for ANSI color codes
  const getAnsiColor = (code: number): string => {
    switch (code) {
      case 31:
        return 'red';
      case 32:
        return 'green';
      case 33:
        return 'yellow';
      case 34:
        return 'blue';
      // Add more cases for other colors as needed
      default:
        return 'inherit'; // Default color
    }
  };
 
  
  return <>{convertAnsiToHtml(text)}</>;
};

export default Ansi;
