// Keyboard layout configurations
const LAYOUTS = {
  "QWERTY": {
    rows: [
      ["Q","W","E","R","T","Y","U","I","O","P"],
      ["A","S","D","F","G","H","J","K","L"],
      ["Z","X","C","V","B","N","M"]
    ],
    fingerMap: {
      "q": "L4", "w": "L3", "e": "L2", "r": "L1", "t": "L1", "y": "R1", "u": "R1", "i": "R2", "o": "R3", "p": "R4",
      "a": "L4", "s": "L3", "d": "L2", "f": "L1", "g": "L1", "h": "R1", "j": "R1", "k": "R2", "l": "R3",
      "z": "L4", "x": "L3", "c": "L2", "v": "L1", "b": "L1", "n": "R1", "m": "R1"
    },
    homeKeys: {
      "L4": "a", "L3": "s", "L2": "d", "L1": "f", "R1": "j", "R2": "k", "R3": "l", "R4": ";"
    }
  },
  "Colemak": {
    rows: [
      ["Q","W","F","P","G","J","L","U","Y"],
      ["A","R","S","T","D","H","N","E","I","O"],
      ["Z","X","C","V","B","K","M"]
    ],
    fingerMap: {
      "q": "L4", "w": "L3", "f": "L2", "p": "L1", "g": "L1", "j": "R1", "l": "R1", "u": "R2", "y": "R3",
      "a": "L4", "r": "L3", "s": "L2", "t": "L1", "d": "L1", "h": "R1", "n": "R1", "e": "R2", "i": "R3", "o": "R4",
      "z": "L4", "x": "L3", "c": "L2", "v": "L1", "b": "L1", "k": "R1", "m": "R1"
    },
    homeKeys: {
      "L4": "a", "L3": "r", "L2": "s", "L1": "t", "R1": "n", "R2": "e", "R3": "i", "R4": "o"
    }
  },
  "Dvorak": {
    rows: [
      ["'", ",", ".", "P","Y","F","G","C","R","L"],
      ["A","O","E","U","I","D","H","T","N","S"],
      ["Q","J","K","X","B","M","W","V","Z"]
    ],
    fingerMap: {
      "'": "L4", ",": "L3", ".": "L2", "p": "L1", "y": "L1", "f": "R1", "g": "R1", "c": "R2", "r": "R3", "l": "R4",
      "a": "L4", "o": "L3", "e": "L2", "u": "L1", "i": "L1", "d": "R1", "h": "R1", "t": "R2", "n": "R3", "s": "R4",
      "q": "L4", "j": "L3", "k": "L2", "x": "L1", "b": "L1", "m": "R1", "w": "R1", "v": "R2", "z": "R3"
    },
    homeKeys: {
      "L4": "a", "L3": "o", "L2": "e", "L1": "u", "R1": "h", "R2": "t", "R3": "n", "R4": "s"
    }
  },
  "Colemak-SE": {
    rows: [
      ["Q","W","F","P","G","J","L","U","Y","Ö","Å"],
      ["A","R","S","T","D","H","N","E","I","O","Ä"],
      ["Z","X","C","V","B","K","M"]
    ],
    fingerMap: {
      "q": "L4", "w": "L3", "f": "L2", "p": "L1", "g": "L1", "j": "R1", "l": "R1", "u": "R2", "y": "R3", "ö": "R4", "å": "R4",
      "a": "L4", "r": "L3", "s": "L2", "t": "L1", "d": "L1", "h": "R1", "n": "R1", "e": "R2", "i": "R3", "o": "R4", "ä": "R4",
      "z": "L4", "x": "L3", "c": "L2", "v": "L1", "b": "L1", "k": "R1", "m": "R1"
    },
    homeKeys: {
      "L4": "a", "L3": "r", "L2": "s", "L1": "t", "R1": "n", "R2": "e", "R3": "i", "R4": "o"
    }
  }
};

// Constants for finger labels and names
const FINGER_LABELS = ['L4', 'L3', 'L2', 'L1', 'R1', 'R2', 'R3', 'R4'];
const FINGER_NAMES = ['LP', 'LR', 'LM', 'LI', 'RI', 'RM', 'RR', 'RP'];

// Utility functions
function getKeyPosition(layout, key) {
  const upperKey = key.toUpperCase();
  const lowerKey = key.toLowerCase();
  for (let rowIndex = 0; rowIndex < layout.rows.length; rowIndex++) {
    let colIndex = layout.rows[rowIndex].indexOf(upperKey);
    if (colIndex === -1) {
      colIndex = layout.rows[rowIndex].indexOf(lowerKey);
    }
    if (colIndex !== -1) {
      return { row: rowIndex, col: colIndex };
    }
  }
  return null;
}

function calculateDistance(pos1, pos2) {
  if (!pos1 || !pos2) return 0;
  const rowDiff = pos2.row - pos1.row;
  const colDiff = pos2.col - pos1.col;
  return Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
}

