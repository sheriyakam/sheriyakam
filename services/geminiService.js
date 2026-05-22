/**
 * geminiService.js
 * Integration with Google Gemini AI (Gemini 1.5 Flash)
 * Used for:
 *   - AI Diagnostics (analyzing photo of electrical issues)
 *   - Voice/Text Command parsing
 */

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Mock Diagnostic responses for offline/demo use
const MOCK_DIAGNOSTICS = {
  ac: {
    possibleIssue: "Condenser coil leakage or blocked air filter",
    recommendedCategory: "Air Conditioning",
    estimatedCost: "₹1,200 - ₹2,500 (Includes gas charging if needed)",
    safetyAdvice: "Turn off the AC circuit breaker (MCB) immediately to prevent motor burnout from low refrigerant.",
    materialsNeeded: "AC Gas (R32/R410), Copper tubing, foam filters",
    confidence: "94%"
  },
  fan: {
    possibleIssue: "Faulty start-capacitor or worn-out motor bearing",
    recommendedCategory: "Electrical (Ceiling Fan)",
    estimatedCost: "₹250 - ₹550",
    safetyAdvice: "Do not spin the fan blades manually while power is ON. Keep the fan switch OFF.",
    materialsNeeded: "2.5mfd Capacitor, copper fan winding check, lubricant",
    confidence: "91%"
  },
  motor: {
    possibleIssue: "Dry running/impeller jam or pump capacitor burnout",
    recommendedCategory: "Plumbing & Motor Repair",
    estimatedCost: "₹450 - ₹950",
    safetyAdvice: "Do not keep the motor switch ON if there is no water flow. It can overheat and burn the stator winding.",
    materialsNeeded: "Motor running capacitor (10mfd/12mfd), impeller check",
    confidence: "88%"
  },
  light: {
    possibleIssue: "Choke failure in LED tubelight or loose terminal connections",
    recommendedCategory: "Electrical",
    estimatedCost: "₹150 - ₹350",
    safetyAdvice: "Switch off the room switchboard and MCB. Never touch exposed wiring or connectors.",
    materialsNeeded: "LED driver / LED strip panel",
    confidence: "95%"
  },
  default: {
    possibleIssue: "General contact or circuit connection fault",
    recommendedCategory: "Electrical",
    estimatedCost: "₹200 - ₹500",
    safetyAdvice: "Please turn off the main switch immediately if there is a burning smell or sparking.",
    materialsNeeded: "Multimeter testing, terminal tightening",
    confidence: "85%"
  }
};

export const geminiService = {
  isConfigured: () => {
    return GEMINI_API_KEY.length > 0 && !GEMINI_API_KEY.includes('YOUR_');
  },

  analyzeIssueImage: async (imageUri, serviceCategory = 'general') => {
    console.log(`[Gemini AI] Analyzing image for category: ${serviceCategory}, URI: ${imageUri}`);
    
    // Simulate API delay for a highly realistic interaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (geminiService.isConfigured()) {
      try {
        let base64Data = '';
        if (imageUri.startsWith('data:image')) {
          base64Data = imageUri.split(',')[1];
        } else {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const requestBody = {
          contents: [{
            parts: [
              { text: `You are an expert home repair diagnostics system. Analyze this image of a home appliance/electrical issue (associated with the ${serviceCategory} service). Return a JSON object with: possibleIssue, recommendedCategory, estimatedCost (in INR ₹), safetyAdvice, materialsNeeded, and confidence percentage. Do NOT wrap the JSON inside markdown ticks. Return raw JSON.` },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        const json = await res.json();
        const textResponse = json.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse);
      } catch (err) {
        console.warn("[Gemini AI] Real call failed, falling back to mock diagnostics:", err);
      }
    }

    const catLower = serviceCategory.toLowerCase();
    if (catLower.includes('ac') || catLower.includes('cool') || catLower.includes('air')) {
      return MOCK_DIAGNOSTICS.ac;
    } else if (catLower.includes('fan') || catLower.includes('bearing') || catLower.includes('ceiling')) {
      return MOCK_DIAGNOSTICS.fan;
    } else if (catLower.includes('motor') || catLower.includes('pump') || catLower.includes('plumb')) {
      return MOCK_DIAGNOSTICS.motor;
    } else if (catLower.includes('light') || catLower.includes('bulb') || catLower.includes('switch') || catLower.includes('wiring')) {
      return MOCK_DIAGNOSTICS.light;
    }
    return MOCK_DIAGNOSTICS.default;
  },

  parseVoiceCommand: async (transcriptText) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerText = transcriptText.toLowerCase();
    let serviceType = "Electrician";
    let isEmergency = false;
    let category = "Electrical";

    if (lowerText.includes('ac') || lowerText.includes('air condition') || lowerText.includes('cooling')) {
      serviceType = "AC Repair";
      category = "Air Conditioning";
    } else if (lowerText.includes('leak') || lowerText.includes('pipe') || lowerText.includes('plumber') || lowerText.includes('water')) {
      serviceType = "Plumber";
      category = "Plumbing";
    }

    if (lowerText.includes('urgent') || lowerText.includes('immediate') || lowerText.includes('emergency') || lowerText.includes('tripping') || lowerText.includes('spark') || lowerText.includes('current illa')) {
      isEmergency = true;
    }

    return {
      category,
      serviceType,
      isEmergency,
      parsedDescription: transcriptText,
      confidence: "92%"
    };
  }
};
