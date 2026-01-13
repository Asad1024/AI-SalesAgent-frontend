const fs = require('fs');
const en = JSON.parse(fs.readFileSync('en.json', 'utf8'));

// Hindi translations mapping for common terms
const translations = {
  // Common
  "Cancel": "रद्द करें",
  "Save": "सहेजें",
  "Delete": "हटाएं",
  "Edit": "संपादित करें",
  "Create": "बनाएं",
  "Update": "अपडेट करें",
  "Confirm": "पुष्टि करें",
  "Close": "बंद करें",
  "Loading...": "लोड हो रहा है...",
  "Error": "त्रुटि",
  "Success": "सफलता",
  "Warning": "चेतावनी",
  "Info": "जानकारी",
  "Yes": "हाँ",
  "No": "नहीं",
  "OK": "ठीक है",
  "Back": "वापस",
  "Next": "अगला",
  "Previous": "पिछला",
  "Search": "खोजें",
  "Filter": "फ़िल्टर",
  "Clear": "साफ़ करें",
  "Refresh": "ताज़ा करें",
  "Upload": "अपलोड करें",
  "Download": "डाउनलोड करें",
  "Export": "निर्यात करें",
  "Import": "आयात करें",
  "Required": "आवश्यक",
  "Optional": "वैकल्पिक",
  "Name": "नाम",
  "Description": "विवरण",
  "Status": "स्थिति",
  "Active": "सक्रिय",
  "Inactive": "निष्क्रिय",
  "Completed": "पूर्ण",
  "Pending": "लंबित",
  "Paused": "रोका गया",
  "Pause": "रोकें",
  "Resume": "जारी रखें",
  "Draft": "ड्राफ्ट",
  "Settings": "सेटिंग्स",
  "Log Out": "लॉग आउट",
  "Log In": "लॉग इन",
  "Register": "पंजीकरण",
  "Email": "ईमेल",
  "Password": "पासवर्ड",
  "Confirm Password": "पासवर्ड की पुष्टि करें",
  "User": "उपयोगकर्ता",
  "Dark Mode": "डार्क मोड",
  "Light Mode": "लाइट मोड",
  "Switch to dark mode": "डार्क मोड में बदलें",
  "Switch to light mode": "लाइट मोड में बदलें",
  "Admin": "व्यवस्थापक",
  "Administrator": "व्यवस्थापक",
  "Sign In": "साइन इन",
  "Get Started": "शुरू करें",
  "Start Free Trial": "मुफ्त परीक्षण शुरू करें",
  "Watch Demo": "डेमो देखें",
  "Schedule Demo": "डेमो शेड्यूल करें",
  "About": "के बारे में",
  "Contact": "संपर्क",
  "Features": "सुविधाएं",
  "Pricing": "मूल्य निर्धारण",
  "Home": "होम",
  "Dashboard": "डैशबोर्ड",
  "Campaigns": "अभियान",
  "Voices": "आवाज़ें",
  "Analytics": "विश्लेषण"
};

// Function to translate a value
function translateValue(value) {
  if (typeof value === 'string') {
    // Check if exact match exists
    if (translations[value]) {
      return translations[value];
    }
    // For longer strings, we'll keep them in English for now
    // and add specific translations as needed
    return value;
  } else if (Array.isArray(value)) {
    return value.map(translateValue);
  } else if (typeof value === 'object' && value !== null) {
    const translated = {};
    for (const key in value) {
      translated[key] = translateValue(value[key]);
    }
    return translated;
  }
  return value;
}

// Translate the entire structure
const hi = translateValue(en);

// Write the translated file
fs.writeFileSync('hi.json', JSON.stringify(hi, null, 2));
console.log('Hindi translation file created!');
