# 💰 Budget Set

Budget Set is a simple and intuitive web app for creating and managing budgets.  
It lets you allocate funds to a project or goal and track items under that budget.  

Example:  

```
Name: Dream PC Build
Allocation: $3000
   - Motherboard  $150
   - GPU          $800
   - Monitor      $250
```

---

## 🚀 Features
- Create and manage multiple budgets.  
- Add items under each budget with cost tracking.  
- Automatic calculation of totals and remaining balance.  
- Clean, modern interface with responsive design.  

---

## 🛠️ Tech Stack
- **Framework:** Next.js (React + TypeScript) and Prisma with PostgreSQL  
- **Styling:** Tailwind CSS   
- **Deployment:** Vercel  

---

## 📸 Demo
https://budgetset.vercel.app/


---

## 🧑‍💻 Getting Started
To run the project locally:  

```bash
git clone https://github.com/yourusername/budget-set.git
cd budget-set
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.  

---

## 📂 Project Structure
- `app/page.tsx` → Main page  
- `app/api` → Backend APIs  
- `app/budgets/` → Budgets page  
- `app/budgets/[budgetId]` → Expenses page related to a budget ID  
- `app/expenses/` → All expenses page  
- `app/settings/` → Settings Page  
- `components/` → Reusable UI components  
- `styles/` → Global styles  

---

## 📌 Note
⚠️ This project is provided for **demonstration purposes only**.  
Reuse, modification, or redistribution is **not permitted** without permission.  
