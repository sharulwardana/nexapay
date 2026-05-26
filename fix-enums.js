const fs = require('fs');
let s = fs.readFileSync('prisma/schema.prisma', 'utf-8');

s = s.replace(/enum\s+[a-zA-Z]+\s*\{[^}]+\}/g, '');
s = s.replace(/Role(\s*@default\(Role\.USER\))?/g, 'String @default("USER")');
s = s.replace(/TransactionStatus(\s*@default\([^)]+\))?/g, 'String @default("PENDING")');
s = s.replace(/PaymentMethod/g, 'String');
s = s.replace(/PromoType/g, 'String');
s = s.replace(/ProductCategory/g, 'String');
s = s.replace(/LoyaltyLevel(\s*@default\([^)]+\))?/g, 'String @default("BRONZE")');

fs.writeFileSync('prisma/schema.prisma', s);
console.log('Done');
