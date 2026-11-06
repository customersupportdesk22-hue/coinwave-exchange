const fs = require('fs');
let code = fs.readFileSync('public/patch.js', 'utf8');

// 1. Find and delete the auto-loader block
const startMarker = "if (!document.getElementById('tawk-script')) {";
const endMarker = "document.head.appendChild(s1);\n}";

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    code = code.slice(0, startIndex) + "// Tawk auto-loader deleted. It will only load on click.\n" + code.slice(endIndex + endMarker.length);
}

// 2. Append the on-demand loader function
code += `
// ==========================================
// LOAD TAWK.TO ON DEMAND ONLY
// ==========================================
window.openLiveChat = function(e) {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    if(window.closeSupportPage) window.closeSupportPage();
    
    if(!document.getElementById('tawk-script')) {
        var s1 = document.createElement("script");
        s1.id = 'tawk-script';
        s1.async = true;
        s1.src = 'https://embed.tawk.to/6acacd23a18e8334c37e911e/default';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        document.head.appendChild(s1);
        
        setTimeout(() => {
            if(window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
            if(window.Tawk_API && window.Tawk_API.hideWidget) window.Tawk_API.hideWidget();
        }, 2000);
    } else {
        if(window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
        if(window.Tawk_API && window.Tawk_API.hideWidget) window.Tawk_API.hideWidget();
    }
}
`;

fs.writeFileSync('public/patch.js', code);
console.log('✅ SUCCESS: Auto-loader deleted. Tawk will load only on click.');
