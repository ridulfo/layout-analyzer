#!/bin/bash

# Keyboard Home Row Analyzer
# Analyzes text input to calculate home row usage for different keyboard layouts

# Define home row characters for each layout (lowercase)
QWERTY_HOMEROW="asdfghjkl"
COLEMAK_HOMEROW="arstdhneio"
DVORAK_HOMEROW="aoeuhtnsid"
COLEMAK_SE_HOMEROW="arstdhneioä"

# Function to count characters in a string
count_chars() {
    local text="$1"
    local homerow="$2"
    local count=0
    local total=0
    
    # Convert text to lowercase and process character by character
    text=$(echo "$text" | tr '[:upper:]' '[:lower:]')
    
    # Count total alphabetic characters (including ä for Swedish)
    total=$(echo "$text" | grep -o '[a-zä]' | wc -l)
    
    # Count home row characters
    for ((i=0; i<${#homerow}; i++)); do
        char="${homerow:$i:1}"
        char_count=$(echo "$text" | grep -o "$char" | wc -l)
        count=$((count + char_count))
    done
    
    echo "$count $total"
}

# Function to calculate percentage
calc_percentage() {
    local count=$1
    local total=$2
    if [ "$total" -eq 0 ]; then
        echo "0.00"
    else
        echo "scale=2; $count * 100 / $total" | bc -l
    fi
}

# Read input from pipe
if [ -t 0 ]; then
    echo "Usage: cat textfile.txt | $0"
    echo "   or: echo 'text' | $0"
    exit 1
fi

# Read all input
input=$(cat)

# Check if bc is available for calculations
if ! command -v bc &> /dev/null; then
    echo "Error: 'bc' command is required for percentage calculations"
    exit 1
fi

# Calculate statistics for each layout
echo "Keyboard Home Row Usage Analysis"
echo "================================"
echo

# QWERTY
result=$(count_chars "$input" "$QWERTY_HOMEROW")
qwerty_count=$(echo $result | cut -d' ' -f1)
total_chars=$(echo $result | cut -d' ' -f2)
qwerty_pct=$(calc_percentage $qwerty_count $total_chars)

echo "QWERTY (asdfghjkl):"
echo "  Home row characters: $qwerty_count / $total_chars"
echo "  Percentage: ${qwerty_pct}%"
echo

# Colemak
result=$(count_chars "$input" "$COLEMAK_HOMEROW")
colemak_count=$(echo $result | cut -d' ' -f1)
colemak_pct=$(calc_percentage $colemak_count $total_chars)

echo "Colemak (arstdhneio):"
echo "  Home row characters: $colemak_count / $total_chars"
echo "  Percentage: ${colemak_pct}%"
echo

# Dvorak
result=$(count_chars "$input" "$DVORAK_HOMEROW")
dvorak_count=$(echo $result | cut -d' ' -f1)
dvorak_pct=$(calc_percentage $dvorak_count $total_chars)

echo "Dvorak (aoeuhtnsid):"
echo "  Home row characters: $dvorak_count / $total_chars"
echo "  Percentage: ${dvorak_pct}%"
echo

# Colemak-SE
result=$(count_chars "$input" "$COLEMAK_SE_HOMEROW")
colemak_se_count=$(echo $result | cut -d' ' -f1)
colemak_se_pct=$(calc_percentage $colemak_se_count $total_chars)

echo "Colemak-SE (arstdhneioä):"
echo "  Home row characters: $colemak_se_count / $total_chars"
echo "  Percentage: ${colemak_se_pct}%"
echo

# Summary
echo "Summary:"
echo "--------"
printf "%-12s %8s %10s\n" "Layout" "Count" "Percentage"
printf "%-12s %8s %10s\n" "--------" "-----" "----------"
printf "%-12s %8d %9.2f%%\n" "QWERTY" "$qwerty_count" "$qwerty_pct"
printf "%-12s %8d %9.2f%%\n" "Colemak" "$colemak_count" "$colemak_pct"
printf "%-12s %8d %9.2f%%\n" "Dvorak" "$dvorak_count" "$dvorak_pct"
printf "%-12s %8d %9.2f%%\n" "Colemak-SE" "$colemak_se_count" "$colemak_se_pct"
echo
echo "Total alphabetic characters analyzed: $total_chars"
