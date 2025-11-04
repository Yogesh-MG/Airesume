cd frontend

if [ ! -d "node_modules" ]; then
  npm install
fi
read -p "do you want to build the frontend? (y/n) " choice
if [ "$choice" = "y" ]; then
  npm run build
fi  
npm run preview