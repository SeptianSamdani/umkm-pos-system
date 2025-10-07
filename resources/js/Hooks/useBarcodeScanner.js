// FILE: resources/js/Hooks/useBarcodeScanner.js
import { useEffect, useRef } from 'react';

export default function useBarcodeScanner(onScan) {
    const barcodeRef = useRef('');
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ignore if typing in input fields
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                return;
            }

            // Clear timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Add character to barcode
            if (e.key.length === 1) {
                barcodeRef.current += e.key;
            }

            // Process barcode after 100ms of no input
            timeoutRef.current = setTimeout(() => {
                if (barcodeRef.current.length >= 8) { // Minimum barcode length
                    onScan(barcodeRef.current);
                }
                barcodeRef.current = '';
            }, 100);
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [onScan]);
}