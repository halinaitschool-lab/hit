#!/bin/bash

# Fix GitHub Pages routing issue
# Replace absolute paths with relative paths

echo "🔧 Fixing GitHub Pages routing..."

# For ua/index.html
sed -i '' 's|href="/ua/"|href="../ua/"|g' ua/index.html
sed -i '' 's|href="/pl/"|href="../pl/"|g' ua/index.html
sed -i '' 's|href="/en/"|href="../en/"|g' ua/index.html

# For pl/index.html
sed -i '' 's|href="/ua/"|href="../ua/"|g' pl/index.html
sed -i '' 's|href="/pl/"|href="../pl/"|g' pl/index.html
sed -i '' 's|href="/en/"|href="../en/"|g' pl/index.html

# For en/index.html
sed -i '' 's|href="/ua/"|href="../ua/"|g' en/index.html
sed -i '' 's|href="/pl/"|href="../pl/"|g' en/index.html
sed -i '' 's|href="/en/"|href="../en/"|g' en/index.html

echo "✅ GitHub Pages routing fixed!"
echo "Now test with: https://halinaitschool-lab.github.io/hit/en/"