function getColor(count, max) {
  if (max === 0) return '#ebdbb2';
  const low = { r: 0xeb, g: 0xdb, b: 0xb2 };
  const high = { r: 0xfb, g: 0x49, b: 0x34 };
  const ratio = count / max;
  const r = Math.round(low.r + ratio * (high.r - low.r));
  const g = Math.round(low.g + ratio * (high.g - low.g));
  const b = Math.round(low.b + ratio * (high.b - low.b));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Text analysis functions
function analyzeText(text) {
  const counts = {};
  for (const char of text) {
    if ((char >= 'a' && char <= 'z') || char === 'ä' || char === 'ö' || char === 'å') {
      counts[char] = (counts[char] || 0) + 1;
    }
  }
  return counts;
}

function calculateFingerDistances(text, layout) {
  const fingerDistances = { L4: 0, L3: 0, L2: 0, L1: 0, R1: 0, R2: 0, R3: 0, R4: 0 };
  
  for (const char of text) {
    if (layout.fingerMap[char]) {
      const finger = layout.fingerMap[char];
      const homeKey = layout.homeKeys[finger];
      
      // Only count distance if it's not the home key
      if (char !== homeKey) {
        const currentPos = getKeyPosition(layout, char.toUpperCase());
        const homePos = getKeyPosition(layout, homeKey.toUpperCase());
        
        if (currentPos && homePos) {
          const distance = calculateDistance(homePos, currentPos);
          fingerDistances[finger] += distance;
        }
      }
    }
  }
  
  return fingerDistances;
}

// DOM manipulation functions
function createLayoutSection(name, layout, counts, fingerDistances, maxCount, totalCount) {
  const section = document.createElement("div");
  section.className = "layout";
  
  // Title
  const title = document.createElement("h2");
  title.textContent = name;
  section.appendChild(title);
  
  // Home row usage
  const homeKeys = layout.rows[1] || [];
  const homeCount = homeKeys.reduce((sum, k) => sum + (counts[k.toLowerCase()] || 0), 0);
  const homePct = totalCount > 0 ? (homeCount / totalCount * 100).toFixed(1) : '0.0';
  const info = document.createElement('p');
  info.textContent = `Home: ${homeCount}/${totalCount} (${homePct}%)`;
  info.style.fontSize = '12px';
  info.style.margin = '4px 0';
  section.appendChild(info);
  
  // Finger effort metrics
  const totalDistance = Object.values(fingerDistances).reduce((sum, d) => sum + d, 0);
  const effortInfo = document.createElement('div');
  effortInfo.innerHTML = `<p style="font-size: 12px; margin: 4px 0;"><strong>Distance: ${totalDistance.toFixed(1)} units</strong></p>`;
  section.appendChild(effortInfo);
  
  // Finger workload bars
  const maxFingerDistance = Math.max(...Object.values(fingerDistances));
  const workloadDiv = document.createElement('div');
  workloadDiv.className = 'finger-workload';
  
  FINGER_LABELS.forEach((finger, index) => {
    const distance = fingerDistances[finger];
    const intensity = maxFingerDistance > 0 ? distance / maxFingerDistance : 0;
    const bar = document.createElement('div');
    bar.className = 'finger-bar';
    bar.style.backgroundColor = getColor(intensity * 100, 100);
    bar.textContent = `${FINGER_NAMES[index]}\n${distance.toFixed(1)}`;
    bar.style.whiteSpace = 'pre-line';
    bar.title = `${FINGER_NAMES[index]}: ${distance.toFixed(1)} units`;
    workloadDiv.appendChild(bar);
  });
  
  section.appendChild(workloadDiv);
  
  // Keyboard visualization
  const keyboard = document.createElement("div");
  keyboard.className = "keyboard";
  layout.rows.forEach((rowKeys, rowIndex) => {
    const row = document.createElement("div");
    row.className = "row";
    if (rowIndex === 1) row.classList.add("second-row");
    if (rowIndex === 2) row.classList.add("third-row");
    
    rowKeys.forEach(key => {
      const count = counts[key.toLowerCase()] || 0;
      const keyDiv = document.createElement("div");
      keyDiv.className = "key";
      keyDiv.style.backgroundColor = getColor(count, maxCount);
      keyDiv.textContent = key;
      
      const countSpan = document.createElement("div");
      countSpan.className = "count";
      countSpan.textContent = count;
      keyDiv.appendChild(countSpan);
      row.appendChild(keyDiv);
    });
    keyboard.appendChild(row);
  });
  section.appendChild(keyboard);
  
  return section;
}

// Main analysis function
function analyze() {
  const text = document.getElementById("text-input").value.toLowerCase();
  const counts = analyzeText(text);
  const maxCount = Math.max(0, ...Object.values(counts));
  const totalCount = Object.values(counts).reduce((sum, v) => sum + v, 0);
  const container = document.getElementById("layouts-container");
  container.innerHTML = "";
  
  for (const [name, layout] of Object.entries(LAYOUTS)) {
    const fingerDistances = calculateFingerDistances(text, layout);
    const section = createLayoutSection(name, layout, counts, fingerDistances, maxCount, totalCount);
    container.appendChild(section);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("text-input").addEventListener("input", analyze);
});